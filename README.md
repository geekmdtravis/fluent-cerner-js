# fluent-cerner-js

A modern, fully typed API for interacting with the Cerner Millennium application from MPages which have access to the Discern native functions and COM objects. The `TypeScript` wrapper functions were created thoughtfully to enhance the productivity of software engineers tasked with building out MPage solutions: they replace hand-built event strings and COM object choreography with simple, promise-based function calls that are easy to read, test, and maintain.

This library is stable and in active use. It does not yet cover the complete set of Cerner Millennium functionality (see the [utility map](#utility-map) below for current and planned coverage), and new capabilities are added as they are needed and verified against real PowerChart environments.

| Environment | CI                                                                                                                             | Publish                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Production  | ![Main Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=main)               | ![Main Publish](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/publish.yml/badge.svg) |
| Development | ![Development Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=development) | Not Applicable                                                                                            |

## Installation

```bash
npm install fluent-cerner-js
```

If you plan to use `makeCclRequestAsync`, also install the peer dependency [`easy-ccl-request`](https://github.com/geekmdtravis/easy-ccl-request):

```bash
npm install easy-ccl-request
```

The package ships both ESM and CommonJS builds with full TypeScript declarations.

## Key Features

- **Promise-based**: every wrapper is `async` and resolves to a structured result object.
- **Fully typed**: function options, order actions, MOEW flags, and return shapes are all expressed as TypeScript types, so invalid input is caught at compile time.
- **Graceful outside of PowerChart**: when run outside of the PowerChart environment (e.g. local development in a browser), functions do not throw. They resolve with `inPowerChart: false`, and order-related functions log the event string that would have been sent so you can inspect it. `submitOrdersAsync` and `launchMOEWAsync` also support a `dryRun` option that returns the generated event string without invoking PowerChart at all.

## API In Action

### Place Orders

Placing orders through the `MPAGES_EVENT` function with the `ORDERS` directive, simplified. Just provide the patient ID, encounter ID, and an array of orders.

```typescript
const orders: Order[] = [
  { action: 'new order', id: 32461245 },
  { action: 'new order', id: 12341243 },
];

const { eventString, ordersPlaced, status } = await submitOrdersAsync(
  91294,
  123424,
  orders
);
```

### Launch the MOEW Without Adding Orders

Open the Modal Order Entry Window (MOEW) on its own — for example, to let the user search for and place orders interactively — using the Cerner-documented launch-only order token.

```typescript
const { inPowerChart, eventString } = await launchMOEWAsync(91294, 123424, {
  targetTab: 'power orders',
  launchView: 'search',
});
```

### Submit PowerPlan and Standalone Orders

Submit standalone orders and PowerPlan orders through the `POWERORDERS` COM object, with optional silent signing and interaction checking.

```typescript
const orders: Array<StandaloneOrder | PowerPlanOrder> = [
  { synonymId: 1343, origination: 'inpatient order' },
  { pathwayCatalogId: 14241, diagnosisIds: [12345, 67891] },
];
const { status, ordersPlaced } = await submitPowerOrdersAsync(
  91294,
  123424,
  orders
);
```

### Make a CCL Query

Make a request for a JSON object from a CCL end-point. Just pass the CCL program name (often referenced as the URL) and the parameters as an array of either strings or numbers.

```typescript
const { data, status, result } = await makeCclRequestAsync(
  '1_GET_VITALS_DT_RNG',
  [391414, 1234124, '2022-01-01', '2022-12-31']
);
```

**Note**: This project exposes the function `makeCclRequestAsync` through [`easy-ccl-request`](https://github.com/geekmdtravis/easy-ccl-request), which is a _peer dependency_. This function is used to make AJAX calls to CCL end-points. If you choose to use this function, you will need to install the peer dependency. This decision was made since `makeCclRequestAsync` is being leveraged in a number of different packages and we wanted to offer it as a stand-alone package without bringing in the entire `fluent-cerner-js` package. Please see the _package.json_ file for the supported versions of `easy-ccl-request`.

### Open a Chart Level Tab

Open a tab at the chart level. Just provide the patient ID, encounter ID, and the tab name.

```typescript
await openPatientTabAsync(12341, 197777, 'Orders');
```

### More

There are many more functionalities listed below.

## Utility Map

| Discern                                        | _fluent-cerner-js_                  | Description                                                                |
| ---------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `APPLINK`                                      | `openApplicationAsync`              | Opens a file, URL, executable, shell executable, or application object     |
|                                                | &rdsh; `openOrganizerTabAsync`      | Opens a tab at the organizer level.                                        |
|                                                | &rdsh; `openPatientTabAsync`        | Opens a tab at the patient level.                                          |
|                                                | &rdsh; `openWebsiteByUrlAsync`      | Opens a URL in a new window from PowerChart.                               |
| `CCLEVENT`                                     | (no support planned)                | Evoke special solution-specific events from within a web page.             |
| `CCLLINK`                                      | (no support planned)                | Link CCL reports within a given MPage.                                     |
| `CCLLINKPOPUP`                                 | (no support planned)                | Link CCL reports, launch in a new Internet Explorer&reg; pop-up.           |
| `CCLNEWSESSIONWINDOW`                          | (will review)                       | Open a link (a URL) in a new _Discern Output Viewer_ window.               |
| `DiscernObjectFactory("CINFOBUTTONLINK")`      | (will review)                       | Communicate information between MPages and the Infobutton service.         |
| `DiscernObjectFactory("DISCHARGEPROCESS")`     | `launchDischargeProcessAsync`       | Launch the discharge process module.                                       |
| `DiscernObjectFactory("DYNDOC")`               | &mdash;                             | Create new Dynamic Documentation notes and modify existing ones.           |
|                                                | &rdsh; `createNewDocumentAsync`     | Create a new document, launching the DYNDOC modal.                         |
|                                                | &rdsh; `addAddendumToDocumentAsync` | Add an addendum to an existing document.                                   |
| `DiscernObjectFactory("KIACROSSMAPPING")`      | (will review)                       | Map a nomenclature from one nomenclature terminology set to another.       |
| `DiscernObjectFactory("ORDERS")`               | (no support planned)                | Launch the MOEW and execute orders-related actions.                        |
| `DiscernObjectFactory("PATIENTEDUCATION")`     | `launchPatientEducationAsync`       | Launches patient education.                                                |
| `DiscernObjectFactory("PEXAPPLICATIONSTATUS")` | (will review)                       | Provides a means to decide if a given MPage is in view.                    |
| `DiscernObjectFactory("PEXSCHEDULINGACTIONS")` | `manageAppointmentAsync`            | Launch various Cerner Scheduling functions.                                |
| `DiscernObjectFactory("PMLISTMAINTENANCE")`    | (planned)                           | Launch the patient list maintenance dialog.                                |
| `DiscernObjectFactory("POWERFORM")`            | `launchPowerFormAsync`              | Launch a PowerForm.                                                        |
| `DiscernObjectFactory("POWERNOTE")`            | `launchPowerNoteAsync`              | Launch a PowerNote.                                                        |
| `DiscernObjectFactory("POWERORDERS")`          | &mdash;                             | Interact with the PowerOrders MOEW dialog from within an MPage.            |
|                                                | &rdsh; `submitPowerOrdersAsync`     | Submit PowerPlan and standalone orders.                                    |
| `DiscernObjectFactory("PREGNANCY")`            | (planned)                           | Launch dialogs used for managing an active pregnancy                       |
| `DiscernObjectFactory("PVCONTXTMPAGE")`        | `getValidEncountersAsync`           | Gets an array of valid encounter ID's for a given patient.                 |
| `DiscernObjectFactory("PVFRAMEWORKLINK")`      | (will review)                       | Communicate information to the Win32 components of PowerChart.             |
| `DiscernObjectFactory("PVPATIENTFOCUS")`       | (planned)                           | Set and clear a patient's focus within the Powerchart framework.           |
| `DiscernObjectFactory("PVPATIENTSEARCHMPAGE")` | (planned)                           | Launch the patient search dialogue.                                        |
| `DiscernObjectFactory("PVVIEWERMPAGE")`        | (planned)                           | Launch various result viewers for docs, reminders, and more.               |
| `DiscernObjectFactory("TASKDOC")`              | (planned)                           | Launch the task documentation dialog or to launch the print labels dialog. |
| `MESSAGING`                                    | (planned)                           | Register, unregister, send, and receive messages between MPages.           |
| `MPAGE_EVENT("ALLERGY",...)`                   | (planned)                           | Allergy conversation will be launched.                                     |
| `MPAGE_EVENT("CLINICALNOTE",...)`              | `launchClinicalNoteAsync`           | Launch a clinical note.                                                    |
| `MPAGE_EVENT("POWERFORM",...)`                 | (will review)                       | PowerForm conversation will be launched.                                   |
| `MPAGE_EVENT("POWERNOTE",...)`                 | `launchClinicalNoteAsync`           | PowerNote conversation will be launched.                                   |
| `MPAGE_EVENT("ORDERS",...)`                    | &mdash;                             | Orders conversation with the MOEW.                                         |
|                                                | &rdsh; `submitOrdersAsync`          | Submits one or more orders to MOEW.                                        |
|                                                | &rdsh; `launchMOEWAsync`            | Launches the MOEW without adding any orders.                               |
| `MPAGES_SVC_EVENT`                             | (planned)                           | Launch the Discern MPages Web Service.                                     |
| `MPAGES_OVERRIDE_REFRESH`                      | (planned)                           | Change the behavior of the MPage when a refresh event is received.         |
| `MPAGES_OVERRIDE_PRINT`                        | (planned)                           | Change the behavior of the MPage when a print event is received.           |
| _Patient List Navigation_                      | (no support planned)                | &mdash;                                                                    |
| &rdsh;`PCEdgeActivatePatArrows`                | (no support planned)                | Activates the patient navigation buttons.                                  |
| &rdsh;`PCEdgePatNavSetCallback`                | (no support planned)                | Set a handler callback func for when navigation arrows are pressed.        |
| `PCUPDATEREFRESHTIME`                          | (no support planned)                | Update the refresh button to show how long ago the data was updated.       |
| `XMLCclRequest`                                | `makeCclRequestAsync`               | Makes an AJAX call to a CCL end-point.                                     |

## Development

Development requires Node.js `>=22` and `npm` (Yarn is not supported).

```bash
npm install        # install dependencies (also sets up husky hooks and builds)
npm test           # run the test suite (vitest)
npm run lint       # lint with eslint
npm run typecheck  # type-check with tsc
npm run build      # build ESM + CJS bundles with tsup
```

CI runs the full format check, lint, typecheck, test, and build pipeline on Linux, Windows, and macOS against Node 22.x and 24.x. Releases are published to npm with provenance via OIDC trusted publishing.

## License

[MIT](LICENSE)
