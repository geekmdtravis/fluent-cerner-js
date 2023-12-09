import { openApplicationAsync } from './openApplicationAsync';

describe('openApplicationAsync', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        APPLINK: undefined,
      },
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
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        APPLINK: jest
          .fn()
          .mockImplementation(
            (mode: 0 | 1 | 100, target: string, args: string) => {
              console.debug('APPLINK', mode, target, args);
              return Promise.resolve(null);
            }
          ),
      },
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
