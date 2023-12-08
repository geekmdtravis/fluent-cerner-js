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

Please see `demo.ts` to see the API in action. To _run_ the demo, you will need to use `ts-node`.

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
