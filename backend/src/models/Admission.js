/**
 * ========================================================
 * HAPPY KIDS SCHOOL - ADMISSION MYSQL MODEL
 * Uses transactions to atomically insert/update all tables
 * ========================================================
 */
const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');
const fallbackStore = require('./localFallbackStore');

const isConnectionError = (err) => {
  if (!err) return false;
  const c = err.code || '';
  return (
    c === 'ECONNREFUSED' ||
    c === 'ENOTFOUND' ||
    c === 'EHOSTUNREACH' ||
    c === 'ETIMEDOUT' ||
    c === 'ER_ACCESS_DENIED_ERROR' ||
    c === 'ER_BAD_DB_ERROR' ||
    c === 'ER_NO_SUCH_TABLE' ||
    c === 'ER_NO_DB_ERROR'
  );
};

class AdmissionModel {
  /**
   * Helper: Calculate age in years & months from DOB string (YYYY-MM-DD)
   */
  static calculateAge(dobString) {
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
  }

  /**
   * Helper: Generate unique application number e.g. HKS-2026-0001
   */
  static async generateApplicationNumber(connection) {
    const year = new Date().getFullYear();
    const prefix = `HKS-${year}-`;
    const [rows] = await connection.query(
      `SELECT application_number FROM students WHERE application_number LIKE ? ORDER BY student_id DESC LIMIT 1`,
      [`${prefix}%`]
    );

    let nextNumber = 1;
    if (rows.length > 0) {
      const lastNumberStr = rows[0].application_number.split('-')[2];
      const parsed = parseInt(lastNumberStr, 10);
      if (!isNaN(parsed)) {
        nextNumber = parsed + 1;
      }
    }
    return `${prefix}${String(nextNumber).padStart(4, '0')}`;
  }

  /**
   * 1. CREATE ADMISSION (POST /api/admission)
   */
  static async createAdmission(data, files) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // 1. Generate Application Number
      const appNumber = await this.generateApplicationNumber(connection);

      // 2. Calculate Age
      const age = this.calculateAge(data.dob);

      // Photo paths
      const studentPhotoFile = files?.studentPhoto?.[0];
      const fatherPhotoFile = files?.fatherPhoto?.[0];
      const motherPhotoFile = files?.motherPhoto?.[0];
      const guardianPhotoFile = files?.guardianPhoto?.[0];

      const studentPhotoPath = studentPhotoFile ? `/uploads/${studentPhotoFile.filename}` : null;
      const fatherPhotoPath = fatherPhotoFile ? `/uploads/${fatherPhotoFile.filename}` : null;
      const motherPhotoPath = motherPhotoFile ? `/uploads/${motherPhotoFile.filename}` : null;
      const guardianPhotoPath = guardianPhotoFile ? `/uploads/${guardianPhotoFile.filename}` : null;

      // 3. Insert into `students` table
      const [studentResult] = await connection.query(
        `INSERT INTO students (
          application_number, full_name, dob, age_years, age_months,
          gender, blood_group, mother_tongue, photo_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          appNumber,
          data.studentName,
          data.dob,
          age.years,
          age.months,
          data.gender,
          data.bloodGroup,
          data.motherTongue,
          studentPhotoPath,
        ]
      );
      const studentId = studentResult.insertId;

      // 4. Insert Father into `parents` table
      await connection.query(
        `INSERT INTO parents (
          student_id, relation_type, full_name, occupation,
          mobile_number, email, aadhaar_number, photo_path
        ) VALUES (?, 'FATHER', ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          data.fatherName,
          data.fatherOccupation,
          data.fatherMobile,
          data.fatherEmail || null,
          data.fatherAadhaar,
          fatherPhotoPath,
        ]
      );

      // 5. Insert Mother into `parents` table
      await connection.query(
        `INSERT INTO parents (
          student_id, relation_type, full_name, occupation,
          mobile_number, email, aadhaar_number, photo_path
        ) VALUES (?, 'MOTHER', ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          data.motherName,
          data.motherOccupation,
          data.motherMobile,
          data.motherEmail || null,
          data.motherAadhaar,
          motherPhotoPath,
        ]
      );

      // 6. Insert Guardian into `parents` table
      await connection.query(
        `INSERT INTO parents (
          student_id, relation_type, full_name, occupation,
          mobile_number, email, aadhaar_number, photo_path
        ) VALUES (?, 'GUARDIAN', ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          data.guardianName,
          data.guardianOccupation,
          data.guardianMobile,
          data.guardianEmail || null,
          data.guardianAadhaar,
          guardianPhotoPath,
        ]
      );

