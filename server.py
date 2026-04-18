import os
import re
import secrets
import threading
from datetime import datetime
from functools import wraps

from dotenv import load_dotenv  # optional — ignore if not installed

try:
    load_dotenv()
except Exception:
    pass

from flask import Flask, jsonify, request, send_from_directory, abort, Response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from db import get_db, init_db
import mailer

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=BASE_DIR, static_url_path="")

CORS(app, resources={r"/api/*": {"origins": os.environ.get("ALLOWED_ORIGIN", "*")}})

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=[],
    storage_uri="memory://",
)

ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASS", "changeme")
PORT = int(os.environ.get("PORT", "5000"))

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PHONE_RE = re.compile(r"^[\d\s\+\-\(\)]{6,20}$")

HOME_SIZES = {"studio", "1br", "2br", "3br", "4br"}
REGIONS = {"north-west", "launceston", "east-coast", "midlands", "hobart", "west-coast"}

REGION_NAMES = {
    "north-west": "North West",
    "launceston": "Launceston & North",
    "east-coast": "East Coast",
    "midlands": "Midlands",
    "hobart": "Hobart & South",
    "west-coast": "West Coast",
}

SIZE_NAMES = {
    "studio": "Studio / 1 bed",
    "1br": "1 bedroom",
    "2br": "2 bedrooms",
    "3br": "3 bedrooms",
    "4br": "4+ bedrooms",
}


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username != ADMIN_USER or not secrets.compare_digest(
            auth.password, ADMIN_PASS
        ):
            return Response(
                "Login required",
                401,
                {"WWW-Authenticate": 'Basic realm="RoamTassie Admin"'},
            )
        return f(*args, **kwargs)
    return decorated


def bad(msg, code=422):
    return jsonify({"ok": False, "error": msg}), code


# ---------------------------------------------------------------------------
# Static routes
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "RoamTassie.html")


@app.route("/admin")
@require_admin
def admin_page():
    return send_from_directory(BASE_DIR, "admin.html")


# ---------------------------------------------------------------------------
# API — quotes
# ---------------------------------------------------------------------------
@app.route("/api/quotes", methods=["POST"])
@limiter.limit("10 per minute")
def create_quote():
    data = request.get_json(silent=True) or {}

    name  = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip() or None
    from_ = (data.get("from_region") or "").strip()
    to_   = (data.get("to_region") or "").strip()
    date  = (data.get("move_date") or "").strip() or None
    size  = (data.get("home_size") or "").strip()
    est   = data.get("estimate")
    src   = (data.get("source") or "quote_widget").strip()
    notes = (data.get("notes") or "").strip() or None

    if not name or len(name) > 120:
        return bad("Name is required (max 120 chars)")
    if not EMAIL_RE.match(email):
        return bad("A valid email address is required")
    if phone and not PHONE_RE.match(phone):
        return bad("Invalid phone number")
    if from_ not in REGIONS:
        return bad("Invalid from_region")
    if to_ not in REGIONS:
        return bad("Invalid to_region")
    if from_ == to_:
        return bad("from_region and to_region must be different")
    if size not in HOME_SIZES:
        return bad("Invalid home_size")
    if est is not None:
        try:
            est = int(est)
        except (TypeError, ValueError):
            return bad("estimate must be an integer")

    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO quotes (name,email,phone,from_region,to_region,move_date,home_size,estimate,source,notes)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (name, email, phone, from_, to_, date, size, est, src, notes),
        )
        quote_id = cur.lastrowid

    payload = {
        "name": name, "email": email, "phone": phone,
        "from_region": REGION_NAMES[from_],
        "to_region": REGION_NAMES[to_],
        "move_date": date, "home_size": SIZE_NAMES[size],
        "estimate": est, "source": src,
    }
    threading.Thread(target=_send_quote_emails, args=(payload,), daemon=True).start()

    return jsonify({"ok": True, "id": quote_id}), 201


def _send_quote_emails(payload):
    try:
        mailer.notify_new_quote(payload)
        mailer.confirm_quote_to_customer(payload)
    except Exception as exc:
        app.logger.warning("Email send failed: %s", exc)


# ---------------------------------------------------------------------------
# API — contact
# ---------------------------------------------------------------------------
@app.route("/api/contact", methods=["POST"])
@limiter.limit("5 per minute")
def create_contact():
    data = request.get_json(silent=True) or {}

    name    = (data.get("name") or "").strip()
    email   = (data.get("email") or "").strip().lower()
    phone   = (data.get("phone") or "").strip() or None
    message = (data.get("message") or "").strip()

    if not name or len(name) > 120:
        return bad("Name is required")
    if not EMAIL_RE.match(email):
        return bad("A valid email address is required")
    if phone and not PHONE_RE.match(phone):
        return bad("Invalid phone number")
    if not message or len(message) > 2000:
        return bad("Message is required (max 2000 chars)")

    with get_db() as conn:
        cur = conn.execute(
            "INSERT INTO contacts (name,email,phone,message) VALUES (?,?,?,?)",
            (name, email, phone, message),
        )
        contact_id = cur.lastrowid

    payload = {"name": name, "email": email, "phone": phone, "message": message}
    threading.Thread(target=mailer.notify_new_contact, args=(payload,), daemon=True).start()

    return jsonify({"ok": True, "id": contact_id}), 201


# ---------------------------------------------------------------------------
# API — admin
# ---------------------------------------------------------------------------
@app.route("/api/admin/quotes")
@require_admin
def admin_quotes():
    status = request.args.get("status")
    with get_db() as conn:
        if status:
            rows = conn.execute(
                "SELECT * FROM quotes WHERE status=? ORDER BY created_at DESC LIMIT 200",
                (status,),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM quotes ORDER BY created_at DESC LIMIT 200"
            ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.route("/api/admin/quotes/<int:qid>", methods=["PATCH"])
@require_admin
def update_quote(qid):
    data = request.get_json(silent=True) or {}
    status = (data.get("status") or "").strip()
    allowed = {"new", "contacted", "booked", "closed"}
    if status not in allowed:
        return bad(f"status must be one of: {', '.join(allowed)}")
    with get_db() as conn:
        conn.execute("UPDATE quotes SET status=? WHERE id=?", (status, qid))
    return jsonify({"ok": True})


@app.route("/api/admin/contacts")
@require_admin
def admin_contacts():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM contacts ORDER BY created_at DESC LIMIT 200"
        ).fetchall()
    return jsonify([dict(r) for r in rows])


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=PORT, debug=os.environ.get("DEBUG") == "1")
