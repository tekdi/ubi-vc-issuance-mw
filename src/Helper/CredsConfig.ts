import { config } from 'dotenv';

config();

export const CredsConfig = {
  marksheet: {
    schemaName: 'marksheet',
    credIssuerId: process.env.MARKSHEET_CRED_SCHEMA_ID,
    credsSchemaId: process.env.MARKSHEET_ISSUER_ID,
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
    credIssuerId: process.env.CASTE_CRED_SCHEMA_ID,
    credsSchemaId: process.env.CASTE_ISSUER_ID,
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
    credIssuerId: process.env.ENROLLMENT_CRED_SCHEMA_ID,
    credsSchemaId: process.env.ENROLLMENT_ISSUER_ID,
    transformer: 'enrollmentCertificate',
    context:
      'https://raw.githubusercontent.com/PSMRI/beneficiary-backend/refs/heads/main/schemas/credentials/EnrollmentCertificate.json#EnrollmentCertificate',
    type: ['VerifiableCredential', 'EnrollmentCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'EnrollmentCertificate',
    tags: ['dev', 'enrollment-certificate-credential'],
  },
};
