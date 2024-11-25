export const CredsConfig = {
  marksheet: {
    schemaName: 'marksheet',
    credIssuerId: 'did:rcw:15659286-4ff8-4036-bfb2-ae99bb735c68',
    credsSchemaId: 'did:schema:6788f6b0-d0be-4170-9305-554120bde880',
    transformer: 'marksheet',
    context:
      'https://raw.githubusercontent.com/PSMRI/beneficiary-backend/refs/heads/main/schemas/credentials/TekdiIssuedMarksheetCredential.json#TekdiIssuedMarksheetCredential',
    type: ['VerifiableCredential', 'TekdiIssuedMarksheetCredential'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'TekdiIssuedMarksheetCredential',
    tags: ['dev', 'marksheet-certificate-credential'],
  },
  casteCertificate: {
    schemaName: 'casteCertificate',
    credIssuerId: 'did:rcw:9a84f35b-4e33-4daf-892d-12dfd7dd6adc',
    credsSchemaId: 'did:schema:3a2288fa-89c8-44ff-a712-404241ac5eea',
    transformer: 'casteCertificate',
    context:
      'https://raw.githubusercontent.com/PSMRI/beneficiary-backend/refs/heads/main/schemas/credentials/CasteCertificate.json#CasteCertificate',
    type: ['VerifiableCredential', 'CasteCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'CasteCertificate',
    tags: ['dev', 'Caste-certificate-credential'],
  },
  enrollmentCertificate: {
    schemaName: 'enrollmentCertificate',
    credIssuerId: 'did:rcw:743e7b9f-cd78-4f4c-a022-75a225efc955',
    credsSchemaId: 'did:schema:c88c59ac-6305-4264-a7a6-8822b6702cad',
    transformer: 'enrollmentCertificate',
    context:
      'https://raw.githubusercontent.com/PSMRI/beneficiary-backend/refs/heads/main/schemas/credentials/EnrollmentCertificate.json#EnrollmentCertificate',
    type: ['VerifiableCredential', 'EnrollmentCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'EnrollmentCertificate',
    tags: ['dev', 'enrollment-certificate-credential'],
  },
};
