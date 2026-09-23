import { z } from 'zod'

export const RFQAttachmentSchema = z.object({
  filename: z.string(),
  type: z.enum(['pdf', 'image', 'text']),
  present: z.boolean(),
})

export const RFQSchema = z.object({
  // Metadata
  rfq_id: z.string(),
  received_at: z.string().datetime(),
  
  // Customer
  customer_company: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_email: z.string().nullable(),
  subject: z.string().nullable(),
  
  // Commercial
  quantity: z.number().nullable(),
  requested_delivery: z.string().nullable(),
  annual_volume: z.number().nullable(),
  target_price: z.string().nullable(),
  
  // Product
  product_type: z.string().nullable(),
  application: z.string().nullable(),
  description: z.string().nullable(),
  
  // Technical
  material: z.string().nullable(),
  cable_length: z.string().nullable(),
  cable_color: z.string().nullable(),
  connector_family: z.string().nullable(),
  connector_part_number: z.string().nullable(),
  wire_gauge: z.string().nullable(),
  voltage_rating: z.string().nullable(),
  current_rating: z.string().nullable(),
  tolerance: z.string().nullable(),
  finish_or_plating: z.string().nullable(),
  
  // Compliance
  certifications: z.string().nullable(),
  rohs: z.string().nullable(),
  reach: z.string().nullable(),
  ul: z.string().nullable(),
  other_standards: z.string().nullable(),
  
  // Packaging
  packaging_requirements: z.string().nullable(),
  
  // Attachments
  attachments: z.array(RFQAttachmentSchema),
  
  // Notes
  other_requirements: z.string().nullable(),
})

export type RFQ = z.infer<typeof RFQSchema>

export const RFQFieldGroupSchema = z.object({
  status: z.enum(['complete', 'missing', 'partial']),
  fields: z.record(z.union([z.string(), z.number(), z.null()]).nullable()),
})

export const RFQValidationResultSchema = z.object({
  required_fields_met: z.number(),
  total_required_fields: z.number(),
  missing_fields: z.array(z.string()),
  completeness_percentage: z.number(),
  status: z.enum(['incomplete', 'partial', 'complete']),
})

export type RFQValidationResult = z.infer<typeof RFQValidationResultSchema>

export const RFQFieldProvenanceSchema = z.object({
  value: z.union([z.string(), z.number(), z.null()]).nullable(),
  source: z.enum(['customer_email', 'attachment', 'ai_extracted', 'human_edited', 'missing']),
  confidence: z.number().min(0).max(1).optional(),
})

export type RFQFieldProvenance = z.infer<typeof RFQFieldProvenanceSchema>

export const ReviewedRFQSchema = z.object({
  rfq: RFQSchema,
  field_provenance: z.record(RFQFieldProvenanceSchema),
  reviewer_notes: z.string().nullable(),
  marked_complete: z.boolean(),
})

export type ReviewedRFQ = z.infer<typeof ReviewedRFQSchema>
