import { calculateMOEWBitmask } from './calculateMOEWBitmask';

describe('calculateMOEWBitmask', () => {
  it('accepts all parameters and yields expected flag values', async () => {
    const result = calculateMOEWBitmask('orders tab', [
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

  it('correctly handles the `medications` order type', async () => {
    const result = calculateMOEWBitmask('medications tab', []);
    const expectedObj = {
      dwCustomizeFlag: 152,
      dwTabFlag: 3,
      dwTabDisplayOptionsFlag: 127,
    };
    expect(result).toEqual(expectedObj);
  });

  it('can handle the alternate `show flags`', async () => {
    const result = calculateMOEWBitmask('medications tab', [
      'show med rec',
      'show demographics',
    ]);
    const expectedObj = {
      dwCustomizeFlag: 0,
      dwTabFlag: 3,
      dwTabDisplayOptionsFlag: 0,
    };
    expect(result).toEqual(expectedObj);
  });
});
