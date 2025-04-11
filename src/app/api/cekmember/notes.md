# Dokumentasi API Cek Member untuk Pemula 📱

## 🌟 Pengenalan
API ini seperti seorang resepsionis di sebuah klub eksklusif. Tugasnya sederhana: mengecek apakah seseorang adalah member aktif atau bukan berdasarkan nomor teleponnya.

## 🎯 Cara Kerja

### 1️⃣ Menerima Tamu (Request)
```javascript
export async function POST(request: Request)
```
- API ini seperti resepsionis yang hanya menerima tamu lewat pintu depan (POST request)
- Jika ada yang mencoba masuk lewat pintu belakang (GET request), akan ditolak
- Tamu harus memberikan nomor telepon mereka untuk dicek

### 2️⃣ Memeriksa Format Nomor Telepon
```javascript
const validationResult = CheckMemberSchema.safeParse(body);
```
Bayangkan resepsionis memeriksa kartu identitas dengan aturan berikut:
- ✅ Harus ada nomor (tidak boleh kosong)
  ```javascript
  .min(1, "Nomor telepon wajib diisi")
  ```

- ✅ Harus diawali "62" (kode Indonesia)
  ```javascript
  .regex(/^62\d+$/, "Nomor telepon harus dimulai dengan '62'")
  ```
  Contoh yang benar: 628123456789
  Contoh yang salah: 08123456789

- ✅ Panjang nomor harus masuk akal
  ```javascript
  .min(8, "Nomor telepon terlalu pendek")
  .max(15, "Nomor telepon terlalu panjang")
  ```
  Seperti KTP, tidak mungkin terlalu pendek atau terlalu panjang

### 3️⃣ Mencari Data di Database
```javascript
const member = await getMemberByPhone(validationResult.data.phone);
```
- Resepsionis mencari nomor telepon di daftar member
- Ada 2 kemungkinan:
  1. Ketemu (✅ Lanjut ke pengecekan status)
  2. Tidak ketemu (❌ Langsung ditolak)

### 4️⃣ Memeriksa Status Keanggotaan
```javascript
if (!member || !member.isMember) {
    return NextResponse.json(false);
}
```
Seperti memeriksa kartu member:
1. Kartu tidak ada di sistem (`!member`)
   - Seperti kartu yang tidak terdaftar
   - Langsung mendapat jawaban: ❌ TIDAK BOLEH MASUK

2. Kartu ada tapi tidak aktif (`!member.isMember`)
   - Seperti kartu yang sudah kadaluarsa
   - Tetap mendapat jawaban: ❌ TIDAK BOLEH MASUK

3. Kartu ada dan aktif
   - Mendapat jawaban: ✅ SILAKAN MASUK
   ```javascript
   return NextResponse.json(true);
   ```

### 5️⃣ Penanganan Kesalahan
```javascript
try {
    // Proses pengecekan
} catch (error) {
    console.error("Error checking member:", error);
    return NextResponse.json(false);
}
```
Seperti ketika sistem komputer resepsionis error:
- Mencatat error di buku log
- Lebih baik menolak daripada salah mengizinkan

## 📝 Contoh Penggunaan

### Contoh 1: Member Aktif
```json
Request POST /api/cekmember:
{
    "phone": "628123456789"
}

Response: true ✅
```

### Contoh 2: Format Salah
```json
Request POST /api/cekmember:
{
    "phone": "0812345"
}

Response: false ❌
(Ditolak karena tidak diawali 62)
```

### Contoh 3: Member Non-Aktif
```json
Request POST /api/cekmember:
{
    "phone": "628987654321"
}

Response: false ❌
(Ditolak karena status non-aktif)
```

## 🎯 Kesimpulan
1. API ini seperti resepsionis digital yang:
   - Memeriksa format nomor telepon
   - Mencari di database member
   - Mengecek status keanggotaan
   - Memberi jawaban YA/TIDAK

2. Hanya ada 2 jawaban:
   - `true` = Silakan masuk ✅
   - `false` = Maaf, tidak bisa masuk ❌

3. Keamanan:
   - Selalu validasi input
   - Hanya terima POST request
   - Jika ragu, lebih baik tolak

## 💡 Tips Penggunaan
1. Selalu gunakan awalan "62" untuk nomor telepon
2. Pastikan nomor telepon berupa angka saja
3. Jangan lupa handle error di sisi client
4. Simpan nomor telepon yang valid untuk testing
