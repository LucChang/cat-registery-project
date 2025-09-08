import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { isCaged } = body
    const { id } = await params

    // 確保貓咪存在
    const existingCat = await prisma.cat.findUnique({
      where: { id: id }
    })

    if (!existingCat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 更新關龍狀態
    const updatedCat = await prisma.cat.update({
      where: { id: id },
      data: {
        isCaged: isCaged,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: '關龍狀態更新成功', 
      cat: updatedCat 
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating cage status:', error)
    return NextResponse.json({ 
      message: '更新失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}