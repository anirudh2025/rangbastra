# Incident Response Runbook

1. **Detect and preserve.** Record UTC time, reporter, affected environment, request IDs, deployment/version, and provider alerts. Preserve relevant logs with access restricted; do not copy customer data into tickets.
2. **Contain.** Disable the affected function/route or provider integration, revoke exposed credentials, invalidate sessions when applicable, block abusive sources at the platform edge, and prevent further upload/download access. Avoid deleting evidence.
3. **Assess.** Determine data types, users, time window, attacker capability, persistence, downstream processors, and whether production was affected. Treat service-role exposure, cross-user access, auth bypass, or public private-file access as critical.
4. **Eradicate and recover.** Patch the root cause, rotate dependent secrets, audit grants/RLS and provider logs, redeploy from a trusted commit, restore only verified data, and run negative authorization tests.
5. **Notify.** The owner decides customer, processor, insurer, and legal/regulatory notifications based on verified scope and applicable law. Do not speculate publicly.
6. **Learn.** Within five business days, document timeline, root cause, control failures, detection gaps, and assigned follow-ups. Update this runbook, threat model, tests, and permanent project documentation.

Emergency provider actions and named contacts belong in the approved private operations system, not this repository.
