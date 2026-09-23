import { RFQ, RFQValidationResult } from './rfq-schema'
import { REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY } from './demo-data'

export function validateRFQ(rfq: RFQ, requiredFields: string[] = REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY): RFQValidationResult {
  const missing_fields: string[] = []
  
  for (const field of requiredFields) {
    const value = rfq[field as keyof RFQ]
    if (value === null || value === undefined || value === '') {
      missing_fields.push(field)
    }
  }
  
  const required_fields_met = requiredFields.length - missing_fields.length
  const total_required_fields = requiredFields.length
  const completeness_percentage = Math.round((required_fields_met / total_required_fields) * 100)
  
  let status: 'incomplete' | 'partial' | 'complete'
  if (completeness_percentage === 100) {
    status = 'complete'
  } else if (completeness_percentage >= 50) {
    status = 'partial'
  } else {
    status = 'incomplete'
  }
  
  return {
    required_fields_met,
    total_required_fields,
    missing_fields,
    completeness_percentage,
    status,
  }
}

export function getFieldDisplayName(field: string): string {
  const displayNames: Record<string, string> = {
    customer_company: 'Customer Company',
    contact_name: 'Contact Name',
    contact_email: 'Contact Email',
    subject: 'Subject',
    quantity: 'Quantity',
    requested_delivery: 'Requested Delivery',
    annual_volume: 'Annual Volume',
    target_price: 'Target Price',
    product_type: 'Product Type',
    application: 'Application',
    description: 'Description',
    material: 'Material',
    cable_length: 'Cable Length',
    cable_color: 'Cable Color',
    connector_family: 'Connector Family',
    connector_part_number: 'Connector Part Number',
    wire_gauge: 'Wire Gauge',
    voltage_rating: 'Voltage Rating',
    current_rating: 'Current Rating',
    tolerance: 'Tolerance',
    finish_or_plating: 'Finish or Plating',
    certifications: 'Certifications',
    rohs: 'RoHS Compliance',
    reach: 'REACH',
    ul: 'UL',
    other_standards: 'Other Standards',
    packaging_requirements: 'Packaging Requirements',
    other_requirements: 'Other Requirements',
  }
  
  return displayNames[field] || field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1)
}

export function formatFieldValue(value: any): string {
  if (value === null || value === undefined) {
    return 'Not provided'
  }
  return String(value)
}
