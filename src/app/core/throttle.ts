export function throttle(func: Function, delay: number) {
  let inThrottle = false; // Flag to track if the function is currently throttled

  // @ts-ignore
  return function (...args) {
    if (inThrottle) {
      return; // Ignore calls that happen within the delay period
    }

    // Execute the function and set the throttle flag
    // @ts-ignore
    func.apply(this, args);
    inThrottle = true;

    // After the delay, reset the flag to allow the next call
    setTimeout(() => {
      inThrottle = false;
    }, delay);
  };
}
