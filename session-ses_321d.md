# NPM publish 404: fluent-cerner-js not in registry

**Session ID:** ses_321d81fd0ffew7AKQs8qFVTOOD
**Created:** 3/11/2026, 11:28:01 AM
**Updated:** 3/11/2026, 11:29:37 AM

---

## User

npm is saying that fluent-cerner-js is not in the registry, but I can go right to the page for it. 2s
Run npm publish --access public

> fluent-cerner-js@1.1.0-0 prepare
> npm run build


> fluent-cerner-js@1.1.0-0 build
> tsup

CLI Building entry: src/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.1
CLI Using tsup config: /home/runner/work/fluent-cerner-js/fluent-cerner-js/tsup.config.ts
CLI Target: node16
CLI Cleaning output folder
CJS Build start
ESM Build start
ESM dist/index.js     30.32 KB
ESM dist/index.js.map 115.10 KB
ESM ⚡️ Build success in 47ms
CJS dist/index.cjs     32.41 KB
CJS dist/index.cjs.map 115.17 KB
CJS ⚡️ Build success in 47ms
Build completed successfully!
DTS Build start
DTS ⚡️ Build success in 991ms
DTS dist/index.d.cts 42.69 KB
DTS dist/index.d.ts  42.69 KB
npm notice
npm notice 📦  fluent-cerner-js@1.1.0-0
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 11.2kB README.md
npm notice 33.2kB dist/index.cjs
npm notice 117.9kB dist/index.cjs.map
npm notice 43.7kB dist/index.d.cts
npm notice 43.7kB dist/index.d.ts
npm notice 31.0kB dist/index.js
npm notice 117.9kB dist/index.js.map
npm notice 1.3kB package.json
npm notice 2.2kB src/addAddendumToDocumentAsync.spec.ts
npm notice 1.3kB src/addAddendumToDocumentAsync.ts
npm notice 5.4kB src/createNewDocumentAsync.spec.ts
npm notice 2.5kB src/createNewDocumentAsync.ts
npm notice 2.5kB src/getValidEncountersAsync.spec.ts
npm notice 1.3kB src/getValidEncountersAsync.ts
npm notice 14.1kB src/index.ts
npm notice 3.2kB src/launchClinicalNoteAsync.spec.ts
npm notice 4.5kB src/launchClinicalNoteAsync.ts
npm notice 946B src/launchDischargeProcessAsync.spec.ts
npm notice 787B src/launchDischargeProcessAsync.ts
npm notice 2.0kB src/launchPatientEducationAsync.spec.ts
npm notice 1.1kB src/launchPatientEducationAsync.ts
npm notice 3.1kB src/launchPowerFormAsync.spec.ts
npm notice 2.5kB src/launchPowerFormAsync.ts
npm notice 1.7kB src/launchPowerNoteAsync.spec.ts
npm notice 2.0kB src/launchPowerNoteAsync.ts
npm notice 6.5kB src/manageAppointmentAsync.spec.ts
npm notice 2.4kB src/manageAppointmentAsync.ts
npm notice 3.5kB src/openApplicationAsync.spec.ts
npm notice 4.1kB src/openApplicationAsync.ts
npm notice 2.3kB src/openOrganizerTabAsync.spec.ts
npm notice 994B src/openOrganizerTabAsync.ts
npm notice 2.8kB src/openPatientTabAsync.spec.ts
npm notice 1.8kB src/openPatientTabAsync.ts
npm notice 1.4kB src/openWebsiteByUrlAsync.spec.ts
npm notice 987B src/openWebsiteByUrlAsync.ts
npm notice 15.7kB src/submitOrdersAsync.spec.ts
npm notice 12.8kB src/submitOrdersAsync.ts
npm notice 34.8kB src/submitPowerOrdersAsync.spec.ts
npm notice 12.9kB src/submitPowerOrdersAsync.ts
npm notice 6.4kB src/utils/addNewOrdersToScratchPadAsync.spec.ts
npm notice 3.3kB src/utils/addNewOrdersToScratchPadAsync.ts
npm notice 3.9kB src/utils/addPowerPlanWithDetailsAsync.spec.ts
npm notice 2.8kB src/utils/addPowerPlanWithDetailsAsync.ts
npm notice 1.6kB src/utils/calculateMOEWBitmask.spec.ts
npm notice 5.2kB src/utils/calculateMOEWBitmask.ts
npm notice 2.3kB src/utils/createMOEWAsync.spec.ts
npm notice 1.8kB src/utils/createMOEWAsync.ts
npm notice 5.0kB src/utils/createOrderString.spec.ts
npm notice 4.3kB src/utils/createOrderString.ts
npm notice 1.4kB src/utils/destroyMOEWAsync.spec.ts
npm notice 959B src/utils/destroyMOEWAsync.ts
npm notice 1.4kB src/utils/displayMOEWAsync.spec.ts
npm notice 1.1kB src/utils/displayMOEWAsync.ts
npm notice 4.2kB src/utils/getOrdersPlacedAsync.spec.ts
npm notice 7.5kB src/utils/getOrdersPlacedAsync.ts
npm notice 789B src/utils/index.ts
npm notice 1.4kB src/utils/signOrdersAsync.spec.ts
npm notice 1.4kB src/utils/signOrdersAsync.ts
npm notice Tarball Details
npm notice name: fluent-cerner-js
npm notice version: 1.1.0-0
npm notice filename: fluent-cerner-js-1.1.0-0.tgz
npm notice package size: 119.4 kB
npm notice unpacked size: 612.1 kB
npm notice shasum: 0fe94c6f0a3235a72d2f931cc648e856c327c8ad
npm notice integrity: sha512-dmRhaGJhEYIfa[...]56iBzVnjI6zHA==
npm notice total files: 59
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/fluent-cerner-js - Not found
npm error 404
npm error 404  'fluent-cerner-js@1.1.0-0' is not in this registry.
npm error 404
npm error 404 Note that you can also install from a
npm error 404 tarball, folder, http url, or git url.
npm error A complete log of this run can be found in: /home/runner/.npm/_logs/2026-03-11T18_22_08_071Z-debug-0.log
Error: Process completed with exit code 1. 

