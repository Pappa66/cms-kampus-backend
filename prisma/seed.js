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

  // 2. Menghapus data menu lama untuk memastikan kebersihan
  console.log('Menghapus data menu dan postingan lama...');
  // Urutan penghapusan penting: mulai dari model yang bergantung pada model lain
  await prisma.subMenuItem.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.post.deleteMany({}); // Hapus semua post agar tidak ada sisa

  // ====================================================================
  // 3. Membuat struktur menu dan konten (LOGIKA YANG DIPERBAIKI)
  // ====================================================================
  console.log('Membuat menu, submenu, dan halaman konten...');

  // BERANDA (Halaman Statis)
  await prisma.menuItem.create({
    data: { 
      name: 'BERANDA', 
      href: '/', 
      order: 1,
      type: 'STATIC_PATH' // Menentukan tipe menu
    },
  });

  // TENTANG STISIP (Menu dengan Submenu)
  const tentangStisipMenu = await prisma.menuItem.create({
    data: {
      name: 'TENTANG STISIP',
      order: 2,
      type: 'INTERNAL' // Tipe menu ini adalah INTERNAL karena isinya dari submenu
    }
  });

  // Data untuk submenu "TENTANG STISIP"
  const tentangSubMenus = [
    { name: 'Visi & Misi', order: 1 },
    { name: 'Informasi Prodi', order: 2 },
    { name: 'Lokasi Kampus', order: 3 },
    { name: 'Fasilitas', order: 4 },
    { name: 'Sejarah Kampus', order: 5 },
  ];

  // Loop untuk membuat Post dan Submenu secara berurutan
  for (const sub of tentangSubMenus) {
    const post = await prisma.post.create({
      data: {
        title: sub.name,
        content: `<h1>${sub.name}</h1><p>Konten untuk halaman ${sub.name} belum diisi.</p>`,
        authorId: adminUser.id,
      }
    });
    await prisma.subMenuItem.create({
      data: {
        name: sub.name,
        order: sub.order,
        menuItemId: tentangStisipMenu.id,
        postId: post.id, // Menghubungkan ke Post yang baru dibuat
      }
    });
  }

  // PROGRAM STUDI (Menu dengan Submenu)
  const prodiMenu = await prisma.menuItem.create({
    data: {
      name: 'PROGRAM STUDI',
      order: 3,
      type: 'INTERNAL'
    }
  });

  const prodiSubMenus = [
      { name: 'Ilmu Pemerintahan', order: 1 },
      { name: 'Ilmu Administrasi Negara', order: 2 }
  ];

  for (const sub of prodiSubMenus) {
    const post = await prisma.post.create({
      data: {
        title: sub.name,
        content: `<h1>${sub.name}</h1><p>Konten untuk halaman ${sub.name} belum diisi.</p>`,
        authorId: adminUser.id,
      }
    });
    await prisma.subMenuItem.create({
      data: {
        name: sub.name,
        order: sub.order,
        menuItemId: prodiMenu.id,
        postId: post.id,
      }
    });
  }

  // REPOSITORY (Halaman Statis)
  await prisma.menuItem.create({
    data: { 
      name: 'REPOSITORY', 
      href: '/repository', 
      order: 4,
      type: 'STATIC_PATH'
    }
  });

  // KONTAK (Halaman Statis)
  await prisma.menuItem.create({
    data: { 
      name: 'KONTAK', 
      href: '/kontak', 
      order: 5,
      type: 'STATIC_PATH'
    }
  });

  console.log('Menu dan halaman konten berhasil dibuat.');
  
  // 4. Membuat satu contoh data Repository (tidak ada perubahan, sudah benar)
  console.log('Membuat contoh data repository...');
  await prisma.repositoryItem.create({
    data: {
      title: 'Contoh Skripsi: Analisis Dampak Digitalisasi Terhadap UMKM',
      author: 'Mahasiswa Berprestasi',
      year: 2024,
      studyProgram: 'Ilmu Administrasi Negara',
      abstract: 'Ini adalah abstrak dari contoh skripsi...',
      keywords: 'digitalisasi, umkm, analisis dampak',
      advisor: 'Dr. Dosen Hebat, M.Kom.',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      uploaderId: adminUser.id,
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
