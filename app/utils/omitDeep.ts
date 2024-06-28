import _ from 'lodash';

/**
 * Recursively omits specified properties from an object.
 *
 * @param obj - The input object from which properties will be omitted.
 * @param propertiesToOmit - An array of property names to omit from the object.
 * @param replacer - An optional function to replace values during the omit operation.
 *   It takes a property key and its corresponding value as parameters.
 *   If provided, the function should return the replacement value.
 *
 * @returns A new object with specified properties omitted.
 */
export function deepOmit<T extends Record<string, any>>(
  obj: T,
  propertiesToOmit: string[],
  replacer?: (key: string, value: any) => any
): Record<string, unknown> {
  return _.transform(
    obj,
    (result: Record<string, unknown>, value: unknown, key: string) => {
      if (_.isObject(value) && !_.isArray(value)) {
        result[key] = deepOmit(value, propertiesToOmit, replacer);
      } else if (!propertiesToOmit.includes(key)) {
        result[key] = replacer ? replacer(key, value) : value;
      }
    }
  );
}
