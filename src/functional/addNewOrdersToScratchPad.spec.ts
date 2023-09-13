import {
  AddNewOrdersToScratchpadReturn,
  addNewOrdersToScratchpadAsync,
} from './addNewOrdersToScratchPad';
import { StandaloneOrder } from './submitPowerOrders';

describe('addNewOrdersToScratchpadAsync', () => {
  it('runs outside of powerchart and correctly outputs as such', async () => {
    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

    const expectedObj: AddNewOrdersToScratchpadReturn = {
      inPowerChart: false,
      result: 'add failed',
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

  it('runs inside of powerchart and correctly sets `result` if executed correctly in PowerChart successfully', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.result).toEqual('successfully added');
  });

  it('sets `result` correctly if orders could not be added', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(3),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.result).toEqual('add failed');
  });

  it('sets `result` correctly if orders are added and signed', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(1),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.result).toEqual('added and signed');
  });

  it('sets `result` correctly if orders are cancelled by the user', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(2),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.result).toEqual('cancelled by user');
  });

  it('sets `result` correctly if orders are added and signed', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(1),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.result).toEqual('added and signed');
  });

  it('can handle an outpatient order with no sentence Id', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          AddNewOrdersToScratchpad: async () => Promise.resolve(0),
        })),
      },
    });

    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'prescription order',
      },
    ];

    const result = await addNewOrdersToScratchpadAsync(0, orders, true);
    expect(result.result).toEqual('successfully added');
  });

  it('throws an error if an unexpected error occurs', async () => {
    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];

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
