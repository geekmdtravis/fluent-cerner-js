# fluent-cerner-js

A modern API for interacting with the Cerner Millennium application. Modern Typescript/Javascript wrappers have been created to enhance the productivity of software engineers who are tasked with interacting with the Cerner Millennium application. This software is in it's alpha stage and should be used with caution. Additionally, it doesn't cover a full set of the Cerner Millennium application's functionality. It is a work in progress.

| Environment | CI                                                                                                                             | Publish                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Production  | ![Main Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=main)               | ![Main Publish](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/publish.yml/badge.svg) |
| Development | ![Development Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=development) | Not Applicable                                                                                            |

## Contributors

- [Travis Nesbit, MD (geekmdtravis)](https://github.com/geekmdtravis/) - Primary Author
- [Daniel "Danny" Lara, MD (dl2github)](https://github.com/dl2github)

## API In Action

### Create and Send Orders to MOEW

```js
const o1 = orderString('copy existing', { orderId: 12345 });

const o2 = orderString('new order', {
  newOrderOpts: {
    synonymId: 1343,
    origination: 'prescription',
  },
});

const o3 = orderString('new order', {
  newOrderOpts: {
    synonymId: 3428,
    orderSentenceId: 3,
    nomenclatureIds: [14, 15],
    interactionCheck: 'on sign',
  },
});

submitOrders(123, 456, [o1, o2, o3]);
```

### Make a CCL Request from an MPage

Using the provided tooling inside of PowerChart, making a CCL request is a complex endeavor. This library abstracts away the complexity and provides a simple interface for making CCL requests and provides an easy way to handle the response asynchronously. It returns a `Promise`.

#### Using `Promise` syntax

```ts
const opts: CclOpts = {
  prg: 'MP_GET_ORDER_LIST',
  params: [
    { type: 'number', param: 12345 },
    { type: 'string', param: 'joe' },
  ],
};

makeCclRequestAsync(opts)
  .then(data => setData(data))
  .catch(err => console.error(err))
  .finally(() => console.log("I'm done!"));
```

#### Using `async/await`

```ts
const opts: CclOpts = {
  prg: 'MP_GET_ORDER_LIST',
  params: [
    { type: 'number', param: 12345 },
    { type: 'string', param: 'joe' },
  ],
};

try {
  const data = await makeCclRequestAsync(opts);
  setData(result);
} catch (error) {
  console.error(error);
} finally {
  console.log("I'm done!");
}
```

### Launch a Clinical Note

```ts
const opts: ClinicalNoteOpts = {
  personId: 8316243,
  encounterId: 12575702,
  eventIds: [155543],
  windowTitle: 'Clinical Notes Title',
  viewOptionFlags: ['view-only'],
};

const { inPowerChart, eventString } = await launchClinicalNoteAsync(opts);
```

### Launch PowerForm

```ts
const opts: PowerFormOpts = {
  personId: 733757,
  encounterId: 701346,
  target: 'completed form',
  targetId: 15721144,
  permissions: 'modify',
};

const { inPowerChart, eventString } = await launchPowerFormAsync(opts);
```

### Launch a PowerNote

```ts
const opts: PowerNoteOpts = {
  personId: 123456,
  encounterId: 78910,
  target: 'existing',
  targetId: 1337,
};

const { inPowerChart, eventString } = await launchPowerNoteAsync(opts);
```

### Launch a Tab at the Organizer Level

Open a tab at the organizer level (no patient context). Arguments provided are _tab name_.

```ts
const { inPowerChart, eventString, badInput } = await openOrganizerTabAsync(
  'Tab Name'
);
```

### Launch a Tab at the Patient Level

Open a tab at the patient level (patient context is present). Arguments provided are _person ID_, _encounter ID_, _tab name_, and optional _boolean_ for whether or not attempt to open a _Quick Add_ tab (not available in all tabs).

```ts
const { inPowerChart, eventString, badInput } = await openPatientTabAsync(
  12345,
  51353,
  'Tab Name',
  true
);
```

### Verification and Context Validation

Each function will return an object `{eventString: string, inPowerChart: boolean}`. This object can be used to verify the event string and context of the application. `eventString` does not give information about the function called, but does give a final representation of the string that is being fed into the relevant function and is therefore useful for debugging. If you're developing outside of PowerChart the error generated will be caught and logged to the console along with returning the object with the `inPowerChart` property set to `false`.

```ts
const { eventString, inPowerChart, badInput } = openPatientTabAsync(
  0,
  1,
  'Tab Name',
  true
);

if (badInput) {
  dispatch(appWarning('Bad input was provided to the function!'));
}

if (!inPowerChart) {
  dispatch(
    appWarning(
      `You're not in PowerChart! The generated event string is ${eventString}`
    )
  );
}
```

## TypeScript Support

This library was developed with _TypeScript_ and all relevant types are exported.

```tsx
import { makeCclRequest, CclCallParam, CclOpts } from 'fluent-cerner-js';
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

    makeCclRequestAsync<MyCustomResponse>(opts)
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

---

## Resources

