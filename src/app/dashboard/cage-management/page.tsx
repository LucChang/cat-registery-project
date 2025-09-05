'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

interface Cat {
  id: string
  name: string
  breed: string
  color: string
  imageUrl: string | null
  isCaged: boolean
  owner: {
    name: string
  }
}

export default function CageManagementPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCats()
  }, [])

  const fetchCats = async () => {
    try {
      const response = await fetch('/api/cats')
      const data = await response.json()
      if (response.ok) {
        setCats(data.cats)
      } else {
        setError(data.message || '獲取貓咪資料失敗')
      }
    } catch (error) {
      setError('網路錯誤')
    } finally {
      setLoading(false)
    }
  }

  const toggleCageStatus = async (catId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/cats/${catId}/cage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCaged: !currentStatus }),
      })

      if (response.ok) {
        const updatedCat = await response.json()
        setCats(cats.map(cat => 
          cat.id === catId 
            ? { ...cat, isCaged: updatedCat.cat.isCaged }
            : cat
        ))
      } else {
        alert('更新失敗')
      }
    } catch (error) {
      alert('網路錯誤')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">載入中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchCats} className="mt-4">
              重新載入
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">貓咪關龍管理</h1>
              <p className="text-gray-600 mt-2">管理所有貓咪的關龍狀態</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                返回主控台
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cats.map((cat) => (
            <Card key={cat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cat.name}</CardTitle>
                  <span 
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      cat.isCaged 
                        ? "bg-red-100 text-red-800" 
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {cat.isCaged ? "關龍中" : "自由活動"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {cat.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl">🐱</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">品種: {cat.breed || '未知'}</p>
                      <p className="text-sm text-gray-600">顏色: {cat.color || '未知'}</p>
                      <p className="text-sm text-gray-600">飼主: {cat.owner.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium">關龍狀態</span>
                    <button
                    onClick={() => toggleCageStatus(cat.id, cat.isCaged)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      cat.isCaged ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        cat.isCaged ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cats.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">尚無貓咪資料</h3>
            <p className="text-gray-600 mb-4">請先註冊貓咪後再來管理關龍狀態</p>
            <Link href="/cats/new">
              <Button>
                註冊新貓咪
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}