---

## Assistant (Plan · claude-opus-4-6 · 7.8s)



This is a common npm publishing issue. The `E404` error on `PUT` when publishing typically means one of these things:

1. **The package name is scoped but published without a scope** — but that doesn't seem to be the case here since it's `fluent-cerner-js` (unscoped).

2. **The npm account doesn't own the package name** — if the package already exists on the registry under a different account, you can't publish to it.

3. **The package was unpublished and is in a 24-hour cooldown** — npm prevents re-publishing a package name for 24 hours after it's been unpublished.

4. **The npm token/auth doesn't have publish permissions** — the token used in CI may lack the `publish` scope.

Let me check your `package.json` to understand the current configuration:

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/travis/Development/fluent-cerner-js/package.json"
}
```

**Output:**
```
<path>/home/travis/Development/fluent-cerner-js/package.json</path>
<type>file</type>
<content>1: {
2:   "version": "1.1.0-0",
3:   "license": "MIT",
4:   "type": "module",
5:   "main": "dist/index.js",
6:   "typings": "dist/index.d.ts",
7:   "files": [
8:     "dist",
9:     "src"
10:   ],
11:   "engines": {
12:     "node": ">=22",
13:     "yarn": "please-use-npm"
14:   },
15:   "scripts": {
16:     "build": "tsup",
17:     "test": "vitest run",
18:     "test:watch": "vitest",
19:     "lint": "eslint src",
20:     "prepare": "npm run build",
21:     "size": "size-limit",
22:     "analyze": "size-limit --why",
23:     "demo": "npx node demo.js"
24:   },
25:   "prettier": {
26:     "printWidth": 80,
27:     "semi": true,
28:     "singleQuote": true,
29:     "trailingComma": "es5"
30:   },
31:   "name": "fluent-cerner-js",
32:   "author": "geekmdtravis",
33:   "module": "dist/index.mjs",
34:   "devDependencies": {
35:     "@typescript-eslint/eslint-plugin": "8.57.0",
36:     "@typescript-eslint/parser": "8.57.0",
37:     "eslint": "10.0.3",
38:     "jsdom": "^25.0.0",
39:     "tslib": "^2.8.0",
40:     "tsup": "^8.3.0",
41:     "typescript": "^5.7.0",
42:     "vitest": "^2.1.0"
43:   },
44:   "dependencies": {
45:     "fast-xml-parser": "^4.5.4"
46:   },
47:   "peerDependencies": {
48:     "easy-ccl-request": "^1.0.0"
49:   },
50:   "overrides": {
51:     "vite": {
52:       "esbuild": "^0.25.0"
53:     }
54:   },
55:   "jest": {
56:     "verbose": true,
57:     "silent": true,
58:     "collectCoverage": true,
59:     "testPathIgnorePatterns": [
60:       "index.ts"
61:     ],
62:     "coveragePathIgnorePatterns": [
63:       "index.ts"
64:     ]
65:   }
66: }

