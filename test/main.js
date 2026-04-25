/* =========================================
   main.js — สคริปต์หลักของหน้าโปรไฟล์
   ทำหน้าที่: นาฬิกา + พื้นหลัง Canvas
   ========================================= */


/* ─────────────────────────────────────────
   ฟังก์ชัน: อัปเดตนาฬิกาแบบเรียลไทม์
   ทำงานทุก 1 วินาที แสดงเวลาปัจจุบัน
   ในรูปแบบ HH:MM:SS
   ───────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}

/* เรียกครั้งแรกทันที แล้วตั้งให้ทำซ้ำทุก 1 วินาที */
updateClock();
setInterval(updateClock, 1000);


/* ─────────────────────────────────────────
   ตั้งค่า Canvas พื้นหลัง
   ─────────────────────────────────────────*/
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

/* ตัวแปรขนาดหน้าจอและตำแหน่งเมาส์ */
let W, H, mouse = { x: 0.5, y: 0.5 };

/* ─────────────────────────────────────────
   ฟังก์ชัน: ปรับขนาด Canvas ให้เต็มหน้าจอ
   เรียกตอนโหลดและตอนย่อ/ขยายหน้าต่าง
   ───────────────────────────────────────── */
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ติดตามตำแหน่งเมาส์เพื่อทำ parallax */
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX / W;
  mouse.y = e.clientY / H;
});


/* ─────────────────────────────────────────
   สร้างดาว 280 ดวง แบบสุ่ม
   แต่ละดวงมี: ตำแหน่ง, ขนาด, ความเร็ว,
   จังหวะกระพริบ, และสี
   ───────────────────────────────────────── */
const STAR_COUNT = 280;
const stars = Array.from({ length: STAR_COUNT }, () => ({
  x: Math.random(),                              /* ตำแหน่ง X (0-1) */
  y: Math.random(),                              /* ตำแหน่ง Y (0-1) */
  r: Math.random() * 1.4 + 0.3,                 /* ขนาด radius */
  speed: Math.random() * 0.00008 + 0.00002,     /* ความเร็วลอย */
  twinkleOffset: Math.random() * Math.PI * 2,   /* จุดเริ่มต้นกระพริบ */
  twinkleSpeed: Math.random() * 0.02 + 0.005,   /* ความเร็วกระพริบ */
  /* สีฟ้าอ่อนสำหรับดาวสว่าง หรือสีขาวนวล */
  color: Math.random() < 0.15
    ? `hsl(${200 + Math.random()*40},80%,85%)`
    : `hsl(${210 + Math.random()*30},50%,${80 + Math.random()*20}%)`,
}));


/* ─────────────────────────────────────────
   ระบบดาวตก
   เก็บดาวตกที่กำลังเคลื่อนที่ใน array
   ───────────────────────────────────────── */
const shooters = [];

/* ─────────────────────────────────────────
   ฟังก์ชัน: สร้างดาวตกใหม่แบบสุ่ม
   วิ่งในทิศทางสุ่ม พร้อม trail ค่อยๆ จาง
   ───────────────────────────────────────── */
function spawnShooter() {
  shooters.push({
    x: Math.random() * W,                                          /* ตำแหน่งเริ่มต้น X */
    y: Math.random() * H * 0.5,                                   /* ตำแหน่งเริ่มต้น Y (ครึ่งบน) */
    vx: (Math.random() * 4 + 3) * (Math.random() < 0.5 ? 1 : -1), /* ความเร็ว X (ซ้าย/ขวาสุ่ม) */
    vy: Math.random() * 2 + 1,                                    /* ความเร็ว Y (ลงเสมอ) */
    len: Math.random() * 120 + 60,                                /* ความยาว trail */
    alpha: 1,                                                     /* ความโปร่งใสเริ่มต้น */
    fade: Math.random() * 0.015 + 0.01,                          /* ความเร็วจาง */
  });
}

/* สร้างดาวตกใหม่ทุก ~3-5 วินาที */
setInterval(spawnShooter, 2800 + Math.random() * 2000);


/* ─────────────────────────────────────────
   ข้อมูลหมอกอวกาศ (Nebula) 4 จุด
   ให้ความรู้สึกพื้นที่มีความลึก
   ───────────────────────────────────────── */
const nebulae = [
  { x: 0.18, y: 0.28, rx: 0.32, ry: 0.22, color: 'rgba(20,60,160,0.18)'  },
  { x: 0.78, y: 0.65, rx: 0.28, ry: 0.20, color: 'rgba(10,30,100,0.22)'  },
  { x: 0.50, y: 0.10, rx: 0.50, ry: 0.15, color: 'rgba(0,50,130,0.16)'   },
  { x: 0.30, y: 0.85, rx: 0.25, ry: 0.12, color: 'rgba(5,20,80,0.20)'    },
];

/* ข้อมูลดวงจันทร์ */
const moon = { baseX: 0.88, baseY: 0.09, r: 46 };

/* ตัวนับเฟรม (ใช้คำนวณ animation) */
let t = 0;


/* ─────────────────────────────────────────
   ฟังก์ชัน: วาดหมอกอวกาศ (Nebula)
   ใช้ radial gradient เป็นวงรี
   มี parallax เบาๆ ตามเมาส์
   ───────────────────────────────────────── */
function drawNebulae() {
  nebulae.forEach(n => {
    /* คำนวณตำแหน่งพร้อม parallax */
    const px = n.x + (mouse.x - 0.5) * 0.012;
    const py = n.y + (mouse.y - 0.5) * 0.012;

    /* สร้าง gradient แบบวงกลมจางออก */
    const grd = ctx.createRadialGradient(px*W, py*H, 0, px*W, py*H, n.rx*W);
    grd.addColorStop(0, n.color);
    grd.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(px*W, py*H, n.rx*W, n.ry*H, 0, 0, Math.PI*2);
    ctx.fill();
  });
}


