# ERP System

A modern Enterprise Resource Planning (ERP) system inspired by Odoo's framework architecture, built with cutting-edge technologies and a beautiful, animated UI.

## 🚀 Features

### Core Modules
- **Dashboard** - Main dashboard with animated cards, interactive charts, and real-time statistics
- **Sales** - Sales orders management, customer management, quotations, and sales analytics
- **Inventory** - Product management, stock tracking, warehouse management, and inventory valuation
- **Accounting** - Invoice management, payment tracking, and financial reports
- **HR** - Employee management, attendance tracking, and leave management
- **CRM** - Lead management, pipeline visualization, and conversion analytics

### Technical Features
- 🎨 Modern, responsive UI with dark/light mode support
- ✨ Smooth animations using Framer Motion
- 📊 Interactive charts with Chart.js
- 🗄️ PostgreSQL database with Prisma ORM
- 🔒 TypeScript for type safety
- 📱 Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (or Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/erp-beta.git
   cd erp-beta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` in `.env` with your PostgreSQL connection string.

4. **Start PostgreSQL** (using Docker)
   ```bash
   docker-compose up -d
   ```

5. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

6. **Run database migrations**
   ```bash
   npm run db:push
   ```

7. **Seed the database** (optional)
   ```bash
   npm run db:seed
   ```

8. **Start the development server**
   ```bash
   npm run dev
   ```

9. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  /api                    # API routes
  /(auth)                 # Authentication pages
  /(dashboard)            # Dashboard and module pages
    /dashboard
    /sales
    /inventory
    /accounting
    /hr
    /crm
    /settings
/components
  /ui                     # Reusable UI components
  /charts                 # Chart.js wrapper components
  /layouts                # Layout components
  /modules                # Module-specific components
/lib
  /prisma.ts              # Prisma client
  /utils.ts               # Utility functions
/prisma
  /schema.prisma          # Database schema
  /seed.ts                # Seed data
/styles
  /globals.css            # Global styles
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## 🎨 UI Features

- **Glassmorphism** effects for modern aesthetics
- **Gradient accents** for visual appeal
- **Smooth animations** for all interactions
- **Professional color palette** suitable for business applications
- **Responsive design** that works on all devices
- **Dark/Light mode** toggle

## 📊 Database Schema

The database includes tables for:
- Users & Authentication
- Companies/Organizations
- Products & Categories
- Customers & Vendors
- Sales Orders & Order Lines
- Invoices & Payments
- Employees & Departments
- Inventory & Stock Moves
- Leads & Opportunities (CRM)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

### Docker

```bash
docker-compose up -d
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
