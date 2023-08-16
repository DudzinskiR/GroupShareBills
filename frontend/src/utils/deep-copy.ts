const deepCopy = (obj: any, clones = new WeakMap()): any => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (clones.has(obj)) {
    return clones.get(obj);
  }

  if (Array.isArray(obj)) {
    const newArr: any[] = [];
    clones.set(obj, newArr);
    for (const item of obj) {
      newArr.push(deepCopy(item, clones));
    }
    return newArr;
  }

  if (obj instanceof Date) {
    const newDate = new Date(obj);
    clones.set(obj, newDate);
    return newDate;
  }

  const newObj: Record<string, any> = {};
  clones.set(obj, newObj);
  for (const key in obj) {
    newObj[key] = deepCopy(obj[key], clones);
  }

  return newObj;
};

export default deepCopy;
