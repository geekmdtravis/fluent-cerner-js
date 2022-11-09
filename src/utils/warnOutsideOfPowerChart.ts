export const warnOutsideOfPowerChart = (eventString: string): void => {
  console.warn(`window.MPAGES_EVENT('ORDERS', '${eventString}')`);
};
