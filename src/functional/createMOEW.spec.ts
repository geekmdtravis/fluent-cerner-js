import { createMOEWAsync } from './createMOEW';
import { PowerChartReturn } from '.';

describe('getValidEncountersAsync', () => {
  it('runs with minimal (and invalid) paramaters outside of powerchart', async () => {
    const result = await createMOEWAsync(0, 0);
    const expectedObj: PowerChartReturn & {
      moewHandle: number | null;
      customizeFlag: number;
      tabFlag: number;
      tabDisplayOptionsFlag: number;
    } = {
      inPowerChart: false,
      moewHandle: null,
      customizeFlag: 24,
      tabFlag: 2,
      tabDisplayOptionsFlag: 127,
    };

    expect(result).toEqual(expectedObj);
  });

  it('accepts all paramaters and yields expected flag values', async () => {
    const result = await createMOEWAsync(0, 0, [
      'sign later',
      'read only',
      'allow power plans',
      'allow power plan doc',
      'allow only inpatient and outpatient orders',
      'show refresh and print buttons',
      'documented meds only',
      'hide med rec',
      'disallow EOL',
      'hide demographics',
      'add rx filter',
      'disable auto search',
      'allow regimen',
      'customize order',
      'show nav tree',
      'show diag and probs',
      'show related res',
      'show orders search',
      'show order profile',
      'show scratchpad',
      'show list details',
    ]);

    const expectedObj: PowerChartReturn & {
      moewHandle: number | null;
      customizeFlag: number;
      tabFlag: number;
      tabDisplayOptionsFlag: number;
    } = {
      inPowerChart: false,
      moewHandle: null,
      customizeFlag: 32701,
      tabFlag: 2,
      tabDisplayOptionsFlag: 127,
    };

    expect(result).toEqual(expectedObj);
  });

  it('throws the expected error if `customize meds` and `customize order` are both chosen', async () => {
    try {
      await createMOEWAsync(0, 0, ['customize meds', 'customize order']);
    } catch (e) {
      expect(e).toBeInstanceOf(SyntaxError);
      expect(e as SyntaxError).toHaveProperty(
        'message',
        'The MOEW must be configured to customize orders or medications, but cannot be configured to customize both.'
      );
    }
  });

  it('correctly handles `customize meds` (`customize order` tested previously)', async () => {
    const result = await createMOEWAsync(0, 0, ['customize meds']);
    const expectedObj: PowerChartReturn & {
      moewHandle: number | null;
      customizeFlag: number;
      tabFlag: number;
      tabDisplayOptionsFlag: number;
    } = {
      inPowerChart: false,
      moewHandle: null,
      customizeFlag: 0,
      tabFlag: 3,
      tabDisplayOptionsFlag: 0,
    };
    expect(result).toEqual(expectedObj);
  });

  it('throws an error if an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    try {
      await createMOEWAsync(0, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });

  it('correctly sets the moewHandle to null if executed correctly in PowerChart and 0 is retured', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(0),
        })),
      },
    });
    const result = await createMOEWAsync(1, 1);
    expect(result.moewHandle).toEqual(null);
  });

  it('correctly sets the moewHandle to the returned value if executed correctly in PowerChart and a non-zero is retured', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          CreateMOEW: async () => Promise.resolve(1337),
        })),
      },
    });
    const result = await createMOEWAsync(1, 1);
    expect(result.moewHandle).toEqual(1337);
  });
});
