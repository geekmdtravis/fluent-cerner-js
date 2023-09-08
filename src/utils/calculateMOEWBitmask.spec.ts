import { calculateMOEWBitmask } from './calculateMOEWBitmask';

describe('calculateMOEWBitmask()', () => {
  it('accepts all paramaters and yields expected flag values', async () => {
    const result = calculateMOEWBitmask({
      orderType: 'order',
      moewFlags: [
        'sign later',
        'read only',
        'allow power plans',
        'allow power plan doc',
        'allow only inpatient and outpatient orders',
        'show refresh and print buttons',
        'documented meds only',
        'disallow EOL',
        'add rx to filter',
        'disable auto search',
        'allow regimen',
        'customize order',
        'show nav tree',
        'show demographics',
        'show med rec',
        'show diag and probs',
        'show related res',
        'show orders search',
        'show order profile',
        'show scratchpad',
        'show list details',
      ],
    });

    const expectedObj = {
      dwCustomizeFlag: 32701,
      dwTabFlag: 2,
      dwTabDisplayOptionsFlag: 127,
    };

    expect(result).toEqual(expectedObj);
  });

  it('correctly handles `customize meds` (`order` tested previously)', async () => {
    const result = calculateMOEWBitmask({ orderType: 'medications' });
    const expectedObj = {
      dwCustomizeFlag: 0,
      dwTabFlag: 3,
      dwTabDisplayOptionsFlag: 0,
    };
    expect(result).toEqual(expectedObj);
  });
});
