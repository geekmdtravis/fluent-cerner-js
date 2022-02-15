/************************************************
 * Create and send a set of orders to the server
 ************************************************/
const fcjs = require('./dist/');
const MPageOrder = fcjs.MPageOrder;
const MPageOrderEvent = fcjs.MPageOrderEvent;
const makeCclRequest = fcjs.makeCclRequest;
const openPatientChartTab = fcjs.openPatientTab;

// Make a new order from an existing order which serves as a template for copy.
const order1 = new MPageOrder();
order1.willCopyExistingOrder(12345);

// Make a new order from scratch, declare that it's a prescription order.
const order2 = new MPageOrder();
order2.willMakeNewOrder(1343, { isRxOrder: true });

// Make a new order from scratch, declare that it's a non-prescription order,
// reference an order sentence id and a nomenclature id in addition to requesting
// skip interaction checks until sign.
const opts = {
  orderSentenceId: 3,
  nomenclatureId: 14,
  skipInteractionCheckUntilSign: true,
};
const order3 = new MPageOrder();
order3.willMakeNewOrder(3428, opts);

// Prepare the MPage event for person 1231251 on encounter 812388.
const event = new MPageOrderEvent();
event
  .forPerson(1231251)
  .forEncounter(812388)
  .addOrders([order1, order2, order3])
  .enablePowerPlans()
  .customizeOrderListProfile()
  .enablePowerOrders()
  .launchOrderProfile();

// Send the MPage event to the server.
event.send();

/********************************************************
 * Make a CCL request to the server and retrieve the data
 ********************************************************/

const cclOpts = {
  prg: 'MP_GET_ORDER_LIST',
  params: [
    { type: 'number', param: 12345 },
    { type: 'string', param: 'joe' },
  ],
};

let result = undefined;

makeCclRequest(cclOpts)
  .then(data => (result = data))
  .catch(console.error);

/********************************************************
 * Open a specific tab in a patients chart
 ********************************************************/

openPatientChartTab(12345, 54321, 'Notes', true);
