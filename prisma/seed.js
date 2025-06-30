const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log(' Mulai proses seeding...');

  // 1. Membuat atau memperbarui user Admin
  console.log('Membuat akun admin...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kampus.com' },
    update: {},
    create: {
      email: 'admin@kampus.com',
      name: 'Admin Utama',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Akun admin dibuat/diperbarui dengan ID: ${adminUser.id}`);

  // 2. Menghapus data lama untuk memastikan kebersihan
  console.log('Menghapus data menu dan postingan lama...');
  // Hapus dari model yang memiliki relasi terlebih dahulu
  await prisma.fileItem.deleteMany({});
  await prisma.repositoryItem.deleteMany({});
  await prisma.subMenuItem.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.post.deleteMany({ where: { authorId: adminUser.id } });


  // 3. Membuat struktur menu dan konten halaman sesuai Figma
  console.log('Membuat menu, submenu, dan halaman konten...');
  
  // BERANDA
  await prisma.menuItem.create({
    data: { name: 'BERANDA', href: '/', order: 1 },
  });

  // TENTANG STISIP (dengan banyak submenu)
  await prisma.menuItem.create({
    data: {
      name: 'TENTANG STISIP', order: 2,
      submenus: {
        create: [
          { name: 'Visi & Misi', order: 1, post: { create: { title: 'Visi & Misi', content: '<h1>Visi & Misi</h1><p>Konten untuk halaman Visi & Misi belum diisi.</p>', authorId: adminUser.id } } },
          { name: 'Informasi Prodi', order: 2, post: { create: { title: 'Informasi Prodi', content: '<h1>Informasi Prodi</h1><p>Konten untuk halaman Informasi Prodi belum diisi.</p>', authorId: adminUser.id } } },
          { name: 'Lokasi Kampus', order: 3, post: { create: { title: 'Lokasi Kampus', content: '<h1>Lokasi Kampus</h1><p>Konten untuk halaman Lokasi Kampus belum diisi.</p>', authorId: adminUser.id } } },
          { name: 'Fasilitas', order: 4, post: { create: { title: 'Fasilitas', content: '<h1>Fasilitas</h1><p>Konten untuk halaman Fasilitas belum diisi.</p>', authorId: adminUser.id } } },
          { name: 'Sejarah Kampus', order: 5, post: { create: { title: 'Sejarah Kampus', content: '<h1>Sejarah Kampus</h1><p>Konten untuk halaman Sejarah Kampus belum diisi.</p>', authorId: adminUser.id } } },
        ],
      },
    }
  });

  // PROGRAM STUDI
  await prisma.menuItem.create({
    data: {
        name: 'PROGRAM STUDI', order: 3,
        submenus: {
            create: [
                { name: 'Ilmu Pemerintahan', order: 1, post: { create: { title: 'Ilmu Pemerintahan', content: '<h1>Ilmu Pemerintahan</h1><p>Konten untuk halaman Ilmu Pemerintahan belum diisi.</p>', authorId: adminUser.id } } },
                { name: 'Ilmu Administrasi Negara', order: 2, post: { create: { title: 'Ilmu Administrasi Negara', content: '<h1>Ilmu Administrasi Negara</h1><p>Konten untuk halaman Ilmu Administrasi Negara belum diisi.</p>', authorId: adminUser.id } } }
            ]
        }
    }
  });

  // REPOSITORY
  await prisma.menuItem.create({
    data: { name: 'REPOSITORY', href: '/repository', order: 4 }
  });

  // KONTAK
  await prisma.menuItem.create({
    data: { name: 'KONTAK', href: '/kontak', order: 5 }
  });

  console.log('Menu dan halaman konten berhasil dibuat.');


  // 4. Membuat satu contoh data Repository
  console.log('Membuat contoh data repository...');
  await prisma.repositoryItem.create({
    data: {
      title: 'Contoh Skripsi: Analisis Dampak Digitalisasi Terhadap UMKM',
      author: 'Mahasiswa Berprestasi',
      year: 2024,
      studyProgram: 'Ilmu Administrasi Negara',
      abstract: 'Ini adalah abstrak dari contoh skripsi. Penelitian ini bertujuan untuk menganalisis dampak positif dan negatif dari digitalisasi terhadap usaha mikro, kecil, dan menengah di era modern.',
      keywords: 'digitalisasi, umkm, analisis dampak',
      advisor: 'Dr. Dosen Hebat, M.Kom.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      uploaderId: adminUser.id,
      files: {
        create: [
          { alias: 'Cover dan Abstrak', fileName: 'contoh-file-1.pdf', fileUrl: '/uploads/contoh-file-1.pdf' },
          { alias: 'BAB I - Pendahuluan', fileName: 'contoh-file-2.pdf', fileUrl: '/uploads/contoh-file-2.pdf' },
        ]
      }
    }
  });
  console.log('Contoh data repository berhasil dibuat.');

  console.log(' Proses seeding selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
