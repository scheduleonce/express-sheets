import { Spreadsheet } from './spreadsheet';

let lastUpdateTime = null;

export const spreadsheetUpdater = interval => {
  try {
    setInterval(async () => {
      // checks for updates in the spreadsheet
      if (await isSpreadsheetUpdated()) {
        await Spreadsheet.fetchDataFromGoogleSheet();
      }
    }, interval);
  } catch (e) {
    console.error(e);
  }
};

const isSpreadsheetUpdated = async (): Promise<boolean> => {
  try {
    const lastSheetUpdateTime = await Spreadsheet.getLastUpdateTime(); // gets the last update time of the spreadsheet
    if (lastUpdateTime !== lastSheetUpdateTime) {
      lastUpdateTime = lastSheetUpdateTime;
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
