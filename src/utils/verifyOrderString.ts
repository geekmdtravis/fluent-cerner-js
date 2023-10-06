export const mpageEventStringIsValid = (orderString: string): boolean => {
  return /[0-9]+\|[0-9]+\|\{[A-Z]{5,13}\|[0-9]+\|[0-9]+\|[0-9]+\|[0-9]+\|[0-9]+\}\|[0-9]+\|\{[0-9]{1}\|[0-9]{1,3}\}\|[0-9]{1,2}\|[0-1]{1}/gm.test(
    orderString
  );
};

export const orderStringIsValid = (orderString: string): boolean => {
  return /\{[A-Z]{5,13}\|[0-9]+\|[0-9]+\|[0-9]+\|[0-9]+\|[0-9]+\}/gm.test(
    orderString
  );
};
