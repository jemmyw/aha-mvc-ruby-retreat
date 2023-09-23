/**
 * Object.keys but typesafe
 */
export function keys<T extends object>(object: T): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}
