/**
 * Renames any property matching old name.
 * @param record
 * @param oldName Old name to match in the search.
 * @param newName New name to replace.
 */
export function renameProperty<T = unknown>(
  record: T,
  oldName: string,
  newName: string
): T {
  // We just want to manipulate object and array type.
  if (typeof record !== 'object' || record === null) {
    return record;
  }

  // Apply down to indexes records.
  if (Array.isArray(record)) {
    for (let i = 0; i < record.length; i++) {
      record[i] = renameProperty(record[i], oldName, newName);
    }
  } else {
    const newRecord = {} as any;
    for (const key in record) {
      if (key === oldName) {
        // Apply down to indexes records.
        newRecord[newName] = renameProperty(record[key], oldName, newName);
      } else {
        // Apply down to indexes records.
        newRecord[key] = renameProperty(record[key], oldName, newName);
      }
    }
    return newRecord;
  }

  return record;
}
