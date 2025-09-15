'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MedicalRecord {
  id: string
  title: string
  description: string
  diagnosis: string
  treatment: string
  medication: string
  veterinarian: string
  visitDate: string
  nextVisit?: string
  cost?: number
  notes?: string
  createdAt: string
  medicationRecords: MedicationRecord[]
}

interface MedicationRecord {
  id: string
  date: string
  volunteer: string
  morningDose: boolean
  eveningDose: boolean
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
      
      setMedicalRecords(medicalData.medicalRecords || [])
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
                      <CardTitle className="text-xl">{record.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        就診日期: {new Date(record.visitDate).toLocaleDateString('zh-TW')} | 
                        獸醫師: {record.veterinarian}
                      </p>
                    </div>
                    {record.cost && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">${record.cost}</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">診斷結果</h4>
                      <p className="text-sm text-gray-700 mb-4">{record.diagnosis}</p>
                      
                      <h4 className="font-medium text-gray-900 mb-2">治療方案</h4>
                      <p className="text-sm text-gray-700 mb-4">{record.treatment}</p>
                      
                      <h4 className="font-medium text-gray-900 mb-2">藥物資訊</h4>
                      <p className="text-sm text-gray-700">{record.medication}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">詳細描述</h4>
                      <p className="text-sm text-gray-700 mb-4">{record.description}</p>
                      
                      {record.nextVisit && (
                        <>
                          <h4 className="font-medium text-gray-900 mb-2">下次回診</h4>
                          <p className="text-sm text-gray-700 mb-4">
                            {new Date(record.nextVisit).toLocaleDateString('zh-TW')}
                          </p>
                        </>
                      )}
                      
                      {record.notes && (
                        <>
                          <h4 className="font-medium text-gray-900 mb-2">備註</h4>
                          <p className="text-sm text-gray-700">{record.notes}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 用藥紀錄 */}
                  {record.medicationRecords && record.medicationRecords.length > 0 && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">用藥紀錄</h4>
                      <div className="space-y-2">
                        {record.medicationRecords.map((medication) => (
                          <div key={medication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium">
                                {new Date(medication.date).toLocaleDateString('zh-TW')} - {medication.volunteer}
                              </p>
                              {medication.notes && (
                                <p className="text-xs text-gray-600">{medication.notes}</p>
                              )}
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className={`px-2 py-1 rounded ${medication.morningDose ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                早上: {medication.morningDose ? '已給藥' : '未給藥'}
                              </span>
                              <span className={`px-2 py-1 rounded ${medication.eveningDose ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                晚上: {medication.eveningDose ? '已給藥' : '未給藥'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500">
                    建立時間: {new Date(record.createdAt).toLocaleString('zh-TW')}
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
