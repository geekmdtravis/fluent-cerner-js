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
      // @ts-ignore - From Powerchart context
      const request: XMLCclRequest = new window.XMLCclRequest();

      request.open('GET', `${prg}`);
      request.send(paramsList);
      request.onreadystatechange = function() {
        const data: CclRequestResponse<T> = {
          meta: {
            responseText: request.responseText,
            status: request.status,
            statusText:
              statusCodeMap.get(request.status) ||
              'status refers to unknown error',
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

/**
 * Attempts to open a tab with the name given to the `tab` variable in a
 * patients chart given in the context of a given encounter.
 * @param pid The patients person id.
 * @param eid The patients encounter id.
 * @param tab The string which represents the tab to open
 * (case insensitive). Navigation will be made to the first
 * upper-level tab in the chart that that matches the `tab` string
 * If no match is found, then sub-tab names will be searched and
 * navigation made to the first sub-tab that matches
 * the `tab` string.  If no matches are found, no navigation will occur.
 * @param quickAdd {boolean} - If true, will attempt to open the window
 * in a quick add mode. E.g. if the Orders tab is connected to it will
 * attempt to launch the Add Order window so long as Enhanced Navigation is
 * supported by your installation.
 */
export function openPatientTab(
  pid: number,
  eid: number,
  tab: string,
  quickAdd: boolean
): void {
  const args = `/PERSONID=${pid} /ENCNTRID=${eid} /FIRSTTAB=^${tab.toUpperCase()}${
    quickAdd ? '+' : ''
  }^`;

  try {
    window.APPLINK(1, '$APP_APPNAME$', args);
  } catch (e) {
    if (e instanceof ReferenceError) {
      console.warn(
        `We're likely not inside PowerChart. The input given would be: '1, "$APP_NAME$", ${args}'`
      );
    } else {
      throw e;
    }
  }
}

const _dummyXMLCclRequest: XMLCclRequest = {
  options: {},
  readyState: 0,
  responseText: '',
  status: 0,
  statusText: '',
  sendFlag: false,
  errorFlag: false,
  responseBody: '',
  responseXML: '',
  async: false,
  requestBinding: '',
  requestText: '',
  blobIn: '',
  onreadystatechange: function(): void {
    throw new Error('Function not implemented.');
  },
  onerror: function(): void {
    throw new Error('Function not implemented.');
  },
  abort: function(): void {
    throw new Error('Function not implemented.');
  },
  getAllResponseHeaders: function(): string[] {
    throw new Error('Function not implemented.');
  },
  // @ts-ignore - dummy function
  getResponseHeader: function(header: string): string {
    throw new Error('Function not implemented.');
  },
  // @ts-ignore - dummy function
  open: function(method: string, url: string, async?: boolean): void {
    throw new Error('Function not implemented.');
  },
  // @ts-ignore - dummy function
  send: function(data: string): void {
    throw new Error('Function not implemented.');
  },
  // @ts-ignore - dummy function
  setRequestHeader: function(name: string, value: string): void {
    throw new Error('Function not implemented.');
  },
};
