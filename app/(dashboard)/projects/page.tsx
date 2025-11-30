'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, MoreHorizontal, FolderKanban, CheckCircle, Clock, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const mockProjects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    progress: 45,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    manager: 'John Smith',
    tasks: 12,
    completedTasks: 5,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile app for iOS and Android',
    status: 'PLANNING',
    priority: 'MEDIUM',
    progress: 10,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    manager: 'Sarah Johnson',
    tasks: 24,
    completedTasks: 2,
  },
  {
    id: '3',
    name: 'ERP Integration',
    description: 'Integration of third-party ERP system',
    status: 'COMPLETED',
    priority: 'URGENT',
    progress: 100,
    startDate: '2023-06-01',
    endDate: '2023-12-15',
    manager: 'Michael Brown',
    tasks: 18,
    completedTasks: 18,
  },
  {
    id: '4',
    name: 'Data Migration',
    description: 'Migrate legacy data to new system',
    status: 'ON_HOLD',
    priority: 'LOW',
    progress: 30,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    manager: 'Emily Davis',
    tasks: 8,
    completedTasks: 2,
  },
]

const statusConfig: Record<string, { color: 'default' | 'success' | 'warning' | 'danger', label: string }> = {
  PLANNING: { color: 'default', label: 'Planning' },
  IN_PROGRESS: { color: 'warning', label: 'In Progress' },
  ON_HOLD: { color: 'danger', label: 'On Hold' },
  COMPLETED: { color: 'success', label: 'Completed' },
  CANCELLED: { color: 'danger', label: 'Cancelled' },
}

const priorityConfig: Record<string, { color: 'default' | 'success' | 'warning' | 'danger' }> = {
  LOW: { color: 'default' },
  MEDIUM: { color: 'warning' },
  HIGH: { color: 'danger' },
  URGENT: { color: 'danger' },
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.manager.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Manage projects and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <FolderKanban className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Projects</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">6</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Team Members</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">18</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {project.name}
                </Link>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description}
                </p>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant={statusConfig[project.status].color}>
                {statusConfig[project.status].label}
              </Badge>
              <Badge variant={priorityConfig[project.priority].color}>
                {project.priority}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{project.endDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>{project.completedTasks}/{project.tasks} tasks</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                  {project.manager.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{project.manager}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
