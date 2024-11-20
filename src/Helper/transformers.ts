export const marksheetTransformer = (data) => {
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
      status: 'pending',
    };
  });
};

// Enrollment Certificate transformation logic
export const enrollmentCertificateTransformer = (data) => {
  return data.map((record) => {
    return {
      enrollmentId: record.enrollmentId,
      studentId: record.studentId,
      firstName: record.firstName,
      lastName: record.lastName,
      schoolName: record.schoolName,
      enrollmentDate: record.enrollmentDate,
      degreeProgram: record.degreeProgram,
      status: 'pending',
    };
  });
};
