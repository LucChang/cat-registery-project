import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

async function getCats() {
  try {
    const cats = await prisma.cat.findMany({
      include: {
        owner: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return cats
  } catch (error) {
    console.error('獲取貓咪資料失敗:', error)
    return []
  }
}

export default async function CageManagementPage() {
  const cats = await getCats()

  async function toggleCageStatus(catId: string, currentStatus: boolean) {
    'use server'
    
    try {
      await prisma.cat.update({
        where: { id: catId },
        data: { isCaged: !currentStatus }
      })
      revalidatePath('/dashboard/cage-management')
    } catch (error) {
      console.error('更新關龍狀態失敗:', error)
    }
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
                  
                  <form action={toggleCageStatus.bind(null, cat.id, cat.isCaged)} className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium">關龍狀態</span>
                    <button
                      type="submit"
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
                  </form>
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