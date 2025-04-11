Tentu, mari kita bedah dokumentasi Shadcn UI untuk membuat Data Table langkah demi langkah, mencakup semua bagian yang Anda sebutkan.

**Dokumentasi Pembuatan Data Table dengan Shadcn UI & TanStack Table**

Dokumentasi ini akan memandu Anda menggunakan TanStack Table (sebelumnya React Table) v8 bersama dengan komponen `<Table />` dari Shadcn UI untuk membangun Data Table yang kaya fitur dan dapat disesuaikan.

---

**Daftar Isi (Table of Contents)**

1.  **Introduction:** Pengenalan konsep dasar.
2.  **Installation:** Paket dan komponen yang perlu diinstal.
3.  **Prerequisites:** Persyaratan proyek.
4.  **Project Structure:** Struktur folder yang direkomendasikan.
5.  **Basic Table:** Membuat tabel dasar.
    *   Column Definitions: Mendefinisikan kolom tabel.
    *   `<DataTable />` component: Komponen utama tabel.
    *   Render the table: Menampilkan tabel di halaman.
6.  **Cell Formatting:** Memformat tampilan data dalam sel.
    *   Update columns definition: Memperbarui definisi kolom untuk format.
7.  **Row Actions:** Menambahkan menu aksi untuk setiap baris.
    *   Update columns definition: Memperbarui definisi kolom untuk aksi.
8.  **Pagination:** Menambahkan kontrol halaman (sebelumnya/berikutnya).
    *   Update `<DataTable>`: Menyesuaikan komponen tabel untuk state pagination.
    *   Add pagination controls: Menambahkan tombol navigasi halaman.
9.  **Sorting:** Mengaktifkan pengurutan data berdasarkan kolom.
    *   Update `<DataTable>`: Menyesuaikan komponen tabel untuk state sorting.
    *   Make header cell sortable: Membuat header kolom bisa diklik untuk mengurutkan.
10. **Filtering:** Menambahkan fungsionalitas filter data.
    *   Update `<DataTable>`: Menyesuaikan komponen tabel untuk state filtering.
    *   Add filter input: Menambahkan input untuk filter.
11. **Visibility (Column Toggling):** Mengizinkan pengguna menampilkan/menyembunyikan kolom.
    *   Update `<DataTable>`: Menyesuaikan komponen tabel untuk state visibilitas kolom.
    *   Add visibility controls: Menambahkan dropdown untuk memilih kolom yang terlihat.
12. **Row Selection:** Mengizinkan pengguna memilih satu atau beberapa baris.
    *   Update column definitions: Menambahkan kolom checkbox.
    *   Update `<DataTable>`: Menyesuaikan komponen tabel untuk state seleksi baris.
    *   Show selected rows: Menampilkan informasi jumlah baris yang dipilih.
13. **Reusable Components:** Memecah komponen `DataTable` menjadi bagian-bagian yang lebih kecil dan dapat digunakan kembali.
    *   Column header: Komponen untuk header kolom (termasuk sorting).
    *   Pagination: Komponen untuk kontrol pagination.
    *   Column toggle: Komponen untuk kontrol visibilitas kolom.

---

**1. Introduction**

Data Table adalah komponen UI yang umum digunakan untuk menampilkan data dalam format tabular. Panduan ini menunjukkan cara menggabungkan *logic* dari TanStack Table (sebagai *headless UI library* yang mengelola state dan logika tabel) dengan komponen *styling* dari Shadcn UI (`<Table>`, `<Button>`, `<Checkbox>`, dll.) untuk menciptakan pengalaman Data Table yang modern dan fungsional di aplikasi React Anda.

---

**2. Installation**

Pertama, Anda perlu menginstal library TanStack Table:

```bash
npm install @tanstack/react-table
```

Selanjutnya, tambahkan komponen Shadcn UI yang akan kita gunakan sepanjang panduan ini:

```bash
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add button
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add input
# Anda mungkin juga perlu icon, misalnya dari lucide-react
npm install lucide-react
```

---

**3. Prerequisites**

