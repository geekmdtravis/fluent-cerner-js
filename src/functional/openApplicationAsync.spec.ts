import { openApplicationAsync } from './openApplicationAsync';

describe('openApplicationAsync', () => {
  it("should throw an error if mode is 'by solution name' and args is undefined", async () => {
    expect(async () => {
      await openApplicationAsync('by solution name', 'test target');
    }).toThrowError(
      "openApplicationAsync: 'executable name' mode requires arguments"
    );
  });
  it("should throw an error if mode is 'by application object' and args is undefined", async () => {
    expect(async () => {
      await openApplicationAsync('by application object', 'test target');
    }).toThrowError(
      "openApplicationAsync: 'application object' mode requires arguments"
    );
  });
  it('should throw an error if mode is invalid', async () => {
    expect(async () => {
      // @ts-ignore
      await openApplicationAsync('invalid mode', 'test target');
    }).toThrowError('openApplicationAsync: invalid mode');
  });
});
