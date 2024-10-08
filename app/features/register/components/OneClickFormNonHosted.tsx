import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { Box, Dialog, Typography } from '@mui/material';
import { red } from '@mui/material/colors';

import { phoneSchema } from '~/validations/phone.schema';
import { USDateSchema } from '~/validations/date.schema';
import { useBrand } from '~/hooks/useBrand';
import { useField } from '~/hooks/useField';

import PhoneInput from '~/components/PhoneInput';
import { DateInput } from '~/components/DateInput';

import { oneClickNonHostedSchema } from '~/validations/oneClickNonHosted.schema';
import { OneClickHeader } from '~/features/register/components/OneClickHeader';
import { OneClickPoweredBy } from '~/features/register/components/OneClickPoweredBy';
import { OneClickLegalText } from '~/features/register/components/OneClickLegalText';
import { OneClickPromptDialogContent } from './OneClickPromptDialogContent';
import { OneClickSMSDialogContent } from './OneClickSMSDialogContent';

export function OneClickFormNonHosted() {
  const brand = useBrand();

  const phone = useField({ name: 'phone', schema: phoneSchema });
  const birthDate = useField({
    name: 'birthDate',
    schema: USDateSchema,
  });

  const [searchParams] = useSearchParams();
  const verificationOptions =
    searchParams.get('verificationOptions') || 'only_code';

  const [count, setCount] = useState<number>(0);

  const fetcher = useFetcher();
  const isFetching = fetcher.state !== 'idle';
  const fetcherSubmit = fetcher.submit;
  const fetcherData = fetcher.data;
  const phoneFetcherData = fetcherData?.phone ?? null;
  const phoneRef = useRef<string | null>(fetcherData?.phone ?? null);
  const error = fetcherData?.error;
  const isSuccess = fetcherData?.success ?? false;

  const formRef = useRef<HTMLFormElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';

    const baseUrl = new URL(window.location.href);
    const baseSearchParams = new URLSearchParams(baseUrl.searchParams);
    const baseSearchParamsString = baseSearchParams.toString();
    const redirectUrl = new URL(
      baseUrl.origin +
        '/personal-information' +
        (baseSearchParamsString ? `?${baseSearchParamsString}` : '')
    );

    return redirectUrl.toString();
  }, []);

  const handleFieldChange =
    (field: ReturnType<typeof useField>) =>
    (
      event:
        | string
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { value: string } }
    ) => {
      let value = typeof event === 'string' ? event : event.target.value;

      // DateInput returns a timestamp string when the date is valid, otherwise an empty string.
      if (field.name === 'birthDate' && value) {
        value = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(Number(value));
      }

      field.change(value);

      const isFormValid = oneClickNonHostedSchema.safeParse({
        phone: phone.value,
        birthDate: birthDate.value,
        // Override the field that is being changed.
        [field.name]: value,
      }).success;

      // Short-circuit if is not valid or is already fetching
      if (!isFormValid || isFetching) return;

      // HACK-alert
      // phone input uses another input to hold original value,
      // as the form submits on change event of the masked input,
      // we have to wait the next tick to have the unmasked input value set on the form.
      setTimeout(() => {
        console.log('form is valid, fetching now...');
        fetcherSubmit(formRef.current, { method: 'post' });
      }, 100);
    };

  // Reset form when is not fetching
  useEffect(() => {
    if (isFetching) return;
    // Reset phone and birth date to initial state when is not fetching
    phone.reset();
    birthDate.reset();
    setCount((prev) => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  // Set in session storage the verification options
  useEffect(() => {
    sessionStorage.setItem('verificationOptions', verificationOptions);
  }, [verificationOptions]);

  if (isSuccess) {
    console.log('response is successful', fetcherData);
    // Assign fone to ref so we can use it in the dialog without flikering when fetcherData is null.
    phoneRef.current = phoneFetcherData;
  }

  useEffect(() => {
    phoneInputRef.current?.focus({ preventScroll: true });
    // Hack alert: scroll to top after focusing the phone input to prevent the page from scrolling to the bottom.
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      1
    );
  }, []);

  return (
    <>
      <Typography variant='h1' mt={0} align='center'>
        {brand.name}
      </Typography>
      <OneClickHeader />
      <fetcher.Form
        ref={formRef}
        method='post'
        style={{ width: '100%' }}
        key={count}
      >
        <Box
          component='section'
          display='flex'
          flexDirection='column'
          alignItems='center'
          mt={1}
        >
          <input name='action' value='one-click' hidden readOnly />
          <input name='apiKey' value={brand.apiKey} hidden readOnly />
          <input name='redirectUrl' value={redirectUrl} hidden readOnly />
          <PhoneInput
            name='phone'
            label='Phone'
            autoFocus
            value={phone.value}
            onChange={handleFieldChange(phone)}
            error={phone.touched && !!phone.error}
            helperText={(phone.touched && phone.error) || undefined}
            disabled={isFetching}
            inputProps={{ placeholder: undefined }}
          />
          <Box sx={{ width: '100%', mt: 2 }}>
            <DateInput
              name='birthDate'
              label='Birthday'
              value={birthDate.value}
              onChange={handleFieldChange(birthDate)}
              error={birthDate.touched && !!birthDate.error}
              helperText={
                (birthDate.touched && birthDate.error) || 'MM/DD/YYYY'
              }
              disabled={isFetching}
              InputProps={{ autoComplete: 'bday' }}
            />
          </Box>
          {error && (
            <Typography variant='body2' sx={{ marginTop: 2 }} color={red[500]}>
              {error}
            </Typography>
          )}
        </Box>
      </fetcher.Form>
      <OneClickPoweredBy />
      <OneClickLegalText />

      <Dialog open={isSuccess && verificationOptions === 'only_link'}>
        <OneClickSMSDialogContent
          phone={phoneRef.current ?? ''}
          onRetryClick={() => {
            const formData = new FormData();
            formData.set('action', 'reset');
            fetcher.submit(formData, { method: 'post' });
          }}
        />
      </Dialog>

      <Dialog open={isSuccess && verificationOptions !== 'only_link'}>
        <OneClickPromptDialogContent
          phone={phoneRef.current ?? ''}
          oneClickUrl={fetcherData?.url ?? ''}
          onRetryClick={() => {
            const formData = new FormData();
            formData.set('action', 'reset');
            fetcher.submit(formData, { method: 'post' });
          }}
        />
      </Dialog>
    </>
  );
}
