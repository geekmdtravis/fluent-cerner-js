import {
  formattedParams,
  CclCallParam,
  makeCclRequestAsync,
  parsedResponseText,
} from './makeCclRequestAsync';

describe('makeCclRequestAsync', () => {
  it('return inPowerChart as false outside of PowerChart', async () => {
    const { inPowerChart } = await makeCclRequestAsync('TEST', [
      { type: 'string', param: 'param1' },
    ]);
    expect(inPowerChart).toBe(false);
  });

  it('propagates the error when an unexpected error occurs', async () => {
    Object.defineProperty(window, 'external', {
      writable: true,
      value: {
        XMLCclRequest: jest.fn().mockImplementation(() => ({
          // @ts-ignore
          open: (a: string, b: string) => {
            return null;
          },
          // @ts-ignore
          send: (a: string) => {
            throw new Error('test error');
            return null;
          },
        })),
      },
    });

    await expect(makeCclRequestAsync('TEST')).rejects.toThrow();
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

describe('parsedResponseText', () => {
  it('returns the parsed response text when the response text is valid JSON', () => {
    const responseText = '{"test": "test"}';
    const result = parsedResponseText(responseText);
    expect(result).toEqual({ test: 'test' });
  });
  it('returns undefined when the response text is not valid JSON', () => {
    const responseText = 'test';
    const result = parsedResponseText(responseText);
    expect(result).toBeUndefined();
  });
  it('propagates an error if an unexpected error occurs', () => {
    const responseText = 'test';
    jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw new Error('test error');
    });
    expect(() => parsedResponseText(responseText)).toThrowError();
  });
});
