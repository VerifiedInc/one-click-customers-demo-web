import { useSearchParams } from '@remix-run/react';

// Returns true if one-click and non-hosted is enabled
export function useIsOneClickNonHosted() {
  const [searchParams] = useSearchParams();
  const isHosted = searchParams.get('isHosted') !== 'false' ?? true;
  return !isHosted;
}
