# Pizza Bot

A basic chatbot built using [Dialogflow](https://dialogflow.com/), [NodeJS](https://nodejs.org/) and [Angular](https://angular.io/). The deployed app can be checked out here: https://pizza-bot-lqrjjy.firebaseapp.com/

You can order a pizza or check out the status of an order.

## Getting Started

If you want to check it out on your local machine follow the instructions below:

### Prerequisites

For getting started you need Angular and Firebase Tools, to install Angular you can follow the instructions [here](https://angular.io/guide/setup-local). Firebase tools can be installing using the npm package, instructions for which can be found [here](https://firebase.google.com/docs/cli).

You will also need a [firebase project](https://firebase.google.com/docs/projects/learn-more) to host this and a firestore to store order information. My collection is named 'pizza.orders', you should then download the Service Account SDK json file (can be downloaded from Firebase Project Settings -> Service accounts.) and copy it to the functions directory inside pizza-bot. The file is then referenced at 
```console
line 6: const serviceAccount = require('./service-account.json');
```

The databaseURL at line 10 should be changed as per your project name. 
```console
line 10: databaseURL: 'https://pizza-bot-lqrjjy.firebaseio.com'
```

You should also change the projectId with yours at 
```console
line 20: const session = sessionClient.sessionPath('pizza-bot-lqrjjy', sessionId);
```

Firebase function URL has been referenced inside chat.component.ts at
```console
line 4: const dialogflowURL = 'https://us-central1-pizza-bot-lqrjjy.cloudfunctions.net/dialogflowGateway';
```

### Installation

Clone the repository on your local machine and execute the following from the root directory of the project
```console
pizza-bot:~$ npm install
```

## Running Locally

Run the application on localhost using
```
ng serve --o
```

### Setting up Firebase
Go to [Firebase](https://firebase.google.com/) and create a free account, you can then setup Firebase for deploying an Angular App by referring to this [this article](https://angularfirebase.com/lessons/deploying-an-angular-app-to-firebase/). Basically you have to do the following steps:
```
ng build --prod
firebase login
firebase init
firebase deploy
```
If successful you will be able to see your deployed app using the URL displayed in the CLI.
