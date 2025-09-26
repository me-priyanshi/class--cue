# PostgreSQL Setup for Windows - ClassCue

## Step 1: Install PostgreSQL

### Download and Install PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download PostgreSQL 15 or 16 (recommended)
4. Run the installer as Administrator
5. **Important**: During installation:
   - Choose a password for the 'postgres' user (remember this!)
   - Make sure "Add PostgreSQL to PATH" is checked
   - Port should be 5432 (default)
   - Locale should be "Default locale"

### Verify Installation
Open Command Prompt and run:
```cmd
psql --version
```
You should see something like: `psql (PostgreSQL) 15.x`

## Step 2: Create Database

### Method 1: Using Command Line
1. Open Command Prompt as Administrator
2. Run: `psql -U postgres`
3. Enter your postgres password when prompted
4. Create the database:
```sql
CREATE DATABASE classcue_db;
\q
```

### Method 2: Using pgAdmin (GUI)
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `classcue_db`
5. Click "Save"

## Step 3: Test Django Connection

Now let's test if Django can connect to PostgreSQL:

```bash
cd backend
python manage.py check --database default
```

If this works, you'll see: "System check identified no issues (0 silenced)."

## Step 4: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 5: Create Sample Data

```bash
python setup_database.py
```

## Step 6: Start the Application

```bash
python manage.py runserver
```

## Troubleshooting

### If you get "psql: command not found":
1. Add PostgreSQL to your PATH:
   - Go to System Properties → Environment Variables
   - Add `C:\Program Files\PostgreSQL\15\bin` to PATH
   - Restart Command Prompt

### If you get "password authentication failed":
1. Check your postgres password
2. Make sure PostgreSQL service is running:
   - Open Services (services.msc)
   - Find "postgresql-x64-15" service
   - Make sure it's running

### If you get "database does not exist":
1. Create the database using the steps above
2. Check the database name in settings.py

### If you get "connection refused":
1. Make sure PostgreSQL is running
2. Check if port 5432 is available
3. Check Windows Firewall settings

## Quick Test Commands

```bash
# Test PostgreSQL connection
psql -U postgres -d classcue_db -c "SELECT version();"

# Test Django database connection
python manage.py dbshell

# Check Django settings
python manage.py check --database default
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
DB_NAME=classcue_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_HOST=localhost
DB_PORT=5432
```

Replace `your_postgres_password_here` with the password you set during PostgreSQL installation.
