import { useRef } from 'react';
import { Box, Stack } from '@mui/material';

import { handleLoadImageToBase64FromFile } from '~/utils/image';

import { When } from '~/components/When';
import { ImageEncoded } from '~/features/request/shared/ImageEncoded';
import { useCredentialsDisplayItemValid } from '~/features/request/CredentialsDisplay/hooks';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';
import {
  DataFieldLabel,
  DataFieldLabelText,
  DataFieldLegend,
} from '~/features/request/DataField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

/**
 * This component manages the input of type Image.
 * @constructor
 */
export function DataFieldImageInput() {
  const { credentialDisplayInfo, handleChangeValueCredential } =
    useCredentialsDisplayItem();
  const { isValid, errorMessage } = useCredentialsDisplayItemValid();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Stack
      direction='column'
      width='100%'
      sx={{ flex: 1 }}
      {
        ...{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // 'data-sentry-mask':
          //   appContext.config.env.env === 'production' || undefined,
        }
      }
    >
      <DataFieldLabel label={<DataFieldLabelText />} />
      <Stack sx={{ position: 'relative', mt: 1 }}>
        <ImageEncoded src={credentialDisplayInfo.value} />
        <Stack
          direction='column'
          alignItems='center'
          justifyContent='center'
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <Box
            ref={inputRef}
            component='input'
            type='file'
            accept='image/*'
            onChange={async (event) => {
              const base64 = await handleLoadImageToBase64FromFile(event);
              if (!base64) return;
              handleChangeValueCredential(base64);
            }}
            sx={{ display: 'none', visibility: 'hidden' }}
          />
          <PrimaryButton
            type='button'
            onClick={() => inputRef.current?.click()}
            tabIndex={0}
          >
            {credentialDisplayInfo.value ? 'Change Image' : 'Add Image'}
          </PrimaryButton>
        </Stack>
      </Stack>
      <When value={isValid}>
        <When value={credentialDisplayInfo.credentialRequest?.description}>
          <DataFieldLegend>
            {credentialDisplayInfo.credentialRequest?.description}
          </DataFieldLegend>
        </When>
      </When>
      <When value={!isValid}>
        <DataFieldLegend error={!isValid}>{errorMessage}</DataFieldLegend>
      </When>
    </Stack>
  );
}
