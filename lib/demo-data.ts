import { RFQ } from './rfq-schema'

export const DEMO_RFQ_INPUT = `Subject: RFQ - Custom Cable Assembly

Hello,

We are looking for a quotation for 2,000 custom cable assemblies for an industrial control unit.

Requirements:
- Cable length: 500 mm
- Cable color: black
- Connector family: Molex
- RoHS compliant
- Quantity: 2,000 pcs
- Target delivery: November

We have attached a drawing for reference.

Please let us know if you need any additional information.

Best regards,
Emily Chen
ABC Industrial Ltd.
emily@example-industrial.com`

export const DEMO_ATTACHMENT = {
  filename: 'cable_assembly_drawing.pdf',
  type: 'pdf' as const,
  present: true,
}

export const DEMO_EXTRACTED_RFQ: RFQ = {
  rfq_id: 'RFQ-2024-001',
  received_at: new Date().toISOString(),
  
  // Customer
  customer_company: 'ABC Industrial Ltd.',
  contact_name: 'Emily Chen',
  contact_email: 'emily@example-industrial.com',
  subject: 'RFQ - Custom Cable Assembly',
  
  // Commercial
  quantity: 2000,
  requested_delivery: 'November',
  annual_volume: null,
  target_price: null,
  
  // Product
  product_type: 'Custom Cable Assembly',
  application: 'Industrial control unit',
  description: 'Custom cable assembly for industrial control unit',
  
  // Technical
  material: null,
  cable_length: '500 mm',
  cable_color: 'Black',
  connector_family: 'Molex',
  connector_part_number: null, // Not provided in customer email
  wire_gauge: null, // Not provided in customer email
  voltage_rating: null, // Not provided in customer email
  current_rating: null, // Not provided in customer email
  tolerance: null,
  finish_or_plating: null,
  
  // Compliance
  certifications: null,
  rohs: 'Required',
  reach: null,
  ul: null,
  other_standards: null,
  
  // Packaging
  packaging_requirements: null, // Not provided in customer email
  
  // Attachments
  attachments: [DEMO_ATTACHMENT],
  
  // Notes
  other_requirements: null,
}

export const REQUIRED_FIELDS_FOR_CABLE_ASSEMBLY = [
  'customer_company',
  'product_type',
  'quantity',
  'cable_length',
  'connector_family',
  'wire_gauge',
  'voltage_rating',
  'current_rating',
  'rohs',
  'requested_delivery',
  'packaging_requirements',
]
