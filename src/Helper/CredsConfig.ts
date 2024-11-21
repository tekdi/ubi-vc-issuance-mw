export const CredsConfig = {
  marksheet: {
    schemaName: 'marksheet',
    credIssuerId: 'did:rcw:61504044-94f3-440e-af7f-3a4a76cfe3b1',
    credsSchemaId: 'did:schema:1d6245fc-bbc3-47fb-929f-70d6143b162f',
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
    credIssuerId: 'did:rcw:0da75f8e-e044-4f57-9cbe-dff530684da9',
    credsSchemaId: 'did:schema:903fb857-8562-4e7a-89b7-1e611120f88d',
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
    credIssuerId: 'did:rcw:3d922d7c-3c31-4059-90e7-d88574e2bd5a',
    credsSchemaId: 'did:schema:1b1464da-ef5a-49d9-b91d-c1954d249a2e',
    transformer: 'enrollmentCertificate',
    context:
      'https://raw.githubusercontent.com/PSMRI/beneficiary-backend/refs/heads/main/schemas/credentials/EnrollmentCertificate.json#EnrollmentCertificate',
    type: ['VerifiableCredential', 'EnrollmentCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'EnrollmentCertificate',
    tags: ['dev', 'enrollment-certificate-credential'],
  },
};
