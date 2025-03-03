import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    // Add CORS headers
    const headersList = headers()
    const origin = headersList.get('origin') || '*'

    const responseHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { headers: responseHeaders })
    }

    const { messages, model } = await req.json()

    if (!model) {
      return NextResponse.json(
        { error: 'Model not specified' },
        { status: 400, headers: responseHeaders }
      )
    }

    // Validate Ollama connection first
    try {
      await fetch('http://localhost:11434/api/version')
    } catch (error) {
      console.error('Ollama server not running:', error)
      return NextResponse.json(
        { error: 'Ollama server is not running. Please start Ollama first.' },
        { status: 503, headers: responseHeaders }
      )
    }

    // Call Ollama API
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false // Disable streaming to get complete response
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Ollama API error:', errorData)
      throw new Error(`Failed to get response from Ollama: ${errorData}`)
    }

    const data = await response.json()
    
    // The response format from Ollama includes a 'message' object with 'content'
    return NextResponse.json({ 
      message: data.message.content 
    }, { 
      headers: responseHeaders 
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 