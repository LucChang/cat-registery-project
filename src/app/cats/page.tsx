'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  gender?: string
  birthDate?: string
  imageUrl?: string
  description?: string
  isCaged: boolean
  createdAt: string
  updatedAt: string
  owner?: {
    name: string
    email: string
  }
  healthRecords: HealthRecord[]
}

export default function CatsPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCats()
  }, [])

  const fetchCats = async () => {
    try {
      const response = await fetch('/api/cats')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || '無法獲取貓咪資料')
      }
      
      setCats(data.cats || [])
      setLoading(false)
    } catch (error) {
      console.error('獲取貓咪資料失敗:', error)
      setLoading(false)
    }
  }

  const handleDeleteCat = async (catId: string, catName: string) => {
    if (confirm(`確定要刪除貓咪「${catName}」嗎？\n\n注意：此操作將刪除該貓咪的所有資料，包括健康記錄和醫療記錄，且無法復原。`)) {
      try {
        setDeletingId(catId)
        const response = await fetch(`/api/cats/${catId}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || '刪除失敗')
        }
        
        // 從列表中移除已刪除的貓咪
        setCats(cats.filter(cat => cat.id !== catId))
        alert('貓咪已成功刪除！')
      } catch (error) {
        console.error('刪除貓咪失敗:', error)
        alert(`刪除失敗：${error instanceof Error ? error.message : '未知錯誤'}`)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">貓咪清單</h1>
            <p className="text-gray-600 mt-2">管理所有已註冊的貓咪</p>
          </div>
          <div className="space-x-2">
            <Link href="/cats/new">
              <Button>註冊新貓咪</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">返回主控台</Button>
            </Link>
          </div>
        </header>
        <div className='flex justify-center mb-[8px] '>
          <input type="text" placeholder="搜索貓咪" id="cat-input" className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.filter(cat => 
            !searchTerm || 
            cat.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    🐱 {cat.name}
                  </CardTitle>
                  <Button variant = 'record'onClick={() => window.location.href = 'records/new'}>
                     紀錄
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {cat.imageUrl && (
                  <div className="mb-4">
                    <Image 
                      src={cat.imageUrl && (cat.imageUrl.startsWith('http') || cat.imageUrl.startsWith('/')) ? cat.imageUrl : '/placeholder-cat.jpg'} 
                      alt={cat.name}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-md shadow-2xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-cat.jpg'
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  {cat.breed && (
                    <p className="text-sm">
                      <span className="font-medium">品種：</span>{cat.breed}
                    </p>
                  )}
                  {cat.color && (
                    <p className="text-sm">
                      <span className="font-medium">顏色：</span>{cat.color}
                    </p>
                  )}
                  {cat.gender && (
                    <p className="text-sm">
                      <span className="font-medium">性別：</span>{cat.gender}
                    </p>
                  )}
                  {cat.birthDate && (
                    <p className="text-sm">
                      <span className="font-medium">進入日期：</span>{new Date(cat.birthDate).toLocaleDateString('zh-TW')}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">關龍狀態：</span>
                    <span className={`font-medium text-sm ${
                      cat.isCaged ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {cat.isCaged ? "關籠" : "不關籠"}
                    </span>
                  </div>
                  {cat.owner && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">飼主：</span>{cat.owner.name}
                    </p>
                  )}
                  
                  {/* 顯示最新健康紀錄 */}
                  {cat.healthRecords && cat.healthRecords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">最新健康紀錄</h4>
                      <div className="text-xs space-y-1 text-gray-600">
                        <p><span className="font-medium">日期：</span>{cat.healthRecords[0].date}</p>
                        <p><span className="font-medium">時段：</span>{cat.healthRecords[0].timeSlot}</p>
                        <p><span className="font-medium">乾食：</span>{cat.healthRecords[0].dryFood}</p>
                        <p><span className="font-medium">大便：</span>{cat.healthRecords[0].stool}</p>
                        <p><span className="font-medium">尿：</span>{cat.healthRecords[0].urine}</p>
                        {cat.healthRecords[0].symptoms && (
                          <p><span className="font-medium">症狀：</span>{cat.healthRecords[0].symptoms}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <Link href={`/cats/${cat.id}`}>
                    <Button className="w-full" size="sm">
                      查看詳細資料
                    </Button>
                  </Link>
                  <div className="flex gap-2">
                    <Link href={`/cats/${cat.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        編輯資料
                      </Button>
                    </Link>
                    <Link href={`/cats/${cat.id}/health`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        健康記錄
                      </Button>
                    </Link>
                    <Link href={`/cats/${cat.id}/medical`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        醫療記錄
                      </Button>
                    </Link>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleDeleteCat(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
                  >
                    {deletingId === cat.id ? '刪除中...' : '刪除貓咪'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">還沒有註冊任何貓咪</p>
            <Link href="/cats/new">
              <Button>註冊第一隻貓咪</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
