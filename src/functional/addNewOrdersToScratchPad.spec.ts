import { addNewOrdersToScratchpadAsync } from './addNewOrdersToScratchPad';
import { StandaloneOrder } from './submitPowerOrders';

describe('addNewOrdersToScratchpadAsync', () => {
  it('runs outside of powerchart and correctly thorws an error', async () => {
    const orders: Array<StandaloneOrder> = [
      {
        synonymId: 1337,
        origination: 'inpatient order',
        sentenceId: 31337,
      },
    ];
    try {
      await addNewOrdersToScratchpadAsync(
        {} as DiscernObjectFactoryReturn,
        0,
        orders,
        true
      );
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
    }
  });

  it('throws a range error if an order list of length less than 1 is provided', async () => {
    const orders: Array<StandaloneOrder> = [];

    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({})),
      },
    });

    try {
      const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
      await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
    const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
    const result = await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
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
      const dcof = await window.external.DiscernObjectFactory('POWERORDERS');
      await addNewOrdersToScratchpadAsync(dcof, 0, orders, true);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty('message', 'This is a test error.');
    }
  });
});
