'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

interface Cat {
  id: string
  name: string
}

export default function NewRecordPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [selectedCatId, setSelectedCatId] = useState('')
  const [recordType, setRecordType] = useState('')
  const [healthData, setHealthData] = useState({
    weight: '',
    height: '',
    temperature: '',
    notes: ''
  })
  const [medicalData, setMedicalData] = useState({
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    veterinarian: '',
    visitDate: '',
    nextVisit: '',
    cost: '',
    notes: ''
  })

  useEffect(() => {
    // TODO: 從 API 獲取貓咪清單
    // 現在使用模擬資料
    setCats([
      { id: '1', name: '小橘' },
      { id: '2', name: '咪咪' },
      { id: '3', name: '雪球' }
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCatId || !recordType) {
      alert('請選擇貓咪和記錄類型')
      return
    }

    try {
      const recordData = recordType === 'health' ? healthData : medicalData
      console.log('新增記錄:', { catId: selectedCatId, type: recordType, data: recordData })
      
      alert('記錄新增成功！')
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('新增記錄失敗:', error)
      alert('新增失敗，請稍後再試')
    }
  }

  const handleHealthDataChange = (field: string, value: string) => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMedicalDataChange = (field: string, value: string) => {
    setMedicalData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">新增記錄</h1>
          <p className="text-gray-600 mt-2">為貓咪新增健康或醫療記錄</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>記錄資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 選擇貓咪 */}
              <div className="space-y-2">
                <Label htmlFor="cat">選擇貓咪 *</Label>
                <Select onValueChange={setSelectedCatId}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇要記錄的貓咪" />
                  </SelectTrigger>
                  <SelectContent>
                    {cats.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 記錄類型 */}
              <div className="space-y-2">
                <Label htmlFor="recordType">記錄類型 *</Label>
                <Select onValueChange={setRecordType}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇記錄類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">健康記錄</SelectItem>
                    <SelectItem value="medical">醫療記錄</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 健康記錄表單 */}
              {recordType === 'health' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">健康記錄</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">體重 (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={healthData.weight}
                        onChange={(e) => handleHealthDataChange('weight', e.target.value)}
                        placeholder="例：4.5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="height">身長 (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={healthData.height}
                        onChange={(e) => handleHealthDataChange('height', e.target.value)}
                        placeholder="例：45"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature">體溫 (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={healthData.temperature}
                        onChange={(e) => handleHealthDataChange('temperature', e.target.value)}
                        placeholder="例：38.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthNotes">備註</Label>
                    <Textarea
                      id="healthNotes"
                      value={healthData.notes}
                      onChange={(e) => handleHealthDataChange('notes', e.target.value)}
                      placeholder="記錄任何額外的健康狀況或觀察"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* 醫療記錄表單 */}
              {recordType === 'medical' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">醫療記錄</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">標題 *</Label>
                    <Input
                      id="title"
                      value={medicalData.title}
                      onChange={(e) => handleMedicalDataChange('title', e.target.value)}
                      placeholder="例：定期健康檢查"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitDate">就診日期 *</Label>
                      <Input
                        id="visitDate"
                        type="date"
                        value={medicalData.visitDate}
                        onChange={(e) => handleMedicalDataChange('visitDate', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nextVisit">下次預約日期</Label>
                      <Input
                        id="nextVisit"
                        type="date"
                        value={medicalData.nextVisit}
                        onChange={(e) => handleMedicalDataChange('nextVisit', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="veterinarian">獸醫師</Label>
                    <Input
                      id="veterinarian"
                      value={medicalData.veterinarian}
                      onChange={(e) => handleMedicalDataChange('veterinarian', e.target.value)}
                      placeholder="獸醫師姓名"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">診斷</Label>
                    <Textarea
                      id="diagnosis"
                      value={medicalData.diagnosis}
                      onChange={(e) => handleMedicalDataChange('diagnosis', e.target.value)}
                      placeholder="獸醫師的診斷結果"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="treatment">治療方式</Label>
                    <Textarea
                      id="treatment"
                      value={medicalData.treatment}
                      onChange={(e) => handleMedicalDataChange('treatment', e.target.value)}
                      placeholder="採用的治療方式"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medication">用藥</Label>
                      <Input
                        id="medication"
                        value={medicalData.medication}
                        onChange={(e) => handleMedicalDataChange('medication', e.target.value)}
                        placeholder="處方藥物"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cost">費用</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={medicalData.cost}
                        onChange={(e) => handleMedicalDataChange('cost', e.target.value)}
                        placeholder="診療費用"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalNotes">備註</Label>
                    <Textarea
                      id="medicalNotes"
                      value={medicalData.notes}
                      onChange={(e) => handleMedicalDataChange('notes', e.target.value)}
                      placeholder="其他注意事項或備註"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* 按鈕 */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  新增記錄
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    取消
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
