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
      {
        pid: 1,
        eid: 1,
        refTemplateId: 1,
      }
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
      {
        pid: 1,
        eid: 1,
        refTemplateId: 1,
      }
    );
    expect(inPowerChart).toBe(true);
  });
  it('returns inPowerChart as true when inside of PowerChart when created by reference ID with note code given', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenNewDocumentByReferenceTemplateIdAndNoteType: async () =>
            Promise.resolve(null),
        })),
      },
    });
    const { inPowerChart } = await createNewDocumentAsync(
      'by reference template',
      {
        pid: 1,
        eid: 1,
        refTemplateId: 1,
        noteTypeCd: 1,
      }
    );
    expect(inPowerChart).toBe(true);
  });
  it('returns inPowerChart as false when outside of PowerChart when created by workflow ID', async () => {
    const { inPowerChart } = await createNewDocumentAsync('by workflow', {
      pid: 1,
      eid: 1,
      workflowId: 1,
    });
    expect(inPowerChart).toBe(false);
  });
  it('returns inPowerChart as true when inside of PowerChart when created by workflow ID', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenDynDocByWorkFlowId: async () => Promise.resolve(null),
        })),
      },
    });
    const { inPowerChart } = await createNewDocumentAsync('by workflow', {
      pid: 1,
      eid: 1,
      workflowId: 1,
    });
    expect(inPowerChart).toBe(true);
  });
  it('throws an Error when there is neither a refTemplate ID nor a workflow ID provide', async () => {
    try {
      await createNewDocumentAsync('by workflow', { pid: 1, eid: 1 });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty(
        'message',
        'Either a reference template ID or a workflow ID must be provided.'
      );
    }
  });
  it('throws an Error when there is both a refTemplate ID and a workflow ID provided', async () => {
    try {
      await createNewDocumentAsync('by reference template', {
        pid: 1,
        eid: 1,
        refTemplateId: 1,
        workflowId: 1,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty(
        'message',
        'Only one of a reference template ID or a workflow ID can be provided, exclusively.'
      );
    }
  });
  it('throws an Error when there is no workflow ID provided when creating a document by workflow', async () => {
    try {
      await createNewDocumentAsync('by workflow', {
        pid: 1,
        eid: 1,
        refTemplateId: 1,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty(
        'message',
        'A workflow ID must be provided when creating a document by workflow.'
      );
    }
  });
  it('throws an Error when there is no refTemplate ID provided when creating a document by reference template', async () => {
    try {
      await createNewDocumentAsync('by reference template', {
        pid: 1,
        eid: 1,
        workflowId: 1,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e as Error).toHaveProperty(
        'message',
        'A reference template ID must be provided when creating a document by reference template.'
      );
    }
  });
  it('calls console.warn when a note type code is provided when creating a document by workflow', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await createNewDocumentAsync('by workflow', {
      pid: 1,
      eid: 1,
      workflowId: 1,
      noteTypeCd: 1,
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  it('returns success as true when the DynDoc window is successfully called', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
  it('returns success as false when the DynDoc window is not successfully called', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
  it('throws an Error when an unexpected error occurs when attempting to create new document by workflow id', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenDynDocByWorkFlowId: async () => {
            throw new Error('test');
          },
        })),
      },
    });
    return expect(
      async () =>
        await createNewDocumentAsync('by workflow', {
          pid: 1,
          eid: 1,
          workflowId: 1,
        })
    ).rejects.toThrow(Error);
  });
  it('throws an Error when an unexpected error occurs when attempting to create new document by referene template', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        DiscernObjectFactory: jest.fn().mockImplementation(() => ({
          OpenDynDocByWorkFlowId: async () => {
            throw new Error('test');
          },
        })),
      },
    });
    return expect(
      async () =>
        await createNewDocumentAsync('by reference template', {
          pid: 1,
          eid: 1,
          refTemplateId: 1,
        })
    ).rejects.toThrow(Error);
  });
  it('successfully create a new document by reference template when a note type code is provided', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
  it('successfully create a new document by reference template when a note type code is not provided', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
  it('returns success as true when the DynDoc window is successfully called when creating a document by reference template', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
  it('returns success as false when the DynDoc window is not successfully called when creating a document by workflow id', async () => {
    // TODO: implement after investing if return values are as expected for the underlying COM object methods
    expect(true).toBe(false);
  });
});
