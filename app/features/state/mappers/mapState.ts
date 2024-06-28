import { JSONParseOrNull } from '~/utils/json';

import { MappedState } from '~/features/state/types';

export function mapState(state?: string): MappedState | null {
  if (!state) return null;
  const _state = JSONParseOrNull(state);
  if (!_state) return null;
  return _state as MappedState;
}
