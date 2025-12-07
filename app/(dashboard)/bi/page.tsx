'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BIPage() {
  const [widgets] = useState([
    {
      id: 1,
      name: 'Revenue by Month',
      type: 'chart',
      data: { current: '$45,231', change: '+12%' },
    },
    {
      id: 2,
      name: 'Top Customers',
      type: 'list',
      data: { count: 156, change: '+5%' },
    },
    {
      id: 3,
      name: 'Inventory Value',
      type: 'metric',
      data: { value: '$324,512', change: '+3%' },
    },
    {
      id: 4,
      name: 'Open Invoices',
      type: 'metric',
      data: { count: 23, amount: '$12,450' },
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">BI Dashboard</h1>
            <p className="text-gray-600 mt-2">Business intelligence and analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Configure Widgets</Button>
            <Button>Add Widget</Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((widget) => (
            <Card key={widget.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-medium text-gray-600">{widget.name}</h3>
                <Button variant="ghost" size="sm">⋮</Button>
              </div>

              {widget.type === 'metric' && (
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    {widget.data.value || widget.data.count}
                  </p>
                  {widget.data.amount && (
                    <p className="text-sm text-gray-600 mt-1">{widget.data.amount}</p>
                  )}
                  {widget.data.change && (
                    <p className="text-sm text-green-600 mt-2">{widget.data.change}</p>
                  )}
                </div>
              )}

              {widget.type === 'chart' && (
                <div>
                  <p className="text-3xl font-bold text-gray-900">{widget.data.current}</p>
                  <p className="text-sm text-green-600 mt-2">{widget.data.change} from last month</p>
                  <div className="mt-4 h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    Chart Placeholder
                  </div>
                </div>
              )}

              {widget.type === 'list' && (
                <div>
                  <p className="text-3xl font-bold text-gray-900">{widget.data.count}</p>
                  <p className="text-sm text-green-600 mt-2">{widget.data.change} this month</p>
                  <div className="mt-4 space-y-2">
                    <div className="text-sm text-gray-600">Top customers by revenue</div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Reports Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Revenue by Month', category: 'Finance' },
              { name: 'Top Customers', category: 'Sales' },
              { name: 'Inventory Valuation', category: 'Inventory' },
              { name: 'Timesheet Utilization', category: 'HR' },
            ].map((report, index) => (
              <Card key={index} className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.category}</p>
                  </div>
                  <Button variant="ghost" size="sm">▶</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
