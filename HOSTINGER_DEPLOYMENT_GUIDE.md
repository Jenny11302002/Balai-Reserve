# Hostinger Deployment Guide - Balai Reserve Booking System

## Prerequisites
1. Hostinger account with VPS or Business hosting plan (Node.js support required)
2. Access to Hostinger control panel
3. MySQL database access

## Step 1: Prepare Your Application

### 1.1 Update package.json
Your application is ready, but ensure these scripts are present:
```json
"scripts": {
  "start": "node index.js",
  "migrate": "node migrate.js"
}
```

### 1.2 Create .env file for production
You'll need to set these environment variables on Hostinger:
```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
PORT=3001
NODE_ENV=production
```

## Step 2: Hostinger Setup

### 2.1 Create MySQL Database
1. Log into Hostinger control panel (hPanel)
2. Go to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Database name: `u123456789_balai_reserve` (example)
5. Username: Create a new user or use existing
6. Password: Set a strong password
7. **Save these credentials!**

### 2.2 Upload Your Application

#### Option A: Using File Manager
1. Go to **Files** → **File Manager**
2. Navigate to `public_html` or your domain folder
3. Create a new folder: `balai-reserve`
4. Upload all your project files EXCEPT:
   - `node_modules` folder
   - `.git` folder
   - `package-lock.json` (optional, but will be regenerated)

#### Option B: Using Git (Recommended)
1. Access SSH (available on Business/VPS plans)
2. Navigate to your domain directory:
   ```bash
   cd ~/public_html/balai-reserve
   ```
3. Clone your repository:
   ```bash
   git clone https://github.com/almanzajanwin52-a11y/Balai-Reserve.git .
   ```

### 2.3 Setup Node.js Application
1. In hPanel, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: Select 18.x or 20.x
   - **Application mode**: Production
   - **Application root**: `/public_html/balai-reserve`
   - **Application URL**: Your domain or subdomain
   - **Application startup file**: `index.js`
4. Click **Create**

## Step 3: Configure Environment Variables

### 3.1 Using Hostinger Node.js Manager
1. In **Node.js** section, select your application
2. Click **Edit** → **Environment Variables**
3. Add each variable:
   ```
   DB_NAME=u123456789_balai_reserve
   DB_USER=u123456789_user
   DB_PASSWORD=your_strong_password
   DB_HOST=localhost
   DB_PORT=3306
   PORT=3001
   NODE_ENV=production
   ```

### 3.2 Or Create .env file via File Manager
1. Go to File Manager
2. Navigate to your app folder
3. Create new file: `.env`
4. Add your environment variables (same as above)

## Step 4: Install Dependencies

### Via SSH (Recommended)
```bash
cd ~/public_html/balai-reserve
npm install --production
```

### Via Hostinger Node.js Manager
1. Go to your Node.js application
2. Click **Run NPM Install**
3. Wait for completion

## Step 5: Run Database Migration

### Via SSH
```bash
cd ~/public_html/balai-reserve
npm run migrate
```

### Via Node.js Manager Terminal
1. Open application terminal
2. Run: `npm run migrate`

## Step 6: Start Your Application

### Method 1: Hostinger Node.js Manager
1. Go to your Node.js application
2. Click **Start Application**
3. Wait for status to show "Running"

### Method 2: Using PM2 (Advanced)
```bash
npm install -g pm2
pm2 start index.js --name "balai-reserve"
pm2 save
pm2 startup
```

## Step 7: Configure Domain

### 7.1 Point Domain to Your App
1. Go to **Domains** in hPanel
2. Select your domain
3. Click **DNS/Nameservers**
4. Add/Update A record to point to your server IP

### 7.2 Setup Reverse Proxy (if needed)
If using Apache, create `.htaccess` in your domain root:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```

## Step 8: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Check if the homepage loads
3. Test login functionality
4. Test booking system
5. Check database connections

## Troubleshooting

### Application Won't Start
1. Check logs: Node.js Manager → View Logs
2. Verify all dependencies installed
3. Check environment variables
4. Ensure database credentials are correct

### Database Connection Error
1. Verify database exists in MySQL Databases
2. Check DB_HOST is set to `localhost`
3. Ensure database user has permissions
4. Test connection using phpMyAdmin

### Port Already in Use
1. Change PORT in .env to 3002, 3003, etc.
2. Restart application

### File Permission Issues
```bash
chmod -R 755 ~/public_html/balai-reserve
chown -R $USER:$USER ~/public_html/balai-reserve
```

### Socket.IO Not Working
1. Ensure your Node.js server is publicly accessible
2. Check firewall settings
3. Verify CORS configuration
4. Use correct WebSocket URL in frontend

## Monitoring & Maintenance

### View Logs
```bash
# Via PM2
pm2 logs balai-reserve

# Via Node.js Manager
Click "View Logs" in application dashboard
```

### Update Application
```bash
cd ~/public_html/balai-reserve
git pull origin main
npm install
pm2 restart balai-reserve
```

### Backup Database
```bash
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

## Security Best Practices

1. **Never commit .env to Git**
2. **Use strong database passwords**
3. **Enable HTTPS** (Hostinger provides free SSL)
4. **Keep Node.js and dependencies updated**
5. **Set proper file permissions**
6. **Use PM2 for process management**
7. **Enable firewall** (if on VPS)

## Support Resources

- Hostinger Knowledge Base: https://support.hostinger.com
- Node.js Documentation: https://nodejs.org/docs
- Contact Hostinger Support if you encounter hosting-specific issues

---

## Quick Deployment Checklist

- [ ] Create MySQL database in Hostinger
- [ ] Upload application files
- [ ] Create Node.js application in hPanel
- [ ] Set environment variables
- [ ] Install dependencies (`npm install`)
- [ ] Run database migration
- [ ] Start the application
- [ ] Test all functionality
- [ ] Configure domain/subdomain
- [ ] Enable SSL certificate

**Your Balai Reserve Booking System should now be live! 🎉**
