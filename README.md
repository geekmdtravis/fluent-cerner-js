# fluent-cerner-js

A fluent `MPAGE_EVENT` string generation library.

| Environment | CI                                                                                                                             | Publish                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Production  | ![Main Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=main)               | ![Main Publish](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/publish.yml/badge.svg?branch=main) |
| Development | ![Development Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=development) | Not Applicable                                                                                                        |

## Resources

- [MPage Developer Guide - MPAGE_EVENT Orders](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT-ORDERS)

### Anatomy of an `MPAGE_EVENT` String

An `MPAGE_EVENT` string takes the form:

```
personId|encounterId|orderList|customizeFlags|tabList|defaultDisplay|silentSignFlag
```

Where `orderList` is a series of braces-contained, pipe-delimited strings that takes the form:

```
{orderAction|orderId|synonymId|orderOrigination|orderSentenceId|nomenclatureId|signTimeInteractionFlag}
```

Where `tabList` is a single brace-contained, pip-delimited string that takes the form:

```
{tab|tabDisplayFlags}
```

### Definitions

- `personId`: The `person_id` of the patient whose Modal Order Entry Window (MOEW) is to be displayed.
- `encounterId`: The `encntr_id` of the patient whose MOEW is to be displayed.
- `orderList`: The list of order actions and properties that define the data that is to be loaded into the MOEW.
  - A set that must be enclosed by curly brackets `{` and `}`.
  - If you want only to launch into the MOEW and not to add any new orders or perform any other order actions, an empty orderAction / orderProperties set of `{ORDER|0|0|0|0|0}` can be used.
- `orderAction`: The type of action to be performed on an order.
  - Must follow the `{"ORDER"|synonymId|orderOrigination|orderSentenceId|nomenclatureId|signTimeInteractionFlag}` signature.
    - `"ORDER"` The prototype for placing a new order.
  - Must follow the `{<ORDER_ACTION_TYPE>|orderId}` signature.
    - `"ACTIVATE"` - The prototype for activating an existing future order.
    - `"CANCEL DC"` The prototype for canceling / discontinuing an existing order.
    - `"CANCEL REORD"` The prototype for canceling and reordering an existing order.
    - `"CLEAR"` The prototype for clearing the future actions of an existing order.
    - `"CONVERT_INPAT"` The prototype for converting a historical or prescription order into an inpatient order.
    - `"CONVERT_RX"` The prototype for converting an existing non-prescription order to a prescription order.
    - `"MODIFY"` The prototype for modifying an existing order.
    - `"RENEW"` The prototype for renewing an existing non-prescription order.
    - `"RENEW_RX"` The prototype for renewing an existing prescription order.
    - `"REPEAT"` The prototype for copying an existing order.
    - `"RESUME"` The prototype for resuming an existing suspended order.
    - `"SUSPEND"` The prototype for suspending an existing order.
  - Child Paramters:
    - `orderId`: The `order_id` associated with an existing order.
    - `synonymId`: The `synonym_id` to be associated with the new order.
    - `orderOrigination`: The type of order to be associated with the new order. A value of represents a normal order.
      - `1`: Prescription order.
      - `5`: satellite order
    - `orderSenteceId`: The optional `order_sentence_id` to be associated with the new order.
    - `nomenclatureId`: The optional `nomenclature_id` to be associated with the new order.
    - `signTimeInterationFlag`: A Boolean flag to determine if interaction checking should only be performed at sign-time or not.
- `customizeFlags`: A set of flags that can be used to define the style of the MOEW.
  - `0`: default, no PowerPlans.
  - `24`: enable PowerPlans.
- `tabList`: The customization data for the different tab(s) of the MOEW.
  - A set that must be enclosed by the `{` and `}` braces.
  - Parameters within the sets are pipe-delimited.
  - Child Parameters
    - `tab`: The tab that is to be modified.
      - `2`: customizations to the Order List profile.
      - `3`: customizations to the Medication List profile.
    - `tabDisplayFlags`: A set of flags that can be used to define the style of the tab being altered by 'tab'.
      - `127` For full PowerOrders functionality.
- `defaultDisplay`: The view to display by default when launching into the MOEW.
  - `8`: default to the order search.
  - `16`: default to the order profile.
  - `32`: default to the orders for signature.
- `silentSignFlag` (optional): A Boolean flag used to determine if the MOEW should sign orders silently. When this flag is set, and the required details on each new order are pre-populated, it causes the orders to be signed automatically without displaying the MOEW. Orders are signed automatically when existing orders are not already on the scratchpad and no other orderActions are present.

### Example

One would read the following:

```
6204|3623|{REPEAT|123456}{REPEAT|654321}{REPEAT|987654}|24|{2|127}|16
```

As:

- For patient `6204`,
- In encounter `3623`,
- We will copy the following list orders by their `orderId`:
  - 123456
  - 654321
  - 987654
- With **PowerPlans** enabled,
- Customizing the **Order List Profile** with **PowerOrder** functionality
- Defaulting to the **Order Profile** view.

## API In Action: Create and Send Orders to MOEW

```js
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
```

You can also invoke the `toString()` override method to confirm your order string is correct.

```js
console.log(`MPage Event String:\n${mpageEvent}\n`);
```

Result:

```sh
1231251|812388|{REPEAT|12345}{ORDER|1343|1|0|0|0}{ORDER|3428|0|3|14|1}|24|{2|127}|16|0
```

## API in Action: Make a CCL call to pull data into you MPage

```js
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
```

## TypeScript Support

This library was developedin typescript and all relevant types are exported.

```tsx
import { makeCclRequest, CclCallParam } from 'fluent-cerner-js';
import { MyCustomResponse } from '../types';
// Other imports omitted in this example for clarity

const MyComponent = ({ user }) => {
  const [data, setData] = useState<MyCustomResponse>({});

  const handleButtonClick = () => {
    const userPidParam: CclCallParam = { type: 'number', param: user.pid };

    const opts: CclOpts = {
      prg: 'MY_CUSTOM_PRG_FILENAME',
      params: [userPidParam],
    };

    makeCclRequest<MyCustomResponse>(opts)
      .then(data => setData(data))
      .catch(error => addErrorToast(error));
  };

  return (
    <div>
      <h2>My Custom Component</h2>
      <p>Welcome, {user.name}</p>
      <button onClick={handleButtonClick}>Click Me to Get Data</button>
    </div>
  );
};
```
