import { SpreadSheet } from './spreadsheet';

let lastUpdateTime = null;

export const spreadSheetUpdater = interval => {
  setInterval(async () => {
    // checks for updates in the spreadsheet
    if (await isSpreadSheetUpdated()) {
      await SpreadSheet.fetchDataFromGoogleSheet();
    }
  }, interval);
};

const isSpreadSheetUpdated = async (): Promise<boolean> => {
  try {
    const lastSheetUpdateTime = await SpreadSheet.getLastUpdateTime(); // gets the last update time of the spreadsheet
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
