'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Plugin {
  id: string;
  name: string;
  key: string;
  version: string;
  description: string;
  isEnabled: boolean;
  configSchema: Record<string, any>;
  tenantConfig?: {
    id: string;
    config: Record<string, any>;
    isEnabled: boolean;
  };
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [pluginConfig, setPluginConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load plugins - in production, fetch from API
    // fetch('/api/v1/plugins/tenant/list').then(res => res.json()).then(setPlugins);
    
    // Mock data for demonstration
    setPlugins([
      {
        id: '1',
        name: 'Advanced Analytics',
        key: 'advanced-analytics',
        version: '1.0.0',
        description: 'Enhanced analytics and reporting capabilities with custom dashboards',
        isEnabled: true,
        configSchema: {
          refreshInterval: { type: 'number', default: 60, label: 'Refresh Interval (seconds)' },
          enableRealtime: { type: 'boolean', default: false, label: 'Enable Real-time Updates' },
        },
        tenantConfig: {
          id: 'tc1',
          config: { refreshInterval: 30, enableRealtime: true },
          isEnabled: true,
        },
      },
      {
        id: '2',
        name: 'Email Marketing',
        key: 'email-marketing',
        version: '1.2.0',
        description: 'Send marketing campaigns and newsletters to your customers',
        isEnabled: true,
        configSchema: {
          apiKey: { type: 'string', label: 'API Key', required: true },
          fromEmail: { type: 'email', label: 'From Email', required: true },
          fromName: { type: 'string', label: 'From Name' },
        },
        tenantConfig: undefined,
      },
      {
        id: '3',
        name: 'Multi-Currency',
        key: 'multi-currency',
        version: '2.0.0',
        description: 'Support for multiple currencies and automatic exchange rate updates',
        isEnabled: true,
        configSchema: {
          baseCurrency: { type: 'string', default: 'USD', label: 'Base Currency' },
          autoUpdate: { type: 'boolean', default: true, label: 'Auto-update Rates' },
          provider: {
            type: 'select',
            options: ['fixer.io', 'openexchangerates', 'currencyapi'],
            label: 'Exchange Rate Provider',
          },
        },
        tenantConfig: {
          id: 'tc3',
          config: { baseCurrency: 'USD', autoUpdate: true, provider: 'fixer.io' },
          isEnabled: false,
        },
      },
    ]);
  }, []);

  const handleToggle = async (plugin: Plugin) => {
    const newEnabled = !plugin.tenantConfig?.isEnabled;
    // In production, POST to /api/v1/plugins/tenant/:key/toggle
    console.log(`Toggling plugin ${plugin.key} to ${newEnabled}`);
    
    // Update local state
    setPlugins(
      plugins.map((p) =>
        p.id === plugin.id
          ? {
              ...p,
              tenantConfig: {
                ...(p.tenantConfig || { id: '', config: {}, isEnabled: false }),
                isEnabled: newEnabled,
              },
            }
          : p,
      ),
    );
  };

  const handleConfigure = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setPluginConfig(plugin.tenantConfig?.config || {});
    setConfigDialogOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!selectedPlugin) return;

    // In production, POST to /api/v1/plugins/tenant/:key/configure
    console.log('Saving config for', selectedPlugin.key, pluginConfig);

    // Update local state
    setPlugins(
      plugins.map((p) =>
        p.id === selectedPlugin.id
          ? {
              ...p,
              tenantConfig: {
                ...(p.tenantConfig || { id: '', config: {}, isEnabled: false }),
                config: pluginConfig,
              },
            }
          : p,
      ),
    );

    setConfigDialogOpen(false);
  };

  const renderConfigField = (key: string, schema: any) => {
    const value = pluginConfig[key] ?? schema.default;

    switch (schema.type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between" key={key}>
            <Label htmlFor={key}>{schema.label || key}</Label>
            <Switch
              id={key}
              checked={value}
              onCheckedChange={(checked) => setPluginConfig({ ...pluginConfig, [key]: checked })}
            />
          </div>
        );
      case 'select':
        return (
          <div key={key}>
            <Label htmlFor={key}>{schema.label || key}</Label>
            <select
              id={key}
              value={value}
              onChange={(e) => setPluginConfig({ ...pluginConfig, [key]: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {schema.options.map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return (
          <div key={key}>
            <Label htmlFor={key}>
              {schema.label || key}
              {schema.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={key}
              type={schema.type}
              value={value}
              onChange={(e) => setPluginConfig({ ...pluginConfig, [key]: e.target.value })}
            />
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Plugin Marketplace</h1>
        <p className="text-gray-600">Extend your ERP with powerful plugins</p>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Plugins</TabsTrigger>
          <TabsTrigger value="enabled">Enabled</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plugins.map((plugin) => (
              <Card key={plugin.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plugin.name}</CardTitle>
                      <CardDescription>v{plugin.version}</CardDescription>
                    </div>
                    {plugin.tenantConfig?.isEnabled && (
                      <Badge className="bg-green-500">Active</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600">{plugin.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Switch
                      checked={plugin.tenantConfig?.isEnabled || false}
                      onCheckedChange={() => handleToggle(plugin)}
                    />
                    <span className="text-sm">
                      {plugin.tenantConfig?.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleConfigure(plugin)}>
                    Configure
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enabled" className="space-y-4">
          {plugins.filter((p) => p.tenantConfig?.isEnabled).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No plugins enabled yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Enable plugins from the Available Plugins tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {plugins
                .filter((p) => p.tenantConfig?.isEnabled)
                .map((plugin) => (
                  <Card key={plugin.id}>
                    <CardHeader>
                      <CardTitle>{plugin.name}</CardTitle>
                      <CardDescription>v{plugin.version}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{plugin.description}</p>
                      {plugin.tenantConfig?.config && (
                        <div className="text-xs text-gray-500">
                          <p className="font-semibold mb-1">Configuration:</p>
                          <pre className="bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(plugin.tenantConfig.config, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConfigure(plugin)}
                        className="w-full"
                      >
                        Reconfigure
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedPlugin?.name}</DialogTitle>
            <DialogDescription>
              Update the configuration for this plugin. Changes will be saved for your organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPlugin &&
              Object.entries(selectedPlugin.configSchema).map(([key, schema]) =>
                renderConfigField(key, schema),
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
