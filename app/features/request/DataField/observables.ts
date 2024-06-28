import { createObservable } from '~/utils/observers';

import { Address } from '~/features/request/DataField/types';

export const changeValue = createObservable<{ type: string; value: any }>();
