import { PowerChartReturn } from '.';
import { outsideOfPowerChartError } from './utils';

/**
 * An input parameter for a CCL call. In internal testing, there were cases
 * where the CCL call would fail if the parameter was not wrapped in single
 * quotes. This type allows for the explicit definition of the type of the
 * parameter and the ability to wrap the parameter in single quotes if needed.
 * @param {'string'|'number'} type - The type of the parameter.
 * @param {string} param - The string representing the parameters value.
 */
export type CclCallParam = {
  type: 'string' | 'number';
  param: string | number;
};

/**
 * A text-based representation of the ready state of an XmlCclRequest.
 */
export type XmlCclReadyState =
  | 'uninitialized'
  | 'loading'
  | 'loaded'
  | 'interactive'
  | 'completed';

/**
 * A text-based representation of the status of an XmlCclRequest.
 */
export type XmlCclResult =
  | 'success'
  | 'method not allowed'
  | 'invalid state'
  | 'non-fatal error'
  | 'memory error'
  | 'internal server exception';

/**
 * A type which represents the full set of data returned from an XmlCclRequest
 * and important, formatted metadata to help with debugging and error management.
 * This is a generic type and data will represent the type `T` which is the
 * type or interface which represents the resolved data from the CCL request. The
 * names of the properties **are not** the same as the properties returned by the
 * XmlCclRequest, but are instead named to be more descriptive and to avoid
 * confusion with the native XmlCclRequest properties. A mapping of the native
 * properties to the properties of this type is as follows:
 *
 * | CclRequestResponse         | XmlCclRequest                                 |
 * |----------------------------|-----------------------------------------------|
 * | `code`                     | `status` code                                 |
 * | `result`                   | text representation of `status`               |
 * | `status`                   | text representation of `readyState`           |
 * | `details`                  | `statusText`                                  |
 * | `data`                     | parsed JSON of `responseText`                 |
 * | `__request`                | full request object returned by XMLCclReqeust |
 *
 * A description of the `CclRequestResponse` properties is as follows:
 * @param {number} code - The status code of the request. The values are
 * 200 (success), 405 (method not allowed), 409 (invalid state), 492 (non-fatal error),
 * 493 (memory error), and 500 (internal server exception). There may be other
 * values not listed by the Cerner documentation.
 * @param {XmlCclResult} result - The text representation of the status code. The values
 * are "success", "method not allowed", "invalid state", "non-fatal error", "memory error",
 * and "internal server exception". There may be other values not listed by the Cerner
 * documentation.
 * @param {XmlCclReadyState} status - The text representation of the ready state.
 * The values are "uninitialized", "loading", "loaded", "interactive", and "completed". The
 * underlying `readyState` numbers are 0, 1, 2, 3, and 4 respectively.
 * @param {string} details - The status text of the request.
 * @param {T} data - The parsed JSON from the response text.
 * @param {XMLCclRequest} __request - The full request object.
 */
export type CclRequestResponse<T> = PowerChartReturn & {
  code?: number;
  result?: XmlCclResult;
  status?: XmlCclReadyState;
  details?: string;
  data?: T;
  __request?: XMLCclRequest;
};

/**
 * Make AJAX calls to CCL end-points to retrieve data from the Cerner PowerChart
 * application. This function is a wrapper around the `XMLCclRequest` native Discern function
 * provided by the Cerner PowerChart application that greatly simplifies it's use. This
 * request is ultimately a wrapper around the `XMLHttpRequest` object and is only set to
 * handle GET requests.
 * @param prg {string} - the name of the CCL program to call.
 * @param params {Array<CclCallParam|string|number>} - an array of parameters to pass to the CCL program.
 * @param excludeMine {boolean} - (optional) determines whether or not to include the "MINE" parameter as the
 * first parameter in the CCL request's argument list.
 * @returns a `Promise` of type `CclRequestResponse<T>`.
 * @documentation - [XMLCclRequest](https://wiki.cerner.com/display/MPAGES/MPages+JavaScript+Reference#MPagesJavaScriptReference-XMLCclRequest)
 */
export async function makeCclRequestAsync<T>(
  prg: string,
  params: Array<CclCallParam | string | number>,
  excludeMine?: boolean
): Promise<CclRequestResponse<T>> {
  let res: CclRequestResponse<T> = {
    inPowerChart: true,
  };

  try {
    const req = await window.external.XMLCclRequest();
    req.open('GET', prg);
    req.send(formattedParams(params, excludeMine));
    req.onreadystatechange = function() {
      res.code = req.status;
      res.result = statusCodeMap.get(req.status);
      res.status = readyStateMap.get(req.readyState);
      res.details = req.statusText;
      res.data = parsedResponseText<T>(req.responseText);
      res.__request = req;
    };
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      res.inPowerChart = false;
    } else {
      throw e;
    }
  }

  return res;
}

/**
 * A function which processes the CCL request parameters, converting them to a string compatible with an XmlCclRequest.
 * @param params {Array<CclCallParam|string|number>} An array of CclCallParam objects when explicitly defining
 * type, or strings and numbers when implicitly defining type, each of which represents
 * @param excludeMine {boolean} Determines whether or not to include the "MINE" parameter as the
 * @returns {string} the XmlCclRequest compatible string.
 * @throws {TypeError} if an invalid parameter type is passed.
 */
export function formattedParams(
  params?: Array<CclCallParam | string | number>,
  excludeMine?: boolean
) {
  params = params || [];

  const processedParams: Array<CclCallParam> = params.map(param => {
    if (typeof param === 'string') {
      return { type: 'string', param: param };
    } else if (typeof param === 'number') {
      return { type: 'number', param: param };
    } else if (typeof param === 'object' && param.param && param.type) {
      return param;
    } else {
      throw new TypeError(
        `makeCclRequestAsync params can only be string, number, or CclCallParam`
      );
    }
  });

  const mineParam: CclCallParam = {
    type: 'string',
    param: 'MINE',
  };

  if (!excludeMine) {
    processedParams.unshift(mineParam);
  }
  const paramString = processedParams
    .map(({ type, param }) => (type === 'string' ? `'${param}'` : param))
    .join(',');

  return paramString;
}

function parsedResponseText<T>(responseText: string): T | undefined {
  try {
    return JSON.parse(responseText) as T;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return undefined;
    } else {
      throw e;
    }
  }
}

const readyStateMap: Map<number, XmlCclReadyState> = new Map();
readyStateMap.set(0, 'uninitialized');
readyStateMap.set(1, 'loading');
readyStateMap.set(2, 'loaded');
readyStateMap.set(3, 'interactive');
readyStateMap.set(4, 'completed');

const statusCodeMap: Map<number, XmlCclResult> = new Map();
statusCodeMap.set(200, 'success');
statusCodeMap.set(405, 'method not allowed');
statusCodeMap.set(409, 'invalid state');
statusCodeMap.set(492, 'non-fatal error');
statusCodeMap.set(493, 'memory error');
statusCodeMap.set(500, 'internal server exception');
