import {
  processCclRequestParams,
  CclCallParam,
  makeCclRequest,
} from './makeCclRequest';

describe('makeCclRequest', () => {
  it('rejects when outside of PowerChart', async () => {
    return expect(
      makeCclRequest({
        prg: 'TEST',
        params: [{ type: 'string', param: 'param1' }],
      })
    ).rejects.toEqual('window.XMLCclRequest is not a function');
  });
});

describe('processCclRequestParams', () => {
  it('returns a proper request params string when given string, number, and all options', () => {
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
    const result = processCclRequestParams(params, false);
    expect(result).toEqual("'MINE','test',1");
  });

  it('handles a case with no parameters provided', () => {
    const result = processCclRequestParams();
    expect(result).toEqual("'MINE'");
  });

  it('handles a case with empty parameters', () => {
    const params: Array<CclCallParam> = [];
    const result = processCclRequestParams(params);
    expect(result).toEqual("'MINE'");
  });
  it('handles a case with exlude mine parameter excluded', () => {
    const params: Array<CclCallParam> = [
      {
        type: 'string',
        param: 'test',
      },
    ];
    const result = processCclRequestParams(params);
    expect(result).toEqual("'MINE','test'");
  });
  it('handles a case with exlude mine parameter set to true', () => {
    const params: Array<CclCallParam> = [
      {
        type: 'string',
        param: 'test',
      },
    ];
    const result = processCclRequestParams(params, true);
    expect(result).toEqual("'test'");
  });
  it('handles properly processes parameters when the list items types are decided without explicit type declaration', () => {
    const params: Array<number | string | CclCallParam> = [
      1234,
      'test',
      6789,
      'test2',
      { param: 'test3', type: 'string' },
    ];
    const result = processCclRequestParams(params, true);
    expect(result).toEqual("1234,'test',6789,'test2','test3'");
  });
  it('throws and error when invalid parameters are given', () => {
    const params: Array<number | string> = [{ test: 'test' } as any];
    expect(() => processCclRequestParams(params, true)).toThrowError();
  });
});
