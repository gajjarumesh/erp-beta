'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Integration {
  id: string;
  type: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastTestedAt?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedType, setSelectedType] = useState<string>('stripe');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Load integrations - in production, fetch from API
    // fetch('/api/v1/integrations').then(res => res.json()).then(setIntegrations);
  }, []);

  const integrationTypes = [
    { value: 'stripe', label: 'Stripe', fields: ['apiKey', 'webhookSecret'] },
    { value: 'razorpay', label: 'Razorpay', fields: ['keyId', 'keySecret', 'webhookSecret'] },
    { value: 'sendgrid', label: 'SendGrid', fields: ['apiKey'] },
    { value: 'ses', label: 'AWS SES', fields: ['accessKeyId', 'secretAccessKey', 'region'] },
    { value: 'twilio', label: 'Twilio', fields: ['accountSid', 'authToken'] },
    { value: 'shopify', label: 'Shopify', fields: ['shopDomain', 'accessToken', 'apiVersion'] },
    { value: 'docusign', label: 'DocuSign', fields: ['integrationKey', 'secretKey', 'accountId', 'baseUrl'] },
  ];

  const handleSave = async () => {
    // In production, POST to /api/v1/integrations
    console.log('Saving integration:', { type: selectedType, config: formData });
  };

  const handleTest = async (id: string) => {
    setTesting(true);
    // In production, POST to /api/v1/integrations/:id/test
    setTimeout(() => {
      setTesting(false);
      alert('Integration test successful!');
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-gray-600">Connect external services to your ERP system</p>
      </div>

      <Tabs defaultValue="configure" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Integration</CardTitle>
              <CardDescription>Configure a new external integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Integration Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {integrationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Integration Name</Label>
                <Input
                  placeholder="My Integration"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {integrationTypes
                .find((t) => t.value === selectedType)
                ?.fields.map((field) => (
                  <div key={field}>
                    <Label>{field}</Label>
                    <Input
                      type={field.includes('secret') || field.includes('key') ? 'password' : 'text'}
                      placeholder={`Enter ${field}`}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    />
                  </div>
                ))}

              <Button onClick={handleSave} className="w-full">
                Save Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {integrations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No integrations configured yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Configure your first integration in the Configure tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                    <CardDescription className="capitalize">{integration.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {integration.lastTestedAt && (
                      <p className="text-xs text-gray-500">
                        Last tested: {new Date(integration.lastTestedAt).toLocaleString()}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTest(integration.id)}
                        disabled={testing}
                      >
                        Test Connection
                      </Button>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Payment Gateways</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stripe - Create payment intents for invoices</li>
                <li>• Razorpay - Process payments for Indian market</li>
                <li>• Webhook handlers for payment status updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email Providers</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• SendGrid - Transactional emails</li>
                <li>• AWS SES - Cost-effective email delivery</li>
                <li>• Test connectivity before going live</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">SMS & Communication</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Twilio - Send SMS notifications</li>
                <li>• Workflow action integration</li>
                <li>• Overdue invoice reminders</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">E-commerce & Documents</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Shopify - Sync products and orders</li>
                <li>• DocuSign - Send documents for signature</li>
                <li>• Webhook support for status updates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
