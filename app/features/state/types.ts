import { CustomDemoForm } from '~/features/customConfig/validators/form';

export type MappedState = {
  uuid: string;
  state: CustomDemoForm;
  secondaryEnvBrand: string;
  primaryEnvBrand: string;
  createdAt: Date;
  updatedAt: Date;
};
