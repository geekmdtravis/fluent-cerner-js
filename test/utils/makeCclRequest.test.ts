import {
  processCclRequestParams,
  CclCallParam,
} from '../../src/utils/makeCclRequest';

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
});
