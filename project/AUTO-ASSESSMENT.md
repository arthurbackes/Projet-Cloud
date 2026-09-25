# :books: LINFO2145 Project: Auto-Assessment Grid

**LINFO2145 Autumn, 2026** -- *Etienne Rivière, Yinan Cao, Paul-Edouard Bertrand Van Ouytsel, Rémi Van Boxem, and Clément Delzotti*

## Introduction

Before the [oral examination](README.md#oral-examination), you must fill in this grid to reflect on the strengths and weaknesses of your project.
For each criterion below, tick the box that best matches your project, and briefly justify your self-assessment: what works, what is missing or partial, and why you made the choices you made.
This is not a grading grid: it is a tool to help you and the teaching staff discuss your project's architecture, code, and choices during the oral examination.

- **Criterion 1:** *Is your back-end split into independent microservices, each with a clearly-defined role, communicating over well-documented RESTful APIs?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 2:** *Is all application state (sessions, cart content, purchase history) kept server-side, so that a user reconnecting from a different browser or session does not lose anything?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 3:** *Do you have an API Gateway that routes client requests to the appropriate microservices?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 4:** *Do you have a logging microservice, backed by CouchDB, that is actively used by your other services to record user actions and performance data?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 5:** *Can your microservices' service implementations and databases scale independently (add/remove instances), and have you tested this?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 6:** *Are product images externalized to Azure Storage, and does your administrator interface allow registering, updating and deleting products end-to-end?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 7:** *Does your logging data feed a working recommendation engine that uses Map/Reduce to produce personalized suggestions?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- **Criterion 8:** *Are the back-end features (catalogue, cart, checkout, admin, recommendations) properly and usably integrated into the provided front-end?*
  - [ ] Not at all&nbsp;&nbsp;&nbsp;- [ ] Barely&nbsp;&nbsp;&nbsp;- [ ] Globally yes&nbsp;&nbsp;&nbsp;- [ ] Absolutely

- :gift: **Bonus:** Did you go beyond the requirements anywhere (e.g. image validation/resizing, Azure deployment automation, advanced recommendation logic, meaningful contributions back to the course repositories)? Describe them here.

## Getting early feedback

If you would like to discuss any of the above criteria, schedule an appointment with one of the teaching assistants or come ask during the lab hours.
You will get better feedback if you send a link to your code in advance by email.
