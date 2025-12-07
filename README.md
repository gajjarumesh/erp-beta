# NexusERP - Multi-Tenant SaaS ERP Platform

A production-grade, multi-tenant Enterprise Resource Planning (ERP) system built with NestJS and Next.js. This repository implements **Phase 0: Core Platform & Foundation** - the complete foundation for a scalable SaaS ERP platform with proper multi-tenancy, RBAC, and enterprise-grade features.

## 🏗️ Architecture

### Multi-Tenant Architecture
- **Database-level isolation** with PostgreSQL Row-Level Security (RLS)
- **Shared database** with `tenant_id` on all tenant-scoped tables
- **Automatic tenant context** via JWT tokens and middleware
- **RLS policies** enforce data isolation at the database level

### Backend Stack
- **NestJS** - Production-grade Node.js framework
- **TypeORM** - Database ORM with migration support
- **PostgreSQL** - Primary database with RLS enabled
- **Redis** - Caching and session management
- **JWT** - Stateless authentication with refresh tokens
- **Argon2** - Secure password hashing
- **Swagger** - Auto-generated API documentation

### Frontend Stack
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **React Query** - Data fetching and caching
- **Zustand** - State management

## 🌟 Phase 0 Features (Implemented)

### 1. Tenant Management
- ✅ Tenant onboarding with admin user creation
- ✅ Tenant settings and configuration
- ✅ Tenant branding (logo, primary color, locale, timezone)
- ✅ Tenant activation/suspension
- ✅ Multi-level tenant configuration (JSONB)

### 2. Authentication & Security
- ✅ Email/password authentication
- ✅ JWT access tokens + refresh tokens
- ✅ Argon2 password hashing
- ✅ Login attempt logging via audit system
- ✅ Rate limiting on auth endpoints
- ✅ Tenant-aware signup
- ✅ Protected routes with JWT guard

### 3. Users, Roles & Permissions (RBAC)
- ✅ Complete RBAC implementation
- ✅ User management with tenant isolation
- ✅ Role-based access control
- ✅ Fine-grained permissions (format: `module:resource:action`)
- ✅ Permission guards on API endpoints
- ✅ Seeded base roles: owner, admin, user
- ✅ Seeded base permissions for core modules

### 4. Settings Framework
- ✅ Multi-level settings engine
- ✅ Tenant-level settings
- ✅ Module-level settings support
- ✅ User-level settings support
- ✅ JSONB storage for flexible configuration
- ✅ Settings API with scope filtering

### 5. Audit Logging
- ✅ Automatic audit logging for core entities
- ✅ Tracks: create, update, delete, login, logout
- ✅ Before/after state capture
- ✅ Actor tracking (who performed the action)
- ✅ Audit log API with filtering

### 6. File Storage
- ✅ File entity with tenant isolation
- ✅ File metadata storage
- ✅ Support for signed upload URLs (S3-compatible)
- ✅ Support for signed download URLs
- ✅ File size and MIME type tracking

### 7. Notification Engine (Base)
- ✅ Notification entity with tenant isolation
- ✅ Support for: email, SMS, in-app notifications
- ✅ Notification status tracking
- ✅ Channel configuration (JSONB)
- ✅ Basic create/read API

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 10 (TypeScript strict mode)
- **Database**: PostgreSQL 15 with Row-Level Security
- **ORM**: TypeORM with migrations
- **Cache**: Redis 7
- **Auth**: JWT with refresh tokens, Argon2 hashing
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Rate Limiting**: @nestjs/throttler

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Data Fetching**: React Query (@tanstack/react-query)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: Tailwind + Lucide Icons
- **Animations**: Framer Motion

### Infrastructure
- **Containerization**: Docker + docker-compose
- **CI/CD**: GitHub Actions
- **Database Migrations**: TypeORM migrations
- **Seeding**: Custom seed scripts

## 📦 Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** or **yarn**
- **Docker** and **docker-compose** (recommended)
- **PostgreSQL** 15+ (if not using Docker)
- **Redis** 7+ (if not using Docker)

### Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/gajjarumesh/erp-beta.git
cd erp-beta

# Start all services (PostgreSQL, Redis, Backend API, Frontend)
docker-compose up -d

