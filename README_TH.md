# คู่มือใช้งานแบบจับมือทำ: รวม Backend AI กับ Frontend แอป

โปรเจกต์นี้รวมไฟล์ 2 ส่วนเข้าด้วยกันแล้ว
- `backend/` = ฝั่ง AI model + API สำหรับรับรูปและวิเคราะห์
- `frontend/` = ฝั่งหน้าจอแอปที่เชื่อมกับ backend จริงแล้ว

## สิ่งที่โปรเจกต์นี้ทำได้
- ผู้ใช้เปิดหน้าแอป
- อ่านคำแนะนำการถ่ายรูป
- อัปโหลดรูปหลัง
- กดวิเคราะห์
- Frontend ส่งรูปไปที่ Backend
- Backend เรียกโมเดล `scoliosis_model.pt`
- ส่งผลกลับมาเป็น
  - ระดับความรุนแรง (Normal / Mild / Moderate / Severe)
  - ความมั่นใจของโมเดล (confidence)
  - รูปที่วาด keypoints + เส้น + กล่องผลลัพธ์แล้ว

## สิ่งสำคัญมาก
เวอร์ชันนี้ **ไม่แสดง Cobb angle จริงแบบการแพทย์** เพราะจากไฟล์โมเดลที่ให้มา โมเดลตัวนี้เน้นทำนาย “คลาสความรุนแรง” และ keypoints เป็นหลัก
ดังนั้นหน้าแอปจึงแสดง
- severity class
- confidence
- degree range ตามคลาส
แทนการแสดงตัวเลของศาปลอม

---

# ส่วนที่ 1: ติดตั้งโปรแกรมที่ต้องมี

## 1) ติดตั้ง Python
ให้ติดตั้ง Python 3.10 หรือ 3.11 จะง่ายที่สุด

### วิธีติดตั้ง
1. เปิดเว็บดาวน์โหลด Python
2. ดาวน์โหลดเวอร์ชัน Windows
3. ตอนติดตั้ง **ติ๊กถูกช่อง Add Python to PATH**
4. กด Install Now
5. เมื่อติดตั้งเสร็จ ปิดแล้วเปิด VS Code ใหม่

### วิธีเช็กว่าติดตั้งสำเร็จไหม
เปิด VS Code แล้วเปิด Terminal จากเมนูด้านบน
- `Terminal`
- `New Terminal`

แล้วพิมพ์คำสั่งนี้

```bash
python --version
```

ถ้าไม่ขึ้น ให้ลอง

```bash
py --version
```

ถ้าขึ้นเช่น `Python 3.11.x` แปลว่าใช้ได้แล้ว

---

## 2) ติดตั้ง Node.js
ต้องใช้สำหรับรัน frontend

### วิธีติดตั้ง
1. เปิดเว็บดาวน์โหลด Node.js
2. ดาวน์โหลด **LTS**
3. ติดตั้งแบบกด Next ไปเรื่อย ๆ
4. ติดตั้งเสร็จแล้ว ปิดและเปิด VS Code ใหม่

### วิธีเช็ก
ใน Terminal พิมพ์

```bash
node -v
npm -v
```

ถ้าขึ้นเลขเวอร์ชัน แปลว่าใช้ได้

---

# ส่วนที่ 2: เตรียมโฟลเดอร์โปรเจกต์

## 3) แตกไฟล์ zip ที่ฉันให้
ให้แตกไฟล์ `scoliosis_combined_app.zip`

แนะนำให้วางไว้ที่ path ง่าย ๆ เช่น

```text
D:\scoliosis_combined_app
```

หรือ

```text
C:\Users\ชื่อคุณ\Desktop\scoliosis_combined_app
```

**อย่าวางใน path ที่ยาวเกินไปหรือมีชื่อโฟลเดอร์ซ้อนเยอะ** จะลดโอกาส error

---

## 4) เปิดโฟลเดอร์ใน VS Code
1. เปิด VS Code
2. กด `File`
3. กด `Open Folder`
4. เลือกโฟลเดอร์ `scoliosis_combined_app`
5. กด `Select Folder`

ตอนนี้ฝั่งซ้ายจะเห็น
- backend
- frontend
- README_TH.md

---