*   Anda harus memiliki proyek React (misalnya, menggunakan Next.js, Vite + React, dll.).
*   Proyek Anda sebaiknya sudah dikonfigurasi untuk menggunakan TypeScript (karena TanStack Table dan contoh Shadcn UI sangat mengandalkannya).
*   Shadcn UI sudah terinisialisasi dalam proyek Anda (`npx shadcn-ui@latest init`).

---

**4. Project Structure**

Struktur folder yang disarankan agar kode tetap terorganisir:

```
.
├── app
│   ├── page.tsx              # Halaman utama untuk menampilkan tabel
│   └── columns.tsx           # Definisi kolom tabel
├── components
│   ├── ui                    # Komponen Shadcn UI (otomatis)
│   └── data-table.tsx        # Komponen utama DataTable
├── lib
│   └── utils.ts              # Fungsi utilitas Shadcn (otomatis)
└── ... (file konfigurasi lainnya)
```

---

**5. Basic Table**

Langkah pertama adalah membuat tabel dasar yang hanya menampilkan data.

**5.1. Column Definitions (`columns.tsx`)**

Definisikan struktur kolom tabel Anda. Ini memberi tahu tabel data apa yang harus ditampilkan dan bagaimana header-nya.

*   Buat file `app/columns.tsx`.
*   Definisikan tipe data Anda (misalnya, `Payment`).
*   Gunakan `ColumnDef<TData, TValue>` dari `@tanstack/react-table`.
*   Properti utama:
    *   `accessorKey`: Nama properti dari objek data Anda yang ingin ditampilkan di kolom ini.
    *   `header`: Teks atau JSX yang akan ditampilkan di header kolom.

```typescript
// app/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"

// Ini adalah contoh tipe data. Sesuaikan dengan data Anda.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
```

**5.2. `<DataTable />` component (`data-table.tsx`)**

Komponen ini akan membungkus logika TanStack Table dan merender komponen `<Table>` dari Shadcn UI.

*   Buat file `components/data-table.tsx`.
*   Gunakan hook `useReactTable` dari `@tanstack/react-table` untuk mengelola state tabel.
*   Hook ini memerlukan `data`, `columns`, dan fungsi `getCoreRowModel`.
*   Gunakan `table.getHeaderGroups()` untuk mendapatkan grup header dan `table.getRowModel()` untuk mendapatkan baris data.
*   Render struktur tabel menggunakan komponen Shadcn UI: `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableHead>`, `<TableBody>`, `<TableCell>`.
*   Gunakan `flexRender` dari `@tanstack/react-table` untuk merender konten header dan sel (memungkinkan konten berupa string, fungsi, atau JSX).

```typescript
// components/data-table.tsx
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // Pastikan path import sesuai

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

**5.3. Render the table (`page.tsx`)**

Sekarang, gunakan komponen `DataTable` di halaman Anda.

*   Import `DataTable` dan `columns`.
*   Siapkan data Anda (bisa dari API fetch atau data dummy).
*   Render komponen `<DataTable>` dengan props `columns` dan `data`.

```typescript
// app/page.tsx
import { Payment, columns } from "./columns"
import { DataTable } from "../components/data-table" // Sesuaikan path

