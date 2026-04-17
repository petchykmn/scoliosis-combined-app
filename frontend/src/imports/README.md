# Scoliosis AI Analyzer (YOLOv11m-Pose)

ชุดโปรแกรมวิเคราะห์กระดูกสันหลังคดอัตโนมัติ ด้วย AI (YOLO11m-Pose)
This is a standalone package for automatic scoliosis severity classification and 10-point spinal keypoint estimation.

## 📌 Features
- **10 Keypoints:** วิเคราะห์ตำแหน่งกระดูกสันหลัง (6 จุด), หัวไหล่ (2 จุด) และสะบัก (2 จุด)
- **Classification:** แบ่งระดับความรุนแรงเป็น 4 ระดับ: Normal, Mild, Moderate, Severe
- **Professional Visualization:** จุดสีขาวขอบดำ และเส้นแสดงแนวกระดูกสันหลังสีดำ เพื่อการวิเคราะห์ที่ชัดเจน

## 🛠️ การติดตั้ง (Installation)
1. ติดตั้ง Python (แนะนำ version 3.9 ขึ้นไป)
2. ติดตั้ง Library ที่จำเป็นโดยใช้คำสั่ง:
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 วิธีใช้งาน (Usage)
1. รันไฟล์ `predict.py`:
   ```bash
   python predict.py
   ```
2. พิมพ์ที่อยู่ไฟล์ภาพ (Image Path) หรือลากรูปภาพมาวางในหน้าต่าง Terminal แล้วกด Enter
3. ผลลัพธ์จะแสดงขึ้นมาบนหน้าจอ และถูกบันทึกไว้ในโฟลเดอร์ `results/`

## 📊 เกณฑ์การวัด (Class Definitions)
- **Normal:** < 10 degrees (ปกติ)
- **Mild:** 10 - 25 degrees (คดเล็กน้อย)
- **Moderate:** 25 - 40 degrees (คดปานกลาง)
- **Severe:** > 40 degrees (คดรุนแรง)

---
*Disclaimer: This is an AI research tool. For clinical diagnosis, please consult a medical professional.*
