import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catId = searchParams.get('catId');
    
    // 如果有catId參數，查詢特定貓咪的用藥資訊
    if (catId) {
      const medicationRecords = await prisma.catMedication.findMany({
        where: {
          catId: catId,
          // 只查詢還在有效期內的用藥
          endDate: {
            gte: new Date()
          }
        },
        include: {
          cat: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return NextResponse.json({ medications: medicationRecords });
    }
    
    // 如果沒有catId參數，返回所有用藥記錄
    const medicationRecords = await prisma.catMedication.findMany({
      include: {
        cat: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(medicationRecords);
  } catch (error) {
    console.error('獲取用藥記錄錯誤:', error);
    return NextResponse.json(
      { error: '獲取用藥記錄失敗' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
    } = body;

    // 驗證必填欄位
    if (!catId || !medicationName || !startDate || !endDate) {
      return NextResponse.json(
        { error: '缺少必填欄位：貓咪、藥物名稱、開始日期、到期日期' },
        { status: 400 }
      );
    }

    // 驗證日期格式
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return NextResponse.json(
        { error: '開始日期不能晚於到期日期' },
        { status: 400 }
      );
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
    });

    return NextResponse.json(medicationRecord, { status: 201 });
  } catch (error) {
    console.error('創建用藥記錄錯誤:', error);
    return NextResponse.json(
      { error: '創建用藥記錄失敗' },
      { status: 500 }
    );
  }
}