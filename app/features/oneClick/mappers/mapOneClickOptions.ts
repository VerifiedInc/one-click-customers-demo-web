import { CredentialRequestDto } from '@verifiedinc/core-types';

import { OneClickOptions } from '~/coreAPI.server';

import {
  OneClickContentTitle,
  OneClickContentVerificationOptions,
} from '~/features/customConfig/types';

export const mapOneClickOptions = (
  data?: Record<string, any>
): Partial<OneClickOptions> => {
  const mapCredentialRequests = (
    credentialRequest: CredentialRequestDto
  ): CredentialRequestDto => {
    const _data: CredentialRequestDto = {
      type: credentialRequest.type,
      mandatory: credentialRequest.mandatory,
      description: credentialRequest.description,
      allowUserInput: credentialRequest.allowUserInput,
    };

    if (!Array.isArray(credentialRequest.children)) {
      return _data;
    }

    return {
      ..._data,
      children: credentialRequest.children.map(mapCredentialRequests),
    };
  };

  const options: Partial<OneClickOptions> = {
    verificationOptions:
      data?.verificationOptions || OneClickContentVerificationOptions.OnlyCode,
    isHosted: data?.isHosted ?? true,
    content: {
      title: data?.content?.title || OneClickContentTitle.Signup,
      description: data?.content?.description,
    },
    redirectUrl: data?.redirectUrl,
  };

  if (data?.credentialRequests?.length) {
    options.credentialRequests = data.credentialRequests.map(
      mapCredentialRequests
    );
  }

  return options;
};
