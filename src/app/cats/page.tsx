'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

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
}

export default function CatsPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🐱 {cat.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cat.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={cat.imageUrl.startsWith('http') ? cat.imageUrl : cat.imageUrl} 
                      alt={cat.name}
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