# Wait for services to be healthy, then run migrations
docker-compose exec api npm run migration:run

# Seed the database with demo data
docker-compose exec api npm run seed

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000/api/v1
# API Docs: http://localhost:4000/api/docs
```

### Local Development Setup

#### 1. Start PostgreSQL and Redis

```bash
# Using Docker for databases only
docker-compose up -d db redis
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migration:run

# Seed demo data
npm run seed

# Start development server
npm run start:dev

# Backend will run on http://localhost:4000
# API docs at http://localhost:4000/api/docs
```

#### 3. Setup Frontend

```bash
# From project root
npm install

# Generate Prisma client
npm run db:generate

# Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

### Environment Variables

#### Backend (.env in backend/ directory)

```env
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_db?schema=public

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRATION=30d

FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env in project root)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_db?schema=public
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Demo Credentials

After seeding the database, you can login with:

**Owner Account:**
- Email: `demo@nexuserp.com`
- Password: `Demo123!`
- Access: Full system access

**Admin Account:**
- Email: `admin@nexuserp.com`
- Password: `Admin123!`
- Access: Most permissions (excludes delete operations)

## 📁 Project Structure

```
/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── common/            # Shared utilities
│   │   │   ├── decorators/    # Custom decorators
│   │   │   ├── guards/        # Auth & permission guards
│   │   │   ├── interceptors/  # Tenant context, audit logging
│   │   │   ├── filters/       # Exception filters
│   │   │   └── dto/          # Common DTOs
│   │   ├── config/           # Configuration files
│   │   ├── database/
│   │   │   ├── entities/     # TypeORM entities
│   │   │   ├── migrations/   # Database migrations
│   │   │   └── seeds/        # Seed scripts
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── tenants/      # Tenant management
│   │   │   ├── users/        # User management
│   │   │   ├── roles/        # RBAC module
│   │   │   ├── settings/     # Settings framework
│   │   │   ├── audit/        # Audit logging
│   │   │   ├── files/        # File storage
│   │   │   └── notifications/ # Notifications
│   │   ├── app.module.ts     # Root module
│   │   └── main.ts          # Application entry point
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── app/                       # Next.js App Router
│   ├── (dashboard)/          # Protected dashboard routes
│   ├── api/                  # API routes (legacy)
│   ├── auth/                 # Auth pages
│   └── page.tsx             # Landing page
├── components/               # React components
├── lib/                     # Utility functions
├── prisma/                  # Prisma schema (legacy)
├── docker-compose.yml       # Docker services
├── Dockerfile.web           # Frontend Dockerfile
└── README.md
```

## 🗄️ Database Schema

### Core Tables

#### tenants
- id, name, slug, plan, config (JSONB)
- isActive, logoUrl, primaryColor
- locale, timezone
- Row-Level Security enabled

#### users
- id, tenantId, email, displayName, passwordHash
- isActive, lastLogin
- Row-Level Security enabled

#### roles
- id, tenantId, name, description
- Many-to-many with users and permissions
- Row-Level Security enabled

#### permissions
- id, code (format: `module:resource:action`), description
- Global permissions across system

#### settings
- id, tenantId, scope (tenant/module/user)
- key, value (JSONB)
- Row-Level Security enabled

#### audit_logs
- id, tenantId, actorUserId
- action, objectType, objectId
- before, after (JSONB)
- Row-Level Security enabled

#### files
- id, tenantId, path, filename
- size, mimeType, createdByUserId
- Row-Level Security enabled

#### notifications
- id, tenantId, userId
- type (email/sms/inapp), status
- channelDetails, payload (JSONB)
- Row-Level Security enabled

### Row-Level Security (RLS)

All tenant-scoped tables have RLS policies:
```sql
CREATE POLICY tenant_isolation_policy ON table_name
USING ("tenantId" = current_setting('app.current_tenant', true)::uuid);
```

The backend automatically sets the `app.current_tenant` session variable from JWT tokens.

## 🔧 Available Scripts

### Backend (from backend/ directory)

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start backend in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run migration:generate` | Generate new migration |
| `npm run migration:run` | Run pending migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run seed` | Seed database with demo data |

### Frontend (from project root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push Prisma schema |
| `npm run db:seed` | Seed with Prisma |
| `npm run db:studio` | Open Prisma Studio |

## 🔐 API Endpoints

All API endpoints are prefixed with `/api/v1` and documented with Swagger at `/api/docs`.

### Authentication

- `POST /auth/signup` - Register new user (tenant-aware)
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Tenants

- `POST /tenants/onboard` - Onboard new tenant (public)
- `GET /tenants/:id` - Get tenant details
- `PUT /tenants/:id` - Update tenant
- `PUT /tenants/:id/activate` - Activate tenant
- `PUT /tenants/:id/suspend` - Suspend tenant

### Users (Coming soon)

- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Roles (Coming soon)

- `GET /roles` - List roles
- `POST /roles` - Create role
- `PUT /roles/:id` - Update role
- `PUT /roles/:id/permissions` - Assign permissions

### Settings (Coming soon)

- `GET /settings` - Get settings by scope
- `PUT /settings` - Update settings (bulk)

### Audit Logs (Coming soon)

- `GET /audit-logs` - List audit logs with filters

### Files (Coming soon)

- `POST /files/signed-upload` - Get signed upload URL
- `GET /files/:id` - Get file details
- `GET /files/:id/download` - Get signed download URL

### Notifications (Coming soon)

- `GET /notifications` - List notifications
- `POST /notifications` - Create notification
- `PUT /notifications/:id/read` - Mark as read

## 🚀 Deployment

### Production Deployment

#### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# Run migrations
docker-compose exec api npm run migration:run

# Seed data (optional)
docker-compose exec api npm run seed
```

