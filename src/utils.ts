/**
 * Making Promise more convenient, without having to construct a promise every time
 */
export const promisify = (f: Function): Function => {
  return function() {
    const args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      args.push(function(err: object, result: object) {
        if (err) reject(err);
        else resolve(result);
      });
      f.apply(null, args);
    });
  };
};

export function isFunction(o: any): boolean {
  return typeof o === "function";
}

export function isString(o: any): boolean {
  return typeof o === "string";
}
