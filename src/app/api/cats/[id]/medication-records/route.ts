import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - 獲取貓咪的用藥紀錄
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { message: '缺少貓咪ID' },
        { status: 400 }
      )
    }

    // 先找到貓咪最新的醫療紀錄
    const latestMedicalRecord = await prisma.medicalRecord.findFirst({
      where: { catId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        medicationRecords: {
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!latestMedicalRecord) {
      return NextResponse.json({
        records: [],
        currentMedication: null,
        message: '尚無醫療紀錄'
      })
    }

    return NextResponse.json({
      records: latestMedicalRecord.medicationRecords,
      currentMedication: {
        name: latestMedicalRecord.medication,
        title: latestMedicalRecord.title,
        veterinarian: latestMedicalRecord.veterinarian
      }
    })

  } catch (error) {
    console.error('獲取用藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '獲取用藥紀錄失敗' },
      { status: 500 }
    )
  }
}

// POST - 新增用藥紀錄
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { message: '缺少貓咪ID' },
        { status: 400 }
      )
    }

    const { volunteer, morningDose, eveningDose, notes } = body

    if (!volunteer || typeof volunteer !== 'string') {
      return NextResponse.json(
        { message: '餵藥者名稱為必填' },
        { status: 400 }
      )
    }

    if (!morningDose && !eveningDose) {
      return NextResponse.json(
        { message: '請選擇至少一個餵藥時間' },
        { status: 400 }
      )
    }

    // 找到最新的醫療紀錄
    const latestMedicalRecord = await prisma.medicalRecord.findFirst({
      where: { catId: id },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestMedicalRecord) {
      return NextResponse.json(
        { message: '找不到醫療紀錄，無法新增餵藥紀錄' },
        { status: 400 }
      )
    }

    // 創建新的用藥紀錄
    const medicationRecord = await prisma.medicationRecord.create({
      data: {
        volunteer: volunteer.trim(),
        morningDose: Boolean(morningDose),
        eveningDose: Boolean(eveningDose),
        notes: notes?.trim() || null,
        medicalRecordId: latestMedicalRecord.id
      }
    })

    return NextResponse.json({
      message: '餵藥紀錄新增成功',
      record: medicationRecord
    })

  } catch (error) {
    console.error('新增用藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '新增用藥紀錄失敗' },
      { status: 500 }
    )
  }
}