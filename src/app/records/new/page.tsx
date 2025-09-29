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
  const [loading, setLoading] = useState(true)
  const [healthData, setHealthData] = useState({
    timeSlot: '',
    dryFood: '',
    stool: '',
    urine: '',
    vomiting: '',
    cough: '',
    symptoms: '',
    behavior: '',
    notes: ''
  })
  const [currentDate, setCurrentDate] = useState('')
  const [existingHealthRecords, setExistingHealthRecords] = useState<string[]>([])
  const [existingMedicalRecords, setExistingMedicalRecords] = useState<{morning: boolean, evening: boolean}>({morning: false, evening: false})
  const [catMedicationInfo, setCatMedicationInfo] = useState<any>(null)
  const [medicalData, setMedicalData] = useState({
    medicationName: '',
    frequency: '',
    morningDose: '',
    afternoonDose: '',
    eveningDose: '',
    nightDose: '',
    startDate: '',
    endDate: '',
    notes: ''

  })

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('/api/cats')
        if (!response.ok) {
          throw new Error('獲取貓咪資料失敗')
        }
        const data = await response.json()
        setCats(data.cats || [])
      } catch (error) {
        console.error('獲取貓咪資料失敗:', error)
        alert('無法獲取貓咪資料，請稍後再試')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCats()
    
    // 獲取當前日期
    const getCurrentDate = async () => {
      try {
        const response = await fetch('/api/time')
        if (!response.ok) {
          throw new Error('無法獲取標準時間')
        }
        const data = await response.json()
        setCurrentDate(data.date)
      } catch (error) {
        console.error('獲取標準時間失敗，使用本地時間:', error)
        const today = new Date().toISOString().split('T')[0]
        setCurrentDate(today)
      }
    }
    
    getCurrentDate()
  }, [])
  //nothing
  // 當選擇貓咪或日期改變時，檢查現有記錄
  useEffect(() => {
    const checkExistingRecords = async () => {
      if (!selectedCatId || !currentDate) return
      
      try {
        // 檢查健康記錄
        const healthResponse = await fetch(`/api/health-records?catId=${selectedCatId}&date=${currentDate}`)
        if (healthResponse.ok) {
          const healthData = await healthResponse.json()
          const existingSlots = healthData.records.map((record: any) => record.timeSlot)
          setExistingHealthRecords(existingSlots)
        }
        
        // 檢查用藥記錄
        const medicalResponse = await fetch(`/api/medical-records?catId=${selectedCatId}&date=${currentDate}`)
        if (medicalResponse.ok) {
          const medicalData = await medicalResponse.json()
          const hasMorning = medicalData.records.some((record: any) => record.morningDose)
          const hasEvening = medicalData.records.some((record: any) => record.eveningDose)
          setExistingMedicalRecords({ morning: hasMorning, evening: hasEvening })
        }
        
        // 獲取貓咪的用藥資訊
        const medicationResponse = await fetch(`/api/medication-management?catId=${selectedCatId}`)
        if (medicationResponse.ok) {
          const medicationData = await medicationResponse.json()
          if (medicationData.medications && medicationData.medications.length > 0) {
            // 設置所有有效的用藥記錄
            setCatMedicationInfo(medicationData.medications)
          } else {
            // 如果沒有用藥記錄，設置為空陣列
            setCatMedicationInfo([])
          }
        } else {
          setCatMedicationInfo([])
        }
      } catch (error) {
        console.error('檢查現有記錄失敗:', error)
      }
    }
    
    checkExistingRecords()
  }, [selectedCatId, currentDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCatId || !recordType) {
      alert('請選擇貓咪和記錄類型')
      return
    }

    // 驗證必填欄位
    if (recordType === 'health') {
      if (!healthData.timeSlot || !healthData.dryFood || 
          !healthData.stool || !healthData.urine || !healthData.vomiting || !healthData.cough) {
        alert('請填寫所有健康記錄的必填欄位')
        return
      }
    } else if (recordType === 'medical') {
      if (!medicalData.volunteer || !medicalData.timeSlot) {
        alert('請填寫餵藥者名稱並選擇餵藥時間')
        return
      }
    }

    try {
      const endpoint = recordType === 'health' ? '/api/health-records' : '/api/medical-records'
      const recordData = recordType === 'health' ? healthData : medicalData
      
      // 自動添加當前日期
      const submitData = {
        ...recordData,
        date: currentDate,
        catId: selectedCatId
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || '新增失敗')
      }
      
      alert('記錄新增成功！')
      window.location.href = `/cats/${selectedCatId}/medical`
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
                <Select onValueChange={setSelectedCatId} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={loading ? "載入貓咪資料中..." : "請選擇要記錄的貓咪"} 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cats.length === 0 && !loading ? (
                      <SelectItem value="none" disabled>
                        尚無貓咪資料
                      </SelectItem>
                    ) : (
                      cats.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    )}
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
                    <SelectItem value="medical">用藥紀錄</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 健康記錄表單 */}
              {recordType === 'health' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">健康記錄</h3>
                  


                  {/* 時段 */}
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot">時段 *</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('timeSlot', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇時段" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="上午" disabled={existingHealthRecords.includes('上午')}>
                          上午 {existingHealthRecords.includes('上午') && '(已記錄)'}
                        </SelectItem>
                        <SelectItem value="下午" disabled={existingHealthRecords.includes('下午')}>
                          下午 {existingHealthRecords.includes('下午') && '(已記錄)'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 乾食 */}
                  <div className="space-y-2">
                    <Label htmlFor="dryFood">乾食 *</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('dryFood', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇乾食狀況" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="正常">正常</SelectItem>
                        <SelectItem value="一點">一點</SelectItem>
                        <SelectItem value="不吃">不吃</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 大便 */}
                  <div className="space-y-2">
                    <Label htmlFor="stool">大便 *</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('stool', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇大便狀況" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="成形">成形</SelectItem>
                        <SelectItem value="軟便">軟便</SelectItem>
                        <SelectItem value="拉肚子">拉肚子</SelectItem>
                        <SelectItem value="血便">血便</SelectItem>
                        <SelectItem value="無">無</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 尿 */}
                  <div className="space-y-2">
                    <Label htmlFor="urine">尿 *</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('urine', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇尿的狀況" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="正常">正常</SelectItem>
                        <SelectItem value="過多">過多</SelectItem>
                        <SelectItem value="血尿">血尿</SelectItem>
                        <SelectItem value="少量">少量</SelectItem>
                        <SelectItem value="無">無</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 嘔吐 */}
                  <div className="space-y-2">
                    <Label htmlFor="vomiting">嘔吐 *</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('vomiting', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇嘔吐狀況" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="無">無</SelectItem>
                        <SelectItem value="食物/毛球">食物/毛球</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 咳嗽 */}
                  <div className="space-y-2">
                    <Label htmlFor="cough">咳嗽 *</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('cough', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇咳嗽狀況" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="有">有</SelectItem>
                        <SelectItem value="無">無</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 症狀 */}
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">症狀</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('symptoms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇症狀（可選）" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="打噴嚏">打噴嚏</SelectItem>
                        <SelectItem value="鼻塞">鼻塞</SelectItem>
                        <SelectItem value="流鼻涕">流鼻涕</SelectItem>
                        <SelectItem value="眼睛紅腫">眼睛紅腫</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                   {/* 行為 */}
                  <div className="space-y-2">
                    <Label htmlFor="behavior">行為</Label>
                    <Select onValueChange={(value) => handleHealthDataChange('behavior', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="請選擇行為（可選）" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="親人">親人</SelectItem>
                        <SelectItem value="害怕">害怕</SelectItem>
                        <SelectItem value="沮喪">沮喪</SelectItem>
                        <SelectItem value="無性">無性</SelectItem>
                        <SelectItem value="在沙盆外">在沙盆外</SelectItem>
                      </SelectContent>
                    </Select>
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

              {recordType === 'medical' && (
                  
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 mb-2">用藥資訊</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    請確實記錄餵藥時間和餵藥者名稱，以便追蹤用藥情況。
                    每天早上和晚上請確認是否已經餵藥。
                  </p>
                  
                  {/* 顯示貓咪當前的用藥資訊 */}
                  {catMedicationInfo && catMedicationInfo.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      <h5 className="font-medium text-amber-900">當前用藥清單：</h5>
                      {catMedicationInfo.map((medication: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border border-amber-200">
                          <div className="flex justify-between items-start mb-2">
                            <h6 className="font-medium text-gray-900">{medication.medicationName}</h6>
                            <span className="text-xs text-gray-500">
                              {new Date(medication.startDate).toLocaleDateString()} - {new Date(medication.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          {medication.dosage && (
                            <p className="text-sm text-gray-600 mb-1">劑量: {medication.dosage}</p>
                          )}
                          <p className="text-sm text-gray-600 mb-2">頻率: {medication.frequency}</p>
                          <div className="flex gap-2 text-xs">
                            {medication.morning && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">早上</span>}
                            {medication.afternoon && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">下午</span>}
                            {medication.evening && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">晚上</span>}
                            {medication.night && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">睡前</span>}
                          </div>
                          {medication.notes && (
                            <p className="text-sm text-gray-500 mt-2">備註: {medication.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : selectedCatId ? (
                    <div className="mt-4 p-3 bg-gray-100 rounded border">
                      <p className="text-sm text-gray-600">此貓咪目前沒有進行中的用藥記錄</p>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-gray-100 rounded border">
                      <p className="text-sm text-gray-600">請先選擇貓咪以查看用藥資訊</p>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-medium">用藥紀錄</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="volunteer">餵藥者名稱 *</Label>
                  <Input
                    id="volunteer"
                    value={medicalData.volunteer}
                    onChange={(e) => handleMedicalDataChange('volunteer', e.target.value)}
                    placeholder="輸入負責餵藥的志工名稱"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>餵藥時間 *</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="morningDose"
                        name="timeSlot"
                        value="morning"
                        checked={medicalData.timeSlot === 'morning'}
                        onChange={(e) => handleMedicalDataChange('timeSlot', e.target.value)}
                        className="border-gray-300"
                        disabled={existingMedicalRecords.morning}
                      />
                      <Label htmlFor="morningDose" className={`font-normal ${existingMedicalRecords.morning ? 'text-gray-400' : ''}`}>
                        早上 {existingMedicalRecords.morning && '(已記錄)'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="eveningDose"
                        name="timeSlot"
                        value="evening"
                        checked={medicalData.timeSlot === 'evening'}
                        onChange={(e) => handleMedicalDataChange('timeSlot', e.target.value)}
                        className="border-gray-300"
                        disabled={existingMedicalRecords.evening}
                      />
                      <Label htmlFor="eveningDose" className={`font-normal ${existingMedicalRecords.evening ? 'text-gray-400' : ''}`}>
                        晚上 {existingMedicalRecords.evening && '(已記錄)'}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="description">用藥說明</Label>
                  <Textarea
                    id="description"
                    value={medicalData.description}
                    onChange={(e) => handleMedicalDataChange('description', e.target.value)}
                    placeholder="描述用藥原因、注意事項等"
                    rows={3}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">其他備註</Label>
                  <Textarea
                    id="medicalNotes"
                    value={medicalData.notes}
                    onChange={(e) => handleMedicalDataChange('notes', e.target.value)}
                    placeholder="其他需要注意的事項"
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
