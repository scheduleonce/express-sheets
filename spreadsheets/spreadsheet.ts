import Sheets from 'node-sheets';

export class SpreadSheet {
  public static sheetTabularData = {};
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
   * Gets the last update time of the spreadsheet. Returns a Promise that resolves to a timestamp
   */
  public static getLastUpdateTime = async (): Promise<number> => {
    try {
      await SpreadSheet.authorizeSheet();
      return new Date(await SpreadSheet.googleSheet.getLastUpdateDate()).getTime();
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  /**
   * Stores the tabular content of each sheet in the object sheetTabularData with the sheet name as the key.
   */
  public static fetchDataFromGoogleSheet = async () => {
    try {
      await SpreadSheet.authorizeSheet();
      const sheetNames = await SpreadSheet.getSheetNames();

      const sheets = [];
      sheetNames.forEach(tableName => {
        sheets.push(SpreadSheet.googleSheet.tables(tableName));
      });

      const tables = await Promise.all(sheets);
      tables.forEach(table => {
        SpreadSheet.sheetTabularData[table.title] = table.rows
          // Filtering rows with values in each column. If any of the columns are empty, that row will not be listed
          .filter(record => Object.keys(record).every(key => record[key] && record[key].value))
          // Formatting the output to look like: {columnName1: "column1 value", columnName2: "column2 value"}
          .map(record => {
            const entry = {};
            Object.keys(record).forEach(k => (entry[k] = record[k].value));
            return entry;
          });
      });
    } catch (e) {
      console.error(e);
    }
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
