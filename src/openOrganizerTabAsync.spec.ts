import { openOrganizerTabAsync } from '.';

describe('openOrganizerTab', () => {
  test('returns an MPageEventReturn object', async () => {
    const result = await openOrganizerTabAsync('Tab Name');
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('eventString');
    expect(result).toHaveProperty('inPowerChart');
  });
  test('returns inPowerChart as false when outside of Powerchart', async () => {
    const { inPowerChart } = await openOrganizerTabAsync('Tab Name');
    expect(inPowerChart).toBe(false);
  });
  test('returns an appropriately formatted eventString', async () => {
    const { eventString } = await openOrganizerTabAsync('Tab Name');
    expect(eventString).toBe(`/ORGANIZERTAB=^TAB NAME^`);
  });
  test('badInput returns false if response is anything other than null', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        APPLINK: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<null | ''> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve => resolve(''));
          }),
      },
    });

    const { badInput } = await openOrganizerTabAsync('Tab Name');
    expect(badInput).toBe(false);
  });
  test('badInput returns true if response is null', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        APPLINK: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<null | ''> {
            console.debug(`a: ${a}, b: ${b}`);
            return new Promise(resolve => resolve(null));
          }),
      },
    });

    const { badInput } = await openOrganizerTabAsync('Tab Name');
    expect(badInput).toBe(true);
  });
  test('throws an error when the error type is not one expected to be generated as an "out-of-powerchart" error.', async () => {
    Object.defineProperty(window.external, 'APPLINK', {
      writable: true,
      value: jest
        .fn()
        .mockImplementation(async function(
          a: string,
          b: string
        ): Promise<Error> {
          console.debug(`a: ${a}, b: ${b}`);
          throw new Error('unexpected error');
        }),
    });

    await expect(openOrganizerTabAsync('Tab Name')).rejects.toThrow(Error);
  });
});
