import express, { Request, Response } from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = 3000;
const api_url = "https://random-nsfw.hellibell38.workers.dev/";
const delay_between = 200; // ms

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // serve static files

// หน้าเว็บหลัก
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint ส่งรูปไป Discord
app.post('/send-images', async (req: Request, res: Response) => {
  const { webhook, num_images } = req.body;
  if (!webhook || !num_images) {
    return res.status(400).json({ error: "กรุณาส่ง webhook และ num_images" });
  }

  const sent_urls = new Set<string>();

  for (let i = 1; i <= num_images;) {
    try {
      const response = await fetch(api_url, { headers: { "X-Requested-With": "XMLHttpRequest" } });
      if (!response.ok) throw new Error("โหลดรูปไม่สำเร็จ");
      const data = await response.json();
      const img_url = data.content.url;

      if (sent_urls.has(img_url)) continue;
      sent_urls.add(img_url);

      const payload = {
        content: `ส่งรูป ${i}/${num_images} สำเร็จ 🎉`,
        embeds: [{ title: `รูปที่ ${i}`, image: { url: img_url }, color: 0x3EFF00 }]
      };

      // ส่ง payload ไป Discord
      const discordRes = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!discordRes.ok && discordRes.status !== 204) {
        console.error(`❌ ส่งรูป ${i} ไม่สำเร็จ`);
      } else {
        console.log(`✅ ส่งรูป ${i} สำเร็จ`);
      }

      i++; // เพิ่มเลขรูปเมื่อส่งสำเร็จ
      await new Promise(r => setTimeout(r, delay_between)); // delay 200ms
    } catch (err) {
      console.error(`⚠️ เกิดข้อผิดพลาดส่งรูป ${i}:`, err);
    }
  }

  res.json({ message: `ส่งรูป ${num_images} ไป Discord เรียบร้อยแล้ว` });
});

app.listen(port, () => {
  console.log(`Server รันที่ http://localhost:${port}`);
});
                                              
