# Deployment Guide - Phase 0 Multi-Tenant ERP Platform

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)
- Git

## Option 1: Docker Deployment (Recommended)

### Step 1: Clone and Configure

```bash
# Clone repository
git clone https://github.com/gajjarumesh/erp-beta.git
cd erp-beta

# Copy environment files
cp backend/.env.example backend/.env
cp .env.example .env

# Edit backend/.env with production values
nano backend/.env
```

**Important Environment Variables for Production:**

```env
NODE_ENV=production
PORT=4000

# Strong random strings!
JWT_SECRET=<generate-strong-random-string-64-chars>
JWT_REFRESH_SECRET=<generate-strong-random-string-64-chars>

# Production database
DATABASE_URL=postgresql://username:password@db:5432/erp_db?schema=public

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Frontend URL (update to your domain)
FRONTEND_URL=https://your-domain.com
```

### Step 2: Build and Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check if all services are running
docker-compose ps

# Expected output:
# NAME                IMAGE               STATUS
# erp-api             ...                 Up
# erp-web             ...                 Up
# erp-postgres        ...                 Up (healthy)
# erp-redis           ...                 Up (healthy)
```

### Step 3: Initialize Database

```bash
# Run database migrations
docker-compose exec api npm run migration:run

# Seed demo data (optional, remove for production)
docker-compose exec api npm run seed
```

### Step 4: Verify Deployment

```bash
# Check API health
curl http://localhost:4000/api/v1

# Check Swagger docs
curl http://localhost:4000/api/docs

# Check frontend
curl http://localhost:3000
```

### Step 5: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **API Documentation**: http://localhost:4000/api/docs

**Demo Credentials** (if seeded):
- Email: demo@nexuserp.com
- Password: Demo123!

## Option 2: Local Development Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL

# Run migrations
npm run migration:run

# Seed data (optional)
npm run seed

# Start development server
npm run start:dev

# Backend will run on http://localhost:4000
```

### Frontend Setup

```bash
# From project root
npm install

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

## Option 3: Production Deployment

### Cloud Providers

#### AWS ECS/Fargate

1. **Build Docker images:**
```bash
docker build -t erp-api:latest ./backend
docker build -t erp-web:latest -f Dockerfile.web .
```

2. **Push to ECR:**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag erp-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/erp-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/erp-api:latest

docker tag erp-web:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/erp-web:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/erp-web:latest
```

3. **Setup RDS PostgreSQL and ElastiCache Redis**

4. **Create ECS Task Definitions** with environment variables

5. **Deploy to ECS Service**

#### Google Cloud Run

```bash
# Build and push backend
gcloud builds submit --tag gcr.io/PROJECT_ID/erp-api ./backend

# Build and push frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/erp-web -f Dockerfile.web .

# Deploy services
gcloud run deploy erp-api \
  --image gcr.io/PROJECT_ID/erp-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=...,JWT_SECRET=...

gcloud run deploy erp-web \
  --image gcr.io/PROJECT_ID/erp-web \
  --platform managed \
  --region us-central1 \
  --set-env-vars NEXT_PUBLIC_API_URL=...
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Backend: `backend/Dockerfile`
   - Frontend: `Dockerfile.web`
3. Add environment variables in dashboard
4. Deploy

### Database Setup

#### Managed PostgreSQL (Recommended)

**AWS RDS:**
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier erp-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password <secure-password> \
  --allocated-storage 20
```

**Google Cloud SQL:**
```bash
gcloud sql instances create erp-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1
```

**DigitalOcean Managed Database:**
- Create through dashboard
- PostgreSQL 15
- Choose appropriate size

#### Redis Setup

**AWS ElastiCache:**
```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id erp-cache \
  --engine redis \
  --cache-node-type cache.t3.micro \
  --num-cache-nodes 1
```

**Google Cloud Memorystore:**
```bash
gcloud redis instances create erp-cache \
  --size=1 \
  --region=us-central1
```

## Monitoring and Logging

### Application Logs

```bash
# Docker logs
docker-compose logs -f api
docker-compose logs -f web

# Individual container logs
docker logs -f erp-api
```

### Health Checks

```bash
# Backend health check
curl http://localhost:4000/api/v1

# Database connection check
docker-compose exec api npm run migration:show
```

### Monitoring Tools

**Recommended:**
- **Application Performance**: New Relic, DataDog
- **Logging**: ELK Stack, CloudWatch, Stackdriver
- **Uptime**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry

## Backup Strategy

### Database Backups

```bash
# Manual backup
docker-compose exec db pg_dump -U postgres erp_db > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20231207.sql | docker-compose exec -T db psql -U postgres erp_db
```

### Automated Backups

**AWS RDS** - Enable automated backups in console
**Google Cloud SQL** - Configure backup schedule
**DigitalOcean** - Enable daily backups

## SSL/TLS Configuration

### Let's Encrypt with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Add Nginx or AWS ALB
2. **Multiple API Instances**: Scale backend containers
3. **Database Read Replicas**: For read-heavy workloads
4. **Redis Cluster**: For high availability

### Performance Optimization

1. **Database Connection Pooling**: Configure in TypeORM
2. **Redis Caching**: Cache frequently accessed data
3. **CDN**: Use CloudFlare or AWS CloudFront for frontend
4. **Image Optimization**: Use Next.js Image component

## Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check database status
docker-compose ps db

# View database logs
docker-compose logs db

# Test connection
docker-compose exec db psql -U postgres -c "SELECT 1"
```

**API Not Starting:**
```bash
# Check API logs
docker-compose logs api

# Check environment variables
docker-compose exec api env | grep DATABASE_URL
```

**Migration Errors:**
```bash
# Revert last migration
docker-compose exec api npm run migration:revert

# Run migrations again
docker-compose exec api npm run migration:run
```

## Security Checklist

- [ ] Change default JWT secrets
- [ ] Use strong database passwords
- [ ] Enable SSL/TLS for all connections
- [ ] Configure firewall rules
- [ ] Enable database encryption at rest
- [ ] Set up VPC/private networking
- [ ] Configure CORS for production domains
- [ ] Enable rate limiting
- [ ] Set up Web Application Firewall (WAF)
- [ ] Regular security updates
- [ ] Enable audit logging
- [ ] Configure backup retention
- [ ] Set up intrusion detection

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review API docs: http://localhost:4000/api/docs
- Check GitHub issues
- Review PHASE_0_SUMMARY.md
