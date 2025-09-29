'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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
  const router = useRouter()
  const catId = (params as { id: string }).id
  const [cat, setCat] = useState<Cat | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  // const 
  useEffect(() => {
    fetchCatDetail()
  }, [catId])

  const fetchCatDetail = async () => {
    try {
      const response = await fetch(`/api/cats/${catId}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || '無法獲取貓咪資料')
      }
      
      setCat(data.cat)
      setLoading(false)
    } catch (error) {
      console.error('獲取貓咪資料失敗:', error)
      setLoading(false)
    }
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

  const handleDeleteCat = async () => {
    if (!confirm(`確定要刪除 ${cat?.name} 的所有資料嗎？此操作無法復原。`)) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/cats/${catId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || '刪除失敗')
      }

      alert('貓咪資料已成功刪除！')
      router.push('/cats')
    } catch (error) {
      console.error('刪除貓咪失敗:', error)
      alert('刪除失敗，請稍後再試')
    } finally {
      setDeleting(false)
    }
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
                <Link href={`/cats/${cat.id}/feeding-medication`}>
                  <Button variant="outline" className="w-full">
                    餵藥紀錄
                  </Button>
                </Link>
                <Link href={`/cats/${cat.id}/edit`}>
                  <Button variant="outline" className="w-full">
                    編輯資料
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  disabled={deleting}
                  onClick={handleDeleteCat}
                >
                  {deleting ? '刪除中...' : '刪除貓咪'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
