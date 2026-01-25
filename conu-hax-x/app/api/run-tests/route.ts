import { NextRequest, NextResponse } from 'next/server'
import { runTests } from '@/lib/runner'
import TicketService from '@/services/ticketService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, language = 'javascript', testCases = [], ticketId } = body

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'code is required' },
        { status: 400 }
      )
    }

    let referenceCode: string | undefined
    let validationCode: string | undefined
    if (ticketId) {
      const ticket = await TicketService.getTicketById(ticketId)
      referenceCode = (ticket as any)?.solutionCode || undefined
      validationCode = (ticket as any)?.validationCode || undefined
    }

    const results = await runTests({
      code,
      language,
      testCases,
      referenceCode,
      validationCode,
    })

    const passed = results.filter((r) => r.passed).length

    return NextResponse.json({
      success: true,
      results,
      summary: {
        passed,
        total: results.length,
      },
    })
  } catch (error) {
    console.error('Failed to run tests:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run tests',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