// Fungsi dummy untuk mendapatkan data
async function getData(): Promise<Payment[]> {
  // Di dunia nyata, ini akan menjadi fetch API
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    // ... data lainnya
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

Sekarang Anda seharusnya memiliki tabel dasar yang menampilkan data Anda.

---

**6. Cell Formatting**

Seringkali Anda ingin memformat data sebelum menampilkannya (misalnya, format mata uang, tanggal, dll.).

**6.1. Update columns definition (`columns.tsx`)**

*   Gunakan properti `cell` dalam `ColumnDef`. Properti ini adalah fungsi yang menerima konteks sel (`cellContext`) yang berisi informasi seperti `row`, `column`, dan `getValue()`.
*   Anda bisa menggunakan `getValue()` untuk mendapatkan nilai mentah dan memformatnya.

Contoh memformat kolom `amount` menjadi format mata uang USD:

```typescript
// app/columns.tsx
// ... (import lainnya)
import { ColumnDef } from "@tanstack/react-table"
import { Payment } from "./page" // atau dari mana tipe Payment diimpor

export const columns: ColumnDef<Payment>[] = [
  // ... (kolom status dan email)
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => { // Gunakan fungsi cell
      const amount = parseFloat(row.getValue("amount")) // Ambil nilai amount
      const formatted = new Intl.NumberFormat("en-US", { // Format sebagai mata uang
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div> // Tampilkan hasil format
    },
  },
]
```

---

**7. Row Actions**

Menambahkan tombol atau menu dropdown di setiap baris untuk tindakan seperti "Edit", "Delete", "View Details", dll.

**7.1. Update columns definition (`columns.tsx`)**

*   Tambahkan `ColumnDef` baru, biasanya di akhir array `columns`.
*   Karena kolom ini tidak memetakan langsung ke properti data, berikan `id` unik (misalnya, `id: "actions"`).
*   Gunakan properti `cell` untuk merender komponen, seperti `<DropdownMenu>` dari Shadcn UI.
*   Akses data baris spesifik menggunakan `row.original` di dalam fungsi `cell`.

```typescript
// app/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react" // Import icon

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import komponen DropdownMenu

import { Payment } from "./page" // atau dari mana tipe Payment diimpor

export const columns: ColumnDef<Payment>[] = [
  // ... (kolom status, email, amount)

  // Kolom Aksi
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original // Dapatkan data lengkap baris ini

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)} // Contoh aksi: copy ID
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

---

**8. Pagination**

Menambahkan kontrol untuk menavigasi antar halaman data jika data Anda besar.

**8.1. Update `<DataTable>` (`data-table.tsx`)**

*   Tambahkan `getPaginationRowModel` ke opsi `useReactTable`.
*   Kelola state pagination menggunakan `useState` (opsional, jika Anda ingin kontrol manual, tapi direkomendasikan untuk state awal). TanStack Table v8 dapat mengelola state internal jika Anda tidak menyediakannya. Untuk kontrol tombol eksternal, Anda *akan* memerlukan state atau akses ke fungsi `table`.
*   *Klarifikasi:* Cara paling umum adalah mengelola state pagination *di dalam* `useReactTable` dengan menyediakan `onPaginationChange` dan `state: { pagination }`.

```typescript
// components/data-table.tsx
"use client"

import * as React from "react" // Import React
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel, // <-- Tambahkan ini
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button" // Import Button

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Tidak perlu state pagination eksplisit jika hanya menggunakan tombol bawaan
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // <-- Aktifkan model pagination
    // Jika Anda ingin mengatur ukuran halaman default:
    // initialState: {
    //   pagination: {
    //     pageSize: 10,
    //   },
    // },
  })

  // ... (bagian render <Table> seperti sebelumnya) ...

  // Return statement sekarang harus membungkus tabel dan kontrol pagination
  return (
    <div> {/* Wrapper div */}
      <div className="rounded-md border">
        <Table>
          {/* ... TableHeader dan TableBody ... */}
        </Table>
      </div>
      {/* Kontrol Pagination ditambahkan di sini */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()} // Nonaktifkan jika tidak ada halaman sebelumnya
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()} // Nonaktifkan jika tidak ada halaman berikutnya
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

**8.2. Add pagination controls**

Sudah ditambahkan di dalam `DataTable.tsx` pada langkah sebelumnya. Kontrol ini menggunakan fungsi `table.previousPage()`, `table.nextPage()`, `table.getCanPreviousPage()`, dan `table.getCanNextPage()` untuk berfungsi.

---

**9. Sorting**

Memungkinkan pengguna mengurutkan data dengan mengklik header kolom.

**9.1. Update `<DataTable>` (`data-table.tsx`)**

*   Tambahkan `getSortedRowModel` ke opsi `useReactTable`.
*   Kelola state sorting menggunakan `useState<SortingState>`.
*   Tambahkan `onSortingChange` dan `state: { sorting }` ke `useReactTable` untuk menghubungkan state React dengan state tabel.

```typescript
// components/data-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState, // <-- Import SortingState
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel, // <-- Tambahkan ini
  useReactTable,
} from "@tanstack/react-table"
// ... (import komponen UI lainnya)

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]) // <-- State untuk sorting

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), // <-- Aktifkan model sorting
    onSortingChange: setSorting, // <-- Hubungkan state setter
    state: {
      sorting, // <-- Berikan state sorting ke tabel
    },
  })

  // ... (Return statement dengan Tabel dan Pagination) ...
  // Perubahan utama ada di render <TableHead>
}
```

