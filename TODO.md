# TODO

## Contact form → DB + email
- [ ] Verify frontend submits JSON payload with name/email/message/hp_field to `POST /api/contact`.
- [ ] Ensure `messages` table exists (migration `server/migrations/001_create_messages.sql`).
- [ ] Ensure contact endpoint inserts a row into `messages` and returns success.
- [ ] Ensure owner email is sent (SMTP env vars + defaults).
- [ ] Provide setup instructions: database migration + environment variables.

