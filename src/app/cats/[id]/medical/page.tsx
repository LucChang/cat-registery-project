'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MedicalRecord {
  id: string
  date: string
  volunteer: string
  morningDose: boolean
  eveningDose: boolean
  notes?: string
}

interface Cat {
  id: string
  name: string
  breed?: string
  color?: string
  imageUrl?: string
}

export default function MedicalRecordsPage({ params }: { params: Promise<{ id: string }> }) {
  const [cat, setCat] = useState<Cat | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
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
      fetchCatAndMedicalRecords()
    }
  }, [catId])

  const fetchCatAndMedicalRecords = async () => {
    try {
      // 獲取貓咪資訊
      const catResponse = await fetch(`/api/cats/${catId}`)
      const catData = await catResponse.json()
      
      if (!catResponse.ok) {
        throw new Error(catData.message || '無法獲取貓咪資料')
      }
      
      setCat(catData.cat)

      // 獲取醫療紀錄
      const medicalResponse = await fetch(`/api/cats/${catId}/medical-records`)
      const medicalData = await medicalResponse.json()
      
      if (!medicalResponse.ok) {
        throw new Error(medicalData.message || '無法獲取醫療紀錄')
      }
      
      setMedicalRecords(medicalData.medicationRecords || [])
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
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{cat.name} 的醫療紀錄</h1>
            <p className="text-gray-600 mt-2">查看所有醫療狀態與用藥記錄</p>
          </div>
          <div className="space-x-2">
            <Link href={`/cats/${catId}/records/new?type=medical`}>
              <Button>新增醫療紀錄</Button>
            </Link>
            <Link href="/cats">
              <Button variant="outline">返回清單</Button>
            </Link>
          </div>
        </header>

        {medicalRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">尚無醫療紀錄</p>
              <Link href={`/cats/${catId}/records/new?type=medical`}>
                <Button>新增第一筆醫療紀錄</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {medicalRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">給藥紀錄</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        日期: {new Date(record.date).toLocaleDateString('zh-TW')} | 
                        給藥者: {record.volunteer}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {record.morningDose && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">早上</span>
                      )}
                      {record.eveningDose && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">晚上</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      {record.notes && (
                        <>
                          <h4 className="font-medium text-gray-900 mb-2">備註</h4>
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </>
                      )}
                    </div>
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