**9.2. Make header cell sortable**

*   Modifikasi cara header dirender di dalam `DataTable.tsx`.
*   Bungkus konten header dengan komponen `<Button>` (misalnya, `variant="ghost"`).
*   Tambahkan `onClick` pada `Button` untuk memanggil `header.column.toggleSorting(header.column.getIsSorted() === "asc")`.
*   Tampilkan ikon panah (misalnya, dari `lucide-react`) berdasarkan status sorting: `header.column.getIsSorted()`.
*   Gunakan `header.column.getCanSort()` untuk hanya mengaktifkan sorting pada kolom yang diizinkan.

```typescript
// components/data-table.tsx
// ... (import lainnya)
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react" // Import ikon sorting

// ... (di dalam return statement, bagian <TableHeader>)

<TableHeader>
  {table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => {
        return (
          <TableHead key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
            {/* Logika Sorting ditambahkan di sini JIKA header adalah teks sederhana */}
            {/* Jika header sudah komponen kompleks, integrasikan Button ini ke dalamnya */}
            {/* Versi sederhana jika header hanya teks: */}
            {/*
            {header.isPlaceholder || typeof header.column.columnDef.header !== 'string' ? null : (
              <Button
                variant="ghost"
                onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
              >
                {header.column.columnDef.header} // Tampilkan teks header lagi
                {header.column.getIsSorted() === "desc" ? (
                   <ArrowDown className="ml-2 h-4 w-4" />
                 ) : header.column.getIsSorted() === "asc" ? (
                   <ArrowUp className="ml-2 h-4 w-4" />
                 ) : (
                   <ArrowUpDown className="ml-2 h-4 w-4" />
                 )}
              </Button>
            )}
            */}
             {/* Catatan: Contoh di dokumentasi Shadcn mungkin menggunakan komponen header kustom, lihat bagian Reusable Components nanti */}
          </TableHead>
        )
      })}
    </TableRow>
  ))}
</TableHeader>

// ... (sisa komponen)
```

*Penting:* Cara termudah mengimplementasikan sorting adalah dengan memindahkan logika header ke komponen terpisah (`DataTableColumnHeader`), seperti yang ditunjukkan di bagian *Reusable Components*. Untuk saat ini, Anda bisa menambahkan logika `Button` dan ikon langsung di `TableHead` jika headernya sederhana.

Anda juga mungkin ingin menonaktifkan sorting untuk kolom tertentu (seperti "Actions") di `columns.tsx`:

```typescript
// app/columns.tsx
// ...
  {
    id: "actions",
    // ... (cell function)
    enableSorting: false, // <-- Nonaktifkan sorting untuk kolom ini
    enableHiding: false, // <-- Nonaktifkan penyembunyian untuk kolom ini
  },
// ...
```

---

**10. Filtering**

Menambahkan input untuk memfilter data berdasarkan nilai kolom tertentu (misalnya, filter berdasarkan email).

**10.1. Update `<DataTable>` (`data-table.tsx`)**

*   Tambahkan `getFilteredRowModel` ke opsi `useReactTable`.
*   Kelola state filter menggunakan `useState<ColumnFiltersState>`.
*   Tambahkan `onColumnFiltersChange` dan `state: { sorting, columnFilters }` ke `useReactTable`.

```typescript
// components/data-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState, // <-- Import ColumnFiltersState
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel, // <-- Tambahkan ini
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

// ... (import komponen UI: Table, Button, Input)
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]) // <-- State untuk filter

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // <-- Aktifkan model filter
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters, // <-- Hubungkan state filter
    state: {
      sorting,
      columnFilters, // <-- Berikan state filter ke tabel
    },
  })

  // ... (bagian return)
  return (
    <div>
      {/* Tambahkan Input Filter di sini */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""} // Ambil nilai filter kolom 'email'
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value) // Set nilai filter saat input berubah
          }
          className="max-w-sm"
        />
      </div>

      {/* Tabel */}
      <div className="rounded-md border">
        <Table>
            {/* ... TableHeader & TableBody ... */}
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
         {/* ... Tombol Pagination ... */}
      </div>
    </div>
  )
}
```