# ส่วนที่ 3: รัน Backend

## 5) เปิด Terminal ใน VS Code
ถ้ายังไม่เห็น Terminal
1. กดเมนู `Terminal`
2. กด `New Terminal`

จะมีช่องสีดำด้านล่างโผล่ขึ้นมา

---

## 6) เข้าโฟลเดอร์ backend
ใน Terminal พิมพ์

```bash
cd backend
```

แล้วกด Enter

---

## 7) สร้าง virtual environment
พิมพ์

```bash
py -m venv .venv
```

ถ้าเครื่องคุณใช้ `python` แทน `py` ให้ใช้

```bash
python -m venv .venv
```

รอจนจบ

---

## 8) เปิดใช้งาน virtual environment
### ถ้าเป็น PowerShell
พิมพ์

```powershell
.\.venv\Scripts\Activate.ps1
```

ถ้าขึ้น error เรื่อง script execution ให้พิมพ์อันนี้ก่อน 1 ครั้ง

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

แล้วค่อยพิมพ์อีกครั้ง

```powershell
.\.venv\Scripts\Activate.ps1
```

### ถ้าเป็น Command Prompt
พิมพ์

```cmd
.venv\Scripts\activate.bat
```

### เช็กว่าเปิดสำเร็จหรือยัง
ตรงต้นบรรทัดจะมีแบบนี้

```text
(.venv)
```

---

## 9) ติดตั้งไลบรารี backend
พิมพ์

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

ขั้นตอนนี้อาจใช้เวลานานพอสมควร เพราะมี `torch`, `ultralytics`, `opencv`

ถ้าระหว่างติดตั้งขึ้น error แปลก ๆ ให้ลองซ้ำอีกครั้ง

```bash
pip install -r requirements.txt
```

---

## 10) รัน backend
พิมพ์

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

ถ้ารันได้ จะเห็นข้อความประมาณนี้

```text
Uvicorn running on http://0.0.0.0:8000
```

### วิธีเช็กว่า backend ใช้ได้จริง
เปิดเบราว์เซอร์ในคอม แล้วเข้า

```text
http://127.0.0.1:8000/api/health
```

ถ้าขึ้นประมาณนี้

```json
{"status":"ok"}
```

แปลว่า backend พร้อมแล้ว

อีกหน้าเช็กได้คือ

```text
http://127.0.0.1:8000/docs
```

จะเห็นหน้า API docs

**อย่าปิด Terminal นี้** เพราะ backend ต้องเปิดค้างไว้

---

# ส่วนที่ 4: รัน Frontend

## 11) เปิด Terminal อันใหม่
ใน VS Code ให้กดปุ่ม `+` ที่แถบ Terminal เพื่อเปิดอีกแท็บ

ตอนนี้คุณจะมี 2 terminal
- terminal แรก = backend
- terminal ที่สอง = frontend

---

## 12) เข้าโฟลเดอร์ frontend
ใน Terminal ใหม่ พิมพ์

```bash
cd frontend
```

ถ้าตอนนี้ terminal ยังอยู่ใน `backend` ให้พิมพ์

```bash
cd ..
cd frontend
```

---

## 13) ติดตั้งไลบรารี frontend
พิมพ์

```bash
npm install
```

รอจนเสร็จ

---

## 14) รัน frontend
พิมพ์

```bash
npm run dev
```

ถ้าสำเร็จ จะขึ้นประมาณนี้

```text
Local:   http://localhost:5173/
Network: http://192.168.x.x:5173/
```

ให้เปิดลิงก์ Local ในคอมก่อน

```text
http://localhost:5173/
```

ถ้าหน้าเว็บขึ้น แปลว่า frontend ใช้ได้

**อย่าปิด terminal นี้** เช่นกัน

---

# ส่วนที่ 5: เปิดในโทรศัพท์มือถือ

## 15) ให้มือถือกับคอมอยู่ Wi‑Fi เดียวกัน
สำคัญมาก

- คอมต่อ Wi‑Fi บ้าน/หอ
- มือถือต้องต่อ Wi‑Fi เดียวกัน
- อย่าใช้มือถือ 4G/5G คนละเครือข่าย

---

