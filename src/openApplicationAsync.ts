import { ApplinkReturn } from '.';
import { outsideOfPowerChartError } from './utils';

export type OpenApplicationMode =
  | 'by solution name'
  | 'by application object'
  | 'by file'
  | 'by url'
  | 'by executable';

export type OpenApplicationArgument = {
  argument: string;
  value: string | number;
};

/**
 * Attempts to open an application in the PowerChart application.
 * @param {OpenApplicationMode} mode - The mode in which to open the application. Valid options include:
 * - 'by solution name' - Open an application by the name of the solution.
 * - 'by application object' - Open an application by the name of the application object.
 * - 'by file' - Open an application by the name of the file.
 * - 'by url' - Open an we website in your **local** browser. This requires that your Citrix instance
 * be setup to handle server-to-client redirection.
 * - 'by executable' - Open an application by the name of the executable.
 * @param {string} target - The target of the application to open. The target can be
 * a solution name, application object name, file name, URL, or executable name.
 * @param {Array<OpenApplicationArgument>} [args] - An array of arguments to pass to the application.
 * Arguments contain the properties: `argument` and `value`. The `argument` property is the name of the
 * argument to pass to the application. The `value` property is the value of the argument to pass to the
 * application.
 * @resolves `AppLinkReturn`
 * @throws If the mode is 'by solution name' or 'by application object' and the `args` parameter is undefined.
 * @throws If the mode is unsupported (invalid).
 */
export async function openApplicationAsync(
  mode: OpenApplicationMode,
  target: string,
  args?: Array<OpenApplicationArgument>
): Promise<ApplinkReturn> {
  const retVal: ApplinkReturn = {
    inPowerChart: true,
    eventString: '',
    badInput: false,
  };

  if (mode === 'by solution name' && !args) {
    throw new Error(
      "openApplicationAsync: 'by solution name' mode requires arguments"
    );
  }
  if (mode === 'by application object' && !args) {
    throw new Error(
      "openApplicationAsync: 'by application object' mode requires arguments"
    );
  }
  const argString = generateOpenApplicationArgumentString(args || []);

  const modeValue = modeMap.get(mode);

  if (modeValue === undefined) {
    throw new Error('openApplicationAsync: invalid mode');
  }

  retVal.eventString = argString;

  try {
    const response = await window.APPLINK(modeValue, target, argString);

    retVal.badInput = response === null ? true : false;
  } catch (e) {
    if (outsideOfPowerChartError(e)) {
      retVal.inPowerChart = false;
    } else {
      throw e;
    }
  }
  return retVal;
}

export function generateOpenApplicationArgumentString(
  args: Array<OpenApplicationArgument>
) {
  return args
    .map(({ argument: arg, value }) => {
      const isOrgLevel = /organizertab/i.test(arg);
      const isTab = /firsttab/i.test(arg) || /organizertab/i.test(arg);
      return `/${arg}=${isTab ? '^' : ''}${value}${
        isTab && !isOrgLevel ? '+' : ''
      }${isTab ? '^' : ''}`;
    })
    .join(' ')
    .toUpperCase();
}

const modeMap = new Map<OpenApplicationMode, 0 | 1 | 100>();
modeMap.set('by solution name', 0);
modeMap.set('by application object', 1);
modeMap.set('by file', 100);
modeMap.set('by url', 100);
modeMap.set('by executable', 100);
