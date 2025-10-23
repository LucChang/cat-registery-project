import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - 獲取餵藥紀錄
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const catId = searchParams.get('catId')

    const where = catId ? { catId } : {}
   
    const medicationRecords = await prisma.catMedication.findMany({
      where,
      include: {
        cat: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ medicationRecords })
  } catch (error) {
    console.error('獲取餵藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '獲取餵藥紀錄失敗' },
      { status: 500 }
    )
  }
}

// POST - 創建新的餵藥紀錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      catId,
      medicationName,
      dosage,
      frequency,
      morning,
      afternoon,
      evening,
      night,
      startDate,
      endDate,
      notes
    } = body

    // 驗證必填欄位
    if (!catId || !medicationName || !startDate || !endDate) {
      return NextResponse.json(
        { message: '缺少必填欄位：貓咪、藥物名稱、開始日期、到期日期' },
        { status: 400 }
      )
    }

    // 驗證日期格式
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start > end) {
      return NextResponse.json(
        { message: '開始日期不能晚於到期日期' },
        { status: 400 }
      )
    }

    // 驗證貓咪是否存在
    const cat = await prisma.cat.findUnique({
      where: { id: catId }
    })

    if (!cat) {
      return NextResponse.json(
        { message: '找不到指定的貓咪' },
        { status: 404 }
      )
    }

    const medicationRecord = await prisma.catMedication.create({
      data: {
        catId,
        medicationName,
        dosage: dosage || '',
        frequency: frequency || '每日',
        morning: Boolean(morning),
        afternoon: Boolean(afternoon),
        evening: Boolean(evening),
        night: Boolean(night),
        startDate: start,
        endDate: end,
        notes: notes || ''
      },
      include: {
        cat: true
      }
    })

    return NextResponse.json({ medicationRecord }, { status: 201 })
  } catch (error) {
    console.error('創建餵藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '創建餵藥紀錄失敗' },
      { status: 500 }
    )
  }
}