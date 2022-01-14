import { CclOpts } from '../types';

/**
 * A generic wrapper function for `XMLCclRequest` which simplifies it's use.
 * @param {CclOpts} opts - Required options for the CCL request.
 * @returns a promise of type `T` where `T` is the type or interface which represents
 * the resolved data from the CCL request.
 * @resolves the resolved data of type `T` from the CCL request.
 * @rejects with an error message if the CCL request fails.
 */
export function makeCclRequest<T>(opts: CclOpts): Promise<T> {
  const { prg, excludeMine, params } = opts;
  const paramsList =
    (excludeMine ? '' : "'MINE',") +
    params
      .map(({ type, param }) => (type === 'string' ? `'${param}'` : param))
      .join(',');
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore - exists in PowerChart
      const request = new window.XMLCclRequest();
      request.open('GET', `${prg}`);
      request.send(paramsList);
      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
          const data: T = JSON.parse(request.responseText);
          resolve(data);
        } else {
          reject(
            `error with status ${request.status} and readyState ${request.readyState} on ${prg} with params ${paramsList}`
          );
        }
      };
    } catch (e) {
      if (e instanceof ReferenceError) {
        reject(
          `We're likely not inside PowerChart. We cannot send request: "${paramsList}" to "${prg}"`
        );
      } else {
        throw e;
      }
    }
  });
}
