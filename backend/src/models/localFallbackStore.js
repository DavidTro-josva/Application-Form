/**
 * ========================================================
 * HAPPY KIDS SCHOOL - LOCAL JSON FALLBACK STORE
 * Automatically used when MySQL is offline (e.g. ECONNREFUSED)
 * Provides 100% seamless testing & persistence without database installation
 * ========================================================
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NETLIFY
  ? path.join('/tmp', 'data')
  : path.join(__dirname, '../../data');
const FILE_PATH = path.join(DATA_DIR, 'fallback_admissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure JSON file exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ admissions: [] }, null, 2), 'utf-8');
}

/**
 * Read all stored admissions from JSON file
 */
const readData = () => {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.admissions || [];
  } catch (err) {
    console.error('⚠️ Error reading fallback store, resetting to empty array:', err.message);
    return [];
  }
};

/**
 * Save admissions array to JSON file
 */
const writeData = (admissions) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ admissions }, null, 2), 'utf-8');
  } catch (err) {
    console.error('⚠️ Error writing fallback store:', err.message);
  }
};

/**
 * Helper: Calculate age in years & months from DOB string (YYYY-MM-DD)
 */
const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) {
    years--;
    months += 12;
  }
  if (today.getDate() < dob.getDate() && months > 0) {
    months--;
  }
  return { years: Math.max(0, years), months: Math.max(0, months) };
};

/**
 * 1. CREATE ADMISSION (Fallback)
 */
const createAdmission = async (data, files) => {
  const admissions = readData();
  const year = new Date().getFullYear();

  // Generate unique student ID and application number
  const nextId = admissions.length > 0 ? Math.max(...admissions.map((a) => a.studentId)) + 1 : 1;
  const appNumber = `HKS-${year}-${String(nextId).padStart(4, '0')}`;

  const age = calculateAge(data.dob);

  const studentPhotoPath = files?.studentPhoto?.[0]
    ? `/uploads/${files.studentPhoto[0].filename}`
    : null;
  const fatherPhotoPath = files?.fatherPhoto?.[0]
    ? `/uploads/${files.fatherPhoto[0].filename}`
    : null;
  const motherPhotoPath = files?.motherPhoto?.[0]
    ? `/uploads/${files.motherPhoto[0].filename}`
    : null;

  const newAdmission = {
    studentId: nextId,
    applicationNumber: appNumber,
    studentInfo: {
      fullName: data.studentName,
      dob: data.dob,
      ageYears: age.years,
      ageMonths: age.months,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      motherTongue: data.motherTongue,
      photoPath: studentPhotoPath,
    },
    parentInfo: {
      father: {
        fullName: data.fatherName,
        occupation: data.fatherOccupation,
        mobileNumber: data.fatherMobile,
        email: data.fatherEmail || null,
        aadhaarNumber: data.fatherAadhaar,
        photoPath: fatherPhotoPath,
      },
      mother: {
        fullName: data.motherName,
        occupation: data.motherOccupation,
        mobileNumber: data.motherMobile,
        email: data.motherEmail || null,
        aadhaarNumber: data.motherAadhaar,
        photoPath: motherPhotoPath,
      },
    },
    residentialAddress: {
      houseNumber: data.houseNumber,
      street: data.street,
      area: data.area,
      city: data.city,
      district: data.district,
      state: data.state,
      country: data.country || 'India',
      pinCode: data.pinCode,
    },
    uploadedImages: [],
    createdAt: new Date().toISOString(),
  };

  // Add uploaded image references
  [
    { file: files?.studentPhoto?.[0], type: 'STUDENT_PHOTO' },
    { file: files?.fatherPhoto?.[0], type: 'FATHER_PHOTO' },
    { file: files?.motherPhoto?.[0], type: 'MOTHER_PHOTO' },
  ].forEach(({ file, type }) => {
    if (file) {
      newAdmission.uploadedImages.push({
        referenceId: Date.now() + Math.floor(Math.random() * 1000),
        entityType: type,
        originalName: file.originalname,
        storedPath: `/uploads/${file.filename}`,
        fileSizeKb: (file.size / 1024).toFixed(2),
        mimeType: file.mimetype,
      });
    }
  });

  admissions.push(newAdmission);
  writeData(admissions);

  console.log(`✨ [Local Fallback Store] Created Application: ${appNumber} (ID: ${nextId})`);

  return {
    success: true,
    studentId: nextId,
    applicationNumber: appNumber,
  };
};

/**
 * 2. GET ADMISSION BY ID OR REFERENCE (Fallback)
 */
const getAdmissionById = async (identifier) => {
  const admissions = readData();
  const isNumber = !isNaN(identifier) && String(Number(identifier)) === String(identifier);

  const found = admissions.find((a) => {
    if (isNumber) {
      return Number(a.studentId) === Number(identifier);
    }
    return String(a.applicationNumber).toLowerCase() === String(identifier).toLowerCase();
  });

  return found || null;
};

/**
 * 3. UPDATE ADMISSION (Fallback)
 */
const updateAdmission = async (id, data, files) => {
  const admissions = readData();
  const index = admissions.findIndex((a) => String(a.studentId) === String(id));

  if (index === -1) return null;

  const existing = admissions[index];
  const age = calculateAge(data.dob);

  const studentPhotoPath = files?.studentPhoto?.[0]
    ? `/uploads/${files.studentPhoto[0].filename}`
    : existing.studentInfo.photoPath;
  const fatherPhotoPath = files?.fatherPhoto?.[0]
    ? `/uploads/${files.fatherPhoto[0].filename}`
    : existing.parentInfo.father.photoPath;
  const motherPhotoPath = files?.motherPhoto?.[0]
    ? `/uploads/${files.motherPhoto[0].filename}`
    : existing.parentInfo.mother.photoPath;

  const updatedAdmission = {
    ...existing,
    studentInfo: {
      fullName: data.studentName,
      dob: data.dob,
      ageYears: age.years,
      ageMonths: age.months,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
      motherTongue: data.motherTongue,
      photoPath: studentPhotoPath,
    },
    parentInfo: {
      father: {
        fullName: data.fatherName,
        occupation: data.fatherOccupation,
        mobileNumber: data.fatherMobile,
        email: data.fatherEmail || null,
        aadhaarNumber: data.fatherAadhaar,
        photoPath: fatherPhotoPath,
      },
      mother: {
        fullName: data.motherName,
        occupation: data.motherOccupation,
        mobileNumber: data.motherMobile,
        email: data.motherEmail || null,
        aadhaarNumber: data.motherAadhaar,
        photoPath: motherPhotoPath,
      },
    },
    residentialAddress: {
      houseNumber: data.houseNumber,
      street: data.street,
      area: data.area,
      city: data.city,
      district: data.district,
      state: data.state,
      country: data.country || 'India',
      pinCode: data.pinCode,
    },
    updatedAt: new Date().toISOString(),
  };

  admissions[index] = updatedAdmission;
  writeData(admissions);

  console.log(`✨ [Local Fallback Store] Updated Application ID: ${id}`);

  return {
    success: true,
    studentId: existing.studentId,
    applicationNumber: existing.applicationNumber,
  };
};

/**
 * 4. DELETE ADMISSION (Fallback)
 */
const deleteAdmission = async (id) => {
  const admissions = readData();
  const filtered = admissions.filter((a) => String(a.studentId) !== String(id));

  if (filtered.length === admissions.length) return false;

  writeData(filtered);
  console.log(`✨ [Local Fallback Store] Deleted Application ID: ${id}`);
  return true;
};

module.exports = {
  createAdmission,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
};