**10.2. Add filter input**

Sudah ditambahkan di dalam `DataTable.tsx` pada langkah sebelumnya. Input ini terhubung ke state filter kolom "email" menggunakan `table.getColumn("email")?.getFilterValue()` dan `table.getColumn("email")?.setFilterValue()`.

---

**11. Visibility (Column Toggling)**

Memberi pengguna kemampuan untuk memilih kolom mana yang ingin mereka lihat.

**11.1. Update `<DataTable>` (`data-table.tsx`)**

*   Kelola state visibilitas kolom menggunakan `useState<VisibilityState>`.
*   Tambahkan `onColumnVisibilityChange` dan `state: { sorting, columnFilters, columnVisibility }` ke `useReactTable`.

```typescript
// components/data-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState, // <-- Import VisibilityState
  flexRender,
  // ... (import model lainnya)
  useReactTable,
} from "@tanstack/react-table"

// ... (import komponen UI: Table, Button, Input, DropdownMenu)
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({}) // <-- State untuk visibilitas kolom

  const table = useReactTable({
    data,
    columns,
    // ... (get models: core, pagination, sorted, filtered)
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility, // <-- Hubungkan state visibilitas
    state: {
      sorting,
      columnFilters,
      columnVisibility, // <-- Berikan state visibilitas ke tabel
    },
  })

  // ... (bagian return)
  return (
    <div>
      <div className="flex items-center py-4">
        {/* Input Filter */}
        <Input
          // ... (props input filter)
        />
        {/* Tombol Column Toggle (Dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide()) // Hanya kolom yang bisa disembunyikan
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()} // Status checked dari state
                    onCheckedChange={(value) => // Panggil toggle saat diubah
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id} {/* Atau gunakan header kolom jika lebih deskriptif */}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabel */}
      {/* ... */}

      {/* Pagination */}
      {/* ... */}
    </div>
  )
}

```

**11.2. Add visibility controls**

Sudah ditambahkan di dalam `DataTable.tsx` pada langkah sebelumnya. Ini menggunakan komponen `<DropdownMenu>` dari Shadcn UI untuk menampilkan daftar kolom yang dapat di-toggle. Logika `table.getAllColumns()`, `column.getCanHide()`, `column.getIsVisible()`, dan `column.toggleVisibility()` digunakan untuk mengontrol fungsionalitas ini.

---

**12. Row Selection**

Memungkinkan pengguna memilih baris menggunakan checkbox.

**12.1. Update column definitions (`columns.tsx`)**

*   Tambahkan `ColumnDef` baru di *awal* array `columns` untuk checkbox.
*   Berikan `id: "select"`.
*   Gunakan `header` untuk merender checkbox "select all":
    *   Gunakan `table.getIsAllPageRowsSelected()` dan `table.getIsSomePageRowsSelected()` untuk menentukan state `checked` dan `indeterminate`.
    *   Gunakan `table.toggleAllPageRowsSelected(!!value)` pada `onCheckedChange`.
*   Gunakan `cell` untuk merender checkbox per baris:
    *   Gunakan `row.getIsSelected()` untuk state `checked`.
    *   Gunakan `row.toggleSelected(!!value)` pada `onCheckedChange`.
*   Nonaktifkan sorting dan hiding untuk kolom ini (`enableSorting: false, enableHiding: false`).

```typescript
// app/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox" // Import Checkbox
// ... (import lainnya: DropdownMenu, Button, MoreHorizontal, Payment)

export const columns: ColumnDef<Payment>[] = [
  // Kolom Checkbox Seleksi
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || // Semua baris di halaman ini terpilih
          (table.getIsSomePageRowsSelected() && "indeterminate") // Beberapa baris terpilih
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} // Toggle semua baris di halaman
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()} // Apakah baris ini terpilih?
        onCheckedChange={(value) => row.toggleSelected(!!value)} // Toggle status terpilih baris ini
        aria-label="Select row"
      />
    ),
    enableSorting: false, // Nonaktifkan sorting
    enableHiding: false, // Nonaktifkan hiding
  },
  // ... (kolom status, email, amount)
  // ... (kolom actions)
]
```

