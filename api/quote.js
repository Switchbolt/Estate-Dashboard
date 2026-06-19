// Vercel serverless proxy — bypasses browser CORS for Yahoo Finance
module.exports = async (req, res) => {
  const sym = req.query.sym;
  if (!sym || !/^[A-Z0-9.\-]{1,12}$/i.test(sym)) {
    return res.status(400).json({ error: 'invalid symbol' });
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`;
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com/',
      },
    });
    if (!r.ok) {
      return res.status(r.status).json({ error: 'upstream returned ' + r.status });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
