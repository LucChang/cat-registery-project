'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Cat {
  
  id: string
  name: string
  picture?: string
  breed?: string
  color?: string
  gender?: string
  birthDate?: string
  description?: string
  imageUrl?: string
  createdAt: string
}

export default function CatDetailPage() {
  const params = useParams()
  const catId = params.id as string
  const [cat, setCat] = useState<Cat | null>(null)
  const [loading, setLoading] = useState(true)
  // const 
  useEffect(() => {
    // TODO: 從 API 獲取貓咪詳細資料
    // 現在使用模擬資料
    setTimeout(() => {
      const mockCats: Record<string, Cat> = {
        '1': {
          id: '1',
          name: '小橘',
          breed: '橘貓',
          color: '橘色',
          gender: '公',
          birthDate: '2022-05-15',
          description: '活潑好動的小橘貓，喜歡玩毛線球',
          createdAt: '2024-01-15'
        },
        '2': {
          id: '2',
          name: '咪咪',
          breed: '英國短毛貓',
          color: '灰色',
          gender: '母',
          birthDate: '2021-08-22',
          description: '溫柔安靜的貓咪，喜歡曬太陽',
          createdAt: '2024-01-10'
        },
        '3': {
          id: '3',
          name: '雪球',
          breed: '波斯貓',
          color: '白色',
          gender: '母',
          birthDate: '2023-01-10',
          description: '毛茸茸的白色貓咪，很愛乾淨',
          createdAt: '2024-02-01'
        }
      }
      
      setCat(mockCats[catId] || null)
      setLoading(false)
    }, 1000)
  }, [catId])

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

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate)
    const today = new Date()
    const ageInMs = today.getTime() - birth.getTime()
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365))
    const ageInMonths = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    
    if (ageInYears > 0) {
      return `${ageInYears} 歲 ${ageInMonths} 個月`
    }
    return `${ageInMonths} 個月`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🐱 {cat.name}</h1>
            <p className="text-gray-600 mt-2">貓咪詳細資料</p>
          </div>
          <div className="space-x-2">
            <Link href={`/cats/${cat.id}/health`}>
              <Button>健康記錄</Button>
            </Link>
            <Link href={`/cats/${cat.id}/medical`}>
              <Button variant="outline">醫療記錄</Button>
            </Link>
            <Link href="/cats">
              <Button variant="outline">返回清單</Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 基本資訊 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>基本資訊</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">名字</h3>
                    <p className="text-gray-600">{cat.name}</p>
                  </div>
                  {cat.picture && (
                    <div>
                      <Image 
                        src={cat.picture} 
                        alt={cat.name}
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  {cat.breed && (
                    <div>
                      <h3 className="font-medium text-gray-900">品種</h3>
                      <p className="text-gray-600">{cat.breed}</p>
                    </div>
                  )}
                  
                  {cat.color && (
                    <div>
                      <h3 className="font-medium text-gray-900">顏色</h3>
                      <p className="text-gray-600">{cat.color}</p>
                    </div>
                  )}
                  
                  {cat.gender && (
                    <div>
                      <h3 className="font-medium text-gray-900">性別</h3>
                      <p className="text-gray-600">{cat.gender}</p>
                    </div>
                  )}
                  
                  {cat.birthDate && (
                    <div>
                      <h3 className="font-medium text-gray-900">出生日期</h3>
                      <p className="text-gray-600">{cat.birthDate}</p>
                    </div>
                  )}
                  
                  {cat.birthDate && (
                    <div>
                      <h3 className="font-medium text-gray-900">年齡</h3>
                      <p className="text-gray-600">{calculateAge(cat.birthDate)}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-gray-900">註冊日期</h3>
                    <p className="text-gray-600">{cat.createdAt}</p>
                  </div>
                </div>
                
                {cat.description && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2">描述</h3>
                    <p className="text-gray-600">{cat.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 照片和快速操作 */}
          <div className="space-y-6">
            {/* 照片 */}
            <Card>
              <CardHeader>
                <CardTitle>照片</CardTitle>
              </CardHeader>
              <CardContent>
                {cat.imageUrl ? (
                  <Image 
                    src={cat.imageUrl} 
                    alt={cat.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">🐱</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/records/new?catId=${cat.id}&type=health`}>
                  <Button variant="outline" className="w-full">
                    新增健康記錄
                  </Button>
                </Link>
                <Link href={`/records/new?catId=${cat.id}&type=medical`}>
                  <Button variant="outline" className="w-full">
                    新增醫療記錄
                  </Button>
                </Link>
                <Link href={`/cats/${cat.id}/edit`}>
                  <Button variant="outline" className="w-full">
                    編輯資料
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
