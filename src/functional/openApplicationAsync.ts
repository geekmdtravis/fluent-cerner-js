import { ApplinkReturn } from '.';
import { outsideOfPowerChartError } from '../utils';

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
      "openApplicationAsync: 'executable name' mode requires arguments"
    );
  }
  if (mode === 'by application object' && !args) {
    throw new Error(
      "openApplicationAsync: 'application object' mode requires arguments"
    );
  }
  const argString = generateOpenApplicationArgumentString(args || []);

  const modeValue = modeMap.get(mode);

  if (modeValue === undefined) {
    throw new Error('openApplicationAsync: invalid mode');
  }

  retVal.eventString = argString;

  try {
    const response = await window.external.APPLINK(
      modeValue,
      target,
      argString
    );

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

(async () => {
  const args: Array<OpenApplicationArgument> = [
    {
      argument: 'PERSONID',
      value: 123456,
    },
    {
      argument: 'ENCNTRID',
      value: 123456,
    },
    {
      argument: 'FIRSTTAB',
      value: 'Orders',
    },
  ];
  await openApplicationAsync('by solution name', 'Powerchart.exe', args);
})();
