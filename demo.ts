const lib = require('./dist');
const { submitPowerOrdersAsync } = lib;

Object.defineProperty(global, 'window', {
  writable: true,
  value: {
    external: {},
  },
});

(async () => {
  const standaloneOrder = {
    synonymId: 333,
    origination: 'inpatient order',
  };

  const powerOrder = {
    pathwayCatalogId: 444,
  };
  const orders = [standaloneOrder, powerOrder];

  const res = await submitPowerOrdersAsync(123, 456, orders);
  const { inPowerChart, ordersPlaced, status } = res;

  console.log(inPowerChart, ordersPlaced, status);
})();