/* ─────────────────────────────────────────
   ฟังก์ชัน: วาดดวงจันทร์
   มี glow เต้นช้าๆ, พื้นผิว gradient,
   หลุมบนดวงจันทร์, และ parallax ตามเมาส์
   ───────────────────────────────────────── */
function drawMoon() {
  /* คำนวณตำแหน่งพร้อม parallax */
  const mx = moon.baseX * W + (mouse.x - 0.5) * -18;
  const my = moon.baseY * H + (mouse.y - 0.5) * -10;

  /* glow เต้นตาม sine wave */
  const glowPulse = 1 + 0.08 * Math.sin(t * 0.4);

  /* วาด outer glow รอบดวงจันทร์ */
  let g = ctx.createRadialGradient(mx, my, moon.r*0.8, mx, my, moon.r*3.5*glowPulse);
  g.addColorStop(0, 'rgba(200,220,255,0.18)');
  g.addColorStop(0.5, 'rgba(160,190,240,0.07)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(mx, my, moon.r*3.5*glowPulse, 0, Math.PI*2);
  ctx.fill();

  /* วาดตัวดวงจันทร์ด้วย gradient สีขาว-เทาฟ้า */
  let body = ctx.createRadialGradient(mx-moon.r*0.25, my-moon.r*0.25, moon.r*0.05, mx, my, moon.r);
  body.addColorStop(0, '#f4f8ff');
  body.addColorStop(0.45, '#d0e0f0');
  body.addColorStop(1, '#8aaac8');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(mx, my, moon.r, 0, Math.PI*2);
  ctx.fill();

  /* วาดหลุมบนพื้นผิวดวงจันทร์ */
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = 'rgba(100,140,180,0.5)';
  [
    [mx - moon.r*0.28, my - moon.r*0.18, 6],
    [mx + moon.r*0.22, my + moon.r*0.08, 8],
    [mx - moon.r*0.05, my + moon.r*0.30, 5],
  ].forEach(([cx, cy, cr]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.restore();
}


/* ─────────────────────────────────────────
   ฟังก์ชัน: วาดดาวทั้งหมด
   แต่ละดวงกระพริบตาม sine wave
   ดาวใหญ่มี glow รอบๆ
   มี parallax เบาๆ ตามเมาส์
   ───────────────────────────────────────── */
function drawStars() {
  stars.forEach(s => {
    /* คำนวณตำแหน่งพร้อม parallax และการลอยช้าๆ */
    const px = (s.x + (mouse.x - 0.5) * s.r * 0.015 * 0.5 + 1) % 1;
    const py = (s.y + s.speed * t + 1) % 1;

    /* ความสว่างกระพริบตาม sine wave */
    const twinkle = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);

    /* วาด glow สำหรับดาวที่มีขนาดใหญ่กว่า 1.1px */
    if (s.r > 1.1) {
      const grd = ctx.createRadialGradient(px*W, py*H, 0, px*W, py*H, s.r*3);
      grd.addColorStop(0, s.color.replace(')', `,${twinkle*0.6})`).replace('hsl', 'hsla'));
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(px*W, py*H, s.r*3, 0, Math.PI*2);
      ctx.fill();
    }

    /* วาดตัวดาว */
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(px*W, py*H, s.r, 0, Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}


/* ─────────────────────────────────────────
   ฟังก์ชัน: วาดดาวตก
   วาด trail แบบ gradient จางออก
   ลบดาวตกที่จางหมดแล้วออกจาก array
   ───────────────────────────────────────── */
function drawShooters() {
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s = shooters[i];

    /* คำนวณจุดหางของ trail */
    const angle = Math.atan2(s.vy, s.vx);
    const tx = s.x - Math.cos(angle) * s.len;
    const ty = s.y - Math.sin(angle) * s.len;

    /* วาด trail แบบ linear gradient (จางที่หาง สว่างที่หัว) */
    const grd = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, `rgba(200,230,255,${s.alpha})`);

    ctx.strokeStyle = grd;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();

    /* เลื่อนตำแหน่งและลดความโปร่งใส */
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= s.fade;

    /* ลบออกเมื่อจางหมด */
    if (s.alpha <= 0) shooters.splice(i, 1);
  }
}


/* ─────────────────────────────────────────
   ฟังก์ชัน: Loop หลักของ Canvas
   ทำงานทุกเฟรม (~60fps) โดย requestAnimationFrame
   วาดพื้นหลัง → nebula → ดวงจันทร์ → ดาว → ดาวตก
   ───────────────────────────────────────── */
function loop() {
  t++; /* เพิ่มตัวนับเฟรม */

  /* ล้างหน้าจอ */
  ctx.clearRect(0, 0, W, H);

  /* วาดพื้นหลังสีน้ำเงินเข้ม gradient */
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0,   '#020810');
  sky.addColorStop(0.4, '#050d1a');
  sky.addColorStop(1,   '#07101f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  /* วาดส่วนประกอบทั้งหมดตามลำดับ */
  drawNebulae();   /* หมอกอวกาศ */
  drawMoon();      /* ดวงจันทร์ */
  drawStars();     /* ดาว */
  drawShooters();  /* ดาวตก */

  /* เรียก loop ใหม่ในเฟรมถัดไป */
  requestAnimationFrame(loop);
}

/* เริ่ม animation loop */
loop();
