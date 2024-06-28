import { MandatoryEnum } from '@verifiedinc/core-types';

// Check if the display info is strictly required by looking at the required or mandatory.
export const isRequiredCredentialDisplayInfo = (displayInfo: {
  required?: boolean;
  mandatory?: MandatoryEnum;
}) =>
  displayInfo.required ||
  displayInfo.mandatory === MandatoryEnum.YES ||
  displayInfo.mandatory === MandatoryEnum.IF_AVAILABLE;
