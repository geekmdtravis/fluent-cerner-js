import {
  formattedParams,
  CclCallParam,
  makeCclRequestAsync,
} from './makeCclRequestAsync';

describe('makeCclRequestAsync', () => {
  it('return inPowerChart as false outside of PowerChart', async () => {
    const { inPowerChart } = await makeCclRequestAsync('TEST', [
      { type: 'string', param: 'param1' },
    ]);
    expect(inPowerChart).toBe(false);
  });

  it('throws an error when the response returns undefined or null', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        XMLCclRequest: jest.fn().mockImplementation(() => ({
          response: null,
          open: function(a: string, b: string): Promise<null> {
            console.debug('open', a, b);
            return Promise.resolve(null);
          },
          send: function(a: string): Promise<null> {
            console.debug('send', a);
            return Promise.resolve(null);
          },
          onreadystatechange: function(): Promise<null> {
            console.debug('onreadystatechange');
            return Promise.resolve(null);
          },
        })),
      },
    });
    try {
      await makeCclRequestAsync('TEST', [{ type: 'string', param: 'param1' }]);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toHaveProperty(
        'message',
        'An unexpected error occurred and the CCL response returned undefined or null.'
      );
    }
  });
  it('throws an error when an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        XMLCclRequest: jest.fn().mockImplementation(() => ({
          open: function(a: string, b: string): Promise<null> {
            console.debug('open', a, b);
            throw new Error('test error');
          },
          send: function(a: string): Promise<null> {
            console.debug('send', a);
            throw new Error('test error');
          },
          onreadystatechange: function(): Promise<null> {
            console.debug('onreadystatechange');
            throw new Error('test error');
          },
        })),
      },
    });
    try {
      await makeCclRequestAsync('TEST', ['param1']);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});

describe('processCclRequestParams', () => {
  it('returns a proper params string when given inputs as CclCallParams', () => {
    const params: Array<CclCallParam> = [
      {
        type: 'string',
        param: 'test',
      },
      {
        type: 'number',
        param: 1,
      },
    ];
    const result = formattedParams(params, false);
    expect(result).toEqual("'MINE','test',1");
  });

  it('missing params returns only MINE', () => {
    const result = formattedParams();
    expect(result).toEqual("'MINE'");
  });

  it('empty params list return only MINE', () => {
    const params: Array<CclCallParam> = [];
    const result = formattedParams(params);
    expect(result).toEqual("'MINE'");
  });
  it('includes MINE as the first parameter when excludeMine is excluded', () => {
    const params: Array<CclCallParam> = [
      {
        type: 'string',
        param: 'test',
      },
    ];
    const result = formattedParams(params);
    expect(result).toEqual("'MINE','test'");
  });
  it('remove MINE from the parameters when excludeMine parameter set to true', () => {
    const params: Array<CclCallParam> = [
      {
        type: 'string',
        param: 'test',
      },
    ];
    const result = formattedParams(params, true);
    expect(result).toEqual("'test'");
  });
  it('properly processes parameters when the list items types are decided without explicit type declaration', () => {
    const params: Array<number | string | CclCallParam> = [
      1234,
      'test',
      6789,
      'test2',
      { param: 'test3', type: 'string' },
    ];
    const result = formattedParams(params, true);
    expect(result).toEqual("1234,'test',6789,'test2','test3'");
  });
  it('throws an error when invalid parameters are given', () => {
    const params: Array<number | string> = [{ test: 'test' } as any];
    expect(() => formattedParams(params, true)).toThrowError();
  });
});
