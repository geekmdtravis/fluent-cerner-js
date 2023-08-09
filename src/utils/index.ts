import { PowerPlanMOEWOpts } from '../functional/submitPowerPlanOrders';

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
      e.message === 'window.external.MPAGES_EVENT is not a function') ||
    (e instanceof TypeError &&
      e.message === 'window.external.XMLCclRequest is not a function') ||
    (e instanceof TypeError &&
      e.message === 'window.external.APPLINK is not a function') ||
    (e instanceof TypeError &&
      e.message === 'window.external.DiscernObjectFactory is not a function')
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

/**
 * A utility function designed to calculate the bitmask for the input paramaters to be used with PowerChart's CreateMOEW() function.
 * @param {Array<PowerPlanMOEWOpts>} moewOpts - The plaintext parameters, passed as an array of strings, are optional and, if not provided, the values will default to the recommended values for the MOEW
 * with Power Plan support within createMOEWAsync(). If any values are provided, those will be the only values used.
 * @returns The bitmask numbers (dwCustomizeFlag, dwTabFlag, and dwTabDisplayOptionsFlag) to be used with PowerChart's CreateMOEW() function.
 */
export const calculateMOEWBitmask = (
  inputOpts: Array<PowerPlanMOEWOpts>
): {
  dwCustomizeFlag: number;
  dwTabFlag: number;
  dwTabDisplayOptionsFlag: number;
} => {
  // Initialize and calculate the CreateMOEW() parameters
  let CustomizeFlag: number = 0;
  let TabFlag: number = 0;
  let TabDisplayOptionsFlag: number = 0;

  // Calculate the bitmask parameters ultimately needed for CreateMOEW()
  inputOpts.forEach(option => {
    switch (option) {
      // Calculate the dwCustomizeFlagParamater
      case 'sign later':
        CustomizeFlag += 1;
        break;

      case 'read only':
        CustomizeFlag += 4;
        break;

      case 'allow power plans':
        CustomizeFlag += 8;
        break;

      case 'allow power plan doc':
        CustomizeFlag += 16;
        break;

      case 'allow only inpatient and outpatient orders':
        CustomizeFlag += 32;
        break;

      case 'show refresh and print buttons':
        CustomizeFlag += 128;
        break;

      case 'documented meds only':
        CustomizeFlag += 256;
        break;

      case 'hide med rec':
        CustomizeFlag += 512;
        break;

      case 'disallow EOL':
        CustomizeFlag += 1024;
        break;

      case 'hide demographics':
        CustomizeFlag += 2048;
        break;

      case 'add rx filter':
        CustomizeFlag += 4096;
        break;

      case 'disable auto search':
        CustomizeFlag += 8192;
        break;

      case 'allow regimen':
        CustomizeFlag += 16384;
        break;

      // Calculate the dwTabFlag parameter
      case 'customize order':
        TabFlag = 2;
        break;

      case 'customize meds':
        TabFlag = 3;
        break;

      // Calculate the dwTabDisplayOptionsFlag parameter
      case 'show nav tree':
        TabDisplayOptionsFlag += 1;
        break;

      case 'show diag and probs':
        TabDisplayOptionsFlag += 2;
        break;

      case 'show related res':
        TabDisplayOptionsFlag += 4;
        break;

      case 'show orders search':
        TabDisplayOptionsFlag += 8;
        break;

      case 'show order profile':
        TabDisplayOptionsFlag += 16;
        break;

      case 'show scratchpad':
        TabDisplayOptionsFlag += 32;
        break;

      case 'show list details':
        TabDisplayOptionsFlag += 64;
        break;
    }
  });

  return {
    dwCustomizeFlag: CustomizeFlag,
    dwTabFlag: TabFlag,
    dwTabDisplayOptionsFlag: TabDisplayOptionsFlag,
  };
};
