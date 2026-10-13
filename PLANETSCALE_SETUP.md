# PlanetScale Free Database Setup Guide

## Why PlanetScale?
- ✅ **100% FREE** (Hobby plan - 5GB storage, 1 billion row reads/month)
- ✅ **No credit card required**
- ✅ **Works with your existing MySQL/Sequelize code**
- ✅ **Auto-scaling and backups included**
- ✅ **Production-ready**

---

## Step-by-Step Setup

### 1. Create PlanetScale Account

1. Go to: **https://planetscale.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose sign-up method:
   - **GitHub** (recommended - fastest)
   - **Email** (alternative)
4. Complete registration

---

### 2. Create Your Database

1. After login, click **"New database"** or **"Create a database"**
2. Fill in:
   - **Name**: `balaireserve`
   - **Region**: Select **"AWS ap-southeast-1 (Singapore)"** (closest to Philippines)
   - **Plan**: Select **"Hobby"** (FREE)
3. Click **"Create database"**
4. Wait 30-60 seconds for database creation

---

### 3. Get Connection Credentials

1. In your database dashboard, click **"Connect"**
2. Select framework: **"Sequelize"** from dropdown
3. You'll see connection details like:

```
Host: aws.connect.psdb.cloud
Username: xxxxxxxxxxxxxx
Password: pscale_pw_xxxxxxxxxxxxxxxxx
Database: balaireserve
Port: 3306
```

4. **COPY THESE VALUES!** You'll need them in the next step.

---

### 4. Update Your .env File

Open your `.env` file in the project root and update with PlanetScale credentials:

```env
# PlanetScale Database Configuration
DB_NAME=balaireserve
DB_USER=paste_your_username_here
DB_PASSWORD=paste_your_password_here
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_SSL=true

# Server Configuration
PORT=3001
NODE_ENV=production

# Session Secret
SESSION_SECRET=B4l41R3s3rv3_2025_S3cr3t_K3y_Pr0duct10n_V2
```

**Replace:**
- `paste_your_username_here` → Your PlanetScale username
- `paste_your_password_here` → Your PlanetScale password

---

### 5. Run Database Migration

After updating `.env`, run migrations to create tables:

```bash
npm run migrate
```

This will create all necessary tables in your PlanetScale database.

---

### 6. Deploy to Hostinger

#### Option A: Using File Manager

1. Login to **Hostinger hPanel**
2. Go to **File Manager**
3. Navigate to your app folder: `domains/balai-reserve.online/public_html/app/`
4. Upload/Edit `.env` file with your PlanetScale credentials
5. Restart your Node.js application

#### Option B: Using SSH

```bash
cd ~/domains/balai-reserve.online/public_html/app/
nano .env
# Paste your PlanetScale configuration
# Press Ctrl+X, then Y, then Enter to save

# Run migration
npm run migrate

# Restart app
pm2 restart all
```

---

### 7. Verify Connection

1. Visit your website: **https://balaireserve.online**
2. Try to login/register
3. Check if database operations work

---

## Connection String Format (Alternative)

If you need a single connection string instead:

```
mysql://username:password@aws.connect.psdb.cloud:3306/balaireserve?ssl={"rejectUnauthorized":true}
```

---

## PlanetScale Dashboard Features

### View Data
1. Go to your database in PlanetScale
2. Click **"Console"** tab
3. Run SQL queries to view/edit data:

```sql
-- View all users
SELECT * FROM users;

-- View all bookings
SELECT * FROM bookings;
```

### Backup Database
- PlanetScale automatically creates daily backups (included in free plan)
- Access backups from **"Backups"** tab

### Monitor Usage
- Check your usage in **"Insights"** tab
- Free plan limits:
  - 5 GB storage
  - 1 billion row reads/month
  - 10 million row writes/month

---

## Troubleshooting

### Error: "Connection timeout"
- Check if `DB_SSL=true` is set in `.env`
- Verify your PlanetScale credentials are correct
- Ensure your server can connect to external databases

### Error: "Access denied"
- Double-check username and password
- Make sure you copied the complete password (starts with `pscale_pw_`)

### Error: "Database does not exist"
- Verify `DB_NAME=balaireserve` matches your PlanetScale database name
- Check if database was created successfully

### Tables not created
- Run `npm run migrate` to create tables
- Check migration logs for errors

---

## Migration from Local to PlanetScale

If you have existing data in local MySQL:

### 1. Export Local Data
```bash
mysqldump -u root -p Capstone > local_backup.sql
```

### 2. Import to PlanetScale
```bash
# Connect to PlanetScale CLI (install first: https://github.com/planetscale/cli)
pscale shell balaireserve main < local_backup.sql
```

---

## Free Plan Limits

| Feature | Free (Hobby) Plan |
|---------|-------------------|
| Storage | 5 GB |
| Row reads | 1 billion/month |
| Row writes | 10 million/month |
| Databases | 1 |
| Branches | 1 (main) |
| Automatic backups | Daily |
| Support | Community |

**More than enough for a capstone project!**

---

## Security Best Practices

1. ✅ **Never commit `.env` to Git**
2. ✅ **Keep `.env.example` without real credentials**
3. ✅ **Use strong SESSION_SECRET**
4. ✅ **Rotate database password periodically**
5. ✅ **Enable SSL connection** (already configured)

---

## Need Help?

- PlanetScale Docs: https://planetscale.com/docs
- PlanetScale Community: https://github.com/planetscale/discussion

---

## Quick Checklist

- [ ] Created PlanetScale account
- [ ] Created `balaireserve` database
- [ ] Got connection credentials (username, password, host)
- [ ] Updated `.env` file with PlanetScale details
- [ ] Set `DB_SSL=true` in `.env`
- [ ] Ran `npm run migrate` to create tables
- [ ] Uploaded `.env` to Hostinger
- [ ] Restarted Node.js application
- [ ] Tested website - working!

---

**Your app now uses a FREE, production-ready, scalable database! 🎉**
