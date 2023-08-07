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
    statusDetails: string;
    prgName: string;
    prgArguments: string;
    __original: XMLCclRequest | null;
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
 * A generic wrapper function for `XMLCclRequest`, which is a native function
 * in Cerner's Discern platform, which simplifies it's use.
 * @param {CclOpts} opts - Required options for the CCL request.
 * @returns a `Promise` of type `CclRequestResponse<T>` where `T` is the type
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
export async function makeCclRequestAsync<T>(
  opts: CclOpts
): Promise<CclRequestResponse<T>> {
  const { prg, excludeMine, params } = opts;
  const paramsList = processCclRequestParams(params, excludeMine || false);

  let response: CclRequestResponse<T> | undefined = undefined;
  try {
    const request = await window.external.XMLCclRequest();

    request.open('GET', `${prg}`);
    request.send(paramsList);
    request.onreadystatechange = function() {
      const _response = handleReadyStateChange<T>(request);

      if (!_response) return;

      if (_response.meta.statusText !== 'success') {
        throw new Error(composeXmlCclReqRejectMsg(request, prg, paramsList));
      }
      response = _response;
    };
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      throw new Error((e as Error).message);
    } else {
      throw e;
    }
  }

  if (!response) {
    throw new Error(
      'An unexpected error occurred and the CCL response returned undefined.'
    );
  }

  return response;
}

/**
 * A function which processes the CCL request parameters, converting them to a string compatible with an XmlCclRequest.
 * @param params {Array<CclCallParam|string|number>} An array of CclCallParam objects when explicitly defining
 * type, or strings and numbers when implicitly defining type, each of which represents
 * @param excludeMine {boolean} Determines whether or not to include the "MINE" parameter as the
 * @returns {string} the XmlCclRequest compatible string.
 */
export function processCclRequestParams(
  params?: Array<CclCallParam | string | number>,
  excludeMine?: boolean
) {
  params = params || [];
  excludeMine = excludeMine || false;

  const processedParams: Array<CclCallParam> = params.map(param => {
    if (typeof param === 'string') {
      return { type: 'string', param: param };
    } else if (typeof param === 'number') {
      return { type: 'number', param: param };
    } else if (typeof param === 'object' && param.param && param.type) {
      return param;
    } else {
      throw new Error(
        `Invalid parameter type. Expected string, number, or a valid CclCallParam object. Received ${typeof param}`
      );
    }
  });

  const finalParams = excludeMine
    ? [...processedParams]
    : [{ type: 'string', param: 'MINE' }, ...processedParams];

  const paramString = finalParams
    .map(({ type, param }) => (type === 'string' ? `'${param}'` : param))
    .join(',');

  return paramString;
}

/**
 * A function which processes the response text from an XmlCclRequest, mapping
 * the contents to a JavaScript object of type `CclRequestResponse<T>`.
 * @param request {XMLCclRequest} - the request object that is updated when the
 * state of the request changes. Contents are not guaranteed to be valid until
 * the request is in the "completed" state.
 * @returns an object of type `CclRequestResponse<T>` where `T` is the type.
 */
function handleReadyStateChange<T>(
  request: XMLCclRequest
): CclRequestResponse<T> {
  // const readyState = readyStateMap.get(request.readyState);

  const statusText = statusCodeMap.get(request.status);
  const responseText = processXmlCclReqResponseText(request.responseText);
  const data: T | undefined = responseText && JSON.parse(responseText);

  return {
    meta: {
      responseText: responseText || 'no response text',
      status: request.status,
      statusText: statusText || 'status refers to unknown error',
      statusDetails: request.statusText,
      prgName: request.url,
      prgArguments: request.requestText,
      __original: request,
    },
    data,
  };
}
