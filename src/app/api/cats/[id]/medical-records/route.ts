import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - 獲取特定貓咪的醫療紀錄
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: { catId: id },
      include: {
        medicationRecords: {
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { visitDate: 'desc' }
    })

    return NextResponse.json({ medicalRecords })
  } catch (error) {
    console.error('獲取醫療紀錄失敗:', error)
    return NextResponse.json(
      { message: '獲取醫療紀錄失敗' },
      { status: 500 }
    )
  }
}

// POST - 創建新的醫療紀錄
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      title,
      description,
      diagnosis,
      treatment,
      medication,
      veterinarian,
      visitDate,
      nextVisit,
      cost,
      notes
    } = body

    // 驗證必填欄位
    if (!title || !description || !diagnosis || !treatment || !medication || !veterinarian || !visitDate) {
      return NextResponse.json(
        { message: '缺少必填欄位' },
        { status: 400 }
      )
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        catId: id,
        title,
        description,
        diagnosis,
        treatment,
        medication,
        veterinarian,
        visitDate: new Date(visitDate),
        nextVisit: nextVisit ? new Date(nextVisit) : null,
        cost: cost ? parseFloat(cost) : null,
        notes: notes || null
      },
      include: {
        medicationRecords: true
      }
    })

    return NextResponse.json({ medicalRecord }, { status: 201 })
  } catch (error) {
    console.error('創建醫療紀錄失敗:', error)
    return NextResponse.json(
      { message: '創建醫療紀錄失敗' },
      { status: 500 }
    )
  }
}