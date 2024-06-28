/**
 * Mapping of credential types to data keys
 * This can be determined from schemas, but it's much simpler this way
 */
// TODO - credential data key should come from the schema.
export const credentialTypesToKeysMap: Record<string, string> = {
  BirthDateCredential: 'birthDate',
  CityCredential: 'city',
  CountryCredential: 'country',
  Line1Credential: 'line1',
  Line2Credential: 'line2',
  StateCredential: 'state',
  ZipCodeCredential: 'zipCode',
  AmountCredential: 'amount',
  CurrencyCredential: 'currency',
  LivenessCredential: 'confidence',
  MatchCredential: 'confidence',
  AddressCredential: 'address',
  AnnualIncomeCredential: 'income',
  EmployerCredential: 'employer',
  FullNameCredential: 'fullName',
  EmploymentStartDateCredential: 'startDate',
  IncomeRangeCredential: 'incomeRange',
  TitleCredential: 'title',
  EmployerNameCredential: 'employer',
  DocumentBackImageCredential: 'documentBackImage',
  DocumentImageCredential: 'documentImage',
  DocumentNumberCredential: 'idNumber',
  DocumentTypeCredential: 'documentType',
  ExpirationDateCredential: 'expirationDate',
  IssuanceDateCredential: 'issuanceDate',
  DateOfBirthCredential: 'dateOfBirth',
  CountryResidenceCredential: 'country',
  EmailCredential: 'email',
  FacialImageCredential: 'image',
  FirstNameCredential: 'firstName',
  GenderCredential: 'gender',
  LastNameCredential: 'lastName',
  MiddleNameCredential: 'middleName',
  NationalityCredential: 'nationality',
  PhoneCredential: 'phone',
  SexCredential: 'sex',
  SsnCredential: 'ssn',
  GovernmentIdDocumentImageCredential: 'image',
  GovernmentIdTypeCredential: 'documentType',
  GovernmentIdDocumentBackImageCredential: 'image',
  GovernmentIdStateCredential: 'state',
  GovernmentIdNumberCredential: 'idNumber',
  GovernmentIdIssuanceDateCredential: 'issuanceDate',
  GovernmentIdExpirationDateCredential: 'expirationDate',
  IncomeCurrencyCredential: 'currency',
  AnnualIncomeRangeCredential: 'income',
};

export const getCredentialDataKey = (type: string): string => {
  return credentialTypesToKeysMap[type];
};
