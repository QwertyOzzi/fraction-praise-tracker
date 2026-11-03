# Tracker security deployment checklist

## Important: publish Firestore rules

The `firestore.rules` file in this repository is **not** automatically synchronized with the live Firebase project. Deploy and verify it in Firebase Console or an approved Firebase CI workflow. No change is made to the live database just by merging this PR.

Before deploying, back up `sheets/fractionrp`, `sheets/praise`, `config/admins`, `config/settings` and `config/bot_state`. Do not reset administrator emails or current balances.

## Confirm these security properties

- Public users may read the two sheets, but cannot write the sheets, admin directory, system settings, bot ACL or support tickets directly.
- The public support form sends requests through the rate-limited `/api/support` endpoint. Only authenticated staff and the bot's Firebase owner identity can create support tickets in Firestore.
- All dynamic support-ticket IDs use DOM event listeners instead of HTML event attributes.
- A missing sheet never silently restores bundled demonstration data.
- Concurrent edits to the same table document reject stale overwrites rather than silently erase newer results.
- Existing admin emails remain in `config/admins` and existing signed Telegram permissions remain in `config/bot_state`.
- The production web page must be tested on its exact origin, `https://qwertyozzi.github.io`, because CORS only permits this origin on the bot endpoint.

## Follow-up improvements

Use a Firebase Auth UID-based owner/admin ACL and a verified-identity migration after all existing staff have verified their accounts. Do not enable `email_verified` checks without first migrating existing user access. For stronger transaction semantics, migrate table rows into independent Firestore documents and update individual rows atomically, avoiding whole-array writes. Consider edge CAPTCHA/WAF for public support traffic.

Enable GitHub branch protection and require green reviews/checks, GitHub MFA, and secret scanning. The repository integration cannot confirm or change those account-level settings. Do not leave Firebase in test mode.
