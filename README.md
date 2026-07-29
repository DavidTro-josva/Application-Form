# 🎒 Happy Kids School - Student Admission Application System

A modern, professional, responsive, and production-ready **School Admission Application Form** engineered for **Happy Kids School**. Designed with an elegant, child-friendly international kindergarten theme, smooth micro-animations, comprehensive frontend & backend validation, file uploads, and a MySQL relational database.

---

## 🌟 Key Features & Highlights

### 1. Premium UI/UX & Aesthetics
- **International School Theme**: Built with Vanilla CSS (`design-tokens.css`) featuring curated HSL colors, warm navy/amber/coral accents, glassmorphism headers, rounded card surfaces, and layered soft shadows.
- **Interactive Progress Tracker**: A dynamic 3-step progress bar showing completion percentage across Student, Parent, and Residential Address sections.
- **Micro-Animations & Transitions**: Smooth focus rings, shake animations on invalid inputs, animated progress bar fill, and hover transitions.
- **Mobile-First & Responsive**: Adapts seamlessly to Desktop, Laptop, Tablet, and Mobile viewports.

### 2. Complete Application Flow & Validation
- **Section 1 — Student Information**:
  - Full Name (required, minimum 3 characters).
  - Date of Birth with automatic prevention of future dates.
  - **Read-Only Auto-Calculated Age**: Instantly calculates and formats age in **Years and Months**.
  - Gender radio selection & Blood Group dropdown (`A+` to `O-`).
  - Student Photo Upload with instant preview, Replace button, and Remove button (Max 5MB, `JPG/JPEG/PNG`).
- **Section 2 — Parent / Guardian Details**:
  - Dedicated sections for **Father** and **Mother** information.
  - Required Full Name and Occupation.
  - Strict 10-digit Mobile Number formatting & validation.
  - Optional Email Address with RFC-style validation.
  - Strict 12-digit Aadhaar Number formatting & validation.
  - Separate Photo Upload previews for both Father and Mother.
- **Section 3 — Residential Address**:
  - House Number, Street, Area, City, District, State, Country (default: **India**).
  - Strict 6-digit PIN Code formatting & validation.
- **Form Actions & Success Screen**:
  - **Submit Application** button with active loading spinner and disable state during transmission.
  - **Reset Form** button with confirmation dialog.
  - **Success Modal**: Displays a green success icon, thank you message, generated unique Application Number (`HKS-2026-XXXX`), downloadable PDF placeholder, print placeholder, and Return Home button.
- **User-Friendly Error Handling**:
  - Clean floating alert banners for invalid images, network failures, database failures, duplicate submissions, and required field errors.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), HTML5, Vanilla CSS3, Lucide Icons, Axios |
| **Backend API** | Node.js, Express.js 4, Multer (File Uploads), express-validator |
| **Database** | MySQL 8+, `mysql2/promise` (Connection Pooling & Transactions) |

---

## 📂 Project Structure

```
c:\Users\DAVID JOSVA\React Project\Admission Form\
├── backend\
│   ├── src\
│   │   ├── config\db.js                  # MySQL Connection Pool
│   │   ├── controllers\admissionController.js # REST CRUD Handlers
│   │   ├── middleware\upload.js          # Multer File Upload Config (Max 5MB)
│   │   ├── middleware\validate.js        # Server-side validation rules
│   │   ├── middleware\errorHandler.js    # Centralized HTTP status & error formatting
│   │   ├── models\Admission.js           # MySQL Transactions & Relational queries
│   │   ├── routes\admissionRoutes.js     # Express API Routes
│   │   └── server.js                     # Express entry point & CORS
│   ├── uploads\                          # Secure photo storage folder
│   ├── .env.example                      # Template environment variables
│   └── .env                              # Active environment variables
├── frontend\
│   ├── public\logo.svg                   # Custom Happy Kids School badge
│   ├── src\
│   │   ├── components\
│   │   │   ├── Header\                   # Branding & Progress bar
│   │   │   ├── PhotoUpload\              # Reusable file upload dropzone & preview
│   │   │   ├── StudentSection\           # Card 1: Student info & Auto-Age DOB
│   │   │   ├── ParentSection\            # Card 2: Father & Mother details
│   │   │   ├── AddressSection\           # Card 3: Address & 6-digit PIN
│   │   │   ├── FormActions\              # Submit (spinner) & Reset buttons
│   │   │   ├── SuccessModal\             # Success screen & generated app ID
│   │   │   └── ErrorToast\               # Error notifications
│   │   ├── hooks\useFormValidation.js    # Field validation & progress calculation
│   │   ├── services\api.js               # REST client & error translator
│   │   ├── styles\                       # Vanilla CSS design tokens & responsive styling
│   │   ├── App.jsx                       # Main application state flow
│   │   └── main.jsx
│   ├── index.html                        # Google Fonts (Outfit & Inter)
│   └── vite.config.js                    # Vite config with /api proxy
├── database\
│   ├── schema.sql                        # Production MySQL DDL schema
│   └── seed.sql                          # Optional test dataset
└── docs\
    ├── API_DOCUMENTATION.md              # Complete REST API documentation
    └── INSTALLATION.md                   # Installation & configuration guide
```

---

## 🚀 Quick Start Guide

### 1. Database Setup
1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal).
2. Execute `database/schema.sql` to create the `happy_kids_school` database and tables (`students`, `parents`, `addresses`, `image_references`).
3. *(Optional)* Execute `database/seed.sql` to populate sample test data.

### 2. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
- The API server will run at `http://localhost:5000`.
- Health check: `http://localhost:5000/api/health`.

### 3. Start the Frontend React App
```bash
cd frontend
npm install
npm run dev
```
- The frontend will open at `http://localhost:5173`.
- All requests to `/api/*` and `/uploads/*` are automatically proxied to the backend server.

---

## 📚 Documentation
- See [API Documentation](file:///c:/Users/DAVID%20JOSVA/React%20Project/Admission%20Form/docs/API_DOCUMENTATION.md) for endpoint details, parameters, and JSON schemas.
- See [Installation Guide](file:///c:/Users/DAVID%20JOSVA/React%20Project/Admission%20Form/docs/INSTALLATION.md) for environment variable setup and troubleshooting.
