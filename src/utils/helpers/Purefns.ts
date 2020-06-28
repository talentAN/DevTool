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