(End of file - total 66 lines)
</content>
```

---

## Assistant (Plan · claude-opus-4-6 · 55.4s)

I notice something important: **your `package.json` is missing the `"name"` field at the top level in the expected position — wait, it is there on line 31, just placed after other fields.** That's fine structurally, but let me note the key issue:

The version is `1.1.0-0` — this is a **prerelease** version. You mentioned you can "go right to the page for it" — meaning the package already exists on npmjs.com.

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "A few clarifying questions to diagnose this:\n\n1. Can you confirm the package already exists at https://npmjs.com/package/fluent-cerner-js under your account (geekmdtravis)?\n2. Was this package recently unpublished or did the npm org/account ownership change?\n3. Is this running in GitHub Actions? If so, is the NPM_TOKEN a Granular Access Token or a Classic/Automation token? (Granular tokens need the specific package listed in their scope)\n4. Have you successfully published earlier versions (e.g., 1.0.x) of this package before?",
      "header": "Diagnosis questions",
      "options": [
        {
          "label": "Yes, it exists on npm",
          "description": "The package page is live at npmjs.com/package/fluent-cerner-js under my account"
        },
        {
          "label": "It was recently unpublished",
          "description": "I unpublished the package recently and am trying to re-publish"
        },
        {
          "label": "Using Granular Access Token",
          "description": "The NPM_TOKEN in CI is a Granular Access Token (not Classic/Automation)"
        },
        {
          "label": "Previously published fine",
          "description": "Earlier versions published successfully from the same setup"
        }
      ],
      "multiple": true
    }
  ]
}
```

**Output:**
```
User has answered your questions: "A few clarifying questions to diagnose this:

1. Can you confirm the package already exists at https://npmjs.com/package/fluent-cerner-js under your account (geekmdtravis)?
2. Was this package recently unpublished or did the npm org/account ownership change?
3. Is this running in GitHub Actions? If so, is the NPM_TOKEN a Granular Access Token or a Classic/Automation token? (Granular tokens need the specific package listed in their scope)
4. Have you successfully published earlier versions (e.g., 1.0.x) of this package before?"="Previously published fine, Confirm yourself. https://www.npmjs.com/package/fluent-cerner-js, Yes, it exists on npm". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · claude-opus-4-6 · 3.0s)

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://www.npmjs.com/package/fluent-cerner-js",
  "format": "text"
}
```

**Error:**
```
Error: Request failed with status code: 403
```

---

## Assistant (Plan · claude-opus-4-6 · 4.1s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm view fluent-cerner-js 2>&1 || true",
  "description": "Check npm registry for package info"
}
```

**Output:**
```

fluent-cerner-js@1.0.0 | MIT | deps: 1 | versions: 29
A modern API for interacting with MPages in the Cerner Millennium application which have access to the Discern Native functions and COM objects. Modern `Typescript` wrapper functions were created without thoughtfullness to enhance the productivity of soft

dist
.tarball: https://registry.npmjs.org/fluent-cerner-js/-/fluent-cerner-js-1.0.0.tgz
.shasum: 87322e91135fc0de583946bbad2fa32fa0aecc63
.integrity: sha512-sK7jjbkh57Up79qZWwSgWdPi1eotIUlqy2kzfyxIP5vAQGHTYpyeM9bJy6AiV+bhcMP2kW/FBQXRf+MRQ97g+Q==
.unpackedSize: 845.3 kB

dependencies:
fast-xml-parser: 4.2.6

maintainers:
- geekmdtravis <travis@geekmd.io>

dist-tags:
latest: 1.0.0

published 6 months ago by geekmdtravis <travis@geekmd.io>

```

---

## Assistant (Plan · claude-opus-4-6 · 5.4s)

**Tool: bash**

**Input:**
```json
{
  "command": "npm view fluent-cerner-js versions --json 2>&1 | head -40",
  "description": "List all published versions"
}
```

**Output:**
```
[
  "0.1.0",
  "0.1.1",
  "0.1.2",
  "0.1.4",
  "0.2.0-alpha.0",
  "0.2.1-alpha.0",
  "0.3.1-alpha.0",
  "0.3.2-alpha.0",
  "0.3.3-alpha.0",
  "0.3.4-alpha.0",
  "0.5.1-alpha.0",
  "0.5.2-alpha.0",
  "0.5.3-alpha.0",
  "0.6.0-alpha.0",
  "0.6.1-alpha.0",
  "0.6.2-alpha.0",
  "0.7.0-alpha.0",
  "0.7.1-alpha.0",
  "0.7.2-alpha.0",
  "0.8.0-alpha.0",
  "0.9.0-alpha.0",
  "1.0.0-0",
  "1.0.0-1",
  "1.0.0-2",
  "1.0.0-3",
  "1.0.0-4",
  "1.0.0-5",
  "1.0.0-6",
  "1.0.0"
]

