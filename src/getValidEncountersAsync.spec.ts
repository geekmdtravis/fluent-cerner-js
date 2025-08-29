import { getValidEncountersAsync } from './getValidEncountersAsync';

describe('getValidEncountersAsync', () => {
  it('returns an object with an empty array of encounter IDs if the user is not in PowerChart', async () => {
    const { inPowerChart, encounterIds } = await getValidEncountersAsync(1);
    expect(inPowerChart).toBe(false);
    expect(encounterIds).toEqual([]);
  });
  it('returns an accuate array of encounter IDs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetValidEncounters: async () => Promise.resolve('1,2,3'),
        })),
      },
    });
    const { inPowerChart, encounterIds } = await getValidEncountersAsync(1);
    expect(inPowerChart).toBe(true);
    expect(encounterIds).toEqual([1, 2, 3]);
  });
  it('returns an empty array if an empty string is resolved', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetValidEncounters: async () => Promise.resolve(' '),
        })),
      },
    });
    const { inPowerChart, encounterIds } = await getValidEncountersAsync(1);
    expect(inPowerChart).toBe(true);
    expect(encounterIds).toEqual([]);
  });
  it('logs a warning if a value is parsed and returns NaN, but value not added to array', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetValidEncounters: async () => Promise.resolve('1,2,3,abc'),
        })),
      },
    });
    const consoleWarn = spyOn(console, 'warn');
    const { inPowerChart, encounterIds } = await getValidEncountersAsync(1);
    expect(inPowerChart).toBe(true);
    expect(encounterIds).toEqual([1, 2, 3]);
    expect(consoleWarn).toHaveBeenCalled();
  });
  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          GetValidEncounters: async () => {
            throw new Error('test');
          },
        })),
      },
    });
    try {
      await getValidEncountersAsync(1);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'test');
    }
  });
});
