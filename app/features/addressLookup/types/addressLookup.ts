export type ZipCodeLookupResponse = {
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

export interface AddressLookup {
  zipCodeLookup(zipcode: string): Promise<ZipCodeLookupResponse>;
}
