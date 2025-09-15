'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HealthRecord {
  id: string
  date: string
  timeSlot: string
  dryFood: string
  stool: string
  urine: string
  vomiting: string
  cough: string
  symptoms: string
  behavior?: string
  notes?: string
  recordedAt: string
}

interface Cat {
  id: string
  name: string
  breed?: string
  color?: string
  imageUrl?: string
}

export default function CatHealthPage({ params }: { params: Promise<{ id: string }> }) {
  const [cat, setCat] = useState<Cat | null>(null)
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [catId, setCatId] = useState<string>('')

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params
      setCatId(resolvedParams.id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    if (catId) {
      fetchCatAndHealthRecords()
    }
  }, [catId])

  const fetchCatAndHealthRecords = async () => {
    try {
      // 獲取貓咪資訊
      const catResponse = await fetch(`/api/cats/${catId}`)
      const catData = await catResponse.json()
      
      if (!catResponse.ok) {
        throw new Error(catData.message || '無法獲取貓咪資料')
      }
      
      setCat(catData.cat)

      // 獲取健康紀錄
      const healthResponse = await fetch(`/api/cats/${catId}/health-records`)
      const healthData = await healthResponse.json()
      
      if (!healthResponse.ok) {
        throw new Error(healthData.message || '無法獲取健康紀錄')
      }
      
      setHealthRecords(healthData.healthRecords || [])
      setLoading(false)
    } catch (error) {
      console.error('獲取資料失敗:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    )
  }

  if (!cat) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">找不到貓咪</h1>
            <Link href="/cats">
              <Button>返回貓咪清單</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cat.name} 的健康紀錄</h1>
            <p className="text-gray-600 mt-2">查看所有健康狀態記錄</p>
          </div>
          <div className="space-x-2">
            <Link href={`/cats/${catId}/records/new?type=health`}>
              <Button>新增健康紀錄</Button>
            </Link>
            <Link href="/cats">
              <Button variant="outline">返回清單</Button>
            </Link>
          </div>
        </header>

        {healthRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">尚無健康紀錄</p>
              <Link href={`/cats/${catId}/records/new?type=health`}>
                <Button>新增第一筆健康紀錄</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {healthRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    日期: {record.date} - {record.timeSlot}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">乾食:</span> {record.dryFood}</p>
                      <p><span className="font-medium">大便:</span> {record.stool}</p>
                      <p><span className="font-medium">尿:</span> {record.urine}</p>
                      <p><span className="font-medium">嘔吐:</span> {record.vomiting}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">咳嗽:</span> {record.cough}</p>
                      <p><span className="font-medium">症狀:</span> {record.symptoms}</p>
                      {record.behavior && (
                        <p><span className="font-medium">行為:</span> {record.behavior}</p>
                      )}
                      {record.notes && (
                        <p><span className="font-medium">備註:</span> {record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    記錄時間: {new Date(record.recordedAt).toLocaleString('zh-TW')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}