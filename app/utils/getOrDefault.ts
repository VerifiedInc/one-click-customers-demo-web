/**
 * Returns the value if it is not null or undefined, otherwise returns the default value.
 * @param value
 * @param defaultValue
 */
export function getOrDefault<T, D>(value: T, defaultValue: D): T | D {
  return value ?? defaultValue;
}
