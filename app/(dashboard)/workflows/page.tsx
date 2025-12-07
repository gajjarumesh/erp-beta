'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WorkflowsPage() {
  const [workflows] = useState([
    {
      id: 1,
      name: 'Overdue Invoice Reminder',
      description: 'Send email reminder for overdue invoices',
      trigger: 'Scheduled (Daily)',
      status: 'Active',
      runsCount: 143,
      lastRun: '2024-12-07 08:00:00',
    },
    {
      id: 2,
      name: 'New Lead Notification',
      description: 'Notify sales team when a new lead is created',
      trigger: 'On Create (Lead)',
      status: 'Active',
      runsCount: 89,
      lastRun: '2024-12-07 10:30:00',
    },
    {
      id: 3,
      name: 'Low Stock Alert',
      description: 'Alert when product stock falls below minimum',
      trigger: 'On Update (Product)',
      status: 'Inactive',
      runsCount: 12,
      lastRun: '2024-12-05 14:15:00',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflow Engine</h1>
            <p className="text-gray-600 mt-2">Automate business processes with custom workflows</p>
          </div>
          <Button>Create Workflow</Button>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{workflow.name}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        workflow.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {workflow.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{workflow.description}</p>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Trigger:</span>
                      <p className="font-medium mt-1">{workflow.trigger}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Runs:</span>
                      <p className="font-medium mt-1">{workflow.runsCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Run:</span>
                      <p className="font-medium mt-1">{workflow.lastRun}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">View Logs</Button>
                  <Button variant="outline" size="sm">Test Run</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Workflow Builder Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Workflows Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Triggers</h3>
              <p className="text-gray-600 text-sm">
                Define when workflows should run: on record creation, updates, schedules, or webhooks
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-semibold mb-2">Conditions</h3>
              <p className="text-gray-600 text-sm">
                Set conditions to filter when actions execute based on field values and logic
              </p>
            </Card>

            <Card className="p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Actions</h3>
              <p className="text-gray-600 text-sm">
                Execute actions: send emails/SMS, update records, call webhooks, or create tasks
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
