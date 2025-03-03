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

    const { text, voice } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text not specified' },
        { status: 400, headers: responseHeaders }
      )
    }

    // For now, we'll use the browser's Web Speech API
    // In the future, we can integrate a more sophisticated TTS service here
    return NextResponse.json({ 
      success: true,
      text,
      voice
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