'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">貓咪登記系統 - 主控台</h1>
          <p className="text-gray-600 mt-2">管理您的愛貓資訊與健康記錄</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 貓咪清單卡片 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🐱 貓咪清 單
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                查看所有已登記的貓咪資訊
              </p>
              <Link href="/cats">
                <Button className="w-full">
                  查看                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 新增記錄卡片 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ➕ 新增記錄
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                為貓咪新增健康或醫療記錄
              </p>
              <Link href="/records/new">
                <Button className="w-full">
                  新增記錄
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 註冊新貓咪卡片 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 註冊新貓咪
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                在系統中註冊一隻新的貓咪
              </p>
              <Link href="/cats/new">
                <Button className="w-full">
                  註冊貓咪
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 最近活動卡片 */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>最近活動</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">小橘新增了體重記錄</p>
                    <p className="text-sm text-gray-600">2 小時前</p>
                  </div>
                  <span className="text-sm text-blue-600">健康記錄</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">咪咪完成了定期檢查</p>
                    <p className="text-sm text-gray-600">1 天前</p>
                  </div>
                  <span className="text-sm text-green-600">醫療記錄</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">新貓咪「雪球」已註冊</p>
                    <p className="text-sm text-gray-600">3 天前</p>
                  </div>
                  <span className="text-sm text-purple-600">新註冊</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
