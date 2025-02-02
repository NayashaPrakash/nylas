const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mockDb = require('./utils/mock-db');


const Nylas = require('nylas');
const { WebhookTriggers } = require('nylas/lib/models/webhook');
const { Scope } = require('nylas/lib/models/connect');
const { default: Draft } = require('nylas/lib/models/draft');
const { openWebhookTunnel } = require('nylas/lib/services/tunnel');

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// The port the express app will run on
const port = 9000;

// Initialize the Nylas SDK using the client credentials
Nylas.config({
  clientId: process.env.NYLAS_CLIENT_ID,
  clientSecret: process.env.NYLAS_CLIENT_SECRET,
  apiServer: process.env.NYLAS_API_SERVER,
});

// Before we start our backend, we should register our frontend
// as a redirect URI to ensure the auth completes
const CLIENT_URI =
  process.env.CLIENT_URI || `http://localhost:${process.env.PORT || 3000}`;
Nylas.application({
  redirectUris: [CLIENT_URI],
}).then((applicationDetails) => {
  console.log(
    'Application registered. Application Details: ',
    JSON.stringify(applicationDetails)
  );
});

// Start the Nylas webhook
openWebhookTunnel({
  // Handle when a new message is created (sent)
  onMessage: function handleEvent(delta) {
    switch (delta.type) {
      case WebhookTriggers.AccountConnected:
        console.log(
          'Webhook trigger received, account connected. Details: ',
          JSON.stringify(delta.objectData, undefined, 2)
        );
        break;
    }
  },
}).then((webhookDetails) => {
  console.log('Webhook tunnel registered. Webhook ID: ' + webhookDetails.id);
});

// '/nylas/generate-auth-url': This route builds the URL for
// authenticating users to your Nylas application via Hosted Authentication
app.post('/nylas/generate-auth-url', express.json(), async (req, res) => {
  const { body } = req;

  const authUrl = Nylas.urlForAuthentication({
    loginHint: body.email_address,
    redirectURI: (CLIENT_URI || '') + body.success_url,
    scopes: [Scope.Calendar, Scope.EmailModify, Scope.EmailSend],
  });

  return res.send(authUrl);
});

// '/nylas/exchange-mailbox-token': This route exchanges an authorization
// code for an access token
// and sends the details of the authenticated user to the client
app.post('/nylas/exchange-mailbox-token', express.json(), async (req, res) => {
  const body = req.body;

  const { accessToken, emailAddress } = await Nylas.exchangeCodeForToken(
    body.token
  );

  // Normally store the access token in the DB
  console.log('Access Token was generated for: ' + emailAddress);

  // Replace this mock code with your actual database operations
  const user = await mockDb.createOrUpdateUser(emailAddress, {
    accessToken,
    emailAddress,
  });

  // Return an authorization object to the user
  return res.json({
    id: user.id,
    emailAddress: user.emailAddress,
    accessToken: user.accessToken, // This is only for demo purposes - do not send access tokens to the client in production
  });
});


// Middleware to check if the user is authenticated
async function isAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json('Unauthorized');
  }

  // Query our mock db to retrieve the stored user access token
  const user = await mockDb.findUser(req.headers.authorization);

  if (!user) {
    return res.status(401).json('Unauthorized');
  }

  // Add the user to the response locals
  res.locals.user = user;

  next();
}

// Add route for getting 5 latest emails
app.get('/nylas/read-emails', isAuthenticated, async (req, res) => {
  const user = res.locals.user;

  const threads = await Nylas.with(user.accessToken).threads.list({
    expanded: true,
  });

  return res.json(threads);
});

// Add route for getting individual message by id
app.get('/nylas/message', isAuthenticated, async (req, res) => {
  const user = res.locals.user;

  const { id } = req.query;
  const message = await Nylas.with(user.accessToken).messages.find(id);

  return res.json(message);
});

app.post('/nylas/send', isAuthenticated, express.json(), async (req, res) => {
  const {
    body: { to, body, subject },
  } = req;

  const user = res.locals.user;

  const draft = new Draft(Nylas.with(user.accessToken));

  draft.to = [{ email: to }];
  draft.body = body;
  draft.subject = subject;
  draft.from = [{ email: user.emailAddress }];

  const message = await draft.send();

  return res.json({ message });
}
);


// Add route for downloading file
app.get('/nylas/file', isAuthenticated, async (req, res) => {
  const user = res.locals.user;

  const { id } = req.query;
  const file = await Nylas.with(user.accessToken).files.find(id);

  // Files will be returned as a binary object
  const fileData = await file.download();
  return res.end(fileData?.body);
});



// Start listening on port 9000
app.listen(port, () => console.log('App listening on port ' + port));
