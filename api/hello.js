export default function handler(req, res) {
  const now = new Date();

  // 1️⃣ เวลาแบบ ISO
  const isoTime = now.toISOString();

  // 2️⃣ เวลาแบบอ่านง่าย (ไทย)
  const thaiTime = now.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

  // 3️⃣ ข้อความสุ่ม
  const messages = [
    "สวัสดี! API ทำงานเรียบร้อย",
    "คุณคือผู้โชคดีวันนี้!",
    "อัปเดตล่าสุดพร้อมใช้งานแล้ว",
    "ทุกอย่างโอเค! 😊"
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // 4️⃣ รับ query parameter
  const { name } = req.query;
  const personalizedMessage = name
    ? `สวัสดี ${name}! ${randomMessage}`
    : randomMessage;

  // 5️⃣ ข้อมูลระบบ
  const systemInfo = {
    node_version: process.version,
    platform: process.platform,
    env: process.env.NODE_ENV || "development",
  };

  // 6️⃣ รูปภาพตัวอย่าง / CDN
  const exampleImage = "https://raw.githubusercontent.com/Hellibell/cdn-images/main/images/Screenshot_20251031-185544_1.jpg";

  // 7️⃣ นับจำนวนครั้งเรียก (runtime only, รีเซ็ตทุกครั้ง server restart)
  if (!global.apiCallCount) global.apiCallCount = 0;
  global.apiCallCount++;

  // 8️⃣ JSON สุดท้าย สวยงามและเรียงลำดับ
  res.status(200).json({
    title: "อัปเดตล่าสุด",
    status: "success",
    time: {
      iso: isoTime,
      thai: thaiTime
    },
    message: personalizedMessage,
    image: exampleImage,
    system: systemInfo,
    calls_so_far: global.apiCallCount,
    docs: "https://docs.github.com/rest/repos/contents#create-or-update-file-contents"
  });
}
