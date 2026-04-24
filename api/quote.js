export default async function handler(req, res) {
  const { sym } = req.query;
  if (!sym || !/^[A-Z0-9.\-^=]{1,20}$/i.test(sym)) {
    return res.status(400).json({ error: 'Invalid symbol' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`,
  ];

  for (const url of urls) {
    try {
      const r = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://finance.yahoo.com',
        },
      });
      if (!r.ok) continue;
      const data = await r.json();
      return res.json(data);
    } catch (e) {}
  }

  res.status(502).json({ error: 'Could not fetch quote from Yahoo Finance' });
}
