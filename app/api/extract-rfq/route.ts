import { NextRequest, NextResponse } from 'next/server'
import { RFQSchema } from '@/lib/rfq-schema'
import { DEMO_EXTRACTED_RFQ, DEMO_RFQ_INPUT } from '@/lib/demo-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, use_demo } = body
    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Customer request text is required.' }, { status: 400 })
    }
    
    // Demo mode is explicit: arbitrary pasted text must never receive the predefined sample result.
    if (use_demo === true) {
      // Validate against schema
      const validated = RFQSchema.parse(DEMO_EXTRACTED_RFQ)
      return NextResponse.json({
        success: true,
        demo: true,
        rfq: validated,
      })
    }
    
    // Live AI mode: check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        demo: false,
        error: 'Live AI extraction is unavailable because no AI provider is configured. No extraction occurred for this request. Load the predefined synthetic sample to preview the workflow, or configure live extraction before processing customer text.',
      }, { status: 503 })
    }
    
    // Call OpenAI API with structured output
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an RFQ (Request for Quotation) extraction system for a manufacturing company.
            
Extract structured information from unstructured customer requests.

CRITICAL RULES:
1. Never invent values that are not explicitly stated.
2. Return null for any field not present in the customer's request.
3. Do not infer engineering specifications.
4. Do not make pricing decisions or select suppliers.
5. Extract only what is explicitly provided.

Return ONLY valid JSON matching the provided schema.`,
          },
          {
            role: 'user',
            content: `Extract RFQ information from this customer request:

${content}

Return a JSON object with these fields. Use null for missing values. Do NOT invent specifications.

{
  "rfq_id": "RFQ-[timestamp]",
  "received_at": "[ISO datetime]",
  "customer_company": "company name or null",
  "contact_name": "contact name or null",
  "contact_email": "email or null",
  "subject": "subject or null",
  "quantity": "number or null",
  "requested_delivery": "delivery date or null",
  "annual_volume": "number or null",
  "target_price": "price string or null",
  "product_type": "product type or null",
  "application": "application or null",
  "description": "description or null",
  "material": "material or null",
  "cable_length": "length or null",
  "cable_color": "color or null",
  "connector_family": "connector or null",
  "connector_part_number": "part number or null",
  "wire_gauge": "gauge or null",
  "voltage_rating": "voltage or null",
  "current_rating": "current or null",
  "tolerance": "tolerance or null",
  "finish_or_plating": "finish or null",
  "certifications": "certs or null",
  "rohs": "RoHS status or null",
  "reach": "REACH or null",
  "ul": "UL or null",
  "other_standards": "standards or null",
  "packaging_requirements": "requirements or null",
  "attachments": [{"filename": "name", "type": "pdf|image|text", "present": true|false}],
  "other_requirements": "other requirements or null"
}`,
          },
        ],
        temperature: 0.3,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to extract RFQ data',
      }, { status: 500 })
    }
    
    const data = await response.json()
    const content_text = data.choices[0]?.message?.content
    
    if (!content_text) {
      return NextResponse.json({
        success: false,
        error: 'No response from AI model',
      }, { status: 500 })
    }
    
    // Parse and validate JSON response
    let extracted: any
    try {
      extracted = JSON.parse(content_text)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response as JSON',
      }, { status: 500 })
    }
    
    // Validate against schema
    const validated = RFQSchema.parse(extracted)
    
    return NextResponse.json({
      success: true,
      demo: false,
      rfq: validated,
    })
  } catch (error: any) {
    console.error('Extraction error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Extraction failed',
    }, { status: 500 })
  }
}
