import { calculateMOEWBitmask } from './calculateMOEWBitmask';

describe('calculateMOEWBitmask()', () => {
  it('accepts all paramaters and yields expected flag values', async () => {
    const result = calculateMOEWBitmask([
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

    const expectedObj = {
      dwCustomizeFlag: 32701,
      dwTabFlag: 2,
      dwTabDisplayOptionsFlag: 127,
    };

    expect(result).toEqual(expectedObj);
  });

  it('correctly handles `customize meds` (`customize order` tested previously)', async () => {
    const result = calculateMOEWBitmask(['customize meds']);
    const expectedObj = {
      dwCustomizeFlag: 0,
      dwTabFlag: 3,
      dwTabDisplayOptionsFlag: 0,
    };
    expect(result).toEqual(expectedObj);
  });

  it('throws the expected error if `customize meds` and `customize order` are both chosen', async () => {
    try {
      calculateMOEWBitmask(['customize meds', 'customize order']);
    } catch (e) {
      expect(e).toBeInstanceOf(SyntaxError);
      expect(e as SyntaxError).toHaveProperty(
        'message',
        'The MOEW must be configured to customize orders or medications, but cannot be configured to customize both.'
      );
    }
  });
});