#### Manual Deployment

**Backend:**
```bash
cd backend
npm ci --only=production
npm run build
npm run migration:run
NODE_ENV=production npm run start:prod
```

**Frontend:**
```bash
npm ci --only=production
npx prisma generate
npm run build
NODE_ENV=production npm start
```

### Environment Configuration

**Production checklist:**
- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Configure production DATABASE_URL
- [ ] Set up Redis for production
- [ ] Configure SMTP for email notifications
- [ ] Set up S3 or compatible storage for files
- [ ] Enable SSL/TLS for database connections
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for PostgreSQL

## 🔒 Security Features

- ✅ **Argon2 Password Hashing** - Industry-standard secure hashing
- ✅ **JWT Authentication** - Stateless, secure token-based auth
- ✅ **Refresh Tokens** - Long-lived tokens for seamless re-authentication
- ✅ **Rate Limiting** - Protect against brute force attacks
- ✅ **Row-Level Security** - Database-level tenant isolation
- ✅ **Permission Guards** - Fine-grained access control
- ✅ **Audit Logging** - Track all critical operations
- ✅ **Input Validation** - DTO validation with class-validator
- ✅ **SQL Injection Protection** - TypeORM parameterized queries
- ✅ **XSS Protection** - Sanitized inputs and outputs

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test           # Run unit tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
```

### Frontend Tests

```bash
npm run test          # Run tests (when configured)
```

## 📚 API Documentation

The backend provides auto-generated Swagger documentation:

**Local:** http://localhost:4000/api/docs

Key features:
- Interactive API explorer
- Request/response schemas
- Authentication flows
- Try-it-out functionality

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🎯 Roadmap

### Phase 0 (Current) - Core Platform ✅
- [x] Multi-tenant architecture
- [x] Authentication & authorization
- [x] RBAC system
- [x] Settings framework
- [x] Audit logging
- [x] File storage foundation
- [x] Notification engine foundation

### Phase 1 (Next) - Business Modules
- [ ] CRM module (Leads, Opportunities, Pipeline)
- [ ] Sales module (Orders, Quotes, Customers)
- [ ] Inventory module (Products, Stock, Warehouses)
- [ ] Frontend admin pages for Phase 0 features
- [ ] Tenant onboarding UI flow

### Phase 2 - Advanced Features
- [ ] Accounting module
- [ ] HR module
- [ ] Project management
- [ ] Advanced reporting
- [ ] Email integration
- [ ] Webhooks and integrations

## 📧 Support

For questions or issues, please:
- Open a GitHub issue
- Check the documentation
- Review existing issues

---

**Built with ❤️ by the NexusERP team**
