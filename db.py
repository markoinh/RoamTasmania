import sqlite3
import os

DB_PATH = os.environ.get("DB_PATH", "roamtassie.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS quotes (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at  DATETIME DEFAULT (datetime('now')),
                name        TEXT NOT NULL,
                email       TEXT NOT NULL,
                phone       TEXT,
                from_region TEXT NOT NULL,
                to_region   TEXT NOT NULL,
                move_date   TEXT,
                home_size   TEXT NOT NULL,
                estimate    INTEGER,
                source      TEXT DEFAULT 'quote_widget',
                status      TEXT DEFAULT 'new',
                notes       TEXT
            );

            CREATE TABLE IF NOT EXISTS contacts (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at DATETIME DEFAULT (datetime('now')),
                name       TEXT NOT NULL,
                email      TEXT NOT NULL,
                phone      TEXT,
                message    TEXT NOT NULL,
                status     TEXT DEFAULT 'new'
            );
        """)
