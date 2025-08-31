export default function handler(req, res) {
  res.status(200).json({
    title: "อัปเดตล่าสุด",
    message: "API ทำงานแล้วบน Vercel!",
    time: new Date().toISOString()
  });
}
