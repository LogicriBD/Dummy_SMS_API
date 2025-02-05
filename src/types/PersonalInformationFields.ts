export const PersonalInformationFields = {
  phone: 'bKash Wallet Number',
  nid: 'NID',
  name: 'Name',
  fatherName: 'Father Name',
  motherName: 'Mother Name',
  dateOfBirth: 'Date of Birth',
  gender: 'Gender',
  guardianName: 'Guardian Name',
  guardianRelation: 'Guardian Relation',
  division: 'Division',
  district: 'District',
  upazila: 'Upazila',
  union: 'Union',
  ward: 'Ward',
  mahalla: 'Mahalla',
  requestedAmount: 'Amount',
};

export type PersonalInformationFieldsType = {
  phone: string;
  nid: string;
  name: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  guardianName: string;
  guardianRelation: string;
  division: string;
  district: string;
  requestedAmount: string;
};

export type PersonalInformationFields = keyof PersonalInformationFieldsType;
