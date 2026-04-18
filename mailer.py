import smtplib
import os
from email.message import EmailMessage

SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASS = os.environ.get("SMTP_PASS", "")
NOTIFY_TO = os.environ.get("NOTIFY_TO", "")
FROM_ADDR = os.environ.get("FROM_ADDR", SMTP_USER)


def _send(subject: str, body: str, to: str):
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASS, to]):
        return  # email not configured — skip silently
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = FROM_ADDR
    msg["To"] = to
    msg.set_content(body)
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)


def notify_new_quote(q: dict):
    body = f"""New quote request via RoamTassie website

Name:       {q['name']}
Email:      {q['email']}
Phone:      {q.get('phone') or '—'}
From:       {q['from_region']}
To:         {q['to_region']}
Move date:  {q.get('move_date') or '—'}
Home size:  {q['home_size']}
Estimate:   ${q.get('estimate') or '—'}
Source:     {q.get('source', 'quote_widget')}
"""
    _send("New quote request — RoamTassie", body, NOTIFY_TO)


def confirm_quote_to_customer(q: dict):
    body = f"""G'day {q['name']},

Thanks for reaching out to RoamTassie! We've received your quote request and one of our team will be in touch within 20 minutes during business hours.

Your quote summary
------------------
From:      {q['from_region']}
To:        {q['to_region']}
Move date: {q.get('move_date') or 'TBC'}
Home size: {q['home_size']}
Estimate:  from ${q.get('estimate') or '—'}

Questions? Call us on 03 6234 0188 or reply to this email.

Cheers,
The RoamTassie team
hello@roamtassie.com.au · 03 6234 0188
"""
    _send("We've got your quote request — RoamTassie", body, q["email"])


def notify_new_contact(c: dict):
    body = f"""New contact message via RoamTassie website

Name:    {c['name']}
Email:   {c['email']}
Phone:   {c.get('phone') or '—'}
Message: {c['message']}
"""
    _send("New contact message — RoamTassie", body, NOTIFY_TO)
