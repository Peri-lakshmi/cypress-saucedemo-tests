# Cypress + TypeScript E2E Test Suite — SauceDemo

![Cypress Tests](https://github.com/Peri-lakshmi/cypress-saucedemo-tests/actions/workflows/cypress.yml/badge.svg)

End-to-end test automation for [saucedemo.com](https://www.saucedemo.com), a
site built specifically for practicing QA automation. The suite covers login,
cart, checkout and product-sorting flows, using Cypress and TypeScript.
It includes Mochawesome HTML reporting and GitHub Actions CI for automated
test execution on every push and pull request.

I built this to show how I approach test design in practice: not just
happy-path clicking, but the validation errors, edge cases, and quirky
accounts (there's a locked-out user, a slow-loading user, etc.) that a
real QA pass needs to catch.

## Highlights

- 31 automated E2E tests with positive, negative, validation and edge-case coverage
- Cypress + TypeScript with typed reusable custom commands
- Checkout business-rule validation: total equals subtotal + tax
- Mochawesome HTML reporting with timing and pass/fail metrics
- GitHub Actions CI runs on every push and pull request
- Downloadable CI test-report artifact

## What's covered

- **`login.cy.ts`** — valid login, wrong password, unknown username,
  locked-out account, missing username/password validation, the
  intentionally slow account, and logout.
- **`cart.cy.ts`** — adding single and multiple items, badge count,
  removing items from both the inventory and cart pages, button state
  changes, and cart persistence when navigating.
- **`checkout.cy.ts`** — full purchase flow end to end, validation errors
  for each required field, cancel flows, and a check that the order
  total actually equals subtotal + tax.
- **`sorting.cy.ts`** — all four sort options (name A-Z/Z-A, price
  low-high/high-low), and that sorting doesn't drop any products.

**31 tests total, all passing.**

## Tech stack

- [Cypress](https://www.cypress.io/) — the test runner
- TypeScript — for type safety and better autocomplete while writing tests
- [Mochawesome](https://github.com/adamgruber/mochawesome) — generates a
  visual HTML report with pass/fail counts, timing, and charts
- GitHub Actions — runs the suite automatically on every push

---

## Getting started (for beginners)

If you've never run a Cypress project before, here's exactly what to do,
step by step. You don't need any prior Cypress experience — you do need
Node.js installed on your computer.

### 1. Check if you have Node.js installed

Open a terminal (on Mac: Terminal app, on Windows: Command Prompt,
PowerShell, or the terminal inside VS Code) and run:

```
node --version
```

If you see a version number (anything v18 or higher is fine), you're set.
If you get an error saying the command isn't found, download and install
Node.js from [nodejs.org](https://nodejs.org) — pick the LTS version —
and then re-run the command above to confirm it worked.

### 2. Download this project

If you have Git installed:
```
git clone <this-repo-url>
cd cypress-saucedemo-tests
```

If you don't use Git, you can also click the green "Code" button on the
GitHub repo page, choose "Download ZIP," then unzip it and open a
terminal inside that folder.

**Important:** make sure you `cd` into the folder that directly contains
`package.json`. If you unzip and see a folder inside a folder with the
same name, go one level deeper before running any commands.

### 3. Install the project's dependencies

From inside the project folder, run:

```
npm ci
```


This reads the `package.json` file and downloads Cypress, TypeScript,
and the reporting tools into a `node_modules` folder. It can take a
minute or two the first time. You'll know it worked if it finishes
without red error text and you see a new `node_modules` folder appear.

`npm ci` installs the exact dependency versions recorded in `package-lock.json`,
which makes local and CI runs more reproducible.

You may see some `npm audit` warnings about vulnerabilities after
installing — these come from deep inside Cypress's own internal
dependencies, not this project's code, and are safe to ignore. Do **not**
run `npm audit fix --force`, since it can force-install a breaking
version of Cypress that may not work correctly.

### 4. Run the tests with the visual test runner (recommended for first time)

```
npm run cypress:open
```

This opens the Cypress App — a window where you can watch the tests run
in a real browser. The first time it opens:

1. Choose **"E2E Testing"**
2. Choose a browser (Chrome is a safe default if you have it installed)
3. Click **"Start E2E Testing"**
4. You'll see a list of spec files (`login.cy.ts`, `cart.cy.ts`, etc.) —
   click any one of them to watch it run step by step in the browser

This is the best way to actually see what the tests are doing, especially
if you're new to Cypress. You'll watch it type into fields, click buttons,
and check results in real time.

(On Windows, the first time you run this, you may get a Windows Firewall
prompt asking to allow the app to make changes — this is Windows asking
permission for Cypress to talk to the browser locally, and is safe to
allow.)

### 5. Run all tests headlessly (how it runs in CI)

Once you're comfortable with what the tests do, you can run everything at
once without opening a browser window:

```
npm run cypress:run
```

This runs all spec files back to back and prints a pass/fail summary in
the terminal. GitHub Actions also runs the full suite on every push and
generates the HTML report (see `.github/workflows/cypress.yml`).

### Running just one file

If you only want to run one spec file instead of the whole suite:

```
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

---

## Viewing test metrics (pass/fail counts, duration, charts)

Running `npm run cypress:run` gives you a plain text summary in the
terminal. For an actual visual report — pass/fail breakdown, per-test
duration, a pie chart, all in a clean HTML page — run:

```
npm run test:report
```

This runs the full suite and then does three things automatically:

1. Runs every spec file and saves the raw JSON results into
   `cypress/reports/raw/` (one file per spec)
2. Merges all of those raw files into a single combined result:
   `cypress/reports/merged-report.json`
3. Turns that combined result into one HTML report:
   `cypress/reports/merged-report.html`

Once it finishes, open the report in your browser (double-click the file,
or right-click it in your file explorer and choose "Open with" your
browser). You'll see:

- Total tests run, passed, failed, and skipped
- Total run duration and duration per test
- A pass/fail pie chart
- Every test case listed by suite, with pass/fail status and timing

The `cypress/reports/raw/` folder holds intermediate files you don't need
to look at directly — they're just the input to the merge step.

This entire report folder (`cypress/reports/`) is intentionally left out
of Git (see `.gitignore`), aside from a placeholder file, since the
report itself is a generated artifact that changes every run — you
regenerate it locally whenever you want fresh numbers.

**To showcase results on GitHub:** take a screenshot of the generated
report and add it to this README, or to a `screenshots/` folder in the
repo, so visitors see it immediately without needing to run anything
themselves.



---

## Project structure

```
cypress-saucedemo-tests/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.ts        <- login test cases
│   │   ├── cart.cy.ts         <- cart test cases
│   │   ├── checkout.cy.ts     <- checkout flow test cases
│   │   └── sorting.cy.ts      <- product sorting test cases
│   ├── support/
│   │   ├── commands.ts        <- custom reusable commands (e.g. cy.login())
│   │   └── e2e.ts             <- loads the custom commands before each test
│   └── reports/                <- generated test reports (see above)
│       ├── .gitkeep             <- placeholder so this folder exists after cloning
│       └── raw/                 <- intermediate per-spec JSON (created on report run)
├── cypress.config.ts          <- Cypress configuration (base URL, etc.)
├── tsconfig.json              <- TypeScript configuration
├── package.json                <- project dependencies and npm scripts
└── .github/workflows/cypress.yml  <- runs the suite and generates a report on every push
```

## Why there's a `commands.ts` file

Instead of repeating the same login steps in every single test, there's a
custom command:

```typescript
cy.login('standard_user', 'secret_sauce');
```

defined once in `cypress/support/commands.ts`, and every test that needs
to be logged in just calls that one line. If the login flow ever changes,
there's exactly one place to update it, instead of hunting through every
spec file. This is a small thing, but it's the kind of habit that keeps a
test suite maintainable as it grows past a handful of files.

## Notes on the test accounts

SauceDemo provides several login accounts, all with the password
`secret_sauce`, each meant to simulate a different real-world scenario:

| Username | What it simulates |
|---|---|
| `standard_user` | Normal, working account |
| `locked_out_user` | An account that's been blocked |
| `problem_user` | UI bugs (e.g. broken product images) |
| `performance_glitch_user` | A slow-loading account |
| `error_user` | Triggers errors in certain flows |
| `visual_user` | Visual/layout differences |

This suite tests `standard_user` for the main flows, `locked_out_user` for
the blocked-account scenario, and `performance_glitch_user` to confirm the
app still works (just slower) rather than timing out.

## Continuous Integration

Every push to this repository automatically triggers the test suite via
GitHub Actions (see the workflow file in `.github/workflows/cypress.yml`),
generates the same HTML metrics report described above, and uploads it as
a downloadable artifact.

To view a run's results: go to the **Actions** tab on the repo → click
the latest run → check for a green checkmark (all tests passed) → scroll
down to **Artifacts** → download `cypress-test-report` → open
`merged-report.html` from the downloaded folder.
