export const tenMarksheetTransformer = (data) => {
  return data.map((record) => {
    const subjects = record.Subjects.split('|');
    const marksMaxPractical = record.marksMaxPractical.split('|');
    const marksMaxTheory = record.marksMaxTheory.split('|');
    const marksPractical = record.marksPractical.split('|');
    const marksTheory = record.marksTheory.split('|');

    const subjectsArray = subjects.map((subject, index) => ({
      name: subject,
      marksMaxPractical: marksMaxPractical[index] || null,
      marksMaxTheory: marksMaxTheory[index] || null,
      marksPractical: marksPractical[index] || null,
      marksTheory: marksTheory[index] || null,
      marksTotal: (
        parseFloat(marksPractical[index] || 0) +
        parseFloat(marksTheory[index] || 0)
      ).toString(),
    }));

    return {
      studentId: record.studentId,
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      schoolId: record.schoolId,
      schoolName: record.schoolName,
      examDate: record.examDate,
      Performance: {
        cgpa: record.cgpa,
        cgpaMax: record.cgpaMax,
        grade: record.grade,
        marksMax: record.marksMax,
        marksTotal: record.marksTotal,
        percentage: record.percentage,
        result: record.result,
      },
      Subjects: subjectsArray,
      academicYear: record.academicYear,
      issuerName: record.issuerName,
      certificateNo:
        record.academicYear.split('-')[1].trim(' ') +
        '/' +
        record.schoolId.replace(/\s+/g, '').trim(' ') +
        '/' +
        record.studentId.trim(' '),
      status: 'pending',
    };
  });
};

// Marksheet Certificate transformation logic
export const marksheet = (data) => {
  return data?.map((record) => {
    return {
      studentId: record.studentUniqueId,
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      schoolId: record.schoolId,
      schoolName: record.schoolName,
      class: record.class,
      examDate: record.examDate,
      cgpa: record.cgpa,
      cgpaMax: record.cgpaMax,
      grade: record.grade,
      marksMax: record.marksMax,
      marksTotal: record.marksTotal,
      percentage: record.percentage,
      result: record.result,
      academicYear: record.academicYear,
      issuerName: record.issuerName,
      issuanceDate: new Date().toISOString(),
      certificateNo:
        record.academicYear.split('-')[1]?.trim(' ') +
        '/' +
        record.class.replace(/\s+/g, '')?.trim(' ') +
        '/' +
        record.studentUniqueId?.trim(' '),
      status: 'pending',
    };
  });
};
// Enrollment Certificate transformation logic
export const enrollmentCertificate = (data) => {
  return data.map((record) => {
    return {
      studentId: record.studentUniqueId,
      schoolId: record.schoolId,
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      gradeLevel: record.gradeLevel,
      addressLine1: record.addressLine1,
      addressLine2: record.addressLine2,
      landmark: record.landmark,
      locality: record.locality,
      district: record.district,
      pin: record.pin,
      state: record.state,
      country: record.country,
      schoolYear: record.schoolYear,
      studentStatus: record.studentStatus,
      schoolName: record.schoolName,
      schoolRegistrationNumber: record.schoolRegistrationNumber,
      principalName: record.authorityName,
      principalDesignation: record.designationPrincipal,
      dayMonthYear: record.dayMonthYear,
      learnerReferenceNumber: record.learnerReferenceNumber,
      validUpto: record.validUpto,
      certificateNo:
        record.schoolId?.trim(' ') +
        '/' +
        record.academicYear.split('-')[1]?.trim(' ') +
        '/' +
        record.studentUniqueId?.trim(' '),
      status: 'pending',
    };
  });
};

export const casteCertificate = (data) => {
  return data.map((record) => {
    return {
      aadharNumber: record.aadharNumber || 'NA',
      familyLeaderBhamashahNumber: record.familyLeaderBhamashahNumber,
      relationWithApplicant: record.relationWithApplicant,
      studentId: record.studentUniqueId,
      schoolId: record.schoolId,
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      castName: record.castName,
      castCategoryNumber: record.castCategoryNumber,
      addressLine1: record.addressLine1,
      addressLine2: record.addressLine2,
      house: record.house,
      landmark: record.landmark,
      locality: record.locality,
      vtc: record.vtc,
      district: record.district,
      pin: record.pin,
      state: record.state,
      country: record.country,
      orgName: record.orgName,
      orgCode: record.orgCode,
      orgType: record.orgType,
      orgOfficerName: record.orgOfficerName,
      orgOfficerRank: record.orgOfficerRank,
      orgOfficerSign: record.orgOfficerSign,
      orgAddressLine1: record.orgAddressLine1,
      orgAddressLine2: record.orgAddressLine2,
      orgLandmark: record.orgLandmark,
      orgLocality: record.orgLocality,
      orgVtc: record.orgVtc,
      orgDistrict: record.orgDistrict,
      orgPin: record.orgPin,
      orgState: record.orgState,
      orgCountry: record.orgCountry,
      dateOfIssuance: record.dateOfIssuance,
      certificateNumber: record.certificateNo,
      certificateNo:
        record.certificateNo ||
        record.schoolId?.trim(' ') +
          '/' +
          record.pin.replace(/\s+/g, '')?.trim(' ') +
          '/' +
          record.studentUniqueId?.trim(' '),
      status: 'pending',
    };
  });
};
