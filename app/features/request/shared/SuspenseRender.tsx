// This component is to be used with defer data.
// FIXME: It contains a ClientOnly to fix hydration issues with Emotion library,
// related issues: https://github.com/mui/material-ui/issues/35392 and https://github.com/mui/material-ui/issues/34170
import { ReactNode, Suspense } from 'react';
import { Await } from '@remix-run/react';

import { ClientOnly } from '~/components/ClientOnly';

type SuspenseRenderProps = {
  fallback?: ReactNode;
  data: PromiseLike<any>;
  children(resolvedData: any): ReactNode;
};

export function SuspenseRender({
  data,
  fallback,
  children,
}: SuspenseRenderProps) {
  return (
    <Suspense fallback={fallback}>
      <Await resolve={data} errorElement={fallback}>
        {(resolvedData) => (
          // We load the component only on client side since the server hydration happens in streaming.
          <ClientOnly fallback={fallback}>
            {() => children(resolvedData)}
          </ClientOnly>
        )}
      </Await>
    </Suspense>
  );
}
