import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cat = await prisma.cat.findUnique({
      where: { id: id },
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!cat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    return NextResponse.json({ cat }, { status: 200 })
  } catch (error) {
    console.error('Error fetching cat:', error)
    return NextResponse.json({ message: 'Error fetching cat', error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { name, breed, color, gender, birthDate, description, imageUrl } = body
    const { id } = await params

    // 確保貓咪存在
    const existingCat = await prisma.cat.findUnique({
      where: { id: id }
    })

    if (!existingCat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 更新貓咪資料
    const updatedCat = await prisma.cat.update({
      where: { id: id },
      data: {
        name,
        breed,
        color,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        description,
        imageUrl,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: '貓咪資料更新成功', 
      cat: updatedCat 
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating cat:', error)
    return NextResponse.json({ 
      message: '更新失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // 確保貓咪存在
    const existingCat = await prisma.cat.findUnique({
      where: { id: id }
    })

    if (!existingCat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 使用事務來刪除所有相關資料
    await prisma.$transaction(async (tx) => {
      // 先刪除健康記錄
      await tx.healthRecord.deleteMany({
        where: { catId: id }
      })

      // 再刪除醫療記錄
      await tx.medicalRecord.deleteMany({
        where: { catId: id }
      })

      // 最後刪除貓咪
      await tx.cat.delete({
        where: { id: id }
      })
    })

    return NextResponse.json({ 
      message: '貓咪及其所有相關資料已成功刪除' 
    }, { status: 200 })
  } catch (error) {
    console.error('Error deleting cat:', error)
    return NextResponse.json({ 
      message: '刪除失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}