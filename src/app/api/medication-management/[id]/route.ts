import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    await prisma.catMedication.delete({
      where: { id }
    });

    return NextResponse.json({ message: '刪除成功' });
  } catch (error) {
    console.error('刪除用藥記錄錯誤:', error);
    return NextResponse.json(
      { error: '刪除用藥記錄失敗' },
      { status: 500 }
    );
  }
}