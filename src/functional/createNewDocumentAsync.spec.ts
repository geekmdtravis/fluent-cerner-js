import { createNewDocumentAsync } from './createNewDocumentAsync';

describe('createNewDocumentAsync', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: undefined,
      },
    });
  });
  it('returns inPowerChart as false when outside of PowerChart when created by reference ID', async () => {
    const { inPowerChart } = await createNewDocumentAsync(
      'by reference template',
      1,
      1,
      1
    );
    expect(inPowerChart).toBe(false);
  });
  it('returns inPowerChart as true when inside of PowerChart when created by reference ID', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenNewDocumentByReferenceTemplateId: async () =>
            Promise.resolve(null),
        })),
      },
    });
    const { inPowerChart } = await createNewDocumentAsync(
      'by reference template',
      1,
      1,
      1
    );
    expect(inPowerChart).toBe(true);
  });
  it("returns 'success' as 'true' when 'by workflow' method is used and a successful action is returned", async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenDynDocByWorkFlowId: async () => Promise.resolve(1),
        })),
      },
    });
    const { success } = await createNewDocumentAsync('by workflow', 1, 1, 1);
    expect(success).toBe(true);
  });
  it("returns 'success' as 'false' when 'by workflow' method is used and a unsuccessful action is returned", async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenDynDocByWorkFlowId: async () => Promise.resolve(0),
        })),
      },
    });
    const { success } = await createNewDocumentAsync('by workflow', 1, 1, 1);
    expect(success).toBe(false);
  });
  it("returns 'success' as 'true' when 'by reference template' method without a 'noteTypeCd' is used and a successful action is returned", async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenNewDocumentByReferenceTemplateId: async () => Promise.resolve(1),
        })),
      },
    });
    const { success } = await createNewDocumentAsync(
      'by reference template',
      1,
      1,
      1
    );
    expect(success).toBe(true);
  });
  it("returns 'success' as 'true' when 'by reference template' method without a 'noteTypeCd' is used and a unsuccessful action is returned", async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenNewDocumentByReferenceTemplateId: async () => Promise.resolve(0),
        })),
      },
    });
    const { success } = await createNewDocumentAsync(
      'by reference template',
      1,
      1,
      1
    );
    expect(success).toBe(false);
  });
  it("returns 'success' as 'true' when 'by reference template' method with a 'noteTypeCd' is used and a successful action is returned", async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenNewDocumentByReferenceTemplateIdAndNoteType: async () =>
            Promise.resolve(1),
        })),
      },
    });
    const { success } = await createNewDocumentAsync(
      'by reference template',
      1,
      1,
      1,
      1
    );
    expect(success).toBe(true);
  });
  it("returns 'success' as 'true' when 'by reference template' method with a 'noteTypeCd' is used and a successful action is returned", async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenNewDocumentByReferenceTemplateIdAndNoteType: async () =>
            Promise.resolve(0),
        })),
      },
    });
    const { success } = await createNewDocumentAsync(
      'by reference template',
      1,
      1,
      1,
      1
    );
    expect(success).toBe(false);
  });
  it('throws Error when an unsupported method is used', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({})),
      },
    });
    await expect(
      // @ts-ignore
      createNewDocumentAsync('unsupported', 1, 1, 1)
    ).rejects.toThrow(
      'unsupported is not supported as a method of creating a new document.'
    );
  });
  it('console.warn is called when a noteTypeCd is provided when using the by workflow method', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenDynDocByWorkFlowId: async () => Promise.resolve(0),
        })),
      },
    });
    const consoleSpy = jest.spyOn(console, 'warn');
    await createNewDocumentAsync('by workflow', 1, 1, 1, 1);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
