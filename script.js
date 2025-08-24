// ตัวอย่างถ้าต้องการแจ้ง alert เวลาคลิก
const links = document.querySelectorAll(".links a");

links.forEach(link => {
  link.addEventListener("click", () => {
    console.log(`Opening ${link.href}`);
  });
});
