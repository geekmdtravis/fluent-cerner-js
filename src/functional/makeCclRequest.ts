import {
  composeXmlCclReqRejectMsg,
  outsideOfPowerChartError,
  processXmlCclReqResponseText,
} from '../utils';

/**
 * A type which represents the input parameter for an `XmlCclRequest`, which is wrapped by `makeCclRequest`.
 * The parameters are passed in a string, and numbers and strings are interpreted within this string by
 * the presence of quotes within quotes (e.g. single within double or vice versa). By strongly typing
 * the CclCallParam we can ensure that the parameters are always passed in a way that properly represents
 * their type.
 * @param {'string'|'number'} type - The type of the parameter.
 * @param {string} param - The string representing the parameters value.
 */
export type CclCallParam = {
  type: 'string' | 'number';
  param: string | number;
};

/**
 * A type which represents the full set of data required to make an XmlCclRequest, which is wrapped
 * by `makeCclRequest`.
 * @param {string} prg - The name of the CCL program to run, e.g. 12_USER_DETAILS.
 * @param {boolean?} excludeMine - Determines whether or not to include the "MINE" parameter as the
 * first parameter in the CCL call. This defaults to `false`, and almost all cases will require
 * the "MINE" parameter to be included.
 * @param {CclCallParam[]} params - An array of CclCallParam objects, each of which represents
 * a strongly typed parameter.
 */
export type CclOpts = {
  prg: string;
  excludeMine?: boolean;
  params: Array<CclCallParam>;
};

/**
 * A type functioning as a convience wrapper for the ready state of an XmlCclRequest.
 */
export type XmlCclReadyState =
  | 'uninitialized'
  | 'loading'
  | 'loaded'
  | 'interactive'
  | 'completed';

/**
 * A type functioning as a convience wrapper for several status
 * codes, respresented as strings, that are returned by XMLCclRequest.
 */
export type XmlCclStatus =
  | 'success'
  | 'method not allowed'
  | 'invalid state'
  | 'non-fatal error'
  | 'memory error'
  | 'internal server exception'
  | 'status refers to unknown error';

/**
 * A type which represents the full set of data returned from an XmlCclRequest and important, formatted
 * metadata to help with debugging and error management. This is a generic type and data will represent
 * the type `T` which is the type or interface which represents the resolved data from the CCL request.
 */
export type CclRequestResponse<T> = {
  meta: {
    responseText: string;
    status: number;
    statusText: XmlCclStatus;
  };
  data: T | undefined;
};

const readyStateMap: Map<number, XmlCclReadyState> = new Map();
readyStateMap.set(0, 'uninitialized');
readyStateMap.set(1, 'loading');
readyStateMap.set(2, 'loaded');
readyStateMap.set(3, 'interactive');
readyStateMap.set(4, 'completed');

const statusCodeMap: Map<number, XmlCclStatus> = new Map();
statusCodeMap.set(200, 'success');
statusCodeMap.set(405, 'method not allowed');
statusCodeMap.set(409, 'invalid state');
statusCodeMap.set(492, 'non-fatal error');
statusCodeMap.set(493, 'memory error');
statusCodeMap.set(500, 'internal server exception');

/**
 * A generic wrapper function for `XMLCclRequest` which simplifies it's use. Of note,
 * use of this requires the `head` of the HTML document contain the following
 * `meta` tag: `<META content='XMLCCLREQUEST' name='discern'>` so that it might
 * interface with the appropriate COM object.
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
 *
 * @documentation - [XMLCclRequest](https://wiki.cerner.com/display/MPAGES/MPages+JavaScript+Reference#MPagesJavaScriptReference-XMLCclRequest)
 */
export function makeCclRequest<T>(
  opts: CclOpts
): Promise<CclRequestResponse<T>> {
  const { prg, excludeMine, params } = opts;
  const paramsList = processCclRequestParams(params, excludeMine || false);

  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore - From Powerchart context
      const request: XMLCclRequest = window.XMLCclRequest();

      request.open('GET', `${prg}`);
      request.send(paramsList);
      request.onreadystatechange = function() {
        const readyState = readyStateMap.get(request.readyState);

        if (readyState !== 'completed') return;

        const statusText = statusCodeMap.get(request.status);
        const responseText = processXmlCclReqResponseText(request.responseText);
        const data: T | undefined = responseText && JSON.parse(responseText);

        const response: CclRequestResponse<T> = {
          meta: {
            responseText: responseText || 'no response text',
            status: request.status,
            statusText: statusText || 'status refers to unknown error',
          },
          data,
        };

        if (statusText === 'success') {
          resolve(response);
        } else {
          reject(composeXmlCclReqRejectMsg(request, prg, paramsList));
        }
      };
    } catch (e) {
      if (outsideOfPowerChartError(e)) {
        reject((e as Error).message);
      } else {
        throw e;
      }
    }
  });
}

/**
 * A function which processes the CCL request parameters, converting them to a string compatible with an XmlCclRequest.
 * @param params {Array<CclCallParam>} An array of CclCallParam objects, each of which represents
 * @param excludeMine {boolean} Determines whether or not to include the "MINE" parameter as the
 * @returns {string} the XmlCclRequest compatible string.
 */
export function processCclRequestParams(
  params?: Array<CclCallParam>,
  excludeMine?: boolean
) {
  params = params || [];
  excludeMine = excludeMine || false;

  const updatedParams: Array<CclCallParam> = excludeMine
    ? [...params]
    : [{ type: 'string', param: 'MINE' }, ...params];

  const paramString = updatedParams
    .map(({ type, param }) => (type === 'string' ? `'${param}'` : param))
    .join(',');

  return paramString;
}
