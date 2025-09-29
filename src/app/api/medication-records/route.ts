import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - 獲取用藥紀錄
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const medicalRecordId = searchParams.get('medicalRecordId')

    const where = medicalRecordId ? { medicalRecordId } : {}

    const medicationRecords = await prisma.medicalRecord.findMany({
      where,
      include: {
        medicationRecords: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })

    return NextResponse.json({ medicationRecords })
  } catch (error) {
    console.error('獲取用藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '獲取用藥紀錄失敗' },
      { status: 500 }
    )
  }
}

// POST - 創建新的用藥紀錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      medicalRecordId,
      date,
      volunteer,
      morningDose,
      eveningDose,
      notes
    } = body

    // 驗證必填欄位
    if (!medicalRecordId || !date || !volunteer || morningDose === undefined || eveningDose === undefined) {
      return NextResponse.json(
        { message: '缺少必填欄位' },
        { status: 400 }
      )
    }

    // 檢查是否已存在相同日期和時段的用藥紀錄
    const existingRecord = await prisma.medicationRecord.findFirst({
      where: {
        medicalRecordId,
        date: new Date(date),
        OR: [
          // 如果要添加的是早上劑量，檢查是否已有早上劑量的紀錄
          { morningDose: morningDose ? true : undefined },
          // 如果要添加的是晚上劑量，檢查是否已有晚上劑量的紀錄
          { eveningDose: eveningDose ? true : undefined }
        ]
      }
    })

    if (existingRecord) {
      const timeSlot = morningDose ? '早上' : (eveningDose ? '晚上' : '');
      return NextResponse.json({ 
        message: `該醫療紀錄在${date}的${timeSlot}時段已有用藥紀錄，不能重複填寫`, 
        error: 'DUPLICATE_RECORD' 
      }, { status: 400 })
    }

    const medicationRecord = await prisma.medicationRecord.create({
      data: {
        medicalRecordId,
        date: new Date(date),
        volunteer,
        morningDose: Boolean(morningDose),
        eveningDose: Boolean(eveningDose),
        notes: notes || null
      }
    })

    return NextResponse.json({ medicationRecord }, { status: 201 })
  } catch (error) {
    console.error('創建用藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '創建用藥紀錄失敗' },
      { status: 500 }
    )
  }
}