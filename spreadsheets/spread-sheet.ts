import Sheets from 'node-sheets';

export class SpreadSheet {
  public static sheetTabularData = {};
  private static lastUpdate = null;
  private static currUpdateTime = null;
  private static googleSheet: Sheets;
  private static sheetAuthData: any;

  private constructor() {}

  /**
   * Initialize the spreadsheet
   * @param sheetId
   * @param authData
   */
  public static initSpreadSheet(sheetId: string, authData: any) {
    SpreadSheet.googleSheet = new Sheets(sheetId);
    SpreadSheet.sheetAuthData = authData;
  }

  /**
   * Check for updates in the spreadsheet. Returns a Promise that resolves to a boolean.
   */
  public static checkForUpdate = async (): Promise<boolean> => {
    try {
      await SpreadSheet.authorizeSheet();
      const date = new Date(await SpreadSheet.googleSheet.getLastUpdateDate()).getTime();
      SpreadSheet.currUpdateTime = date;
      return !SpreadSheet.lastUpdate ? true : SpreadSheet.lastUpdate < date;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * Stores the tabular content of each sheet in the object sheetTabularData with the sheet name as the key.
   */
  public static fetchUpdatesFromGoogleSheet = async () => {
    try {
      await SpreadSheet.authorizeSheet();
      const sheetNames = await SpreadSheet.getSheetNames();

      sheetNames.forEach(async tableName => {
        const table = await SpreadSheet.googleSheet.tables(tableName);
        SpreadSheet.sheetTabularData[tableName] = table.rows
          .filter(record => Object.keys(record).every(key => record[key] && record[key].value))
          .map(record => {
            const entry = {};
            Object.keys(record).forEach(k => (entry[k] = record[k].value));
            return entry;
          });
      });

      SpreadSheet.lastUpdate = SpreadSheet.currUpdateTime;
    } catch (e) {
      console.error(e);
    }
    SpreadSheet.currUpdateTime = null;
  };

  /**
   * Gets the names of the sheets in the spreadsheet.
   * Returns a Promise that resolves to an array of sheet names.
   */
  private static getSheetNames = async (): Promise<string[]> => {
    return await SpreadSheet.googleSheet.getSheetsNames();
  };

  /**
   * Performs Google APIs authentication with the given sheetAuthData.
   */
  private static authorizeSheet = () => {
    SpreadSheet.googleSheet.authorizeJWT(SpreadSheet.sheetAuthData);
  };
}
