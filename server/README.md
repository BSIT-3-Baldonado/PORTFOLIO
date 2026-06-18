# Portfolio Server (Express + Neon Postgres + SMTP)

## Features
- `POST /api/contact` stores message in Neon Postgres + emails portfolio owner
- Rate limiting + honeypot anti-spam

## Setup
### 1) Install
```bash
cd server
npm install
```

### 2) Environment variables
Create `.env` inside `server/`:

```env
PORT=3000

# Neon Postgres
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
DATABASE_SSL=true

# SMTP (example via Gmail or any provider)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

CONTACT_TO_EMAIL=Kengabriel110720@gmail.com
CONTACT_FROM_EMAIL=your_smtp_user
CONTACT_SUBJECT=New Portfolio Contact Message
```

> Never commit secrets to GitHub.

## Run
```bash
npm run dev
```

Server will listen on: `http://localhost:3000`

## Database migration
Run `server/migrations/001_create_messages.sql` in your Neon project SQL editor.


## Test contact
From browser / frontend, submit the form.
API response should be:
```json
{ "ok": true, "message": "Message received." }
```


