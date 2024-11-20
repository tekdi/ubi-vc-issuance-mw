export const CredsConfig = {
  TenMarksheet: {
    schemaName: 'TenMarksheet',
    credRCSchemaMapping: {
      studentId: 'studentId',
      firstName: 'firstName',
      lastName: 'lastName',
      subjects: 'Subjects',
      performance: 'Performance',
    },
    credIssuerId: 'did:rcw:bca03eb8-fc0a-4700-8893-708ef74a87e1',
    credsSchemaId: 'did:schema:3d0c6923-e5a8-470d-93e8-2c85e367da7a',
    transformer: 'marksheetTransformer',
    context:
      'https://raw.githubusercontent.com/PSMRI/beneficiary-backend/refs/heads/main/schemas/credentials/TekdiIssued10thCredential.json#TekdiIssued10thCredential',
    type: ['VerifiableCredential', 'TekdiIssued10thCredential'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'TekdiIssued10thCredential',
    tags: ['education', 'student', 'examResults'],
  },
  EnrollmentCertificate: {
    credRCSchemaMapping: {
      enrollmentId: 'enrollmentId',
      studentId: 'studentId',
      firstName: 'firstName',
      lastName: 'lastName',
      degreeProgram: 'degreeProgram',
      enrollmentDate: 'enrollmentDate',
      // Add more mappings as necessary...
    },
    credIssuerId: 'enrollmentCertificateIssuerId',
    credsSchemaId: 'enrollmentCertificateSchemaId',
    transformer: 'enrollmentCertificateTransformer',
  },
  // Add more document types as necessary...
};
