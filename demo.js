const {
  orderString,
  submitOrdersAsync,
  makeCclRequestAsync,
  openPatientTabAsync,
  openOrganizerTabAsync,
  launchClinicalNoteAsync,
  manageAppointmentAsync,
  launchPowerFormAsync,
  launchPowerNoteAsync,
  getValidEncountersAsync,
} = require('./dist/');

// Define a 'window' object to simulate the browser environment
window = { external: {} };

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

(async function() {
  const {
    ordersPlaced,
    status,
    response,
    inPowerChart,
    eventString,
  } = await submitOrdersAsync(123, 456, [orderStr1, orderStr2, orderStr3]);

  console.log(inPowerChart ? 'Currently in PowerChart' : 'NOT in PowerChart');
  console.log(
    `Status: ${status} for orders placed with event string: ${eventString}`
  );
  ordersPlaced?.forEach(({ name, oid, display }) => {
    console.log(`Order${name} (ID: ${oid}) - ${display}`);
  });
  response?.Orders.Order.forEach(o => console.log(o.ProviderName));
})();

/********************************************************
 * Make a CCL request to the server and retrieve the data
 ********************************************************/
let result = undefined;
(async function() {
  makeCclRequestAsync({
    prg: 'MP_GET_ORDER_LIST',
    params: [
      { type: 'number', param: 12345 },
      { type: 'string', param: 'joe' },
    ],
  })
    .then(data => (result = data))
    .catch(err => console.log(`Whoops: ${err.message}`))
    .finally(() => console.log(result));
})();

/********************************************************
 * Alternative example, where the parameter types are inferred
 * and using the async/await syntax.
 ********************************************************/
(async function() {
  try {
    const data = await makeCclRequestAsync({
      prg: 'MP_GET_ORDER_LIST_2',
      params: [12345, 'joe'],
    });
    console.log(data);
  } catch (err) {
    console.log(`Whoops: ${err.message}`);
  }
})();

/********************************************************
 * Open a specific tab in a patients chart
 ********************************************************/

(async () => {
  const { inPowerChart, eventString, badInput } = await openPatientTabAsync(
    12345,
    54321,
    'Notes'
  );
  console.log(inPowerChart ? 'Currently in PowerChart' : 'NOT in PowerChart');
  console.log(`Event string: ${eventString}`);
  console.log(`Bad input: ${badInput}`);
})();

/********************************************************
 * Open a specific organizer level tab
 ********************************************************/
(async () => {
  const { inPowerChart, eventString, badInput } = await openOrganizerTabAsync(
    'Message Center'
  );
  console.log(inPowerChart ? 'Currently in PowerChart' : 'NOT in PowerChart');
  console.log(`Event string: ${eventString}`);
  console.log(`Bad input: ${badInput}`);
})();

/****************************************************
 * Launch a Clinical Note
 ***************************************************/
(async () => {
  const { inPowerChart, eventString } = await launchClinicalNoteAsync({
    patientId: 12345,
    encounterId: 54321,
    eventIds: [123, 456, 789],
    windowTitle: 'My Note',
    viewOptionFlags: ['buttons', 'view-only'],
  });
  console.log(inPowerChart ? 'Currently in PowerChart' : 'NOT in PowerChart');
  console.log(`Event string: ${eventString}`);
})();

/****************************************************
 * Launch a PowerForm
 ***************************************************/

(async () => {
  const { inPowerChart, eventString } = await launchPowerFormAsync({
    personId: 12345,
    encounterId: 54321,
    target: 'new form search',
  });

  console.log(inPowerChart ? 'Currently in PowerChart' : 'NOT in PowerChart');
  console.log(`Event string: ${eventString}`);
})();

/****************************************************
 * Launch a PowerNote
 ***************************************************/
(async () => {
  const { inPowerChart, eventString } = await launchPowerNoteAsync({
    personId: 12345,
    encounterId: 54321,
    target: 'new',
    targetId: 'CKI!HAIR LOSS',
  });
  console.log(inPowerChart ? 'Currently in PowerChart' : 'NOT in PowerChart');
  console.log(`Event string: ${eventString}`);
})();

/**************************************************
 * Get a list of valid encounters for a patient
 **************************************************/
(async () => {
  const { inPowerChart, encounterIds } = await getValidEncountersAsync(3);
  console.log(`We are ${inPowerChart ? '' : 'not '}in PowerChart`);
  console.log(
    `We have ${
      encounterIds.length
    } valid encounters, with ID's: ${encounterIds.join(', ') || 'None'}`
  );
})();

/***************************************************
 * Manage an appointment
 ***************************************************/

(async () => {
  const { inPowerChart, success } = await manageAppointmentAsync(
    1,
    'view appt dialog'
  );
  console.log(
    `We are ${inPowerChart ? '' : 'not '}in PowerChart and the operation was ${
      success ? 'successful' : 'unsuccessful'
    }`
  );
})();
