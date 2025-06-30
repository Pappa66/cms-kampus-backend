const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMyItems = async (req, res) => {
    try {
        const items = await prisma.repositoryItem.findMany({
            where: { uploaderId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data Anda' });
    }
};

const createMyItem = async (req, res) => {
    const { title, author, year, studyProgram, abstract, keywords, advisor, filesMetadata } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Minimal satu file harus diunggah' });
    }

    try {
        const parsedFilesMetadata = JSON.parse(filesMetadata);
        const newItem = await prisma.repositoryItem.create({
            data: {
                title, author, abstract, keywords, advisor,
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
        res.status(400).json({ message: 'Gagal membuat item repository' });
    }
};

const updateMyItem = async (req, res) => {
    const { id } = req.params;
    const { title, author, year, studyProgram, abstract, keywords, advisor } = req.body;
    try {
        const item = await prisma.repositoryItem.findUnique({ where: { id } });
        // Mahasiswa hanya bisa edit jika item miliknya dan statusnya masih PRIVATE
        if (!item || item.uploaderId !== req.user.userId || item.status !== 'PRIVATE') {
            return res.status(403).json({ message: 'Aksi tidak diizinkan.' });
        }
        const updatedItem = await prisma.repositoryItem.update({
            where: { id },
            data: { title, author, year: parseInt(year), studyProgram, abstract, keywords, advisor }
        });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Gagal memperbarui item.' });
    }
};

module.exports = { getMyItems, createMyItem, updateMyItem };
