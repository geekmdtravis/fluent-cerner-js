# fluent-cerner-js

A modern API for interacting with MPages in the Cerner Millennium application which have access to the Discern Native functions and COM objects. Modern `Typescript` wrapper functions were created without thoughtfullness to enhance the productivity of software engineers tasked with building out MPage solutions. This software is in it's alpha stage and should be used with caution. Additionally, it doesn't cover a full set of the Cerner Millennium application's functionality. It is a work in progress.

| Environment | CI                                                                                                                             | Publish                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Production  | ![Main Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=main)               | ![Main Publish](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/publish.yml/badge.svg) |
| Development | ![Development Build](https://github.com/geekmdtravis/fluent-cerner-js/actions/workflows/main.yml/badge.svg?branch=development) | Not Applicable                                                                                            |

## Contributors

If you'd like to become a contributor, please contact the primary author.

- [Travis Nesbit, MD (geekmdtravis)](https://github.com/geekmdtravis/) - Primary Author
- [Daniel "Danny" Lara, MD (dl2github)](https://github.com/dl2github)

## API In Action

### Place Orders

Placing orders through the `MPAGES_EVENT` fuction with the `ORDERS` directive, simplified. Just provided the patient ID, encounter ID, and an array of orders.

```typescript
const orders: Order[] = [
  { action: 'new order', id: 32461245 },
  { action: 'new order', id: 12341243 },
];
const { eventString } = await submitOrdersAsync(91294, 123424, orders);
```

### Make a CCL Query

Make a requestion for a JSON object from a CCL end-point. Just pass the CCL program name (often referenced as the URL) and the parameters as an array of either strings or numbers.

```typescript
const {
  data,
  status,
  result,
} = await makeCclRequestAsync('1_GET_VITALS_DT_RNG', [
  391414,
  1234124,
  '2022-01-01',
  '2022-12-31',
]);
```

**Note**: This project exposes the function `makeCclRequestAsync` through [`easy-ccl-request`](https://github.com/geekmdtravis/easy-ccl-request) and is a _peer dependency_. This function is used to make AJAX calls to CCL end-points. If you choose to use this function, you will need to install the peer dependency. This decision was made since `makeCclRequestAsync` is being leveraged in a number of different packages and I wanted to offer it as a stand-alone package without bringing in the entire `fluent-cerner-js` package, which itself is dependent on a limited set of dependencies. Please see the _package.json_ file for the current version of `easy-ccl-request` to see the supported versions.

### Open a Chart Level Tab

Open a tab at the chart level. Just provide the patient ID, encounter ID, and the tab name.

```typescript
await openPatientTabAsync(12341, 197777, 'Orders');
```

### More

There are many more funcionalties listed below.

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
|                                                | &rdsh; `submitPowerOrdersAsync`     | Submit PowerPlan orders.                                                   |
| `DiscernObjectFactory("PREGNANCY")`            | (planned)                           | Launch dialogs used for managing an active pregnancy                       |
| `DiscernObjectFactory("PVCONTXTMPAGE")`        | `getValidEncountersAsync`           | Gets an array valid encounter ID's for a given patient.                    |
| `DiscernObjectFactory("PVFRAMEWORKLINK")`      | (will review)                       | Communicate infomration ot the Win32 components of PowerChart.             |
| `DiscernObjectFactory("PVPATIENTFOCUS")`       | (planned)                           | Set and clear a patient's focus within the Powerchart framework.           |
| `DiscernObjectFactory("PVPATIENTSEARCHMPAGE")` | (planned)                           | Launch the patient search dialogue.                                        |
| `DiscernObjectFactory("PVVIEWERMPAGE")`        | (planned)                           | Launch various result viewers for docs, reminders, and more.               |
| `DiscernObjectFactory("TASKDOC")`              | (planned)                           | Launch the task documentation dialog or to launch the print labels dialog. |
| `MESSAGING`                                    | (planned)                           | Register, unregister, send, and receive messages between MPages.           |
| `MPAGE_EVENT("ALLERGY",...)`                   | (planned)                           | Allergy conversation will be launched.                                     |
| `MPAGE_EVENT("CLINICALNOTE",...)`              | `launchClinicalNoteAsync`           | Launch a clinical note.                                                    |
| `MPAGE_EVENT("POWERFORM",...)`                 | (will review)                       | PowerForm conversation will be launched.                                   |
| `MPAGE_EVENT("POWERNOTE",...)`                 | `launchClinicalNoteAsync`           | PowerNote conversation will be launched.                                   |
| `MPAGE_EVENT("ORDERS",...)`                    | `submitOrdersAsync`                 | Submits one or more orders to MOEW.                                        |
| `MPAGES_SVC_EVENT`                             | (planned)                           | Launch the Discern MPages Web Service.                                     |
| `MPAGES_OVERRIDE_REFRESH`                      | (planned)                           | Change the behavior of the MPage when a refresh event is received.         |
| `MPAGES_OVERRIDE_PRINT`                        | (planned)                           | Change the behavior of the MPage when a print event is received.           |
| _Patient List Navigation_                      | (no support planned)                | &mdash;                                                                    |
| &rdsh;`PCEdgeActivatePatArrows`                | (no support planned)                | Activates the pateint navigation buttons.                                  |
| &rdsh;`PCEdgePatNavSetCallback`                | (no support planned)                | Set a handler callback func for when navigation arrows are pressed.        |
| `PCUPDATEREFRESHTIME`                          | (no support planned)                | Update the refresh button to show how long ago the data was updated.       |
| `XMLCclRequest`                                | `makeCclRequestAsync`               | Makes an AJAX call to a CCL end-point.                                     |

