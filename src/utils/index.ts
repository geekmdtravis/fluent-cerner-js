/**
 * Compose an error message for a rejected XMLCclRequest.
 * @param req {XMLCclRequest} - The XMLCclRequest object which represents the request.
 * @param prg {string} - The program which was called.
 * @param params {string} - The parameters which were passed to the program.
 * @returns a string which represents the error message composed of the above parameters.
 */
export const composeXmlCclReqRejectMsg = (
  req: XMLCclRequest,
  prg: string,
  params: string
): string => {
  const { status, readyState, responseText } = req;
  return `error with status ${status} and readyState ${readyState} on ${prg} with params ${params} returning response text: ${responseText ||
    'no response text'}`;
};

/**
 * Process the response text from an XMLCclRequest for use in the `makeCclRequest` function.
 * @param responseText {string} - The response text from the XMLCclRequest.
 * @returns the response text if it is not an empty string, otherwise returns `undefined`.
 */
export const processXmlCclReqResponseText = (
  responseText: string
): string | undefined => {
  const rt = responseText.trim();
  return rt === '' ? undefined : rt;
};

/**
 * Check to see if the error reflects likely being outside of PowerChart.
 * @param e {Error} - The error to be checked.
 * @returns {boolean} - Returns `true` if the error is one of two cases that result
 * from being outside of Cerner PowerChart.
 */
export function outsideOfPowerChartError(e: unknown) {
  return (
    (e instanceof TypeError &&
      e.message === 'window.MPAGES_EVENT is not a function') ||
    (e instanceof TypeError &&
      e.message === 'window.XMLCclRequest is not a function') ||
    (e instanceof TypeError &&
      e.message === 'window.APPLINK is not a function') ||
    (e instanceof TypeError &&
      e.message === 'window.DiscernObjectFactory is not a function')
  );
}

/**
 * A wrapper function for the `console.warn` function which logs a warning message.
 * @param eventString {string} - The event string to be logged.
 */
export const warnAttemptedOrdersOutsideOfPowerChart = (
  eventString: string
): void => {
  console.warn(`window.MPAGES_EVENT('ORDERS', '${eventString}')`);
};
