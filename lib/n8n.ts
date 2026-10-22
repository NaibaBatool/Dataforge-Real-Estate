/**
 * n8n Webhook Dispatcher
 * Sends lead events to an external n8n automation workflow if configured.
 * Fails gracefully without breaking lead persistence.
 */

export type LeadWebhookPayload = {
  event: "lead.created"
  leadId: string
  purpose: string
  propertyType: string
  areas: string[]
  budgetMin: number
  budgetMax: number
  timeline: string
  score: number
  tier: string
  name: string
  phone: string
  email?: string
  notes?: string
  createdAt: string
}

export async function dispatchN8NWebhook(payload: LeadWebhookPayload): Promise<{
  dispatched: boolean
  status?: number
  error?: string
}> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET

  if (!webhookUrl) {
    return { dispatched: false, error: "N8N_WEBHOOK_URL is not configured (local mode active)" }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookSecret ? { "X-Webhook-Secret": webhookSecret } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000), // 5 second timeout to avoid hanging
    })

    if (!response.ok) {
      return {
        dispatched: false,
        status: response.status,
        error: `n8n webhook returned status ${response.status}`,
      }
    }

    return { dispatched: true, status: response.status }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown webhook delivery error"
    return { dispatched: false, error: message }
  }
}
