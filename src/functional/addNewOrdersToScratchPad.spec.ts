import { PowerChartReturn } from '.';
import { addNewOrdersToScratchpadAsync } from './addNewOrdersToScratchPad';
import { StandaloneOrder } from './submitPowerPlanOrders';

describe('addNewOrdersToScratchpadAsync', () => {
  it('runs outside of powerchart and correctly outputs as such', async () => {
    const orders: Array<StandaloneOrder> = [{ synonymID: 1337 }];

    const expectedObj: PowerChartReturn & {
      standaloneOrdersAdded: boolean;
    } = {
      inPowerChart: false,
      standaloneOrdersAdded: false,
    };

    const resultObj = await addNewOrdersToScratchpadAsync(0, orders, true);

    expect(resultObj).toEqual(expectedObj);
  });

  it('throws a range error if an order list of length less than 1 is provided', async () => {
    const orders: Array<StandaloneOrder> = [];

    try {
      await addNewOrdersToScratchpadAsync(0, orders, true);
    } catch (e) {
      expect(e).toBeInstanceOf(RangeError);
      expect(e as RangeError).toHaveProperty(
        'message',
        'There should be at least one standalone order provided.'
      );
    }
  });

  it('runs inside of powerchart and correctly sets `standaloneOrdersAdded` if executed correctly in PowerChart', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(1),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [{ synonymID: 1337 }];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.standaloneOrdersAdded).toEqual(true);
  });

  it('sets `standaloneOrdersAdded` correctly if orders could not be added', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [{ synonymID: 1337 }];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.standaloneOrdersAdded).toEqual(false);
  });

  it('throws an error if an unexpected error occurs', async () => {
    const orders: Array<StandaloneOrder> = [{ synonymID: 1337 }];

    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => {
            throw new Error('This is a test error.');
          },
        })),
      },
    });
    try {
      await addNewOrdersToScratchpadAsync(0, orders, true);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
