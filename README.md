# AutoHub — Premium Automotive Management Platform

## ⚡ Zero-Setup Mode (Activated)

The application is currently configured to run in **Mock Mode**, storing all data in your **browser's localStorage**. No PostgreSQL or database installation is required.

### Setup

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run development server
npm run dev
```

### 🔑 Mock Accounts
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@autohub.com` | `admin123` |
| **Client** | `john@example.com` | `client123` |

### 🛠️ Developer Notes
- **Storage**: Data is managed in `src/lib/storage.ts` via `localStorage`.
- **Database**: Prisma and Postgres dependencies have been disabled to ensure a smooth, zero-config experience.
- **Persistence**: Your changes (added vehicles, appointments, etc.) will persist in your browser cache as long as you don't clear your site data.

## Demo Credentials (after seed)
- **Admin:** admin@autohub.com / admin123
- **Client:** john@example.com / client123

## Routes
| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/client/dashboard` | Client portal |
| `/admin/dashboard` | Admin portal |

## Extracting the Admin Portal as Standalone
The `/src/app/admin/` and `/src/components/admin/` directories are fully self-contained.

To run as a separate project:
1. Copy `/src/app/admin/`, `/src/components/admin/`, `/src/lib/`, `/src/components/ui/`
2. Set the same `DATABASE_URL` and `NEXTAUTH_SECRET`
3. Set `NEXT_PUBLIC_API_URL` to your backend URL

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js v5
- **UI:** Tailwind CSS + shadcn/ui + Liquid Glass design
- **Animation:** Framer Motion / motion
- **3D:** React Three Fiber + Three.js
- **Particles:** tsparticles
"# car-workshop-management-software" 
"# autohub" 
