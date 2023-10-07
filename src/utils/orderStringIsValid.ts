export const orderStringIsValid = (orderString: string): boolean => {
  return /\{[A-Z]{5,13}\|[0-9]+\|[0-9]+\|[0-9]+\|[0-9]+\|[0-9]+\}/gm.test(
    orderString
  );
};
