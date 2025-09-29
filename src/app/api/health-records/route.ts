import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      catId,
      date,
      timeSlot,
      dryFood,
      stool,
      urine,
      vomiting,
      cough,
      symptoms,
      behavior,
      notes
    } = body

    // 確保貓咪存在
    const cat = await prisma.cat.findUnique({
      where: { id: catId }
    })

    if (!cat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 檢查是否已存在相同日期和時段的紀錄
    const existingRecord = await prisma.healthRecord.findFirst({
      where: {
        catId,
        date,
        timeSlot
      }
    })

    if (existingRecord) {
      return NextResponse.json({ 
        message: '該貓咪在相同日期和時段已有紀錄，不能重複填寫', 
        error: 'DUPLICATE_RECORD' 
      }, { status: 400 })
    }

    // 創建健康紀錄
    const healthRecord = await prisma.healthRecord.create({
      data: {
        catId,
        date,
        timeSlot,
        dryFood,
        stool,
        urine,
        vomiting,
        cough,
        symptoms,
        behavior,
        notes
      }
    })

    return NextResponse.json({ 
      message: '健康紀錄新增成功', 
      healthRecord 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating health record:', error)
    return NextResponse.json({ 
      message: '新增失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}