## 16) หา IP ของคอม
ในคอม เปิด Terminal ใหม่ หรือ Command Prompt แล้วพิมพ์

```bash
ipconfig
```

หา `IPv4 Address` เช่น

```text
192.168.1.8
```

---

## 17) เปิดแอปจากมือถือ
ในมือถือ เปิดเบราว์เซอร์ แล้วพิมพ์

```text
http://192.168.1.8:5173
```

เปลี่ยนเลข IP ให้ตรงกับเครื่องคุณจริง

ถ้าเข้าได้ แปลว่าใช้บนมือถือได้แล้ว

---

# ส่วนที่ 6: วิธีใช้งานแอป

## 18) ลำดับการใช้งาน
1. เปิดหน้าแอป
2. ไปหน้า Instructions
3. อ่านท่าทางการถ่ายรูป
4. ไปหน้า Upload
5. เลือกรูปหลัง
6. กด Analyze
7. รอผล
8. ดูผลลัพธ์ที่ backend ส่งกลับมา

ผลที่เห็นจะมี
- ภาพที่วาด keypoints แล้ว
- ชื่อคลาส เช่น Normal / Mild / Moderate / Severe
- confidence
- degree range ตามคลาส
- recommendation

---

# ส่วนที่ 7: ถ้าจะหยุดโปรแกรม

## 19) ปิด backend / frontend
ให้กลับไปที่แต่ละ Terminal แล้วกด

```bash
Ctrl + C
```

กดทั้ง 2 terminal

---

# ส่วนที่ 8: ปัญหาที่พบบ่อย

## ปัญหา 1: `python` หรือ `py` ไม่รู้จักคำสั่ง
สาเหตุ
- ยังไม่ได้ติดตั้ง Python
- ติดตั้งแล้วแต่ไม่ได้ติ๊ก Add Python to PATH

วิธีแก้
- ติดตั้งใหม่ แล้วติ๊ก Add Python to PATH
- ปิด VS Code แล้วเปิดใหม่

---

## ปัญหา 2: `npm` ไม่รู้จักคำสั่ง
สาเหตุ
- ยังไม่ได้ติดตั้ง Node.js

วิธีแก้
- ติดตั้ง Node.js LTS
- ปิด VS Code แล้วเปิดใหม่

---

## ปัญหา 3: เปิด virtual environment ไม่ได้
ถ้าเป็น PowerShell ให้พิมพ์

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

แล้วค่อย activate ใหม่

---

## ปัญหา 4: โหลดโมเดลไม่ได้
เช็กว่าใน `backend/` มีไฟล์นี้อยู่จริง

```text
scoliosis_model.pt
```

ถ้าไม่มี ให้คัดลอกกลับมาใหม่

---

## ปัญหา 5: วิเคราะห์แล้วบอกว่าไม่พบ spine region
สาเหตุที่พบบ่อย
- รูปมืดเกินไป
- ฉากหลังรก
- ถ่ายไกลเกินไป
- หลังไม่อยู่ตรงกลางภาพ
- รูปไม่ชัด

วิธีแก้
- ถ่ายใหม่ตามหน้า Instructions
- ใช้พื้นหลังเรียบ
- แสงสม่ำเสมอ
- เห็นหลังเต็มตัวชัดเจน

---

## ปัญหา 6: มือถือเปิดลิงก์ไม่ได้
เช็ก 4 อย่างนี้
1. backend ยังรันอยู่ไหม
2. frontend ยังรันอยู่ไหม
3. คอมกับมือถืออยู่ Wi‑Fi เดียวกันไหม
4. ใช้ IP ถูกไหม

---

# ส่วนที่ 9: ถ้าจะทำเป็นแอปติดตั้งในมือถือจริงภายหลัง
เวอร์ชันนี้เหมาะที่สุดสำหรับ “ต้นแบบใช้งานบนมือถือผ่านเบราว์เซอร์”
เพราะทำได้เร็วและเสถียรกว่า

ถ้าต้องการขั้นต่อไปค่อยไปทำเป็น
- Android APK ด้วย Capacitor
- หรือ deploy ขึ้น server/cloud แล้วเปิดผ่าน URL จริง

---

# คำสั่งรวบแบบสั้น

## Backend
```bash
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```
