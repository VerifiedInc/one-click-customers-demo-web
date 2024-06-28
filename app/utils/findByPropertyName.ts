import _ from 'lodash';

/**
 * Finds value in an object that matches a property name.
 * @param object
 * @param propertyName
 */
export function findByPropertyName<Type>(
  object: Record<string, any>,
  propertyName: string
): Type | undefined {
  if (_.has(object, propertyName)) {
    return object[propertyName];
  }

  for (const key in object) {
    if (_.isArray(object[key])) {
      for (const item of object[key]) {
        const result = findByPropertyName(item, propertyName);
        if (result !== undefined) {
          return result as Type;
        }
      }
    }
    if (_.isPlainObject(object[key])) {
      const result = findByPropertyName(object[key], propertyName);
      if (result !== undefined) {
        return result as Type;
      }
    }
  }

  return undefined;
}
