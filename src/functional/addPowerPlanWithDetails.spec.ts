import { addPowerPlanWithDetailsAsync } from './addPowerPlanWithDetails';
import { PowerPlanOrder } from './submitPowerOrders';

describe('addPowerPlanWithDetailsAsync', () => {
  it('runs outside of powerchart and correctly throws an error', async () => {
    const orders: Array<PowerPlanOrder> = [{ pathwayCatalogId: 1337 }];

    try {
      await addPowerPlanWithDetailsAsync(0, 0, orders);
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('throws a range error if an order list of length less than 1 is provided', async () => {
    const orders: Array<PowerPlanOrder> = [];
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({})),
      },
    });
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    try {
      await addPowerPlanWithDetailsAsync(dcof, 0, orders);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addPowerPlanWithDetailsAsync(dcof, 0, orders);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addPowerPlanWithDetailsAsync(dcof, 0, orders);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addPowerPlanWithDetailsAsync(dcof, 0, orders);
    expect(result.powerPlansAdded).toEqual(false);
  });

  it('throws an error if an unexpected error occurs', async () => {
    const orders: Array<PowerPlanOrder> = [{ pathwayCatalogId: 1337 }];
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
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
      await addPowerPlanWithDetailsAsync(dcof, 0, orders);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
