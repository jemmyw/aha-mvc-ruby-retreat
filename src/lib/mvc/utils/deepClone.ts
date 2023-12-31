export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  let copy: any;

  if (Array.isArray(obj)) {
    copy = [];
  } else if (obj instanceof Set) {
    copy = new Set();
  } else if (obj instanceof Map) {
    copy = new Map();
  } else {
    copy = Object.create(Object.getPrototypeOf(obj));
  }

  if (obj instanceof Set) {
    obj.forEach((val) => copy.add(deepClone(val)));
  } else if (obj instanceof Map) {
    obj.forEach((val, key) => copy.set(deepClone(key), deepClone(val)));
  } else {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepClone(obj[key]);
      }
    }
  }

  return copy as T;
}
