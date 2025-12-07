# Database Partitioning Strategy for ERP Platform

## Overview
This document outlines the partitioning strategy for high-volume tables in the ERP system to ensure scalability and maintainability.

## Tables Requiring Partitioning

### 1. journal_entries
**Reason**: High write volume in multi-tenant accounting systems  
**Partitioning Strategy**: Range partitioning by `created_at` (monthly)

#### Implementation
```sql
-- Convert existing table to partitioned table
CREATE TABLE journal_entries_partitioned (LIKE journal_entries INCLUDING ALL)
PARTITION BY RANGE (created_at);

-- Create partitions for current and future months
CREATE TABLE journal_entries_y2024m12 PARTITION OF journal_entries_partitioned
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE journal_entries_y2025m01 PARTITION OF journal_entries_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Create index on tenant_id for each partition
CREATE INDEX idx_journal_entries_y2024m12_tenant 
    ON journal_entries_y2024m12(tenant_id);
```

#### Using pg_partman for Automatic Management
```sql
-- Install pg_partman extension
CREATE EXTENSION pg_partman;

-- Configure automatic partition creation
SELECT partman.create_parent(
    p_parent_table := 'public.journal_entries',
    p_control := 'created_at',
    p_type := 'native',
    p_interval := '1 month',
    p_premake := 3
);

-- Set retention policy (keep 24 months of data)
UPDATE partman.part_config 
SET retention = '24 months',
    retention_keep_table = false
WHERE parent_table = 'public.journal_entries';
```

### 2. audit_logs
**Reason**: Continuous logging of all system activities  
**Partitioning Strategy**: Range partitioning by `created_at` (monthly)

#### Implementation
```sql
-- Convert to partitioned table
CREATE TABLE audit_logs_partitioned (LIKE audit_logs INCLUDING ALL)
PARTITION BY RANGE (created_at);

-- Using pg_partman
SELECT partman.create_parent(
    p_parent_table := 'public.audit_logs',
    p_control := 'created_at',
    p_type := 'native',
    p_interval := '1 month',
    p_premake := 3
);

-- Set retention policy (keep 12 months of data)
UPDATE partman.part_config 
SET retention = '12 months',
    retention_keep_table = false,
    retention_keep_index = false
WHERE parent_table = 'public.audit_logs';
```

### 3. workflow_logs
**Reason**: High volume of workflow execution logs  
**Partitioning Strategy**: Range partitioning by `run_at` (monthly)

#### Implementation
```sql
-- Convert to partitioned table
CREATE TABLE workflow_logs_partitioned (LIKE workflow_logs INCLUDING ALL)
PARTITION BY RANGE (run_at);

-- Using pg_partman
SELECT partman.create_parent(
    p_parent_table := 'public.workflow_logs',
    p_control := 'run_at',
    p_type := 'native',
    p_interval := '1 month',
    p_premake := 3
);

-- Set retention policy (keep 6 months of data)
UPDATE partman.part_config 
SET retention = '6 months',
    retention_keep_table = false
WHERE parent_table = 'public.workflow_logs';
```

## Benefits

### Performance
- **Query Performance**: Partition pruning eliminates unnecessary partition scans
- **Index Size**: Smaller indexes per partition improve lookup speed
- **Parallel Operations**: Multiple partitions can be queried in parallel

### Maintenance
- **Vacuum**: Faster VACUUM operations on smaller partitions
- **Backup**: Selective backup/restore of specific time ranges
- **Data Retention**: Easy deletion of old partitions

### Scalability
- **Growth Management**: New partitions created automatically
- **Storage**: Old partitions can be moved to cheaper storage
- **Archive**: Historical data can be archived to separate tablespaces

## Monitoring

### Check Partition Status
```sql
-- View all partitions
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE tablename LIKE 'journal_entries_%'
   OR tablename LIKE 'audit_logs_%'
   OR tablename LIKE 'workflow_logs_%'
ORDER BY tablename;
```

### Monitor pg_partman
```sql
-- Check partition maintenance status
SELECT * FROM partman.show_partitions('public.journal_entries');
SELECT * FROM partman.show_partitions('public.audit_logs');
SELECT * FROM partman.show_partitions('public.workflow_logs');
```

## Cron Job Setup

### Automatic Maintenance
```bash
# Add to crontab for automatic partition management
# Run every night at 2 AM
0 2 * * * psql -d erp_db -c "CALL partman.run_maintenance_proc();"
```

## Migration Steps

### 1. Pre-Migration
- Analyze current data volume
- Test partitioning on copy of production data
- Plan maintenance window

### 2. Migration Process
```sql
BEGIN;

-- Step 1: Rename existing table
ALTER TABLE journal_entries RENAME TO journal_entries_old;

-- Step 2: Create partitioned table
CREATE TABLE journal_entries (LIKE journal_entries_old INCLUDING ALL)
PARTITION BY RANGE (created_at);

-- Step 3: Create initial partitions
SELECT partman.create_parent(
    p_parent_table := 'public.journal_entries',
    p_control := 'created_at',
    p_type := 'native',
    p_interval := '1 month',
    p_premake := 12
);

-- Step 4: Copy data (in batches)
INSERT INTO journal_entries 
SELECT * FROM journal_entries_old
WHERE created_at >= '2024-01-01';

-- Step 5: Verify data
SELECT count(*) FROM journal_entries;
SELECT count(*) FROM journal_entries_old;

-- Step 6: Drop old table (after verification)
DROP TABLE journal_entries_old;

COMMIT;
```

### 3. Post-Migration
- Monitor query performance
- Verify partition creation
- Set up monitoring alerts

## Best Practices

1. **Partition Key Selection**: Use immutable timestamp columns
2. **Partition Size**: Aim for 10-50 million rows per partition
3. **Premake**: Create 2-3 future partitions in advance
4. **Retention**: Define clear retention policies
5. **Indexes**: Create necessary indexes on each partition
6. **Testing**: Test partitioning strategy on non-production data first

## Additional Considerations

### Multi-Tenancy
- Consider composite partitioning (range + list) for tenant isolation
- Example: Partition by month, sub-partition by tenant_id

### Hot/Cold Data
- Recent partitions on fast SSD storage
- Older partitions on cheaper HDD storage
- Use PostgreSQL tablespaces for storage tiering

### Backup Strategy
- Backup recent partitions more frequently
- Archive old partitions to cold storage
- Use pg_dump with --table option for selective backup

## References
- PostgreSQL Partitioning Documentation: https://www.postgresql.org/docs/current/ddl-partitioning.html
- pg_partman Extension: https://github.com/pgpartman/pg_partman