```

---

## Assistant (Plan · claude-opus-4-6 · 4.9s)

Good — the package exists on the registry, you're the maintainer, and there are 29 published versions including the current `latest: 1.0.0`. The registry is accessible and the package is not unpublished.

Now, let me check your CI/publishing workflow to understand the auth setup:

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.github/workflows/*.{yml,yaml}"
}
```

**Output:**
```
/home/travis/Development/fluent-cerner-js/.github/workflows/publish.yml
/home/travis/Development/fluent-cerner-js/.github/workflows/main.yml
/home/travis/Development/fluent-cerner-js/.github/workflows/size.yml
```

**Tool: glob**

**Input:**
```json
{
  "pattern": "**/.npmrc"
}
```

**Output:**
```
/home/travis/Development/fluent-cerner-js/.npmrc
```

---

## Assistant (Plan · claude-opus-4-6 · 2.9s)

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/travis/Development/fluent-cerner-js/.github/workflows/publish.yml"
}
```

**Output:**
```
<path>/home/travis/Development/fluent-cerner-js/.github/workflows/publish.yml</path>
<type>file</type>
<content>1: name: NPM Publish
2: on:
3:   release:
4:     types: [published]
5: jobs:
6:   build:
7:     runs-on: ubuntu-latest
8:     steps:
9:       - name: Checkout repo
10:         uses: actions/checkout@v4
11: 
12:       - name: Setup Node
13:         uses: actions/setup-node@v4
14:         with:
15:           node-version: 22
16:           registry-url: https://registry.npmjs.org/
17:           cache: 'npm'
18: 
19:       - name: Install dependencies
20:         run: npm install
21: 
22:       - name: Build
23:         run: npm run build
24: 
25:       - name: Test
26:         run: npm run test
27: 
28:       - name: Publish
29:         run: npm publish --access public
30:         env:
31:           NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}

(End of file - total 31 lines)
</content>
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/travis/Development/fluent-cerner-js/.npmrc"
}
```

**Output:**
```
<path>/home/travis/Development/fluent-cerner-js/.npmrc</path>
<type>file</type>
<content>1: save-exact=true

(End of file - total 1 lines)
</content>
```

---

## Assistant (Plan · claude-opus-4-6 · 12.4s)

Now I have the full picture. Here's my diagnosis and plan:

---

## Root Cause

The workflow and package config look correct. The `E404 Not Found - PUT` error when publishing to a package **you already own** is almost always caused by one of two things:

### 1. **NPM Granular Access Token not scoped to this package** (most likely)
npm introduced Granular Access Tokens which must be explicitly scoped to specific packages. If your `NPM_TOKEN` secret is a Granular Access Token and it wasn't configured to include `fluent-cerner-js`, you'll get this exact `404` error. This is a confusingly misleading error message from npm.

### 2. **Token expired or revoked**
If the token was rotated, expired, or revoked since your last successful publish (`1.0.0` was published 6 months ago), it would fail.

---

## Plan

The fix requires no code changes — it's a token/secrets configuration issue:

1. **Verify your NPM token type**: Go to [npmjs.com → Access Tokens](https://www.npmjs.com/settings/geekmdtravis/tokens) and check what type of token `NPM_TOKEN` is:
   - If it's a **Granular Access Token**: ensure `fluent-cerner-js` is listed in the token's allowed packages. Or better yet, replace it with a **Classic Automation token** which has blanket publish access to all your packages.
   - If it's a **Classic token**: ensure it hasn't expired. Generate a new one if needed.

2. **Update the GitHub secret**: If you generate a new token, update the `NPM_TOKEN` secret in your repo settings at `Settings → Secrets and variables → Actions`.

3. **Re-run the publish workflow**.

No changes are needed to `package.json`, `.npmrc`, or the workflow file — they all look correct. Would you like me to make any changes to the repo, or does the token diagnosis resolve it for you?

---