      // 7. Insert into `addresses` table
      await connection.query(
        `INSERT INTO addresses (
          student_id, house_number, street, area,
          city, district, state, country, pin_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          studentId,
          data.houseNumber,
          data.street,
          data.area,
          data.city,
          data.district,
          data.state,
          data.country || 'India',
          data.pinCode,
        ]
      );

      // 7. Insert into `image_references` table for auditing
      const insertImgRef = async (file, entityType) => {
        if (!file) return;
        await connection.query(
          `INSERT INTO image_references (
            student_id, entity_type, original_name, stored_path, file_size_kb, mime_type
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            entityType,
            file.originalname,
            `/uploads/${file.filename}`,
            file.size,
            file.mimetype,
          ]
        );
      };

      await insertImgRef(studentPhotoFile, 'STUDENT');
      await insertImgRef(fatherPhotoFile, 'FATHER');
      await insertImgRef(motherPhotoFile, 'MOTHER');

      await connection.commit();

      return {
        success: true,
        studentId,
        applicationNumber: appNumber,
      };
    } catch (error) {
      if (connection) {
        try { await connection.rollback(); } catch (e) {}
      }
      if (isConnectionError(error)) {
        console.warn('⚠️ [MySQL Offline - Switching to Local JSON Fallback Store]:', error.code || error.message);
        return fallbackStore.createAdmission(data, files);
      }
      throw error;
    } finally {
      if (connection) {
        try { connection.release(); } catch (e) {}
      }
    }
  }

  /**
   * 2. GET ADMISSION BY ID OR REFERENCE (GET /api/admission/:id)
   */
  static async getAdmissionById(identifier) {
    try {
      const isNumber = !isNaN(identifier) && String(Number(identifier)) === String(identifier);

      let query = `SELECT * FROM students WHERE `;
      const param = isNumber ? parseInt(identifier, 10) : identifier;
      query += isNumber ? `student_id = ?` : `application_number = ?`;

      const [students] = await pool.query(query, [param]);
      if (students.length === 0) {
        return null;
      }

    const student = students[0];

    // Fetch Parents
    const [parents] = await pool.query(
      `SELECT * FROM parents WHERE student_id = ?`,
      [student.student_id]
    );

    // Fetch Address
    const [addresses] = await pool.query(
      `SELECT * FROM addresses WHERE student_id = ?`,
      [student.student_id]
    );

    // Fetch Image References
    const [images] = await pool.query(
      `SELECT * FROM image_references WHERE student_id = ?`,
      [student.student_id]
    );

    const father = parents.find((p) => p.relation_type === 'FATHER') || null;
    const mother = parents.find((p) => p.relation_type === 'MOTHER') || null;
    const guardian = parents.find((p) => p.relation_type === 'GUARDIAN') || null;
    const address = addresses[0] || null;

    return {
      studentId: student.student_id,
      applicationNumber: student.application_number,
      studentInfo: {
        fullName: student.full_name,
        dob: student.dob,
        ageYears: student.age_years,
        ageMonths: student.age_months,
        gender: student.gender,
        bloodGroup: student.blood_group,
        motherTongue: student.mother_tongue,
        photoPath: student.photo_path,
      },
      parentInfo: {
        father: father ? {
          fullName: father.full_name,
          occupation: father.occupation,
          mobileNumber: father.mobile_number,
          email: father.email,
          aadhaarNumber: father.aadhaar_number,
          photoPath: father.photo_path,
        } : null,
        mother: mother ? {
          fullName: mother.full_name,
          occupation: mother.occupation,
          mobileNumber: mother.mobile_number,
          email: mother.email,
          aadhaarNumber: mother.aadhaar_number,
          photoPath: mother.photo_path,
        } : null,
        guardian: guardian ? {
          fullName: guardian.full_name,
          occupation: guardian.occupation,
          mobileNumber: guardian.mobile_number,
          email: guardian.email,
          aadhaarNumber: guardian.aadhaar_number,
          photoPath: guardian.photo_path,
        } : null,
      },
      residentialAddress: address ? {
        houseNumber: address.house_number,
        street: address.street,
        area: address.area,
        city: address.city,
        district: address.district,
        state: address.state,
        country: address.country,
        pinCode: address.pin_code,
      } : null,
      uploadedImages: images.map((img) => ({
        entityType: img.entity_type,
        fileName: img.file_name,
        filePath: img.file_path,
        fileSize: img.file_size,
      })),
      createdAt: student.created_at,
    };
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn('⚠️ [MySQL Offline - Switching to Local JSON Fallback Store]:', error.code || error.message);
        return fallbackStore.getAdmissionById(identifier);
      }
      throw error;
    }
  }

  /**
   * 3. UPDATE ADMISSION (PUT /api/admission/:id)
   */
  static async updateAdmission(identifier, data, files) {
    let connection;
    try {
      const existing = await this.getAdmissionById(identifier);
      if (!existing) {
        return null;
      }
      const studentId = existing.studentId;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const age = this.calculateAge(data.dob || existing.studentInfo.dob);

      // Student update
      const studentPhotoFile = files?.studentPhoto?.[0];
      const studentPhotoPath = studentPhotoFile
        ? `/uploads/${studentPhotoFile.filename}`
        : existing.studentInfo.photoPath;

      await connection.query(
        `UPDATE students SET
          full_name = ?, dob = ?, age_years = ?, age_months = ?,
          gender = ?, blood_group = ?, mother_tongue = ?, photo_path = ?
        WHERE student_id = ?`,
        [
          data.studentName,
          data.dob,
          age.years,
          age.months,
          data.gender,
          data.bloodGroup,
          data.motherTongue,
          studentPhotoPath,
          studentId,
        ]
      );

      // Father update
      const fatherPhotoFile = files?.fatherPhoto?.[0];
      const fatherPhotoPath = fatherPhotoFile
        ? `/uploads/${fatherPhotoFile.filename}`
        : existing.parentInfo.father.photoPath;

      await connection.query(
        `UPDATE parents SET
          full_name = ?, occupation = ?, mobile_number = ?,
          email = ?, aadhaar_number = ?, photo_path = ?
        WHERE student_id = ? AND relation_type = 'FATHER'`,
        [
          data.fatherName,
          data.fatherOccupation,
          data.fatherMobile,
          data.fatherEmail || null,
          data.fatherAadhaar,
          fatherPhotoPath,
          studentId,
        ]
      );

      // Mother update
      const motherPhotoFile = files?.motherPhoto?.[0];
      const motherPhotoPath = motherPhotoFile
        ? `/uploads/${motherPhotoFile.filename}`
        : existing.parentInfo.mother.photoPath;

      await connection.query(
        `UPDATE parents SET
          full_name = ?, occupation = ?, mobile_number = ?,
          email = ?, aadhaar_number = ?, photo_path = ?
        WHERE student_id = ? AND relation_type = 'MOTHER'`,
        [
          data.motherName,
          data.motherOccupation,
          data.motherMobile,
          data.motherEmail || null,
          data.motherAadhaar,
          motherPhotoPath,
          studentId,
        ]
      );

      // Guardian update
      const guardianPhotoFile = files?.guardianPhoto?.[0];
      const guardianPhotoPath = guardianPhotoFile
        ? `/uploads/${guardianPhotoFile.filename}`
        : existing.parentInfo?.guardian?.photoPath || null;

      const [existingGuardian] = await connection.query(
        `SELECT * FROM parents WHERE student_id = ? AND relation_type = 'GUARDIAN'`,
        [studentId]
      );

      if (existingGuardian.length === 0) {
        await connection.query(
          `INSERT INTO parents (
            student_id, relation_type, full_name, occupation,
            mobile_number, email, aadhaar_number, photo_path
          ) VALUES (?, 'GUARDIAN', ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            data.guardianName,
            data.guardianOccupation,
            data.guardianMobile,
            data.guardianEmail || null,
            data.guardianAadhaar,
            guardianPhotoPath,
          ]
        );
      } else {
        await connection.query(
          `UPDATE parents SET
            full_name = ?, occupation = ?, mobile_number = ?,
            email = ?, aadhaar_number = ?, photo_path = ?
          WHERE student_id = ? AND relation_type = 'GUARDIAN'`,
          [
            data.guardianName,
            data.guardianOccupation,
            data.guardianMobile,
            data.guardianEmail || null,
            data.guardianAadhaar,
            guardianPhotoPath,
            studentId,
          ]
        );
      }

      // Address update
      await connection.query(
        `UPDATE addresses SET
          house_number = ?, street = ?, area = ?,
          city = ?, district = ?, state = ?, country = ?, pin_code = ?
        WHERE student_id = ?`,
        [
          data.houseNumber,
          data.street,
          data.area,
          data.city,
          data.district,
          data.state,
          data.country || 'India',
          data.pinCode,
          studentId,
        ]
      );

      await connection.commit();
      return await this.getAdmissionById(studentId);
    } catch (error) {
      if (connection) {
        try { await connection.rollback(); } catch (e) {}
      }
      if (isConnectionError(error)) {
        console.warn('⚠️ [MySQL Offline - Switching to Local JSON Fallback Store]:', error.code || error.message);
        return fallbackStore.updateAdmission(identifier, data, files);
      }
      throw error;
    } finally {
      if (connection) {
        try { connection.release(); } catch (e) {}
      }
    }
  }

  /**
   * 4. DELETE ADMISSION (DELETE /api/admission/:id)
   */
  static async deleteAdmission(identifier) {
    const existing = await this.getAdmissionById(identifier);
    if (!existing) {
      return false;
    }

    // Optional: Clean up photo files from disk
    const deleteFileSafely = (relPath) => {
      if (!relPath) return;
      try {
        const absPath = path.join(__dirname, '..', '..', relPath);
        if (fs.existsSync(absPath)) {
          fs.unlinkSync(absPath);
        }
      } catch (e) {
        console.warn('⚠️ Could not delete image file:', relPath);
      }
    };

    deleteFileSafely(existing.studentInfo?.photoPath);
    deleteFileSafely(existing.parentInfo?.father?.photoPath);
    deleteFileSafely(existing.parentInfo?.mother?.photoPath);
    deleteFileSafely(existing.parentInfo?.guardian?.photoPath);

    try {
      const [result] = await pool.query(
        `DELETE FROM students WHERE student_id = ?`,
        [existing.studentId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      if (isConnectionError(error)) {
        console.warn('⚠️ [MySQL Offline - Switching to Local JSON Fallback Store]:', error.code || error.message);
        return fallbackStore.deleteAdmission(identifier);
      }
      throw error;
    }
  }
}

module.exports = AdmissionModel;
