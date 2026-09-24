import { describe, expect, test } from 'vitest'
import { DEMO_EXTRACTED_RFQ, DEMO_RFQ_INPUT, REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY } from '../lib/demo-data'
import { validateRFQ } from '../lib/validate-rfq'

describe('RFQ consistency', () => {

test('built-in sample source and extraction preserve customer-provided details', () => {
  expect(DEMO_RFQ_INPUT).toMatch(/December 15, 2026/)
  expect(DEMO_RFQ_INPUT).toMatch(/emily\.chen@example\.com/)
  expect(DEMO_RFQ_INPUT).toMatch(/Molex Micro-Fit 3\.0 and JST PH/)
  expect(DEMO_EXTRACTED_RFQ.requested_delivery).toBe('December 15, 2026')
  expect(DEMO_EXTRACTED_RFQ.contact_email).toBe('emily.chen@example.com')
  expect(DEMO_EXTRACTED_RFQ.connector_family).toBe('Molex Micro-Fit 3.0 and JST PH')
  expect(DEMO_EXTRACTED_RFQ.attachments).toEqual([])
})

test('sample validation and clarification inputs use the same mandatory field set', () => {
  const validation = validateRFQ(DEMO_EXTRACTED_RFQ)
  expect(validation.missing_fields).toEqual(['wire_gauge', 'voltage_rating', 'current_rating', 'packaging_requirements'])
  expect(REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY.filter((field) => validation.missing_fields.includes(field))).toEqual(validation.missing_fields)
})

test('handoff-critical contact and delivery values are not missing from the extracted record', () => {
  expect(DEMO_EXTRACTED_RFQ.customer_company).toBe('ABC Industrial Ltd.')
  expect(DEMO_EXTRACTED_RFQ.contact_name).toBe('Emily Chen')
  expect(DEMO_EXTRACTED_RFQ.requested_delivery).toBe('December 15, 2026')
  expect(DEMO_EXTRACTED_RFQ.quantity).toBe(2000)
})

})
