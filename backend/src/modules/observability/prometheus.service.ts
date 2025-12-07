import { Injectable, Logger } from '@nestjs/common';

interface CounterMetric {
  type: 'counter';
  help: string;
  labels: string[];
  values: Map<string, number>;
}

interface GaugeMetric {
  type: 'gauge';
  help: string;
  labels: string[];
  values: Map<string, number>;
}

interface HistogramObservation {
  sum: number;
  count: number;
  buckets: Map<number, number>;
}

interface HistogramMetric {
  type: 'histogram';
  help: string;
  labels: string[];
  buckets: number[];
  values: Map<string, HistogramObservation>;
}

type Metric = CounterMetric | GaugeMetric | HistogramMetric;

@Injectable()
export class PrometheusService {
  private readonly logger = new Logger(PrometheusService.name);
  private metrics: Map<string, Metric> = new Map();

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // HTTP metrics
    this.registerHistogram(
      'http_request_duration_seconds',
      'HTTP request duration in seconds',
      ['method', 'route', 'status_code'],
      [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    );

    this.registerCounter(
      'http_requests_total',
      'Total HTTP requests',
      ['method', 'route', 'status_code'],
    );

    this.registerCounter(
      'http_request_errors_total',
      'Total HTTP request errors',
      ['method', 'route', 'error_type'],
    );

    // Database metrics
    this.registerHistogram(
      'db_query_duration_seconds',
      'Database query duration in seconds',
      ['operation', 'table'],
      [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
    );

    this.registerCounter(
      'db_queries_total',
      'Total database queries',
      ['operation', 'table'],
    );

    this.registerCounter(
      'db_query_errors_total',
      'Total database query errors',
      ['operation', 'table'],
    );

    // Queue metrics
    this.registerGauge('queue_length', 'Current queue length', ['queue_name']);

    this.registerCounter(
      'queue_jobs_processed_total',
      'Total queue jobs processed',
      ['queue_name', 'status'],
    );

    this.registerHistogram(
      'queue_job_duration_seconds',
      'Queue job processing duration',
      ['queue_name'],
      [0.1, 0.5, 1, 2, 5, 10, 30, 60],
    );

    // Business metrics
    this.registerCounter(
      'invoices_created_total',
      'Total invoices created',
      ['tenant_id'],
    );

    this.registerCounter(
      'payments_processed_total',
      'Total payments processed',
      ['gateway', 'status'],
    );

    this.registerCounter(
      'workflow_executions_total',
      'Total workflow executions',
      ['workflow_id', 'status'],
    );

    // Module-specific error rates
    this.registerCounter(
      'module_errors_total',
      'Total errors per module',
      ['module', 'error_type'],
    );
  }

  registerCounter(name: string, help: string, labels: string[] = []) {
    this.metrics.set(name, {
      type: 'counter',
      help,
      labels,
      values: new Map<string, number>(),
    } as CounterMetric);
  }

  registerGauge(name: string, help: string, labels: string[] = []) {
    this.metrics.set(name, {
      type: 'gauge',
      help,
      labels,
      values: new Map<string, number>(),
    } as GaugeMetric);
  }

  registerHistogram(
    name: string,
    help: string,
    labels: string[] = [],
    buckets: number[] = [],
  ) {
    this.metrics.set(name, {
      type: 'histogram',
      help,
      labels,
      buckets,
      values: new Map<string, HistogramObservation>(),
    } as HistogramMetric);
  }

  incrementCounter(name: string, labels: Record<string, string> = {}, value: number = 1) {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'counter') return;

    const key = this.serializeLabels(labels);
    const current = metric.values.get(key) || 0;
    metric.values.set(key, current + value);
  }

  setGauge(name: string, value: number, labels: Record<string, string> = {}) {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'gauge') return;

    const key = this.serializeLabels(labels);
    metric.values.set(key, value);
  }

  observeHistogram(name: string, value: number, labels: Record<string, string> = {}) {
    const metric = this.metrics.get(name);
    if (!metric || metric.type !== 'histogram') return;

    const key = this.serializeLabels(labels);
    let observation = metric.values.get(key);
    
    if (!observation) {
      observation = {
        sum: 0,
        count: 0,
        buckets: new Map<number, number>(),
      };
      metric.buckets.forEach((bucket: number) => {
        if (observation) {
          observation.buckets.set(bucket, 0);
        }
      });
      metric.values.set(key, observation);
    }

    observation.sum += value;
    observation.count += 1;

    // Update buckets
    metric.buckets.forEach((bucket: number) => {
      if (value <= bucket && observation) {
        observation.buckets.set(bucket, observation.buckets.get(bucket)! + 1);
      }
    });
  }

  private serializeLabels(labels: Record<string, string>): string {
    return JSON.stringify(labels);
  }

  private formatLabels(labels: Record<string, string>): string {
    if (Object.keys(labels).length === 0) return '';
    
    const pairs = Object.entries(labels)
      .map(([key, value]) => `${key}="${value}"`)
      .join(',');
    
    return `{${pairs}}`;
  }

  async getMetrics(): Promise<string> {
    const lines: string[] = [];

    for (const [name, metric] of this.metrics.entries()) {
      // Add HELP and TYPE comments
      lines.push(`# HELP ${name} ${metric.help}`);
      lines.push(`# TYPE ${name} ${metric.type}`);

      if (metric.type === 'counter' || metric.type === 'gauge') {
        for (const [labelsKey, value] of metric.values.entries()) {
          const labels = labelsKey !== '{}' ? JSON.parse(labelsKey) : {};
          const labelStr = this.formatLabels(labels);
          lines.push(`${name}${labelStr} ${value}`);
        }
      } else if (metric.type === 'histogram') {
        for (const [labelsKey, observation] of metric.values.entries()) {
          const labels = labelsKey !== '{}' ? JSON.parse(labelsKey) : {};
          
          // Bucket counts
          for (const [bucket, count] of observation.buckets.entries()) {
            const bucketLabels = { ...labels, le: bucket.toString() };
            lines.push(`${name}_bucket${this.formatLabels(bucketLabels)} ${count}`);
          }
          
          // +Inf bucket
          const infLabels = { ...labels, le: '+Inf' };
          lines.push(`${name}_bucket${this.formatLabels(infLabels)} ${observation.count}`);
          
          // Sum and count
          lines.push(`${name}_sum${this.formatLabels(labels)} ${observation.sum}`);
          lines.push(`${name}_count${this.formatLabels(labels)} ${observation.count}`);
        }
      }

      lines.push(''); // Empty line between metrics
    }

    return lines.join('\n');
  }

  // Helper methods for common operations
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    const labels = { method, route, status_code: statusCode.toString() };
    this.incrementCounter('http_requests_total', labels);
    this.observeHistogram('http_request_duration_seconds', duration, labels);

    if (statusCode >= 400) {
      this.incrementCounter('http_request_errors_total', {
        method,
        route,
        error_type: statusCode >= 500 ? 'server' : 'client',
      });
    }
  }

  recordDbQuery(operation: string, table: string, duration: number, error?: boolean) {
    const labels = { operation, table };
    this.incrementCounter('db_queries_total', labels);
    this.observeHistogram('db_query_duration_seconds', duration, labels);

    if (error) {
      this.incrementCounter('db_query_errors_total', labels);
    }
  }

  recordModuleError(module: string, errorType: string) {
    this.incrementCounter('module_errors_total', { module, error_type: errorType });
  }
}
