import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - 獲取用藥紀錄
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const medicalRecordId = searchParams.get('medicalRecordId')

    const where = medicalRecordId ? { medicalRecordId } : {}

    const medicationRecords = await prisma.medicalRecord.findMany({
      where,
      include: {
        medicationRecords: {
          orderBy:

    return NextResponse.json({ medicationRecords })
  } catch (error) {
    console.error('獲取用藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '獲取用藥紀錄失敗' },
      { status: 500 }
    )
  }
}

// POST - 創建新的用藥紀錄
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      medicalRecordId,
      date,
      volunteer,
      morningDose,
      eveningDose,
      notes
    } = body

    // 驗證必填欄位
    if (!medicalRecordId || !date || !volunteer || morningDose === undefined || eveningDose === undefined) {
      return NextResponse.json(
        { message: '缺少必填欄位' },
        { status: 400 }
      )
    }

    const medicationRecord = await prisma.medicationRecord.create({
      data: {
        medicalRecordId,
        date: new Date(date),
        volunteer,
        morningDose: Boolean(morningDose),
        eveningDose: Boolean(eveningDose),
        notes: notes || null
      }
    })

    return NextResponse.json({ medicationRecord }, { status: 201 })
  } catch (error) {
    console.error('創建用藥紀錄失敗:', error)
    return NextResponse.json(
      { message: '創建用藥紀錄失敗' },
      { status: 500 }
    )
  }
}