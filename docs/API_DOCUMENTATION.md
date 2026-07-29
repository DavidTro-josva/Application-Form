# 🎒 Happy Kids School - REST API Documentation

Base URL (Local Development): `http://localhost:5000/api`

All endpoints return JSON responses with standard HTTP status codes and a `success` boolean indicator.

---

## 1. Health Check

### `GET /api/health`
Verifies server status and MySQL database connectivity.

**Response Example (`200 OK`):**
```json
{
  "success": true,
  "service": "TN Happy Kids School Admission REST API",
  "status": "ONLINE",
  "database": "CONNECTED",
  "timestamp": "2026-07-29T10:00:00.000Z"
}
```

---

## 2. Submit Admission Application

### `POST /api/admission`
Submits a new student admission application along with Student, Father, and Mother photo uploads.

- **Content-Type**: `multipart/form-data`
- **File Fields**:
  - `studentPhoto` (Optional, max 1 image, JPG/PNG, max 5MB)
  - `fatherPhoto` (Optional, max 1 image, JPG/PNG, max 5MB)
  - `motherPhoto` (Optional, max 1 image, JPG/PNG, max 5MB)

#### Form Data Parameters
| Field | Type | Required | Description / Rules |
| :--- | :--- | :--- | :--- |
| `studentName` | String | **Yes** | Student Full Name (Min 3 chars) |
| `dob` | Date (YYYY-MM-DD) | **Yes** | Date of birth (Cannot be a future date) |
| `gender` | Enum | **Yes** | `Male`, `Female`, or `Other` |
| `bloodGroup` | Enum | **Yes** | `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-` |
| `motherTongue` | String | **Yes** | Mother tongue (e.g., Hindi, English) |
| `fatherName` | String | **Yes** | Father Full Name |
| `fatherOccupation` | String | **Yes** | Father Occupation |
| `fatherMobile` | String | **Yes** | Exactly 10 digits |
| `fatherEmail` | String | No | Valid RFC email address |
| `fatherAadhaar` | String | **Yes** | Exactly 12 digits |
| `motherName` | String | **Yes** | Mother Full Name |
| `motherOccupation` | String | **Yes** | Mother Occupation |
| `motherMobile` | String | **Yes** | Exactly 10 digits |
| `motherEmail` | String | No | Valid RFC email address |
| `motherAadhaar` | String | **Yes** | Exactly 12 digits |
| `guardianName` | String | **Yes** | Guardian Full Name (min 3 chars, alphabetic only) |
| `guardianOccupation` | String | **Yes** | Guardian Occupation |
| `guardianMobile` | String | **Yes** | Exactly 10 digits |
| `guardianEmail` | String | No | Valid RFC email address |
| `guardianAadhaar` | String | **Yes** | Exactly 12 digits |
| `houseNumber` | String | **Yes** | Residential house or flat number |
| `street` | String | **Yes** | Street name or road |
| `area` | String | **Yes** | Area or locality |
| `city` | String | **Yes** | City or town name |
| `district` | String | **Yes** | District name |
| `state` | String | **Yes** | State name |
| `country` | String | **Yes** | Country (Default: `India`) |
| `pinCode` | String | **Yes** | Exactly 6 digits |

#### Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Student admission application submitted successfully.",
  "applicationNumber": "HKS-2026-0001",
  "data": {
    "studentId": 1,
    "applicationNumber": "HKS-2026-0001",
    "studentInfo": {
      "fullName": "Aarav Sharma",
      "dob": "2021-04-15",
      "ageYears": 5,
      "ageMonths": 3,
      "gender": "Male",
      "bloodGroup": "O+",
      "motherTongue": "Hindi",
      "photoPath": "/uploads/studentPhoto-1722222222222.png"
    },
    "parentInfo": { ... },
    "residentialAddress": { ... },
    "uploadedImages": [ ... ]
  }
}
```

---

## 3. Get Admission Application Details

### `GET /api/admission/:id`
Fetches complete application information by `student_id` or `application_number` (e.g., `/api/admission/1` or `/api/admission/HKS-2026-0001`).

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "data": {
    "studentId": 1,
    "applicationNumber": "HKS-2026-0001",
    "studentInfo": { ... },
    "parentInfo": {
      "father": {
        "fullName": "Rajesh Sharma",
        "occupation": "Senior Software Engineer",
        "mobileNumber": "9876543210",
        "email": "rajesh.sharma@example.com",
        "aadhaarNumber": "123456789012",
        "photoPath": "/uploads/fatherPhoto-1722222222222.png"
      },
      "mother": { ... }
    },
    "residentialAddress": {
      "houseNumber": "42-B",
      "street": "Green Valley Boulevard",
      "area": "Indiranagar",
      "city": "Bengaluru",
      "district": "Bengaluru Urban",
      "state": "Karnataka",
      "country": "India",
      "pinCode": "560038"
    }
  }
}
```

---

## 4. Update Admission Application

### `PUT /api/admission/:id`
Updates an existing admission record and optionally replaces any uploaded images.

- **Content-Type**: `multipart/form-data`
- Accepts the same parameters as `POST /api/admission`.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Admission application updated successfully.",
  "data": { ... }
}
```

---

## 5. Delete Admission Application

### `DELETE /api/admission/:id`
Deletes an admission application and removes associated uploaded photos from disk.

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "message": "Admission application (1) has been successfully removed."
}
```

---

## 6. Error Response Format
All errors return a structured JSON response with an `errorType` identifier for frontend handling:

```json
{
  "success": false,
  "errorType": "VALIDATION_ERROR",
  "message": "One or more required fields are invalid or missing.",
  "errors": [
    {
      "field": "pinCode",
      "message": "PIN Code must be exactly 6 digits",
      "value": "123"
    }
  ]
}
```
