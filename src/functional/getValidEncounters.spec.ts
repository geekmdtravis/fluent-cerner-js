import { getValidEncountersAsync } from './getValidEncounters';

describe('getValidEncountersAsync', () => {
  it('throws a range error if an integer less than 1 is provided', async () => {
    try {
      await getValidEncountersAsync(0);
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
      expect(e as RangeError).toHaveProperty(
        'message',
        'The patient ID must be a positive integer.'
      );
    }
  });
  it('returns an object with an empty array of encounter IDs if the user is not in PowerChart', async () => {
    const { inPowerChart, encounterIds } = await getValidEncountersAsync(1);
    expect(inPowerChart).toBe(false);
    expect(encounterIds).toEqual([]);
  });
  it('returns an object with an array of encounter IDs if the user is in PowerChart', async () => {
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
