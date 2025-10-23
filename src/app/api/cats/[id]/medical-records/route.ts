import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - 獲取特定貓咪的給藥紀錄
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const medicationRecords = await prisma.medicationRecord.findMany({
      where: { 
        catId: id
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ medicationRecords })
  } catch (error) {
    console.error('獲取給藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '獲取給藥紀錄失敗' },
      { status: 500 }
    )
  }
}

// POST - 創建新的給藥紀錄
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      date,
      volunteer,
      morningDose,
      eveningDose,
      notes
    } = body

    // 驗證必填欄位
    if (!volunteer) {
      return NextResponse.json(
        { message: '缺少必填欄位：志工姓名' },
        { status: 400 }
      )
    }

    const medicationRecord = await prisma.medicationRecord.create({
      data: {
        catId: id,
        date: date ? new Date(date) : new Date(),
        volunteer,
        morningDose: morningDose || false,
        eveningDose: eveningDose || false,
        notes: notes || null
      }
    })

    return NextResponse.json({ medicationRecord }, { status: 201 })
  } catch (error) {
    console.error('創建給藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '創建給藥紀錄失敗' },
      { status: 500 }
    )
  }
}