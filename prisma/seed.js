const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');
  
  // Seed Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kampus.com' },
    update: {},
    create: {
      email: 'admin@kampus.com',
      name: 'Admin Utama',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Hapus semua data menu lama untuk memastikan data baru yang bersih
  // Ini memastikan seeder bisa dijalankan berkali-kali tanpa membuat duplikat
  await prisma.subMenuItem.deleteMany({});
  await prisma.menuItem.deleteMany({});

  // Seed Menu Items
  console.log('Seeding default menu items...');
  
  await prisma.menuItem.create({
    data: { name: 'BERANDA', href: '/', order: 1 }
  });

  await prisma.menuItem.create({
    data: {
      name: 'TENTANG STISIP', order: 2,
      submenus: {
        create: [
          { name: 'Visi & Misi', href: '/tentang/visi-misi', order: 1 },
          { name: 'Informasi Prodi', href: '/tentang/prodi', order: 2 },
          { name: 'Lokasi Kampus', href: '/tentang/lokasi', order: 3 },
          { name: 'Fasilitas', href: '/tentang/fasilitas', order: 4 },
        ],
      },
    }
  });
  
  await prisma.menuItem.create({
    data: { name: 'REPOSITORY', href: '/repository', order: 3 }
  });
  
  await prisma.menuItem.create({
    data: { name: 'KONTAK', href: '/kontak', order: 4 }
  });

  console.log('Seeding finished.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
