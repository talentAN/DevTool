export function debounce(fn: Function) {
  let timeout: any;
  return function () {
    const args = [...arguments];
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(null, args);
    }, 50);
  };
}

export function sortArr(arr: any[], keys: string[] = []) {
  if (keys.length === 0) {
    return arr.sort();
  }
  return arr.sort((a: any, b: any) => {
    let res: number = NaN;
    let i = 0;
    while (res !== -1 && res !== 1) {
      let key = keys[i];
      res = a[key] === b[key] ? res : a[key] > b[key] ? -1 : 1;
    }
    return res;
  });
}
