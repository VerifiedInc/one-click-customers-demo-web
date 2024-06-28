import { Box, SxProps } from '@mui/material';

// import { DataFieldCheckbox } from '~/features/request/DataField/DataFieldCheckbox';
// import { useCredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItemContext';

/**
 * This component will render the left side of a data field,
 * rendering checkbox or nothing depending on the isSelectable field.
 * @constructor
 */
export function DataFieldLeftSide() {
  // const { isSelectable } = useCredentialsDisplayItem();
  const safeAreaStyle: SxProps = { pl: 1 };

  // if (!isSelectable) {
  // }

  return <Box sx={safeAreaStyle} />;
  // return <DataFieldCheckbox />;
}
