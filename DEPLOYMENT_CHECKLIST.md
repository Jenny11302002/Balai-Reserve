# Hostinger Deployment Checklist ✅

## Before Deployment
- [ ] Test application locally
- [ ] Ensure all dependencies are in package.json
- [ ] Create .env.example file (never commit actual .env)
- [ ] Update .gitignore to exclude sensitive files
- [ ] Commit and push all changes to GitHub

## Hostinger Account Setup
- [ ] Login to Hostinger hPanel
- [ ] Verify you have Node.js hosting capability
- [ ] Note your hosting plan details

## Database Setup (5 minutes)
- [ ] Go to Databases → MySQL Databases
- [ ] Create new database
- [ ] Create database user
- [ ] Assign user to database with ALL PRIVILEGES
- [ ] Save credentials:
  - Database name: ________________
  - Username: ________________
  - Password: ________________
  - Host: localhost

## File Upload (10-15 minutes)

### Option A: File Manager Upload
- [ ] Go to Files → File Manager
- [ ] Create folder: `balai-reserve`
- [ ] Upload all files EXCEPT:
  - [ ] node_modules/
  - [ ] .git/
  - [ ] .env (create new one on server)
- [ ] Create new .env file with production credentials

### Option B: Git Clone (Recommended if you have SSH)
- [ ] Access SSH terminal
- [ ] Navigate to web directory: `cd ~/public_html`
- [ ] Clone repository: `git clone YOUR_REPO_URL balai-reserve`
- [ ] Enter folder: `cd balai-reserve`
- [ ] Create .env file: `nano .env` (paste production credentials)

## Node.js Application Setup (5 minutes)
- [ ] Go to Advanced → Node.js
- [ ] Click "Create Application"
- [ ] Configure:
  - [ ] Node version: 18.x or 20.x
  - [ ] Mode: Production
  - [ ] App root: /public_html/balai-reserve
  - [ ] Startup file: index.js
  - [ ] App URL: your domain
- [ ] Click Create

## Environment Variables Setup (3 minutes)
- [ ] In Node.js app settings, go to Environment Variables
- [ ] Add each variable:
  - [ ] DB_NAME=your_db_name
  - [ ] DB_USER=your_db_user
  - [ ] DB_PASSWORD=your_db_password
  - [ ] DB_HOST=localhost
  - [ ] DB_PORT=3306
  - [ ] PORT=3001
  - [ ] NODE_ENV=production

## Install Dependencies (5 minutes)
- [ ] In Node.js app, click "Run NPM Install"
- [ ] Wait for completion (check logs)
- [ ] OR via SSH: `npm install --production`

## Database Migration (2 minutes)
- [ ] Via SSH or Node.js terminal: `npm run migrate`
- [ ] Verify tables created (use phpMyAdmin)

## Start Application (1 minute)
- [ ] Click "Start Application" in Node.js manager
- [ ] Wait for status: Running ✅
- [ ] Check logs for any errors

## Domain Configuration (5 minutes)
- [ ] Go to Domains
- [ ] Add/select your domain
- [ ] Point to application directory
- [ ] Enable SSL certificate (free)
- [ ] Wait for DNS propagation (can take up to 24 hours)

## Testing (10 minutes)
- [ ] Visit your domain
- [ ] Test homepage loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Test booking system
- [ ] Test admin dashboard
- [ ] Test real-time chat
- [ ] Check browser console for errors
- [ ] Test on mobile device

## Security Checklist
- [ ] .env file is NOT in Git repository
- [ ] Database password is strong
- [ ] SSL/HTTPS is enabled
- [ ] File permissions are correct (755 for directories, 644 for files)
- [ ] Session secret is changed from default
- [ ] All API endpoints are secured

## Post-Deployment
- [ ] Monitor application logs
- [ ] Set up automated backups
- [ ] Document any custom configurations
- [ ] Share deployment info with team
- [ ] Test all critical features again

## Troubleshooting Resources
If something goes wrong, check:
1. Application logs in Node.js manager
2. Error logs in File Manager → logs/
3. Database connection in phpMyAdmin
4. HOSTINGER_DEPLOYMENT_GUIDE.md for detailed solutions

---

## Emergency Contacts
- Hostinger Support: support.hostinger.com
- Your hosting plan includes 24/7 support

## Estimated Total Time: 45-60 minutes

**Good luck with your deployment! 🚀**
