import assert from 'node:assert/strict'
import test from 'node:test'
import { DEMO_EXTRACTED_RFQ, DEMO_RFQ_INPUT, REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY } from '../lib/demo-data'
import { validateRFQ } from '../lib/validate-rfq'

test('built-in sample source and extraction preserve customer-provided details', () => {
  assert.match(DEMO_RFQ_INPUT, /December 15, 2026/)
  assert.match(DEMO_RFQ_INPUT, /emily\.chen@example\.com/)
  assert.match(DEMO_RFQ_INPUT, /Molex Micro-Fit 3\.0 and JST PH/)
  assert.equal(DEMO_EXTRACTED_RFQ.requested_delivery, 'December 15, 2026')
  assert.equal(DEMO_EXTRACTED_RFQ.contact_email, 'emily.chen@example.com')
  assert.equal(DEMO_EXTRACTED_RFQ.connector_family, 'Molex Micro-Fit 3.0 and JST PH')
  assert.deepEqual(DEMO_EXTRACTED_RFQ.attachments, [])
})

test('sample validation and clarification inputs use the same mandatory field set', () => {
  const validation = validateRFQ(DEMO_EXTRACTED_RFQ)
  assert.deepEqual(validation.missing_fields, ['wire_gauge', 'voltage_rating', 'current_rating', 'packaging_requirements'])
  assert.deepEqual(REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY.filter((field) => validation.missing_fields.includes(field)), validation.missing_fields)
})

test('handoff-critical contact and delivery values are not missing from the extracted record', () => {
  assert.equal(DEMO_EXTRACTED_RFQ.customer_company, 'ABC Industrial Ltd.')
  assert.equal(DEMO_EXTRACTED_RFQ.contact_name, 'Emily Chen')
  assert.equal(DEMO_EXTRACTED_RFQ.requested_delivery, 'December 15, 2026')
  assert.equal(DEMO_EXTRACTED_RFQ.quantity, 2000)
})

// Run with a TypeScript-aware test runner in the host project.
export {}
