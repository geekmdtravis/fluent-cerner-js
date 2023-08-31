import { addAddendumToDocumentAsync } from './addAddendumToDocumentAsync';

describe('addAddendumToDocumentAsync', () => {
  it('returns inPowerChart as false when outside of PowerChart', async () => {
    const { inPowerChart } = await addAddendumToDocumentAsync(1, 1, 1);
    expect(inPowerChart).toBe(false);
  });
  it('returns inPowerChart as true when inside of PowerChart', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          ModifyExistingDocumentByEventId: async () => Promise.resolve(null),
        })),
      },
    });
    const { inPowerChart } = await addAddendumToDocumentAsync(1, 1, 1);
    expect(inPowerChart).toBe(true);
  });
  it('throws an Error when an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          ModifyExistingDocumentByEventId: async () => {
            throw new Error('test');
          },
        })),
      },
    });
    return expect(
      async () => await addAddendumToDocumentAsync(1, 1, 1)
    ).rejects.toThrow();
  });
  it('returns success as true when the DynDoc window is successfully called', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
  it('returns success as false when the DynDoc window is not successfully called', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
});
