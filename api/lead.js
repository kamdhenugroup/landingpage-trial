// Vercel serverless function: emails each lead to info@autoglowcare.in through Resend.
// Set RESEND_API_KEY in Vercel > Project > Settings > Environment Variables.
// Optional: LEAD_TO (default info@autoglowcare.in), LEAD_FROM (a sender on your verified Resend domain).
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  var key = process.env.RESEND_API_KEY;
  if (!key) { res.status(204).end(); return; }
  var b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  var clean = function (v) { return String(v || '').slice(0, 300).replace(/[<>]/g, ''); };
  var name = clean(b.name), email = clean(b.email);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { res.status(400).json({ ok: false }); return; }
  var lines = [
    ['Package', clean(b.package)], ['Price', clean(b.price)], ['Name', name], ['Email', email],
    ['Page', clean(b.page)], ['utm_source', clean(b.utm_source)], ['utm_campaign', clean(b.utm_campaign)], ['utm_content', clean(b.utm_content)]
  ];
  var text = lines.map(function (l) { return l[0] + ': ' + l[1]; }).join('\n');
  try {
    var r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM || 'AutoGlow Leads <leads@autoglowcare.in>',
        to: [process.env.LEAD_TO || 'info@autoglowcare.in'],
        reply_to: email,
        subject: 'New package enquiry: ' + clean(b.package) + ' - ' + name,
        text: text
      })
    });
    res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) { res.status(502).json({ ok: false }); }
};
