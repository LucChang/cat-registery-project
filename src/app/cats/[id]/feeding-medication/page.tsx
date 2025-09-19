'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Cat {
  id: string
  name: string
  breed?: string
  color?: string
  gender?: string
  birthDate?: string
  imageUrl?: string
}

interface MedicationRecord {
  id: string
  date: string
  volunteer: string
  morningDose: boolean
  eveningDose: boolean
  notes?: string
  medicationName: string
  dosage?: string
}

export default function FeedingMedicationPage() {
  const params = useParams()
  const catId = params.id as string
  const [cat, setCat] = useState<Cat | null>(null)
  const [medicationRecords, setMedicationRecords] = useState<MedicationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    volunteer: '',
    morningDose: false,
    eveningDose: false,
    notes: ''
  })

  useEffect(() => {
    fetchCatAndMedications()
  }, [catId])

  const fetchCatAndMedications = async () => {
    try {
      // 獲取貓咪資訊
      const catResponse = await fetch(`/api/cats/${catId}`)
      const catData = await catResponse.json()
      
      if (!catResponse.ok) {
        throw new Error(catData.message || '無法獲取貓咪資料')
      }
      
      setCat(catData.cat)

      // 獲取用藥紀錄（包含餵藥紀錄）
      const medicationResponse = await fetch(`/api/cats/${catId}/medication-records`)
      const medicationData = await medicationResponse.json()
      
      if (!medicationResponse.ok) {
        throw new Error(medicationData.message || '無法獲取用藥紀錄')
      }
      
      setMedicationRecords(medicationData.records || [])
      setLoading(false)
    } catch (error) {
      console.error('獲取資料失敗:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.volunteer.trim()) {
      alert('請輸入餵藥者名稱')
      return
    }

    if (!formData.morningDose && !formData.eveningDose) {
      alert('請選擇至少一個餵藥時間')
      return
    }

    try {
      const response = await fetch(`/api/cats/${catId}/medication-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || '新增餵藥紀錄失敗')
      }

      // 重置表單並重新載入資料
      setFormData({
        volunteer: '',
        morningDose: false,
        eveningDose: false,
        notes: ''
      })
      setShowForm(false)
      fetchCatAndMedications()
      alert('餵藥紀錄新增成功！')
    } catch (error) {
      console.error('新增餵藥紀錄失敗:', error)
      alert('新增失敗，請稍後再試')
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
            <h1 className="text-3xl font-bold text-gray-900">🐱 {cat.name} 的餵藥紀錄</h1>
            <p className="text-gray-600 mt-2">記錄每日餵藥情況與相關備註</p>
          </div>
          <div className="space-x-2">
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? '取消' : '新增餵藥紀錄'}
            </Button>
            <Link href={`/cats/${catId}/medical`}>
              <Button variant="outline">返回醫療記錄</Button>
            </Link>
            <Link href="/cats">
              <Button variant="outline">返回清單</Button>
            </Link>
          </div>
        </header>

        {/* 新增餵藥表單 */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>新增餵藥紀錄</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="volunteer">餵藥者名稱 *</Label>
                  <Input
                    id="volunteer"
                    value={formData.volunteer}
                    onChange={(e) => setFormData({...formData, volunteer: e.target.value})}
                    placeholder="請輸入餵藥者名稱"
                    required
                  />
                </div>

                <div>
                  <Label>餵藥時間 *</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.morningDose}
                        onChange={(e) => setFormData({...formData, morningDose: e.target.checked})}
                        className="mr-2"
                      />
                      早上
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.eveningDose}
                        onChange={(e) => setFormData({...formData, eveningDose: e.target.checked})}
                        className="mr-2"
                      />
                      晚上
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">備註</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="記錄任何特殊情況或注意事項..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    新增紀錄
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 餵藥紀錄列表 */}
        <Card>
          <CardHeader>
            <CardTitle>最近餵藥紀錄</CardTitle>
          </CardHeader>
          <CardContent>
            {medicationRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">尚無餵藥紀錄</p>
                <p className="text-sm mt-2">點擊上方「新增餵藥紀錄」開始記錄</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicationRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{record.volunteer}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString('zh-TW')} {new Date(record.date).toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <span className={`px-2 py-1 rounded ${record.morningDose ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          早上: {record.morningDose ? '已餵' : '未餵'}
                        </span>
                        <span className={`px-2 py-1 rounded ${record.eveningDose ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          晚上: {record.eveningDose ? '已餵' : '未餵'}
                        </span>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">備註：</span>{record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}