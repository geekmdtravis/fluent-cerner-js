import {
  AddPowerPlanWithDetailsReturn,
  addPowerPlanWithDetailsAsync,
} from './addPowerPlanWithDetails';
import { PowerPlanOrder } from './submitPowerOrders';

describe('addPowerPlanWithDetailsAsync', () => {
  it('runs outside of powerchart and correctly outputs as such', async () => {
    const orders: Array<PowerPlanOrder> = [{ pathwayCatalogId: 1337 }];

    const expectedObj: AddPowerPlanWithDetailsReturn = {
      inPowerChart: false,
      powerPlansAdded: false,
    };

    const resultObj = await addPowerPlanWithDetailsAsync(0, orders);

    expect(resultObj).toEqual(expectedObj);
  });

  it('throws a range error if an order list of length less than 1 is provided', async () => {
    const orders: Array<PowerPlanOrder> = [];

    try {
      await addPowerPlanWithDetailsAsync(0, orders);
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
      expect(e as RangeError).toHaveProperty(
        'message',
        'There should be at least one PowerPlan order provided.'
      );
    }
  });

  it('runs inside of powerchart and correctly sets `powerPlanAdded` if executed correctly in PowerChart', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
        })),
      },
    });

    const orders: Array<PowerPlanOrder> = [{ pathwayCatalogId: 1337 }];

    const result = await addPowerPlanWithDetailsAsync(0, orders);
    expect(result.powerPlansAdded).toEqual(true);
  });

  it('can create a powerplan with a personalized plan Id and a diagnosis code', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddPowerPlanWithDetails: async () => Promise.resolve(1),
        })),
      },
    });

    const orders: Array<PowerPlanOrder> = [
      {
        pathwayCatalogId: 1337,
        personalizedPlanId: 31337,
        diagnosesSynonymIds: [12],
      },
    ];

    const result = await addPowerPlanWithDetailsAsync(0, orders);
    expect(result.powerPlansAdded).toEqual(true);
  });

  it('sets `powerPlanAdded` correctly if plans could not be added', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddPowerPlanWithDetails: async () => Promise.resolve(0),
        })),
      },
    });

    const orders: Array<PowerPlanOrder> = [{ pathwayCatalogId: 1337 }];

    const result = await addPowerPlanWithDetailsAsync(0, orders);
    expect(result.powerPlansAdded).toEqual(false);
  });

  it('throws an error if an unexpected error occurs', async () => {
    const orders: Array<PowerPlanOrder> = [{ pathwayCatalogId: 1337 }];

    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddPowerPlanWithDetails: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    try {
      await addPowerPlanWithDetailsAsync(0, orders);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
