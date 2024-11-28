import { config } from 'dotenv';

config();

export const CredsConfig = {
  marksheet: {
    schemaName: 'marksheet',
    credIssuerId: process.env.MARKSHEET_ISSUER_ID,
    credsSchemaId: process.env.MARKSHEET_CRED_SCHEMA_ID,
    transformer: 'marksheet',
    context:
      'https://raw.githubusercontent.com/tekdi/tekdi.github.io/refs/heads/main/static/files/vc-schemas/ubi/Marksheet.json',
    type: ['VerifiableCredential', 'marksheet'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'marksheet',
    tags: ['dev', 'marksheet-certificate-credential'],
  },
  casteCertificate: {
    schemaName: 'casteCertificate',
    credIssuerId: process.env.CASTE_ISSUER_ID,
    credsSchemaId: process.env.CASTE_CRED_SCHEMA_ID,
    transformer: 'casteCertificate',
    context:
      'https://raw.githubusercontent.com/tekdi/tekdi.github.io/refs/heads/main/static/files/vc-schemas/ubi/CasteCertificate.json',
    type: ['VerifiableCredential', 'CasteCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'CasteCertificate',
    tags: ['dev', 'Caste-certificate-credential'],
  },
  enrollmentCertificate: {
    schemaName: 'enrollmentCertificate',
    credIssuerId: process.env.ENROLLMENT_ISSUER_ID,
    credsSchemaId: process.env.ENROLLMENT_CRED_SCHEMA_ID,
    transformer: 'enrollmentCertificate',
    context:
      'https://raw.githubusercontent.com/tekdi/tekdi.github.io/refs/heads/main/static/files/vc-schemas/ubi/EnrollmentCertificate.json',
    type: ['VerifiableCredential', 'EnrollmentCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'EnrollmentCertificate',
    tags: ['dev', 'enrollment-certificate-credential'],
  },
  sportsParticipationCertificate: {
    schemaName: 'sportsParticipationCertificate',
    credIssuerId: process.env.SPORT_ISSUER_ID,
    credsSchemaId: process.env.SPORT_CRED_SCHEMA_ID,
    transformer: 'sportsParticipationCertificate',
    context:
      'https://raw.githubusercontent.com/tekdi/tekdi.github.io/refs/heads/main/static/files/vc-schemas/ubi/SportsParticipationCertificate.json',
    type: ['VerifiableCredential', 'sportsParticipationCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'sportsParticipationCertificate',
    tags: ['dev', 'sportsParticipation-certificate-credential'],
  },
  incomeCertificate: {
    schemaName: 'incomeCertificate',
    credIssuerId: process.env.INCOME_ISSUER_ID,
    credsSchemaId: process.env.INCOME_CRED_SCHEMA_ID,
    transformer: 'incomeCertificate',
    context:
      'https://raw.githubusercontent.com/tekdi/tekdi.github.io/refs/heads/main/static/files/vc-schemas/ubi/IncomeCertificate.json',
    type: ['VerifiableCredential', 'incomeCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'incomeCertificate',
    tags: ['dev', 'income-certificate-credential'],
  },
  janAadharCertificate: {
    schemaName: 'janAadharCertificate',
    credIssuerId: process.env.JAN_AADHAAR_ISSUER_ID,
    credsSchemaId: process.env.JAN_AADHAAR_CRED_SCHEMA_ID,
    transformer: 'janAadharCertificate',
    context:
      'https://raw.githubusercontent.com/tekdi/tekdi.github.io/refs/heads/main/static/files/vc-schemas/ubi/JanAadharCertificate.json',
    type: ['VerifiableCredential', 'JanAadharCertificate'],
    expirationDate: '2025-02-08T11:56:27.259Z',
    credentialSubjectType: 'JanAadharCertificate',
    tags: ['dev', 'jan-adhaar-certificate-credential'],
  },
};