**12.2. Update `<DataTable>` (`data-table.tsx`)**

*   Aktifkan seleksi baris di `useReactTable` dengan `enableRowSelection: true`.
*   Kelola state seleksi baris menggunakan `useState<{}>`. Objek ini akan menyimpan ID baris yang dipilih.
*   Tambahkan `onRowSelectionChange` dan `state: { sorting, columnFilters, columnVisibility, rowSelection }` ke `useReactTable`.
*   Tambahkan `getRowId` jika ID unik baris Anda bukan `id`. Defaultnya mencari properti `id`. Jika ID unik ada di properti lain (misal `paymentId`), tambahkan: `getRowId: (row) => row.paymentId`.

```typescript
// components/data-table.tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  // ... (get models)
  useReactTable,
} from "@tanstack/react-table"
// ... (import komponen UI)

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({}) // <-- State untuk seleksi baris

  const table = useReactTable({
    data,
    columns,
    // ... (get models)
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection, // <-- Hubungkan state seleksi
    // getRowId: (row) => row.yourUniqueId, // Opsional: jika ID bukan 'id'
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection, // <-- Berikan state seleksi ke tabel
    },
    enableRowSelection: true, // <-- Aktifkan seleksi baris
  })

  // ... (bagian return: filter, column toggle, tabel, pagination)
  // Tambahkan info jumlah baris terpilih di bawah tabel (sebelum pagination)
  return (
     <div>
        {/* ... Filter & Column Toggle ... */}

        <div className="rounded-md border">
            <Table>
                {/* ... TableHeader & TableBody ... */}
            </Table>
        </div>

        {/* Info Baris Terpilih */}
        <div className="flex-1 text-sm text-muted-foreground py-2">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
             {/* ... Tombol Pagination ... */}
        </div>
     </div>
  )
}
```

**12.3. Show selected rows**

Sudah ditambahkan di `DataTable.tsx` pada langkah sebelumnya. Kode ini menggunakan `table.getFilteredSelectedRowModel().rows.length` untuk mendapatkan jumlah baris yang terpilih (setelah filter diterapkan).

---

**13. Reusable Components**

Untuk menjaga komponen `DataTable.tsx` tetap bersih dan terkelola, serta agar bagian-bagian UI dapat digunakan kembali, Anda dapat memecah logika ke komponen-komponen yang lebih kecil.

**13.1. Column header (`data-table-column-header.tsx`)**

Komponen ini akan menangani rendering header kolom, termasuk logika sorting dan ikon.

*   Buat file `components/data-table-column-header.tsx`.
*   Pindahkan logika `Button` dan ikon sorting dari `DataTable.tsx` ke komponen ini.
*   Terima `column` dan `title` sebagai props. Anda mungkin juga perlu menerima `className`.

```typescript
// components/data-table-column-header.tsx
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils" // Utilitas ClassName dari Shadcn
import { Button } from "@/components/ui/button"
// Anda mungkin perlu DropdownMenu jika ingin menambahkan aksi lain di header
// import { DropdownMenu, ... } from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) { // Jika kolom tidak bisa di-sort, tampilkan judul saja
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{title}</span>
        {column.getIsSorted() === "desc" ? (
          <ArrowDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
      {/* Anda bisa menambahkan DropdownMenu di sini untuk aksi lain (hide, dll) */}
    </div>
  )
}
```

*   **Update `columns.tsx`:** Gunakan komponen ini di definisi kolom Anda.

```typescript
// app/columns.tsx
// ...
import { DataTableColumnHeader } from "@/components/data-table-column-header" // Import komponen header

export const columns: ColumnDef<Payment>[] = [
  // ... (kolom select)
  {
    accessorKey: "status",
    // Gunakan komponen kustom untuk header
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
       <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "amount",
    // Gunakan properti header standar jika perlu alignment kanan
    header: ({ column }) => (
       <div className="text-right">
           <DataTableColumnHeader column={column} title="Amount" />
       </div>
    ),
    // ... (cell formatting)
    cell: ({ row }) => { /* ... format amount ... */ },
  },
  // ... (kolom actions)
]
```

