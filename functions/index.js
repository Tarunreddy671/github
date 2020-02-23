const functions = require('firebase-functions');
const cors = require('cors')({ origin: true});
const admin = require('firebase-admin');
const moment = require('moment');
moment().format();
const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pizza-bot-lqrjjy.firebaseio.com'
});

const { SessionsClient } = require('dialogflow');

exports.dialogflowGateway = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
        const { queryInput, sessionId } = request.body;

        const sessionClient = new SessionsClient({ credentials: serviceAccount  });
        const session = sessionClient.sessionPath('pizza-bot-lqrjjy', sessionId);

        const responses = await sessionClient.detectIntent({ session, queryInput});
        const result = responses[0].queryResult;
        response.send(result);
    });
});

const { WebhookClient } = require('dialogflow-fulfillment');

exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({ request, response });
    const db = admin.firestore();

    const result = request.body.queryResult;

    async function orderPizzaHandler(agent) {
        const orderId = Math.random().toString(36).substr(2, 6);
        const order = db.collection('pizza.orders').doc(orderId);

        let { date, time, size, topping, name, address, phone } = result.parameters;

        date = moment(date).format('DD-MM-YYYY');
        time = moment(time).utcOffset("+05:30").format('h:mm A');

        await order.set({ orderId, name, address, phone, date, time, size, topping });
        agent.add(`Order with Order ID: ${orderId} has been successfully placed for ${date} at ${time}. Pizza Size: ${size.toUpperCase()}, Pizza Topping: ${topping.toUpperCase()}`);
    }

    async function orderStatusHandler(agent) {
        const { orderId } = result.parameters;
        const orderRef = db.collection('pizza.orders').doc(orderId);
        try {
            const orderDoc = await orderRef.get();
            const order = orderDoc.data();
            agent.add(`Name: ${order.name}, Pizza: ${order.size.toUpperCase()} ${order.topping.toUpperCase()}, Deliver: ${order.date} at ${order.time}`);
        } catch(e) {
            agent.add(`An error has occured: ${e}`);
        }
    }

    let intentMap = new Map();
    intentMap.set('order.pizza', orderPizzaHandler);
    intentMap.set('order.status', orderStatusHandler);
    agent.handleRequest(intentMap);
});