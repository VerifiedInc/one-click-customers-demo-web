/**
 * This function map entries of format with indexed key e.g "FieldName[0]" or even "FieldName[0][1]"
 * allowing to return an array with children of values related to that group.
 * @param entries
 */
export function mapEntries<T = Record<string, any> | Record<string, any>[]>(
  entries: [string, any][]
): T {
  const result = {};

  entries.forEach(([key, value]) => {
    const [fieldName, ...indicesStr] = key.split(/\[|\]/gm).filter(Boolean);
    const indices = indicesStr.map(Number);
    let target: any = result;

    // We do not want to modify non-array fields.
    if (indices.length <= 0) {
      target[fieldName] = value;
      return;
    }

    for (const index of indices) {
      if (!target[fieldName]) {
        target[fieldName] = [];
      }
      if (!target[fieldName][index]) {
        target[fieldName][index] = {};
        target[fieldName][index] = {};
      }

      target = target[fieldName][index];
    }

    target.value = value;
  });

  return result as T;
}
