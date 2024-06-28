import { Box, Skeleton, Stack, SxProps } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

import { path } from '~/routes/credentialImageSearch';
import { fetchEnhanced } from '~/utils/fetch';

import { When } from '~/components/When';
import Image from '~/components/Image';

type ImageEncodedProps = {
  src: string;
  alt?: string;
  sx?: SxProps;
};

/**
 * Image component that decodes the same by extracting our
 * @param props
 * @constructor
 */
export function ImageEncoded(props: ImageEncodedProps) {
  // We fetch the data contained in the src prop to retrieve the base64 and populate image component.
  const { data: image, isSuccess } = useQuery({
    queryKey: [props.src],
    queryFn: async () => {
      // Return undefined when there is no source.
      if (!props.src) return null;

      // Do not need to fetch base64 source.
      if (props.src.includes('data:image/')) return props.src;

      const response = await fetchEnhanced(path(props.src));
      const { data } = await response.json();
      if (!data) throw new Error(`Image not found. source: ${props.src}`);
      return data;
    },
    enabled: !!props.src,
  });

  const imageStyle: SxProps = {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  };
  const skeletonStyle: SxProps = {
    ...imageStyle,
    width: '100%',
    aspectRatio: 1,
  };

  return (
    <Stack sx={props.sx}>
      <When value={!image && props.src}>
        <Box className='image-encoded-skeleton-container' sx={skeletonStyle}>
          <Skeleton variant='rounded' width='100%' height='100%' />
        </Box>
      </When>
      <When value={!image && !props.src}>
        <ImageIcon
          sx={{
            ...skeletonStyle,
            height: '100%',
            fontSize: undefined,
            color: 'grey.300',
          }}
        />
      </When>
      <When value={image}>
        {(image) => <Image src={image} alt={props.alt ?? ''} sx={imageStyle} />}
      </When>
    </Stack>
  );
}
