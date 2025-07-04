'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default function NewCatPage() {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    color: '',
    gender: '',
    birthDate: '',
    description: '',
    imageUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: 發送到 API
      console.log('新增貓咪資料:', formData)
      
      // 暫時直接導向貓咪清單
      alert('貓咪註冊成功！')
      window.location.href = '/cats'
    } catch (error) {
      console.error('註冊失敗:', error)
      alert('註冊失敗，請稍後再試')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">註冊新貓咪</h1>
          <p className="text-gray-600 mt-2">請填寫貓咪的基本資訊</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>貓咪資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本資訊 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">貓咪名字 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="請輸入貓咪的名字"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">品種</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) => handleInputChange('breed', e.target.value)}
                      placeholder="例：英國短毛貓"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">顏色</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="例：橘色"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">性別</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇性別" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="公">公</SelectItem>
                        <SelectItem value="母">母</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">出生日期</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">照片網址</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="請輸入貓咪照片的網址（選填）"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="描述貓咪的特徵、個性等（選填）"
                    rows={4}
                  />
                </div>
              </div>

              {/* 按鈕 */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  註冊貓咪
                </Button>
                <Link href="/cats" className="flex-1">
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
