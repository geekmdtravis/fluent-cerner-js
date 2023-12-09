import { mpageEventStringIsValid } from './mpageEventStringIsValid';

describe('mpageEventStringIsValid', () => {
  it('should return true for a valid mpage event string', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{1|1}|1|1')
    ).toBeTruthy();
  });
  it('should return false if the first value is missing', () => {
    expect(
      mpageEventStringIsValid('|1|{ORDER|1|1|1|1|1}|1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the second value is missing', () => {
    expect(
      mpageEventStringIsValid('1||{ORDER|1|1|1|1|1}|1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the third value is missing', () => {
    expect(mpageEventStringIsValid('1|1|{}|1|{1|1}|1|1')).toBeFalsy();
  });
  it('should return false if the fourth value is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}||{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the fifth value is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the sixth value is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{1|1}||1')
    ).toBeFalsy();
  });
  it('should return false if the seventh value is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{1|1}|1|')
    ).toBeFalsy();
  });
  it('should return false if the first pipe is missing', () => {
    expect(
      mpageEventStringIsValid('11|{ORDER|1|1|1|1|1}|1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the second pipe is missing', () => {
    expect(
      mpageEventStringIsValid('1|1{ORDER|1|1|1|1|1}|1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the third pipe is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|ORDER|1|1|1|1|1}1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the fourth pipe is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER1|1|1|1|1|1}|1{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the fifth pipe is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{1|1}1|1')
    ).toBeFalsy();
  });
  it('should return false if the sixth pipe is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{1|1}|11')
    ).toBeFalsy();
  });
  it('should return false if the first bracket is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|ORDER|1|1|1|1|1}|1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the second bracket is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1|1|{1|1}|1|1')
    ).toBeFalsy();
  });
  it('should return false if the third bracket is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|1|1|1')
    ).toBeFalsy();
  });
  it('should return false if the fourth bracket is missing', () => {
    expect(
      mpageEventStringIsValid('1|1|{ORDER|1|1|1|1|1}|1|{1|1|1|1')
    ).toBeFalsy();
  });
});
