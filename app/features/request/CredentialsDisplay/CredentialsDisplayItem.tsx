import { useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { MandatoryEnum } from '@verifiedinc/core-types';

import { DataFieldPaper } from '~/features/request/DataField/DataFieldPaper';
import CredentialsDisplayItemProvider, {
  useCredentialsDisplayItem,
} from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import { hasValue } from '~/features/request/CredentialsDisplay/utils';

function CredentialsDisplayItemBody(props: any) {
  const { isRoot, credentialDisplayInfo, handleSelectCredential } =
    useCredentialsDisplayItem();
  const { current: handleSelectCredentialRef } = useRef(handleSelectCredential);

  // To manage checkbox state the credential must not be required, and input must be allowed.
  const canManageCheckState = useMemo(() => {
    const { credentialRequest } = credentialDisplayInfo;
    return (
      credentialRequest?.allowUserInput &&
      !(
        credentialRequest.required ||
        credentialRequest.mandatory === MandatoryEnum.YES ||
        credentialRequest.mandatory === MandatoryEnum.IF_AVAILABLE
      )
    );
  }, [credentialDisplayInfo]);

  const shouldCheckCredential = useMemo(
    () => hasValue(credentialDisplayInfo),
    [credentialDisplayInfo]
  );

  // Effect to automaticaly check/uncheck credential based on its value or children's ones.
  useEffect(() => {
    if (!canManageCheckState) return;
    handleSelectCredentialRef(shouldCheckCredential, false);
  }, [canManageCheckState, handleSelectCredentialRef, shouldCheckCredential]);

  if (isRoot) {
    return <DataFieldPaper {...props} />;
  }
  return <Box {...props} width='100%' />;
}

/**
 * Render DataFieldPaper to root level only components, and bind the credential display item context to it.
 * @param providerProps
 * @param props
 * @constructor
 */
export function CredentialsDisplayItem({ providerProps, ...props }: any) {
  return (
    <CredentialsDisplayItemProvider {...providerProps}>
      <CredentialsDisplayItemBody {...props} />
    </CredentialsDisplayItemProvider>
  );
}
