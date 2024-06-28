import { isReal } from '~/features/environment/helpers/isReal';
import { isDummy } from '~/features/environment/helpers/isDummy';

type Real<T> = T;
type Dummy<T> = T;
type Fallback<T> = T;
type Either<T> = [Real<T>, Dummy<T>] | [Real<T>, Dummy<T>, Fallback<T>];

export function ifEnv<T>(
  env: string | undefined | null,
  either: Either<T>
): T | undefined {
  // Fallback
  if (!env) return either[2];

  // Real
  if (isReal(env)) {
    return either[0];
  }

  // Dummy
  if (isDummy(env)) {
    return either[1];
  }

  // Fallback
  return either?.[2];
}
