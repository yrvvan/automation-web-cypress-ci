# cypress-automation-web

### Prerequisites:

- Node.js v.18.x.x above
- Cypress Latest

> Cypress
- Install cypress cucumber preprocessor

### How to Getting Started:

```sh
$ npm install --save-dev cypress
$ npm install --save-dev cypress-cucumber-preprocessor
```

### This is directory structure

        .
        ├── cypress
        │  ├── e2e
        │  │    ├── features
        │  │    └── step_definitions
        │  │    │   └── steps.js
        │  │    └── e2e.feature
        │  ├── support
        │       └── e2e.js
        ├── helper
        │    └── ..._helper.js
        ├── .env
        ├── cypress.config.json
        ├── package.lock.json
        └── package.json

### Foldering and Naming Convention

1. Filename using `snake_case` *except for the repo name*
2. Variable name using `camelCase`
3. Add your Cucumber file (`.feature`) into `cypress/e2e/features` folder
4. Add your Steps file (`.js`) in to `cypress/e2e/features/step_definitions` folder
5. Declare and hook your `.feature` file in Cypress Config `specPattern: 'cypress/e2e/**/*.feature'`
6. Declare and hook `support` file in Cypress Config `supportFile: 'cypress/support/e2e.js'`
7. Declare and hook `reporter` in Cypress Config (`reporter: 'mochawesome'`)
8. If you set `true` to video on `cypress.json`, your result video will be added in to `cypress/videos`
10. Your result screenshots will be added in to `cypress/screenshots`

## Run the test
You can specify the command that you want to run from package.json file.

###### Here are our default commands:
```sh
$ npm run test
```
or using Cypress UI 
```sh
$ npm run open
```

###### Mochawesome Report
<img width="1280" alt="Screen Shot 2024-10-15 at 13 04 34" src="https://github.com/user-attachments/assets/dc7f07f5-426f-435f-aea7-10e10b76fb87">

###### Here are our other commands:
```sh
$ npm run test                          | to run all tests
$ npx cypress run --env TAGS="@register | to run test with specific tag
$ npm run notify                        | to send test run summary into slack
$ npm run qase PLYGRND                  | to send test coverage from test case management into slack
```

###### Test Run Summary in Slack
<img width="407" alt="Screen Shot 2024-10-15 at 13 15 08" src="https://github.com/user-attachments/assets/7077fe07-def3-4169-a66d-ab693caec256">

###### Test Coverage Summary in Slack
<img width="400" alt="Screen Shot 2024-10-15 at 13 15 21" src="https://github.com/user-attachments/assets/9988d47a-243d-4242-8b1c-94da0394f0a5">

###### Auto Create Test Run in Qase.io
<img width="1280" alt="Screen Shot 2024-10-15 at 13 01 37" src="https://github.com/user-attachments/assets/bba1085a-5d98-430d-a9ad-8afd307f4ca9">
<img width="1279" alt="Screen Shot 2024-10-15 at 13 01 01" src="https://github.com/user-attachments/assets/b1a8004b-a580-40e5-a1be-4342f41314b2">

#### Runs in Github Action
<img width="1279" alt="Screen Shot 2024-10-15 at 13 14 44" src="https://github.com/user-attachments/assets/8e3ef96e-eeac-4b4b-8d23-f3000fd57f45">
