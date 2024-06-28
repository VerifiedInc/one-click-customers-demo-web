import { useField } from './useField';

type MaskFieldOptions = {
  options: {
    mask?: string;
    unmask?: boolean;
    definitions?: {
      [Mask in string]: {
        mask: string;
        displayChar: string;
      };
    };
    inputMode?: string;
  };
  field: Parameters<typeof useField>[0];
};

export function useMaskField({ options, field }: MaskFieldOptions) {
  const _field = useField(field);
  const proxyChangeEvent = (event: any) => {
    _field.change(event);
  };
  return {
    ..._field,
    change: proxyChangeEvent,
    maskOptions: options,
    isMaskedField: true,
  };
}
