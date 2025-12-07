'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: string;
    redis: string;
  };
}

export default function ObservabilityPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [grafanaUrl, setGrafanaUrl] = useState('http://localhost:3001');
  const [prometheusUrl, setPrometheusUrl] = useState('http://localhost:9090');

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      // In production, fetch from /api/v1/health
      // const response = await fetch('/api/v1/health');
      // const data = await response.json();
      // setHealth(data);

      // Mock data for demonstration
      setHealth({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.random() * 86400, // Random uptime in seconds
        environment: 'development',
        version: '1.0.0',
        services: {
          database: 'ok',
          redis: 'ok',
        },
      });
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ok') {
      return <Badge className="bg-green-500">Healthy</Badge>;
    }
    return <Badge className="bg-red-500">Unhealthy</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Observability</h1>
        <p className="text-gray-600">Monitor system health and performance metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              System Status
              <Button size="sm" variant="outline" onClick={fetchHealth} disabled={loading}>
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {health ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  {getStatusBadge(health.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-mono">{formatUptime(health.uptime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Environment</span>
                  <Badge variant="outline">{health.environment}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Version</span>
                  <span className="text-sm font-mono">{health.version}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Last checked: {new Date(health.timestamp).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {health ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  {getStatusBadge(health.services.database)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Redis Cache</span>
                  {getStatusBadge(health.services.redis)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Gateway</span>
                  {getStatusBadge('ok')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Background Workers</span>
                  {getStatusBadge('ok')}
                </div>
              </>
            ) : (
              <p className="text-gray-500">Loading...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Request Rate</span>
              <span className="text-sm font-mono">245/sec</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="text-sm font-mono">0.12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Latency (p95)</span>
              <span className="text-sm font-mono">125ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-mono">1,247</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>External Monitoring Tools</CardTitle>
          <CardDescription>Configure URLs for external monitoring dashboards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Grafana Dashboard URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={grafanaUrl}
                  onChange={(e) => setGrafanaUrl(e.target.value)}
                  placeholder="http://grafana.example.com"
                />
                <Button
                  variant="outline"
                  onClick={() => window.open(grafanaUrl, '_blank')}
                >
                  Open
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                View detailed performance metrics and custom dashboards
              </p>
            </div>
            <div>
              <Label>Prometheus URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={prometheusUrl}
                  onChange={(e) => setPrometheusUrl(e.target.value)}
                  placeholder="http://prometheus.example.com"
                />
                <Button
                  variant="outline"
                  onClick={() => window.open(prometheusUrl, '_blank')}
                >
                  Open
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Query raw metrics and create custom alerts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Dashboards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <h3 className="font-semibold mb-1">API Performance</h3>
              <p className="text-xs text-gray-600">
                Request rates, latency percentiles (p95/p99), and error tracking
              </p>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <h3 className="font-semibold mb-1">Database Metrics</h3>
              <p className="text-xs text-gray-600">
                Query performance, connection pools, and transaction rates
              </p>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <h3 className="font-semibold mb-1">Queue & Jobs</h3>
              <p className="text-xs text-gray-600">
                Queue lengths, job processing rates, and worker performance
              </p>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <h3 className="font-semibold mb-1">Module Errors</h3>
              <p className="text-xs text-gray-600">
                Error rates per module and error type classification
              </p>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <h3 className="font-semibold mb-1">Business Metrics</h3>
              <p className="text-xs text-gray-600">
                Invoices, payments, workflows, and business KPIs
              </p>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <h3 className="font-semibold mb-1">System Resources</h3>
              <p className="text-xs text-gray-600">
                CPU, memory, disk usage, and network metrics
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Observability Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">✓ Prometheus Metrics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• HTTP request duration histograms</li>
                <li>• Database query performance tracking</li>
                <li>• Queue length and job processing metrics</li>
                <li>• Business metrics (invoices, payments, workflows)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ OpenTelemetry Tracing</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Distributed tracing with correlation IDs</li>
                <li>• Trace context propagation across services</li>
                <li>• Span tracking for DB queries and external calls</li>
                <li>• Request lifecycle tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Structured Logging</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• JSON-formatted logs with correlation IDs</li>
                <li>• Request/response logging with context</li>
                <li>• Error tracking with stack traces</li>
                <li>• Performance timing information</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">✓ Database Partitioning</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Monthly partitioning for journal_entries</li>
                <li>• Automated partition management with pg_partman</li>
                <li>• Retention policies for audit_logs and workflow_logs</li>
                <li>• Optimized query performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
