'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Cat {
  id: string
  name: string
  breed: string
  color: string
  gender: string
  birthDate: string
  description: string
  imageUrl?: string
}

export default function EditCatPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cat, setCat] = useState<Cat>({
    id: '',
    name: '',
    breed: '',
    color: '',
    gender: '',
    birthDate: '',
    description: '',
    imageUrl: ''
  })
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
      fetchCatData()
    }
  }, [catId])

  const fetchCatData = useCallback(async () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCat(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setCat(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/cats/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cat),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '更新失敗')
      }

      alert('更新成功！')
      router.push(`/cats/${catId}`)
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }, [cat, catId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">載入中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">編輯貓咪資料</h1>
          <p className="text-gray-600 mt-2">修改 {cat.name} 的資訊</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>基本資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">名字</Label>
                <Input
                  id="name"
                  name="name"
                  value={cat.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="breed">品種</Label>
                <Input
                  id="breed"
                  name="breed"
                  value={cat.breed}
                  onChange={handleInputChange}
                  placeholder="例如：波斯貓、美國短毛貓"
                />
              </div>

              <div>
                <Label htmlFor="color">顏色</Label>
                <Input
                  id="color"
                  name="color"
                  value={cat.color}
                  onChange={handleInputChange}
                  placeholder="例如：橘色、黑白相間"
                />
              </div>

              <div>
                <Label htmlFor="gender">性別</Label>
                <Select
                  name="gender"
                  value={cat.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇性別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="公">公</SelectItem>
                    <SelectItem value="母">母</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="birthDate">出生日期</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={cat.birthDate}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="description">描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={cat.description}
                  onChange={handleInputChange}
                  placeholder="描述貓咪的個性、習慣等..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">圖片網址</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={cat.imageUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cat.jpg"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? '儲存中...' : '儲存變更'}
                </Button>
                <Link href={`/cats/${cat.id}`} className="flex-1">
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