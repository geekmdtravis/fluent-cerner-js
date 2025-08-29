import {
  generateOpenApplicationArgumentString,
  OpenApplicationArgument,
  openApplicationAsync,
} from './openApplicationAsync';

describe('openApplicationAsync', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'APPLINK', {
      writable: true,
      value: undefined,
    });
  });

  it("should throw an error if mode is 'by solution name' and args is undefined", async () => {
    await expect(
      openApplicationAsync('by solution name', 'target')
    ).rejects.toThrow(Error);
  });
  it("should throw an error if mode is 'by application object' and args is undefined", async () => {
    await expect(
      openApplicationAsync('by application object', 'target')
    ).rejects.toThrow(Error);
  });
  it('should throw an error if mode is invalid', async () => {
    // @ts-ignore
    await expect(openApplicationAsync('invalid', 'target')).rejects.toThrow(
      Error
    );
  });
  it("returns 'true' if the function is run from inside of PowerChart", async () => {
    Object.defineProperty(window, 'APPLINK', {
      writable: true,
      value: jest
        .fn()
        .mockImplementation(
          (mode: 0 | 1 | 100, target: string, args: string) => {
            console.debug('APPLINK', mode, target, args);
            return Promise.resolve(null);
          }
        ),
    });
    const { inPowerChart } = await openApplicationAsync(
      'by solution name',
      'target',
      [{ argument: 'arg', value: 'value' }]
    );
    expect(inPowerChart).toBe(true);
  });
  it("returns 'false' if the function is run from outside of PowerChart", async () => {
    const { inPowerChart } = await openApplicationAsync(
      'by solution name',
      'target',
      [{ argument: 'arg', value: 'value' }]
    );
    expect(inPowerChart).toBe(false);
  });
});

describe('generateOpenApplicationArgumentString', () => {
  it('Generates a correct argument string', () => {
    const args: Array<OpenApplicationArgument> = [
      {
        argument: 'PERSONID',
        value: 1,
      },
      {
        argument: 'ENCNTRID',
        value: 123,
      },
      {
        argument: 'FIRSTTAB',
        value: 'Orders',
      },
    ];

    const argString = generateOpenApplicationArgumentString(args);
    expect(argString).toBe('/PERSONID=1 /ENCNTRID=123 /FIRSTTAB=^ORDERS^');
  });
  it('Generates a correct argument string with quick open', () => {
    const args: Array<OpenApplicationArgument> = [
      {
        argument: 'PERSONID',
        value: 1,
      },
      {
        argument: 'ENCNTRID',
        value: 123,
      },
      {
        argument: 'FIRSTTAB',
        value: 'Orders',
        quickOpen: true,
      },
    ];

    const argString = generateOpenApplicationArgumentString(args);
    expect(argString).toBe('/PERSONID=1 /ENCNTRID=123 /FIRSTTAB=^ORDERS+^');
  });
  it('Tabs string is surrounded by ^', () => {
    const args: Array<OpenApplicationArgument> = [
      {
        argument: 'FIRSTTAB',
        value: 'Orders',
      },
    ];

    const argString = generateOpenApplicationArgumentString(args);
    expect(argString).toBe('/FIRSTTAB=^ORDERS^');
  });
  it('Non-tab string is not surrounded by ^', () => {
    const args: Array<OpenApplicationArgument> = [
      {
        argument: 'PowerChart.exe',
        value: 'Random',
      },
    ];

    const argString = generateOpenApplicationArgumentString(args);
    expect(argString).toBe('/POWERCHART.EXE=RANDOM');
  });
});
