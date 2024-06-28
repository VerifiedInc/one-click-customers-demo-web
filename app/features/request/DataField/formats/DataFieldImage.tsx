import { Stack, SxProps } from '@mui/material';

import { When } from '~/components/When';
import { ImageEncoded } from '~/features/request/shared/ImageEncoded';
import { DataFieldLabel } from '~/features/request/DataField/DataFieldLabel';
import { DataFieldLabelText } from '~/features/request/DataField/DataFieldLabelText';
import { DataFieldLegend } from '~/features/request/DataField/DataFieldLegend';
import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

type DataFieldImageProps = {
  hasMultipleInstances: boolean;
};

/**
 * This component is responsible to render the credential of type Image.
 * @constructor
 */
export function DataFieldImage(props: DataFieldImageProps) {
  const { credentialDisplayInfo } = useCredentialsDisplayItem();
  const containerStyle: SxProps = { flex: 1 };
  return (
    <Stack
      direction='column'
      sx={containerStyle}
      {
        ...{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // 'data-sentry-mask':
          //   appContext.config.env.env === 'production' || undefined,
        }
      }
    >
      <When value={!props.hasMultipleInstances}>
        <DataFieldLabel label={<DataFieldLabelText />} />
      </When>
      <ImageEncoded
        src={credentialDisplayInfo.value}
        alt={credentialDisplayInfo.label}
        sx={{ mt: 1 }}
      />
      <When value={credentialDisplayInfo.credentialRequest?.description}>
        {(description) => <DataFieldLegend>{description}</DataFieldLegend>}
      </When>
    </Stack>
  );
}
