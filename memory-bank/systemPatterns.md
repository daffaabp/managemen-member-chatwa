# Pola Sistem

## Arsitektur Aplikasi
1. **Next.js App Router**
   - Server Components untuk performa
   - Client Components untuk interaktivitas
   - Server Actions untuk operasi data

2. **Struktur Direktori**
   ```
   src/
   ├── app/
   │   └── member/
   │       ├── member-types.ts
   │       ├── member-validation.ts
   │       ├── member-services.ts
   │       ├── member-action.ts
   │       ├── member-table.tsx
   │       ├── member-add-modal.tsx
   │       ├── member-delete-modal.tsx
   │       └── page.tsx
   ```

## Pola Desain
1. **Pemisahan Kepentingan**
   - Types: Definisi tipe data
   - Validation: Schema validasi input
   - Services: Operasi database
   - Actions: Server actions
   - Components: UI components

2. **Component Patterns**
   - Atomic Design
   - Composable Components
   - Reusable UI Components

3. **State Management**
   - Local State: useState
   - Server State: Server Components
   - Form State: react-hook-form

## Pola Data
1. **Schema Database**
   ```prisma
   model Member {
     id        String   @id @default(uuid())
     phone     String   @unique
     isMember  Boolean  @default(false)
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

2. **Validasi Data**
   ```typescript
   export const CreateMemberSchema = z.object({
     phone: z.string()
       .min(1, "Nomor telepon wajib diisi")
       .regex(/^\d+$/, "Nomor telepon harus berupa angka")
       .min(5, "Nomor telepon terlalu pendek")
       .max(15, "Nomor telepon terlalu panjang"),
     isMember: z.boolean()
   });
   ```

## Pola Interaksi
1. **Form Handling**
   - Validasi client-side
   - Server actions
   - Error handling
   - Loading states

2. **Status Updates**
   - Optimistic updates
   - Real-time feedback
   - Error recovery

3. **Modal Dialogs**
   - Konfirmasi aksi
   - Form input
   - Loading states

## Pola Error Handling
1. **Client-side**
   - Form validation
   - Toast notifications
   - Loading indicators

2. **Server-side**
   - Try-catch blocks
   - Error messages
   - Status codes

## Pola Keamanan
1. **Validasi Input**
   - Zod schemas
   - Type checking
   - Sanitasi data

2. **Server Actions**
   - CSRF protection
   - Rate limiting
   - Error masking 