import {
    processCclRequestParams,
} from '../../src/utils/makeCclRequest';
import type {CclCallParam} from "../../src/utils/makeCclRequest";

describe('processCclRequestParams', () => {
  // Check orderAction
  it('handles a case with empty parameters', () => {
    const params: Array<CclCallParam> = [];
    const result = processCclRequestParams(params, false);
    expect(result).toEqual("'MINE'");
  });
});
