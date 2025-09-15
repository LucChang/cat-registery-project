import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      catId,
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

    // 確保貓咪存在
    const cat = await prisma.cat.findUnique({
      where: { id: catId }
    })

    if (!cat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 創建醫療紀錄
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        catId,
        title,
        description,
        diagnosis,
        treatment,
        medication,
        veterinarian,
        visitDate: new Date(visitDate),
        nextVisit: nextVisit ? new Date(nextVisit) : null,
        cost: cost ? parseFloat(cost) : null,
        notes
      }
    })

    return NextResponse.json({ 
      message: '醫療紀錄新增成功', 
      medicalRecord 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating medical record:', error)
    return NextResponse.json({ 
      message: '新增失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}