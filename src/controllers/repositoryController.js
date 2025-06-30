const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const getAllAdminRepositoryItems = async (req, res) => {
  try {
    const items = await prisma.repositoryItem.findMany({ orderBy: { createdAt: 'desc' }, include: { files: true } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data admin', error: error.message });
  }
};
const getAllRepositoryItems = async (req, res) => {
  try {
    const items = await prisma.repositoryItem.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data publik', error: error.message });
  }
};
const getRepositoryItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await prisma.repositoryItem.findUnique({ where: { id }, include: { files: true } });
        if (!item || (item.status !== 'PUBLISHED' && (!req.user || req.user.role !== 'ADMIN'))) {
            return res.status(404).json({ message: 'Item tidak ditemukan atau belum dipublikasikan' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data item', error: error.message });
    }
};
const createRepositoryItem = async (req, res) => {
  const { title, author, year, studyProgram, abstract, keywords, advisor, status, filesMetadata } = req.body;
  const files = req.files;
  if (!files || files.length === 0) return res.status(400).json({ message: 'Minimal satu file harus diunggah' });
  try {
    const parsedFilesMetadata = JSON.parse(filesMetadata);
    const newItem = await prisma.repositoryItem.create({
      data: {
        title, author, abstract, keywords, advisor,
        year: parseInt(year), studyProgram, status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        files: { create: files.map(file => {
            const metadata = parsedFilesMetadata.find(m => m.originalName === file.originalname);
            return { alias: metadata ? metadata.alias : file.originalname, fileName: file.filename, fileUrl: `/uploads/${file.filename}` };
        })},
      },
      include: { files: true },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Gagal membuat item', error: error.message });
  }
};
const updateRepositoryItem = async (req, res) => { /* ... kode lengkap dari sebelumnya ... */ };
const deleteRepositoryItem = async (req, res) => { /* ... kode lengkap dari sebelumnya ... */ };

module.exports = { getAllAdminRepositoryItems, getAllRepositoryItems, getRepositoryItemById, createRepositoryItem, updateRepositoryItem, deleteRepositoryItem };
