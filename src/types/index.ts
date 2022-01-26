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

/**
 * Options for a new order
 * @param {boolean} isRxOrder Marks the order order as a prescription. Is mutually exclusive from
 * isSatelliteOrder. Field will be set to false if left undefined; this resolves to 0 when built.
 * @param {boolean} isSatelliteOrder Moarks the order origination as satellite. Is mutually
 * exclusive from isRxOrder. Field will be set to false if left undefined; this resolves to 0 when built.
 * @param {number} orderSentenceId The optional Cerner order_sentence_id to be associated with
 * the new order. Field will be set to 0 if undefined.
 * @param {number} nomenclatureId The optional Cerner nomenclature_id to be associated with the
 * new order. Field will be set to 0 if undefined.
 * @param {boolean} skipInteractionCheckUntilSign Determines cerner sign-time interaction
 * checking. A value of true skips checking for interactions until orders are signed, false
 * will not. Field will be set to false if left undefined; this resolves to 0 when built.
 */
export type NewOrderOpts = {
  isRxOrder?: boolean;
  isSatelliteOrder?: boolean;
  orderSentenceId?: number;
  nomenclatureId?: number;
  skipInteractionCheckUntilSign?: boolean;
};
