import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cats = await prisma.cat.findMany({
      include: {
        owner: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ cats }, { status: 200 })
  } catch (error) {
    console.error('Error fetching cats:', error)
    return NextResponse.json({ message: 'Error fetching cats', error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const breed = formData.get('breed') as string
    const color = formData.get('color') as string
    const gender = formData.get('gender') as string
    const birthDate = formData.get('birthDate') as string
    const description = formData.get('description') as string
    const pictureFile = formData.get('picture') as File | null

    let pictureUrl = formData.get('picture') as string | null

    if (pictureFile && pictureFile.size > 0) {
      const buffer = Buffer.from(await pictureFile.arrayBuffer())
      const filename = Date.now() + '-' + pictureFile.name.replace(/ /g, '_')
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      const filePath = path.join(uploadDir, filename)

      // Ensure the upload directory exists
      await mkdir(uploadDir, { recursive: true })
      await writeFile(filePath, buffer)
      pictureUrl = `/uploads/${filename}`
    }

    // 暫時使用固定的測試用戶 ID，實際應用中應從登入用戶獲取
    // 先查詢測試用戶
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (!testUser) {
      return NextResponse.json({ message: '找不到測試用戶，請先運行 prisma:seed 命令' }, { status: 400 })
    }
    
    const ownerId = testUser.id
    
    const newCat = await prisma.cat.create({
      data: {
        name,
        breed,
        color,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        description,
        imageUrl: pictureUrl,
        ownerId, // 添加 ownerId 欄位
        // Remove isCaged field as it's not defined in the Prisma schema
      },
    })

    return NextResponse.json({ message: 'Cat registered successfully', cat: newCat }, { status: 200 })
  } catch (error) {
    console.error('Error registering cat:', error)
    return NextResponse.json({ message: 'Error registering cat', error: (error as Error).message }, { status: 500 })
  }
}