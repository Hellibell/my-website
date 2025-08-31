<?php
// ตั้งค่าให้ response เป็น JSON
header("Content-Type: application/json; charset=UTF-8");

// ตัวอย่างข้อมูลล่าสุด (ปกติอาจดึงจาก DB หรือไฟล์อื่น)
$latest = [
    "title" => "อัปเดตล่าสุด",
    "message" => "เว็บของเราเปิดใช้งาน API แล้ว!",
    "time" => date("Y-m-d H:i:s") // เวลาเรียลไทม์
];

// ส่งข้อมูลออกไปเป็น JSON
echo json_encode($latest, JSON_UNESCAPED_UNICODE);
