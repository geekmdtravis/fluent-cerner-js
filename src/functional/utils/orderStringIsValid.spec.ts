import { orderStringIsValid } from './orderStringIsValid';

describe('orderStringIsValid', () => {
  it('should return true for a valid order string', () => {
    expect(orderStringIsValid('{ORDER|1|1|1|1|1}')).toBeTruthy();
  });
  it('should return false if the first value is missing', () => {
    expect(orderStringIsValid('{|1|1|1|1|1}')).toBeFalsy();
  });
  it('should return false if the second value is missing', () => {
    expect(orderStringIsValid('{ORDER||1|1|1|1}')).toBeFalsy();
  });
  it('should return false if the third value is missing', () => {
    expect(orderStringIsValid('{ORDER|1||1|1|1}')).toBeFalsy();
  });
  it('should return false if the fourth value is missing', () => {
    expect(orderStringIsValid('{ORDER|1|1||1|1}')).toBeFalsy();
  });
  it('should return false if the fifth value is missing', () => {
    expect(orderStringIsValid('{ORDER|1|1|1||1}')).toBeFalsy();
  });
  it('should return false if the sixth value is missing', () => {
    expect(orderStringIsValid('{ORDER|1|1|1|1|}')).toBeFalsy();
  });
  it('should return false if the first pipe is missing', () => {
    expect(orderStringIsValid('ORDER|1|1|1|1|1}')).toBeFalsy();
  });
  it('should return false if the second pipe is missing', () => {
    expect(orderStringIsValid('{ORDER1|1|1|1|1|1')).toBeFalsy();
  });

  it;
});