*   **Update `DataTable.tsx`:** Sederhanakan rendering `TableHead`. Sekarang hanya perlu `flexRender`.

```typescript
// components/data-table.tsx
// ... (di dalam <TableHeader>)
<TableHead key={header.id}>
  {header.isPlaceholder
    ? null
    : flexRender(
        header.column.columnDef.header, // Ini akan merender DataTableColumnHeader
        header.getContext()
      )}
</TableHead>
// ...
```

**13.2. Pagination (`data-table-pagination.tsx`)**

Komponen terpisah untuk kontrol pagination.

*   Buat file `components/data-table-pagination.tsx`.
*   Pindahkan elemen `div` yang berisi tombol "Previous" dan "Next" (dan mungkin info halaman/ukuran halaman) dari `DataTable.tsx` ke sini.
*   Terima `table` object sebagai prop.

```typescript
// components/data-table-pagination.tsx
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
// Anda bisa menambahkan Select untuk ukuran halaman, dll.

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
       {/* Info Baris Terpilih (pindahkan dari DataTable.tsx) */}
       <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
       </div>

       {/* Tombol Navigasi */}
       <div className="flex items-center space-x-6 lg:space-x-8">
           {/* Anda bisa menambahkan info halaman (Page 1 of 10) di sini */}
           {/* Anda bisa menambahkan Select untuk Page Size di sini */}
           <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  {/* Icon ChevronLeft */}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  {/* Icon ChevronRight */}
                </Button>
                {/* Anda bisa menambahkan tombol Go to First/Last Page */}
           </div>
       </div>
    </div>
  )
}

```

*   **Update `DataTable.tsx`:** Hapus logika pagination dan info baris terpilih dari `DataTable.tsx`, lalu render komponen baru ini di bagian bawah.

```typescript
// components/data-table.tsx
// ... (import lainnya)
import { DataTablePagination } from "./data-table-pagination" // Import komponen pagination

// ... (di dalam return statement)
return (
    <div>
        {/* ... Filter & Column Toggle ... */}

        <div className="rounded-md border">
            <Table>
                {/* ... TableHeader & TableBody ... */}
            </Table>
        </div>

        {/* Render Komponen Pagination */}
        <DataTablePagination table={table} />
    </div>
)
// ...
```

**13.3. Column toggle (`data-table-view-options.tsx`)**

Komponen terpisah untuk dropdown visibilitas kolom.

*   Buat file `components/data-table-view-options.tsx`.
*   Pindahkan komponen `<DropdownMenu>` untuk column toggle dari `DataTable.tsx` ke sini.
*   Terima `table` object sebagai prop.

```typescript
// components/data-table-view-options.tsx
"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
// Import icon (misalnya MixerHorizontalIcon dari Radix atau icon lain)

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex" // Sesuaikan tampilan/posisi
        >
          {/* Icon View/Columns */}
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id} {/* Ganti dengan nama yang lebih ramah jika perlu */}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

*   **Update `DataTable.tsx`:** Hapus dropdown column toggle dari `DataTable.tsx` dan render komponen baru ini, biasanya di sebelah input filter.

```typescript
// components/data-table.tsx
// ... (import lainnya)
import { DataTableViewOptions } from "./data-table-view-options" // Import komponen view options

// ... (di dalam return statement)
return (
    <div>
        <div className="flex items-center py-4">
            {/* Input Filter */}
            <Input
              // ... (props input filter)
            />
            {/* Render Komponen View Options */}
            <DataTableViewOptions table={table} />
        </div>

        {/* ... Tabel ... */}
        {/* ... Pagination (komponen) ... */}
    </div>
)
// ...
```

---

Selesai! Dengan mengikuti langkah-langkah ini, Anda telah membangun Data Table yang komprehensif menggunakan Shadcn UI dan TanStack Table, mencakup semua fitur utama dari dokumentasi: tabel dasar, format sel, aksi baris, pagination, sorting, filtering, visibilitas kolom, seleksi baris, dan akhirnya memfaktorkan ulang UI menjadi komponen yang dapat digunakan kembali. Pastikan path import komponen sesuai dengan struktur proyek Anda.