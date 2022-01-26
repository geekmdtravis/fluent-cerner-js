import { CclOpts, CclRequestResponse } from '../types';

const statusCodeMap: Map<number, string> = new Map();
statusCodeMap.set(200, 'XMLCclRequest: Success');
statusCodeMap.set(405, 'XMLCclRequest: Method Not Allowed');
statusCodeMap.set(409, 'XMLCclRequest: Invalid State');
statusCodeMap.set(492, 'XMLCclRequest: Non-Fatal Error');
statusCodeMap.set(493, 'XMLCclRequest: Memory Error');
statusCodeMap.set(500, 'XMLCclRequest: Internal Server Exception');

/**
 * A generic wrapper function for `XMLCclRequest` which simplifies it's use.
 * @param {CclOpts} opts - Required options for the CCL request.
 * @returns a promise of type `CclRequestResponse<T>` where `T` is the type
 * or interface which represents the resolved data from the CCL request. If
 * no data are returned, that is an empty string, from the XMLCclRequest then
 * the `data` field will be set to `undefined`. The objects `meta` field
 * includes `responseText`, `status`, and `statusTest` fields.
 * @resolves the `CclRequestResponse<T>` where `T` is the type
 * or interface which represents the resolved data from the CCL request. If
 * no data are returned, that is an empty string, from the XMLCclRequest then
 * the `data` field will be set to `undefined`. The objects `meta` field
 * includes `responseText`, `status`, and `statusTest` fields.
 * @rejects with an error message if the CCL request fails.
 */
export function makeCclRequest<T>(
  opts: CclOpts
): Promise<CclRequestResponse<T>> {
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
        const data: CclRequestResponse<T> = {
          meta: {
            responseText: request.responseText,
            status: request.status,
            statusText:
              statusCodeMap.get(request.status) || 'XMLCclRequest: Unknown',
          },
          data:
            request.responseText === ''
              ? undefined
              : JSON.parse(request.responseText),
        };
        if (request.readyState === 4) {
          resolve(data);
        } else {
          reject(
            `error with status ${request.status} and readyState ${
              request.readyState
            } on ${prg} with params ${paramsList} returning response text: ${request.responseText ||
              'no response text'}`
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
