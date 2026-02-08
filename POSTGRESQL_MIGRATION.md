# PostgreSQL Migration Guide & Vercel Deployment

This project has been migrated from SQLite to PostgreSQL to enable Vercel hosting.

## What Changed

### Dependencies Updated
- **Removed:** `@libsql/client`, `sqlite3`
- **Added:** `postgres` (postgres-js driver for PostgreSQL)
- **Already Present:** `pg` (you can use this as an alternative)

### Code Changes

1. **drizzle.config.ts** - Changed dialect from `sqlite` to `postgresql`
2. **server/db.ts** - Updated to use postgres-js client instead of libsql
3. **shared/schema.ts** - Changed table definitions from `sqliteTable` to `pgTable`

## Local Development Setup

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer and follow the setup wizard
- Remember the password for the `postgres` user

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create a Local Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
-- Create database
CREATE DATABASE aaharsevax;

-- Create a dedicated user (optional but recommended)
CREATE USER aaharsevax_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aaharsevax TO aaharsevax_user;

-- Exit psql
\q
```

### 3. Configure Local Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` with your local database URL:

```
DATABASE_URL=postgresql://aaharsevax_user:your_password@localhost:5432/aaharsevax
```

Or if using the default postgres user:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/aaharsevax
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Push Schema to Database

```bash
npm run db:push
```

### 6. Run Development Server

```bash
npm run dev
```

## Vercel Deployment

### 1. Create PostgreSQL Database on Vercel

- Go to https://vercel.com/dashboard
- Create a new PostgreSQL database via Vercel Postgres
- Copy the connection string

### 2. Set Environment Variables

In your Vercel project settings:

```
DATABASE_URL=postgresql://[your-vercel-connection-string]
NODE_ENV=production
```

### 3. Push Schema to Vercel Database

Before deploying, push your schema:

```bash
# Make sure DATABASE_URL points to your Vercel database
DATABASE_URL=your_vercel_connection_string npm run db:push
```

### 4. Deploy

```bash
git push
```

Vercel will automatically deploy when you push to your main branch.

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Verify credentials and database name

### Migration Issues

If migrations fail, you can:

1. Drop and recreate the database:
```sql
DROP DATABASE aaharsevax;
CREATE DATABASE aaharsevax;
```

2. Run `npm run db:push` again

### Port Already in Use (Local)

If port 5432 is busy, you can start PostgreSQL on a different port or check what's using it:

```bash
# Windows
netstat -ano | findstr :5432

# Mac/Linux
lsof -i :5432
```

## Database Connection Notes

- **postgres-js** (used in this project) is optimized for newer Node.js versions and serverless environments
- **pg** package is also installed if you prefer to use it instead
- For Vercel, serverless databases like Vercel Postgres work best

## Additional Resources

- [Drizzle ORM PostgreSQL Docs](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/postgres)
