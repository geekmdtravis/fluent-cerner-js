const { submitPowerOrdersAsync, submitOrdersAsync } = require('./dist');

Object.defineProperty(global, 'window', {
  writable: true,
  value: {
    external: {},
  },
});

(async () => {
  // Submit standalone orders
  const standaloneOrder = {
    synonymId: 333,
    origination: 'inpatient order',
  };

  const powerOrder = {
    pathwayCatalogId: 444,
  };
  const ordersPO = [standaloneOrder, powerOrder];

  const resPO = await submitPowerOrdersAsync(123, 456, ordersPO);
  const { inPowerChart, ordersPlaced, status } = resPO;

  console.log(inPowerChart, ordersPlaced, status);

  // Submit orders in PowerChart
  const orderO1 = {
    id: 333,
    action: 'new order',
  };

  const orderO2 = {
    id: 444,
    action: 'copy existing',
  };

  const ordersO = [orderO1, orderO2];

  const resO = await submitOrdersAsync(123, 456, ordersO);
  const { ordersPlaced: ordersPlaced2, status: status2 } = resO;
  console.log(ordersPlaced2, status2);
})();
