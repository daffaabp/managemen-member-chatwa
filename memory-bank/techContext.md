# Konteks Teknis

## Stack Teknologi
- Next.js 14 (App Router)
- TypeScript
- Prisma (ORM)
- MySQL (Database)
- Tailwind CSS
- Shadcn/ui (Komponen UI)
- Zod (Validasi)

## Arsitektur API

### 1. API Cek Member
```typescript
// Route: /api/cekmember
// Method: POST

// Request
{
    "phone": string // format: 62xxxx
}

// Response
boolean // true jika member aktif, false jika tidak
```

### 2. Validasi
```typescript
// Schema Validasi Nomor Telepon
phone: z.string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^62\d+$/, "Nomor telepon harus dimulai dengan '62' dan berupa angka")
    .min(11, "Nomor telepon terlalu pendek (minimal 11 digit termasuk '62')")
    .max(15, "Nomor telepon terlalu panjang (maksimal 15 digit termasuk '62')")
```

## Database

### Model Member
```prisma
model Member {
    id        String   @id @default(cuid())
    phone     String   @unique
    isMember  Boolean  @default(false)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

## Komponen UI

### 1. MemberTable
- Menampilkan data member dalam format tabel
- Fitur switch untuk mengubah status
- Loading state saat update status
- Integrasi dengan API services

### 2. Dialog Components
- MemberAddDialog: Form tambah member
- MemberDeleteDialog: Konfirmasi hapus

## Services Layer

### Member Services
```typescript
// Fungsi-fungsi utama
getAllMembers()
getMemberById(id: string)
getMemberByPhone(phone: string)
createMember(data: MemberData)
updateMemberStatus(id: string, status: boolean)
deleteMember(id: string)
```

## Keamanan
- Validasi input ketat untuk nomor telepon
- Error handling untuk semua API endpoints
- Response yang aman dan konsisten

## Performa
- Optimisasi query database
- Loading states untuk UX yang lebih baik
- Minimal response payload untuk API

## Best Practices
- Strict TypeScript typing
- Consistent error handling
- Clean code architecture
- Modular components
- Reusable services

## Tech Stack
1. **Frontend**
   - Next.js 14 (App Router)
   - TypeScript
   - Tailwind CSS
   - Shadcn/ui
   - React Hook Form
   - Zod
   - Sonner (Toast)
   - Lucide Icons

2. **Backend**
   - Next.js Server Components
   - Next.js Server Actions
   - Prisma ORM
   - MySQL

3. **Development Tools**
   - VS Code
   - Git
   - npm/yarn
   - Prettier
   - ESLint

## Dependensi Utama
```json
{
  "dependencies": {
    "@prisma/client": "latest",
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@hookform/resolvers": "latest",
    "zod": "latest",
    "sonner": "latest",
    "lucide-react": "latest",
    "date-fns": "latest"
  },
  "devDependencies": {
    "typescript": "5.x",
    "prisma": "latest",
    "@types/react": "18.x",
    "@types/node": "20.x",
    "tailwindcss": "latest",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

## Konfigurasi Proyek
1. **TypeScript**
   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "target": "es5",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "plugins": [
         {
           "name": "next"
         }
       ],
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

2. **Prisma**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }

   generator client {
     provider = "prisma-client-js"
   }
   ```

## Konvensi Kode
1. **Penamaan**
   - PascalCase: Components, Types, Interfaces
   - camelCase: Variables, Functions
   - kebab-case: File names
   - UPPER_CASE: Constants

2. **File Structure**
   - Satu komponen per file
   - Ekspor named untuk utilities
   - Ekspor default untuk komponen utama

3. **Styling**
   - Tailwind CSS classes
   - CSS Modules jika diperlukan
   - Shadcn/ui untuk komponen dasar

## Keamanan
1. **Validasi Input**
   - Zod schemas
   - TypeScript types
   - Server-side validation

2. **Database**
   - Prepared statements (Prisma)
   - Unique constraints
   - Foreign key constraints

3. **API**
   - Rate limiting
   - CORS
   - CSRF protection

## Performa
1. **Optimisasi**
   - Server Components
   - Client-side caching
   - Optimistic updates
   - Lazy loading

2. **Monitoring**
   - Console logging
   - Error tracking
   - Performance metrics 