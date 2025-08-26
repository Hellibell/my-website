// Log ข้อความตอนโหลดหน้า
console.log("Bio Page Loaded!");

// ตรวจสอบว่าเคยเข้ามาแล้วหรือยัง
if (!localStorage.getItem("visited")) {
  // ถ้ายังไม่เคยเข้ามา -> นับเป็น 1
  localStorage.setItem("visited", "true");
  localStorage.setItem("siteViews", 1);
}

// ดึงค่าผู้เข้าชม
let views = localStorage.getItem("siteViews") || 1;

// แสดงผลใน view-counter พร้อมใส่รูป eye.png แทน emoji
document.querySelector(".view-counter").innerHTML =
  '<img src="assets/Photo/eye.png" alt="eye" width="16" height="16" style="vertical-align:middle;"> ' 
  + views + " เข้าชม";
