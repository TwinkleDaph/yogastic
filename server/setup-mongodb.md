# MongoDB Local Setup Guide

## For Windows:

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, Version 7.0+, MSI package
   - Download and run the installer

2. **During Installation:**
   - Choose "Complete" setup
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB:**
   ```bash
   # MongoDB should start automatically as a service
   # If not, run in Command Prompt as Administrator:
   net start MongoDB
   ```

4. **Verify MongoDB is running:**
   ```bash
   # Check if MongoDB is listening on port 27017
   netstat -an | findstr 27017
   ```

5. **Update your .env to use local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/yogastic
   ```

## Alternative: Use MongoDB with Docker

```bash
# Install Docker Desktop first, then:
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

## Test Connection:
```bash
node test-auth.js
```