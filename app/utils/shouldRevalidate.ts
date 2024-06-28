import { ShouldRevalidateFunction } from '@remix-run/react';

/**
 * This function revalidates on page change only, it ignores form submissions.
 */
export const shouldRevalidateDifferentPage: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
}) => {
  return currentUrl.pathname !== nextUrl.pathname;
};
