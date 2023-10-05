import { openPatientTabAsync } from './openPatientTab';

describe('openPatientTab', () => {
  test('returns an ApplinkReturn object', async () => {
    const result = await openPatientTabAsync(0, 1, 'Tab Name');
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('eventString');
    expect(result).toHaveProperty('inPowerChart');
    expect(result).toHaveProperty('badInput');
  });
  test('returns inPowerChart as false when outside of Powerchart', async () => {
    const { inPowerChart } = await openPatientTabAsync(0, 1, 'Tab Name');
    expect(inPowerChart).toBe(false);
  });
  test('returns an appropriately formatted eventString without quickadd', async () => {
    const { eventString } = await openPatientTabAsync(0, 1, 'Tab Name');
    expect(eventString).toBe(`/PERSONID=0 /ENCNTRID=1 /FIRSTTAB=^TAB NAME+^`);
  });
  test('returns an appropriately formatted eventString with quickadd', async () => {
    const { eventString } = await openPatientTabAsync(0, 1, 'Tab Name');
    expect(eventString).toBe(`/PERSONID=0 /ENCNTRID=1 /FIRSTTAB=^TAB NAME+^`);
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

    const { badInput } = await openPatientTabAsync(0, 1, 'Tab Name');
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

    const { badInput } = await openPatientTabAsync(0, 1, 'Tab Name');
    expect(badInput).toBe(true);
  });
  test('throws an error when the error type is not one expected to be generated as an "out-of-powerchart" error.', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        APPLINK: jest
          .fn()
          .mockImplementation(async function(
            a: string,
            b: string
          ): Promise<Error> {
            console.debug(`a: ${a}, b: ${b}`);
            return Promise.reject(new Error('unexpected error'));
          }),
      },
    });

    try {
      await openPatientTabAsync(0, 1, 'Tab Name');
    } catch (e) {
      expect((e as Error).message).toBe('unexpected error');
    }
  });
});
