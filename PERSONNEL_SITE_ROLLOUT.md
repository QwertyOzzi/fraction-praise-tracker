# FBI site: atomic audit and future agent documents

## What this PR changes now

A sheet edit and its corresponding immutable audit_log event share one
Firestore runTransaction. If creating the audit event fails, Firestore rejects
the entire edit and the browser reloads the authoritative document. This avoids
unlogged website edits.

The edit still uses the legacy sheets/fractionrp and sheets/praise document
schema; current balance display, sorting and UI are unchanged.

## Optional future Firestore schema

firestore.rules adds an owner-only match for agent_directory_v2/{agentId}.
The collection is not populated or queried by either the site or the bot.
The code for generating a candidate projection is in the linked bot PR:
https://github.com/QwertyOzzi/fraction-praise-bot/pull/42

A later migration must create each agent's stable independent document, verify
backups and equivalence, implement dual-write before switching readers, and
test a rollback. Do NOT publish live migration writes without approval.

## Deployment safety

- Back up active sheets and the signed bot ACL before changing deployments.
- Merging GitHub PRs DOES NOT publish Firebase Security Rules automatically.
- Compare and merge updated collection rules into the *currently deployed*
  Firebase Rules; never overwrite active rules with an older full example.
- Verify unauthorized reads and writes remain denied before use.
