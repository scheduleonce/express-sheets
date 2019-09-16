# express-sheets

> Read sheets dynamically from google spreadsheet.

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Background

This is an api that is backed by a Google Spreadsheet as a "database".

We need to be able to get data dynamically from a Google spreadsheet. Multiple sheets can be added to the spreadsheet and data will be returned from them without having to add a new route for the newly added sheet.

For example, this function turns [this spreadsheet](https://docs.google.com/spreadsheets/d/1GvlGcn-IHnacCAztYzIENNIZs4bc_Ys4zVcEM94LPFU/edit#gid=1968330941) into this json response:

```json
[
  {
    "ID": "1",
    "Name": "Classic",
    "Time to read": "5 mins"
  }
]
```

## Usage

The route for the sheet will be the same as the sheet name.

Consider a Google spreadsheet with multiple sheets:

| events | articles | blogs |

Route to retrieve data from **events** sheet:

```sh
/events
```
