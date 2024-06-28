import { PrismaClient } from '@prisma/client';
import { findStateByUuid } from 'prisma/state';

import { MappedState } from '~/features/state/types';
import { mapState } from '~/features/state/mappers/mapState';

export async function findState(
  prisma: PrismaClient,
  uuid?: string | undefined | null
): Promise<MappedState | null> {
  if (!uuid) return null;
  const state = await findStateByUuid(prisma, uuid);
  if (!state) return null;

  state.state = mapState(state.state) as unknown as string;

  return state as unknown as MappedState;
}
