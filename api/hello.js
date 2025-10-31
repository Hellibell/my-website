// pages/api/advanced.js
let callCount = 0;

export default async function handler(req, res) {
  callCount++;

  const now = new Date();

  // เวลาแบบ ISO และไทย
  const time = {
    iso: now.toISOString(),
    thai: now.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
  };

  // ข้อความสุ่ม
  const messages = [
    "สวัสดี! API ทำงานเรียบร้อย",
    "คุณคือผู้โชคดีวันนี้!",
    "อัปเดตล่าสุดพร้อมใช้งานแล้ว",
    "ทุกอย่างโอเค! 😊",
    "ขอบคุณที่เรียก API ของเรา!"
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // รับ query parameter
  const { name, imageCount } = req.query;
  const personalizedMessage = name
    ? `สวัสดี ${name}! ${randomMessage}`
    : randomMessage;

  // ข้อมูลระบบ
  const system = {
    node_version: process.version,
    platform: process.platform,
    env: process.env.NODE_ENV || "development",
  };

  // ฟังก์ชันดึงรูปแบบสุ่มจาก API อื่น
  function generateRandomImages(count = 1) {
    const urls = [];
    for (let i = 0; i < count; i++) {
      // Picsum.photos ให้รูปแบบสุ่มตาม seed หรือ size
      urls.push(`https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/600/400`);
    }
    return urls;
  }

  const images = generateRandomImages(Number(imageCount) || 1);

  // Response JSON
  const response = {
    title: "อัปเดตล่าสุด (Advanced API)",
    status: "success",
    time,
    message: personalizedMessage,
    images,
    system,
    calls_so_far: callCount,
    docs: "https://docs.github.com/rest/repos/contents#create-or-update-file-contents"
  };

  res.status(200).json(response);
}
