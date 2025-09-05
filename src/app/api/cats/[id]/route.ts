import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cat = await prisma.cat.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, breed, color, gender, birthDate, description, imageUrl } = body

    // 確保貓咪存在
    const existingCat = await prisma.cat.findUnique({
      where: { id: params.id }
    })

    if (!existingCat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 更新貓咪資料
    const updatedCat = await prisma.cat.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    // 確保貓咪存在
    const existingCat = await prisma.cat.findUnique({
      where: { id: params.id }
    })

    if (!existingCat) {
      return NextResponse.json({ message: '找不到貓咪' }, { status: 404 })
    }

    // 刪除貓咪
    await prisma.cat.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: '貓咪已刪除' 
    }, { status: 200 })
  } catch (error) {
    console.error('Error deleting cat:', error)
    return NextResponse.json({ 
      message: '刪除失敗', 
      error: (error as Error).message 
    }, { status: 500 })
  }
}