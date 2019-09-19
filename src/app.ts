import express from 'express';
import morgan from 'morgan';
import { SpreadSheet } from '../spreadsheets/spreadsheet';
import { spreadSheetUpdater } from '../spreadsheets/spreadsheet-updater';

const sheetConfig = {
  sheetId: process.env.sheet_id,
  updateIntervalTime: parseInt(process.env.update_interval_time, 10)
};

/**
 * Used to perform Google API's authentication.
 * You can create this object in the [google developers console](https://console.developers.google.com).
 */
const authData = {
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  auth_uri: process.env.auth_uri,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  client_x509_cert_url: process.env.client_x509_cert_url,
  private_key: Buffer.from(process.env.private_key, 'base64').toString(),
  private_key_id: process.env.private_key_id,
  project_id: process.env.project_id,
  token_uri: process.env.token_uri,
  type: process.env.type
};

SpreadSheet.initSpreadSheet(sheetConfig.sheetId, authData); // initialize the spreadsheet
spreadSheetUpdater(sheetConfig.updateIntervalTime); // continuously checks for updates in the spreadsheet after the specified time interval

const app = express();

// set up logging
app.use((req, res, next) => {
  morgan('combined')(req, res, next);
});

app.get('*', (req, res, next) => {
  const requestedResource = req.url.replace('/', '');
  if (SpreadSheet.sheetTabularData && Object.keys(SpreadSheet.sheetTabularData).indexOf(requestedResource) > -1) {
    res.status(200).json(SpreadSheet.sheetTabularData[requestedResource]);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Sheet not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3000;
SpreadSheet.fetchDataFromGoogleSheet().then(() => {
  app.listen(port, () => {
    console.log('Server running on port %d', port);
  });
});
