const {
  orderString,
  submitOrders,
  makeCclRequest,
  MPageOrder,
  MPageOrderEvent,
  openPatientTab,
  openOrganizerTab,
  OrderStrOpts,
  NewOrderStrOpts,
} = require('./dist/');

/************************************************
 * Create and submit new orders to PowerChart
 ************************************************/

// Functional ulities
// ------------------

const orderStr1 = orderString('copy existing', { orderId: 12345 });

const orderStr2 = orderString('new order', {
  newOrderOpts: {
    synonymId: 1343,
    origination: 'prescription',
  },
});

const orderStr3 = orderString('new order', {
  newOrderOpts: {
    synonymId: 3428,
    orderSentenceId: 3,
    nomenclatureId: 14,
    interactionCheck: 'on sign',
  },
});

submitOrders(123, 456, [orderStr1, orderStr2, orderStr3]);

// Class utilities
// ---------------

const order1 = new MPageOrder();
order1.willCopyExistingOrder(12345);

const order2 = new MPageOrder();
order2.willMakeNewOrder(1343, { isRxOrder: true });

const opts = {
  orderSentenceId: 3,
  nomenclatureId: 14,
  skipInteractionCheckUntilSign: true,
};
const order3 = new MPageOrder();
order3.willMakeNewOrder(3428, opts);

const event = new MPageOrderEvent();
event
  .forPerson(123)
  .forEncounter(456)
  .addOrders([order1, order2, order3])
  .enablePowerPlans()
  .customizeOrderListProfile()
  .enablePowerOrders()
  .launchOrdersForSignature();

// Send the MPage event to the server.
event.send();

/********************************************************
 * Make a CCL request to the server and retrieve the data
 ********************************************************/
let result = undefined;
makeCclRequest({
  prg: 'MP_GET_ORDER_LIST',
  params: [
    { type: 'number', param: 12345 },
    { type: 'string', param: 'joe' },
  ],
})
  .then(data => (result = data))
  .catch(console.error)
  .finally(() => console.log(result));

/********************************************************
 * Open a specific tab in a patients chart
 ********************************************************/

openPatientTab(12345, 54321, 'Notes', true);

/********************************************************
 * Open a specific organizer level tab
 ********************************************************/

openOrganizerTab('Message Center');
