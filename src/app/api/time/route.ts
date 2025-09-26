import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 返回当前标准时间（ISO格式）
    const currentDate = new Date().toISOString().split('T')[0];
    
    return NextResponse.json({ 
      date: currentDate,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  } catch (error) {
    console.error('获取时间失败:', error);
    return NextResponse.json(
      { error: '获取时间失败' },
      { status: 500 }
    );
  }
}