# NexusERP - SaaS Business Suite

A modern, SaaS-based Enterprise Resource Planning (ERP) system inspired by Odoo's modular architecture. Built with cutting-edge technologies, featuring a beautiful landing page, app marketplace, flexible pricing plans, and comprehensive business modules.

## 🌟 SaaS Features

### Multi-tenant Architecture
- **Company/Tenant Isolation** - Each organization has isolated data
- **Subscription Plans** - Free, Starter, Professional, Enterprise tiers
- **App Marketplace** - Install only the apps you need
- **Per-app Pricing** - Pay for what you use

### Landing Page
- Modern, animated hero section with app selector
- Interactive pricing comparison
- Customer testimonials
- Feature highlights
- Call-to-action sections

### App Store
- Browse 20+ business applications
- Filter by category (Sales, Operations, Finance, HR, Marketing, Productivity)
- One-click installation
- App ratings and reviews
- Integration information

### Authentication
- User registration with plan selection
- Secure login with social OAuth options
- Company setup wizard
- Demo credentials for testing

## 🚀 Business Modules

### Installed by Default
- **Dashboard** - KPI cards, sales/revenue charts, recent activity

### Sales & CRM
- **Sales** - Orders, customers, quotations with full CRUD
- **CRM** - Lead pipeline, opportunity tracking, conversion analytics
- **Point of Sale** - Retail/restaurant checkout (coming soon)

### Operations
- **Inventory** - Products, stock tracking, warehouse management
- **Purchase** - Vendor management, purchase orders (coming soon)
- **Manufacturing** - BOM, work orders, production planning (coming soon)

### Finance
- **Accounting** - Invoices, payments, financial reports
- **Expenses** - Employee expense tracking (coming soon)

### Human Resources
- **Employees** - Directory, departments, org charts
- **Time Off** - Leave requests, approvals
- **Payroll** - Salary processing (coming soon)
- **Recruitment** - Job postings, applicant tracking (coming soon)

### Marketing & Productivity
- **Email Marketing** - Campaigns, templates (coming soon)
- **Project** - Tasks, milestones, time tracking (coming soon)
- **Helpdesk** - Support tickets, SLA management (coming soon)
- **Website Builder** - Drag & drop pages (coming soon)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Chart.js via react-chartjs-2
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Theming**: next-themes (Dark/Light mode)
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (or Docker)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/erp-beta.git
cd erp-beta

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Start PostgreSQL with Docker
docker-compose up -d

# Generate Prisma client & push schema
npm run db:generate
npm run db:push

# Seed demo data (optional)
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Demo Credentials

- **Email**: demo@nexuserp.com
- **Password**: demo123

## 📁 Project Structure

```
/app
  page.tsx                    # Landing page
  /app-store                  # App marketplace
  /auth
    /login                    # Sign in page
    /register                 # Registration with plan selection
  /pricing                    # Pricing page
  /(dashboard)                # Protected dashboard area
    /dashboard
    /sales
    /inventory
    /accounting
    /hr
    /crm
    /settings
/components
  /ui                         # Reusable UI components
  /charts                     # Chart.js wrappers
  /layouts                    # Sidebar, Header, Dashboard layout
/lib
  /prisma.ts                  # Database client
  /utils.ts                   # Utility functions
/prisma
  /schema.prisma              # Multi-tenant database schema
  /seed.ts                    # Demo data seeder
```

## 🗄️ Database Schema

### Multi-tenancy & Subscriptions
- **Plan** - Subscription tiers with features/limits
- **Subscription** - Company subscription status
- **App** - Available applications
- **CompanyApp** - Installed apps per company

### Core Entities
- **User** - Authentication with roles (Super Admin, Admin, Manager, User)
- **Company** - Tenant/organization with settings
- **Session** - User sessions
- **AuditLog** - Activity tracking

### Business Entities
- Products, Categories, Customers, Vendors
- Sales Orders, Order Lines, Quotations
- Invoices, Payments
- Employees, Departments, Attendance, Leave
- Warehouses, Stock Moves
- Leads, Opportunities
- Projects, Tasks, Tickets, Campaigns

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

## 🎨 UI/UX Features

- **Modern SaaS Design** - Clean, professional aesthetics
- **Responsive Layout** - Mobile-first approach
- **Dark/Light Mode** - System preference or manual toggle
- **Glassmorphism** - Subtle blur effects
- **Gradient Accents** - Brand colors
- **Framer Motion** - Smooth page transitions, hover effects
- **Loading States** - Skeleton screens, spinners
- **Toast Notifications** - Success/error feedback

## 💰 Pricing Model

| Plan | Price | Apps | Users | Records |
|------|-------|------|-------|---------|
| Free | $0 | 1 | 2 | 1,000 |
| Starter | $29/user/mo | 3 | 10 | 10,000 |
| Professional | $59/user/mo | All | 50 | Unlimited |
| Enterprise | Custom | All | Unlimited | Unlimited |

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```bash
docker-compose up -d
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions welcome! Please submit a Pull Request.
