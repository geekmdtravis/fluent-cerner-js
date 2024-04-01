/**
 * Check to see if the error reflects likely being outside of PowerChart.
 * @param e {Error} - The error to be checked.
 * @returns {boolean} - Returns `true` if the error is one of two cases that result
 * from being outside of Cerner PowerChart.
 */
export function outsideOfPowerChartError(e: unknown) {
  return (
    e instanceof TypeError &&
    /(MPAGES_EVENT|XMLCclRequest|APPLINK|DiscernObjectFactory) is not a function/i.test(
      e.message
    )
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
