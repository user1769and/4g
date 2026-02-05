import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.SERVICE_ACCOUNT_JSON),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1SsS2nf7pya6Tb_NKVK9pos1sqX1Vph5HZlfp6e1BrPA";
    const range = "search_result!A1:I10"; 

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    const headers = rows[0];
    const data = rows.slice(1).map((row) =>
      headers.reduce((obj, key, idx) => {
        obj[key] = row[idx];
        return obj;
      }, {})
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch sheet data" });
  }
}
