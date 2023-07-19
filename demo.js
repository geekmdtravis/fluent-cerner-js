const {
  orderString,
  submitOrders,
  makeCclRequest,
  openPatientTab,
  openOrganizerTab,
  launchClinicalNote,
  launchPowerForm,
  launchPowerNote,
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
    nomenclatureIds: [14, 15, 16],
    interactionCheck: 'on sign',
  },
});

submitOrders(123, 456, [orderStr1, orderStr2, orderStr3]);

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
 * Alternative example, where the parameter types are inferred
 ********************************************************/
let altResult = undefined;
makeCclRequest({
  prg: 'MP_GET_ORDER_LIST',
  params: [12345, 'joe'],
})
  .then(data => (altResult = data))
  .catch(console.error)
  .finally(() => console.log(altResult));

/********************************************************
 * Open a specific tab in a patients chart
 ********************************************************/

openPatientTab(12345, 54321, 'Notes');

/********************************************************
 * Open a specific organizer level tab
 ********************************************************/

openOrganizerTab('Message Center');

/****************************************************
 * Launch a Clinical Note
 ***************************************************/
launchClinicalNote({
  patientId: 12345,
  encounterId: 54321,
  eventIds: [123, 456, 789],
  windowTitle: 'My Note',
  viewOptionFlags: ['buttons', 'view-only'],
});

/****************************************************
 * Launch a PowerForm
 ***************************************************/
launchPowerForm({
  personId: 12345,
  encounterId: 54321,
  target: 'new form search',
});

/****************************************************
 * Launch a PowerNote
 ***************************************************/
launchPowerNote({
  personId: 12345,
  encounterId: 54321,
  target: 'new',
  targetId: 'CKI!HAIR LOSS',
});
