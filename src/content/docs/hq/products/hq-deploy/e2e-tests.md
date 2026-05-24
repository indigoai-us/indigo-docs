---
title: E2E Tests
description: End-to-end test infrastructure for validating deploys against real AWS staging.
---

The E2E test suite runs against real AWS staging infrastructure to verify that deploys work end-to-end — from CLI to live URL.

## Staging Infrastructure

A separate, cost-optimized staging environment mirrors production:

| Resource | Staging Difference |
|----------|--------------------|
| S3 Bucket | Separate bucket (`*.staging.{domain}`) |
| CloudFront | Separate distribution |
| ECS Cluster | Single-AZ (cost optimization) |
| ALB | Separate load balancer |
| ECR | Separate repository |
| Lambda@Edge | Separate function |

## Test Suite

### Static Deploy E2E

1. Creates a minimal HTML fixture
2. Deploys via CLI to staging
3. Verifies the live URL responds with correct content
4. Tests SPA fallback routing
5. Retry logic with exponential backoff (up to 60s for DNS propagation)

### SSR Deploy E2E

1. Creates a minimal Next.js fixture with `getServerSideProps`
2. Deploys via CLI to staging
3. Verifies server-rendered content (not just static HTML)
4. ECS stabilization timeout: 120 seconds

### Auth E2E

- Invalid API key returns exit code 2
- Valid API key succeeds
- Login flow stores credentials correctly

### App Lifecycle E2E

```
Create app → Deploy → Verify live → Delete → Verify 404
```

After deletion, verifies no orphaned AWS resources remain (no dangling Route 53 records, no leftover S3 prefixes).

## Running Tests

```bash
# Required environment variables
export E2E_API_KEY=hqd_test_xxxxx
export AWS_PROFILE=staging
export E2E_DOMAIN=staging.indigo-hq.com

# Run the suite
npm run test:e2e
```

Tests run sequentially (`--runInBand`) with 120-second timeout per test. Output includes JUnit XML for CI integration.
