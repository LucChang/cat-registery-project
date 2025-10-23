import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const catId = searchParams.get('catId')
    const date = searchParams.get('date')

    if (!catId || !date) {
      return NextResponse.json({ error: 'Missing catId or date' }, { status: 400 })
    }

    const records = await prisma.medicationRecord.findMany({
      where: {
        catId: catId,
        date: {
          gte: new Date(date + 'T00:00:00.000Z'),
          lt: new Date(date + 'T23:59:59.999Z')
        }
      }
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json({ error: 'Failed to fetch medical records' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      catId,
      date,
      volunteer,
      morningDose,
      eveningDose,
      notes
    } = body

    // 確保貓咪存在
    const cat = await prisma.cat.findUnique({
      where: { id: catId }
    })

    if (!cat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 創建用藥紀錄
    const medicationRecord = await prisma.medicationRecord.create({
      data: {
        catId,
        date: date ? new Date(date) : new Date(),
        volunteer,
        morningDose: Boolean(morningDose),
        eveningDose: Boolean(eveningDose),
        notes
      }
    })

    return NextResponse.json({ 
      message: '用藥紀錄新增成功', 
      medicationRecord 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating medication record:', error)
    return NextResponse.json({ 
      message: '新增失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}