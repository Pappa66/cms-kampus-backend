const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

// Fungsi ini untuk halaman publik, hanya mengambil yang statusnya PUBLISHED
const getAllRepositoryItems = async (req, res) => {
  try {
    const items = await prisma.repositoryItem.findMany({ 
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' } 
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
  }
};

// Fungsi ini untuk mengambil detail satu item
const getRepositoryItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await prisma.repositoryItem.findUnique({
            where: { id },
            include: { files: true },
        });
        // Hapus cek status agar admin bisa melihat detail item private
        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data item', error: error.message });
    }
};

// Fungsi ini untuk admin membuat item baru
const createRepositoryItem = async (req, res) => {
  const { title, author, year, studyProgram, filesMetadata } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Minimal satu file harus diunggah' });
  }

  try {
    const parsedFilesMetadata = JSON.parse(filesMetadata);
    const newItem = await prisma.repositoryItem.create({
      data: {
        title, author,
        year: parseInt(year),
        studyProgram,
        status: 'PRIVATE',
        uploaderId: req.user.userId,
        files: {
          create: files.map(file => {
            const metadata = parsedFilesMetadata.find(m => m.originalName === file.originalname);
            return {
              alias: metadata ? metadata.alias : file.originalname,
              fileName: file.filename,
              fileUrl: `/uploads/${file.filename}`,
            };
          }),
        },
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Gagal membuat item repository', error: error.message });
  }
};

// Fungsi ini untuk admin mengupdate item
const updateRepositoryItem = async (req, res) => {
  const { id } = req.params;
  const { title, author, year, studyProgram, status } = req.body;
  try {
    const item = await prisma.repositoryItem.update({
      where: { id },
      data: { 
        title, 
        author, 
        year: parseInt(year), 
        studyProgram, 
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui item', error: error.message });
  }
};

// Fungsi ini untuk admin menghapus item
const deleteRepositoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.repositoryItem.findUnique({ where: { id } });
    if (item && item.fileUrl) {
      const filePath = path.join(__dirname, '..', '..', 'public', item.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await prisma.repositoryItem.delete({ where: { id } });
    res.json({ message: 'Item berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ message: 'Gagal menghapus item', error: error.message });
  }
};

// --- PASTIKAN SEMUA FUNGSI DIEKSPOR ---
module.exports = { 
  getAllRepositoryItems, 
  createRepositoryItem, 
  updateRepositoryItem, 
  deleteRepositoryItem, 
  getRepositoryItemById 
};
