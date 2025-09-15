import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 確保貓咪存在
    const cat = await prisma.cat.findUnique({
      where: { id }
    })

    if (!cat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 獲取所有健康紀錄，按記錄時間降序排列
    const healthRecords = await prisma.healthRecord.findMany({
      where: { catId: id },
      orderBy: {
        recordedAt: 'desc'
      }
    })

    return NextResponse.json({ 
      success: true,
      healthRecords,
      cat: {
        id: cat.id,
        name: cat.name,
        breed: cat.breed,
        color: cat.color,
        imageUrl: cat.imageUrl
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching health records:', error)
    return NextResponse.json({ 
      message: '獲取失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}