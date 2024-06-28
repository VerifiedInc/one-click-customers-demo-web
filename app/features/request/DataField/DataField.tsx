import { PropsWithChildren } from 'react';
import { SxProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { TypographyPropsVariantOverrides } from '@mui/material/Typography/Typography';
import { OverridableStringUnion } from '@mui/types';

import {
  DataFieldGroup,
  DataFieldLabel,
  DataFieldValue,
} from '~/features/request/DataField';
import { When } from '~/components/When';

interface DataFieldProps extends PropsWithChildren {
  label?: string;
  variant?: OverridableStringUnion<
    'inherit' | Variant,
    TypographyPropsVariantOverrides
  >;
  sx?: SxProps;
}

/**
 * A component to display basic credential display, also should be used to display a section of label and value.
 * @param label
 * @param variant
 * @param children
 * @param sx
 * @constructor
 */
export function DataField({ label, variant, children, sx }: DataFieldProps) {
  return (
    <>
      <DataFieldGroup sx={sx}>
        <When value={label}>
          {(label) => <DataFieldLabel label={label} variant={variant} />}
        </When>
        <DataFieldValue>{children}</DataFieldValue>
      </DataFieldGroup>
    </>
  );
}
