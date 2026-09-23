# Manufacturing RFQ Assistant

A portfolio demonstration showing how unstructured manufacturing RFQs can become structured, review-ready records before sales or engineering action.

## What it demonstrates

- Customer email and attachment intake
- Explainable structured extraction into a typed RFQ schema
- Deterministic required-field validation
- Field provenance and human corrections
- Editable clarification draft generation
- Engineering handoff status and JSON export

The application is deliberately human-in-the-loop: AI interprets text, while deterministic software decides completeness and readiness. It does not calculate pricing, select suppliers, make engineering decisions, or send email.

## Demo mode

Click **Load sample RFQ** to run the complete workflow without an API key. The result is a predefined synthetic cable-assembly RFQ, including a synthetic PDF attachment entry. The attachment is recorded but engineering geometry is not inspected.

## Live AI mode

`POST /api/extract-rfq` supports optional live extraction through `OPENAI_API_KEY`. The server keeps the key private, validates the returned JSON against the local Zod schema, and returns a reviewable error if the response is malformed. The current demo uses a direct OpenAI-compatible request as an explicit, easy-to-study boundary.

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Optional environment variable:

```bash
OPENAI_API_KEY=your_key_here
```

## Architecture

`lib/rfq-schema.ts` contains the typed Zod schema. `lib/demo-data.ts` contains only synthetic sample data. `lib/validate-rfq.ts` contains the deterministic completeness rules. `app/api/extract-rfq/route.ts` is the server-only extraction boundary. The UI lives in `components/rfq-dashboard.tsx` and preserves original extraction values while allowing human edits.

## Limitations and security considerations

This is not production-ready and contains no authentication, database, CRM, ERP, email delivery, or persistent review history. Inputs are synthetic. Uploaded engineering formats such as STEP, DWG, and SolidWorks are not supported or inspected. A production version would add authenticated access, durable audit history, malware scanning, stricter upload handling, provider-managed structured outputs, rate limiting, observability, and retention controls.

## Future extensions

- PDF text extraction with page-level provenance
- Document redaction and malware scanning
- Configurable required fields by product family
- Approval history and role-based review
- ERP/CRM handoff adapters
- Supplier and pricing workflows kept behind separate human approval gates

Portfolio demonstration — synthetic data only.
