export default async function handler(req, res) {
  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = Object.fromEntries(new URLSearchParams(body)); } catch (e) {}
    }
    const order = { ...body };
    const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
    order.ip = String(rawIp).split(',')[0].trim();
    
    try {
      await fetch('http://cl.hondrexil.com/subscribe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(order).toString()
      });
    } catch (e) {}

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });
  }
}
