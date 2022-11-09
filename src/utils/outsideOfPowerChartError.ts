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
    (e instanceof ReferenceError && e.message === 'window is not defined')
  );
}
