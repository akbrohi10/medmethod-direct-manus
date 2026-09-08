# Resend Integration Notes

Official Resend documentation reviewed on September 8, 2026:

- API keys are secret tokens and should be kept confidential. Resend recommends a **Sending access** key and allows restricting it to a verified domain. Source: https://resend.com/docs/create-an-api-key
- The send-email API requires `from`, `to`, and `subject`; it accepts both `html` and `text`, optional `reply_to`, and structured tags. Source: https://resend.com/docs/api-reference/emails/send-email
- `Idempotency-Key` is supported by `POST /emails`, has a maximum length of 256 characters, and prevents duplicate processing for 24 hours. Source: https://resend.com/docs/dashboard/emails/idempotency-keys
- The application additionally keeps a permanent unique payment-event delivery record because Resend's provider idempotency window is limited to 24 hours.

Project decision: the user selected direct transactional sending after successful payment persistence. The Resend API key is entered in `/admin/settings`, encrypted with AES-256-GCM before database storage, masked in the UI, never returned in full, and never written to logs.
