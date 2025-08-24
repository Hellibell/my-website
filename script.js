// script.js

// แสดงข้อความตอนโหลดหน้าเว็บ
window.addEventListener('DOMContentLoaded', () => {
    console.log("Welcome to 3a1tr Online!");
});

// เพิ่ม event ให้ปุ่มดาวน์โหลด
const downloadButton = document.querySelector('a.button');
if (downloadButton) {
    downloadButton.addEventListener('click', (e) => {
        alert("กำลังดาวน์โหลดสคริปต์...");
    });
}