- [MPage Developer Guide - MPAGE_EVENT Orders](https://wiki.cerner.com/display/public/MPDEVWIKI/MPAGES_EVENT-ORDERS)

## Anatomy of an `MPAGE_EVENT` String for the `ORDER` type.

### Background: Examples

**Copying two orders:**

```
6204|3623|{REPEAT|123456}{REPEAT|654321}{REPEAT|987654}|24|{2|127}|16
```

Read the above string to say:

- For patient `6204`,
- In encounter `3623`,
- We will copy the following list orders by their `orderId`:
  - 123456
  - 654321
  - 987654
- With **PowerPlans** enabled,
- Customizing the **Order List Profile** with **PowerOrder** functionality
- Defaulting to the **Order Profile** view.

**Placing two new orders:**

```
"6204|3623|{ORDER|123456|0|0|[961514]|1}{ORDER|654321|0|0|[1029704|1029801|961514]|1}|24|{2|127}|16|1"
```

Read the above string to say:

- For patient `6204`,
- In encounter `3623`,
- We will place new orders for the following list orders by their `orderId`:
  - 123456
    - Having a single `nomenclatureId` of `961514` (e.g. a single diagnosis)
  - 654321
    - Having multiple `nomenclatureId`'s of `1029704`, `1029801`, and `961514` (e.g multiple diagnoses)
- With **PowerPlans** enabled,
- Customizing the **Order List Profile** with **PowerOrder** functionality
- Defaulting to the **Order Profile** view.
- Placing orders **silently** (no confirmation dialog)

When passed as the second argument to the `MPAGES_EVENT` function (first argument is the string `"ORDERS"`), this event string will instruct the Cerner Millennium application to silently place two orders, one with multiple `nomenclatureId`s and one with a single `nomenclatureId`, into the patient's order list.

Example raw usage of the `MPAGES_EVENT` function with a manually constructed string:

```html
<a
  href='javascript:MPAGES_EVENT("ORDERS","8316243|12575702|{ORDER|0|0|0|0|0}|0|{2|127}{3|127}|8")'
  >Add a new order</a
>
```

### Breakdown of the `MPAGE_EVENT` string for the `ORDER` type

An `MPAGE_EVENT` string takes the form:

```
personId|encounterId|orderList|customizeFlags|tabList|defaultDisplay|silentSignFlag
```

Where `orderList` is a series of braces-contained, pipe-delimited strings that takes the form:

```
{orderAction|orderId|synonymId|orderOrigination|orderSentenceId|nomenclatureId|signTimeInteractionFlag}
```

or where there are multiple `nomenclatureId`'s, will take the form:

```
{orderAction|orderId|synonymId|orderOrigination|orderSentenceId|[nomenclatureId1|nomenclatureId2|...|nomenclatureIdN]|signTimeInteractionFlag}
```

Where `tabList` is a single brace-contained, pip-delimited string that takes the form:

```
{tab|tabDisplayFlags}
```

### Definitions of `MPAGES_EVENT` variables for the `ORDER` type

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
    - `synonymId`: The `synonym_id` to be associated with the new order. This can be thought of the identifier for a given order. E.g. _atorvastatin_.
    - `orderOrigination`: The type of order to be associated with the new order. A value of represents a normal order.
      - `1`: Prescription order.
      - `5`: satellite order
    - `orderSenteceId`: The optional `order_sentence_id` to be associated with the new order. This can be thought of as the value that specifies which variant of an order is placed. E.g. for _atovastatin_ you will likely have multiple order sentences to support dosing variants like _10 mg once daily_ vs _5_ mg once daily\_.
    - `nomenclatureId`: The optional `nomenclature_id` to be associated with the new order. This is generally a value that will be linked to an ICD code or SNOMED code. Thus the need to support multiple `nomenclatureId`'s for any given order.
    - `signTimeInterationFlag`: A Boolean flag to determine if interaction checking should only be performed at sign-time or not.
- `customizeFlags`: A set of flags that can be used to define the style of the MOEW.
  - `0`: no PowerPlans.
  - `24`: enable PowerPlans.
- `tabList`: The customization data for the different tab(s) of the MOEW.
  - A set that must be enclosed by the `{` and `}` braces.
  - Parameters within the sets are pipe-delimited.
  - Child Parameters
    - `tab`: The tab that is to be modified.
      - `2`: customizations to the Order List profile.
      - `3`: customizations to the Medication List profile.
    - `tabDisplayFlags`: A set of flags that can be used to define the style of the tab being altered by 'tab'.
      - `0`: no PowerOrders functionality.
      - `127` For full PowerOrders functionality.
- `defaultDisplay`: The view to display by default when launching into the MOEW.
  - `8`: default to the order search.
  - `16`: default to the order profile.
  - `32`: default to the orders for signature.
- `silentSignFlag`: A Boolean flag used to determine if the MOEW should sign orders silently. When this flag is set, and the required details on each new order are pre-populated, it causes the orders to be signed automatically without displaying the MOEW. Orders are signed automatically when existing orders are not already on the scratchpad and no other orderActions are present.
  - `0`: do not sign orders silently.
  - `1`: sign orders silently.
