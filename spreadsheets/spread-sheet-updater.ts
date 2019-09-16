import { SpreadSheet } from './spread-sheet';

export const spreadSheetUpdater = interval => {
  setInterval(async () => {
    // checks for updates in the spreadsheet
    if (await SpreadSheet.checkForUpdate()) {
      await SpreadSheet.fetchUpdatesFromGoogleSheet();
    }
  }, interval);
};
