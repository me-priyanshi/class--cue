# PostgreSQL Installation Guide for Windows

The error you're encountering is because `psycopg2-binary` requires PostgreSQL development headers to be installed on your system. Here are several solutions:

## Solution 1: Install PostgreSQL (Recommended)

### Step 1: Download and Install PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Download the PostgreSQL installer for Windows
3. Run the installer and follow the setup wizard
4. **Important**: During installation, make sure to check "Add PostgreSQL to PATH"
5. Set a password for the postgres user (remember this password!)

### Step 2: Install Python Dependencies
```bash
cd backend
pip install -r requirements-windows.txt
```

### Step 3: Create Database
1. Open Command Prompt or PowerShell
2. Run: `psql -U postgres`
3. Enter your postgres password when prompted
4. Create the database:
```sql
CREATE DATABASE classcue_db;
\q
```

## Solution 2: Use SQLite (Quick Start)

If you want to get started quickly without PostgreSQL:

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements-sqlite.txt
```

### Step 2: Run the Application
```bash
python manage.py migrate
python manage.py runserver
```

The application will automatically use SQLite instead of PostgreSQL.

## Solution 3: Use Pre-compiled Wheels

### Step 1: Install Microsoft Visual C++ Build Tools
1. Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. Install "C++ build tools" workload

### Step 2: Install Dependencies
```bash
cd backend
pip install -r requirements-windows.txt
```

## Solution 4: Use Conda (Alternative)

If you have Anaconda or Miniconda installed:

```bash
conda install psycopg2
pip install -r requirements.txt
```

## Troubleshooting

### If you still get errors:

1. **Try installing psycopg2-binary directly:**
```bash
pip install psycopg2-binary --no-cache-dir
```

2. **Use a different version:**
```bash
pip install psycopg2-binary==2.8.6
```

3. **Install from wheel:**
```bash
pip install --only-binary=all psycopg2-binary
```

## Quick Start (Recommended)

For the fastest setup, use Solution 2 (SQLite):

```bash
# 1. Install dependencies
cd backend
pip install -r requirements-sqlite.txt

# 2. Run migrations
python manage.py migrate

# 3. Create sample data
python setup_database.py

# 4. Start the server
python manage.py runserver
```

The application will work perfectly with SQLite and you can always migrate to PostgreSQL later.

## Database Migration (SQLite to PostgreSQL)

If you start with SQLite and want to migrate to PostgreSQL later:

1. Install PostgreSQL
2. Create the database
3. Update settings.py to use PostgreSQL
4. Run migrations: `python manage.py migrate`

## Verification

To verify everything is working:

1. Start the Django server: `python manage.py runserver`
2. You should see: "Using SQLite database" or "Using PostgreSQL database"
3. Open http://localhost:8000/admin/ to check the admin interface
4. Start the frontend: `cd ../frontend && npm run dev`
5. Open http://localhost:5173 to test the application
