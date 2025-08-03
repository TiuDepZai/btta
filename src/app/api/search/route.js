import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return new Response(JSON.stringify({ error: 'Missing name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const encoded = encodeURIComponent(name).replace(/%20/g, '+');
    const url = `https://www.ratingscentral.com/PlayerList.php?PlayerName=${encoded}&PlayerSport=Any&TourCircuitYear=2025&SortOrder=Name`;

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const result = [];
    $('table tbody tr').each((_, row) => {
      const cols = [];
      $(row).find('td').each((_, td) => {
        cols.push($(td).text().trim());
      });
      result.push(cols);
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
