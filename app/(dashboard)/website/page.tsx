'use client'

import { useState } from 'react'
import { Plus, Globe, FileText, Settings, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const mockPages = [
  { id: '1', title: 'Home', slug: '/', status: 'published', lastModified: '2024-01-15' },
  { id: '2', title: 'About Us', slug: '/about', status: 'published', lastModified: '2024-01-10' },
  { id: '3', title: 'Products', slug: '/products', status: 'published', lastModified: '2024-01-18' },
  { id: '4', title: 'Contact', slug: '/contact', status: 'draft', lastModified: '2024-01-20' },
  { id: '5', title: 'Blog', slug: '/blog', status: 'published', lastModified: '2024-01-12' },
]

const mockMenuItems = [
  { id: '1', label: 'Home', url: '/', order: 1 },
  { id: '2', label: 'Products', url: '/products', order: 2 },
  { id: '3', label: 'About', url: '/about', order: 3 },
  { id: '4', label: 'Blog', url: '/blog', order: 4 },
  { id: '5', label: 'Contact', url: '/contact', order: 5 },
]

export default function WebsitePage() {
  const [activeTab, setActiveTab] = useState('pages')

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Website</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your website content and settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
              <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pages</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">4</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Edit className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Menu Items</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="menus">Menus</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === 'pages' ? 'New Page' : activeTab === 'menus' ? 'New Menu Item' : 'Save Settings'}
          </Button>
        </div>

        <TabsContent value="pages">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Slug</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Last Modified</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mockPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {page.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {page.slug}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={page.status === 'published' ? 'success' : 'default'}>
                          {page.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {page.lastModified}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="View">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Edit">
                            <Edit className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Delete">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="menus">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Main Navigation</h3>
            <div className="space-y-2">
              {mockMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {item.order}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Website Settings</h3>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Title
                </label>
                <input
                  type="text"
                  defaultValue="My Company"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Welcome to our company website"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Favicon URL
                </label>
                <input
                  type="text"
                  defaultValue="/favicon.ico"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
