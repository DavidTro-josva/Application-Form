# 🎒 Happy Kids School - Installation & Configuration Guide

Follow these instructions to install, configure, and run the Happy Kids School Admission System locally.

---

## 📋 Prerequisites
- **Node.js**: Version 18.x or higher (`node -v`)
- **NPM**: Version 9.x or higher (`npm -v`)
- **MySQL**: Version 8.0 or higher running on `localhost:3306` (`mysql -V`)

---

## Step 1: Database Schema & Seeding
1. Start your local MySQL service.
2. Open terminal or MySQL client and run the database schema script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   *Note: If your MySQL server has no password for `root`, omit `-p`.*
3. *(Optional)* Populate sample test data for instant inspection:
   ```bash
   mysql -u root -p < database/seed.sql
   ```

---

## Step 2: Configure & Start the Backend Server
1. Navigate to the `/backend` directory:
   ```bash
   cd backend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Copy the template environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Check `.env` to verify your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=happy_kids_school
   DB_PORT=3306
   CLIENT_ORIGIN=http://localhost:5173
   MAX_FILE_SIZE_MB=5
   ```
5. Start the API server in development mode:
   ```bash
   npm run dev
   ```
   You should see:
   ```
   ✅ MySQL Database Connected Successfully to `happy_kids_school`
   🎒 HAPPY KIDS SCHOOL - ADMISSION API SERVER RUNNING
   🌐 Server URL: http://localhost:5000
   ```

---

## Step 3: Configure & Start the Frontend React App
1. Open a new terminal window and navigate to the `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Install React dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your web browser at:
   **`http://localhost:5173`**

---

## 🛠️ Troubleshooting & FAQ

### 1. `ER_ACCESS_DENIED_ERROR` when connecting to MySQL
- Ensure the `DB_USER` and `DB_PASSWORD` variables in `backend/.env` match your local MySQL credentials.

### 2. File Upload errors (`FILE_TOO_LARGE` or `INVALID_IMAGE_FORMAT`)
- Uploaded photos must be **JPG, JPEG, or PNG** and smaller than **5 MB**. The server automatically creates `/backend/uploads/` if it does not exist.

### 3. Proxy Errors (`ECONNREFUSED` from Vite frontend)
- Ensure the backend Express server is running on port **5000** before testing form submission from the frontend.
