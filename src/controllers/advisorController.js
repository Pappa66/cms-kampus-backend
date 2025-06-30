const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mengambil item repository di mana dosen yang login adalah pembimbing
const getAdvisedItems = async (req, res) => {
    const advisorName = req.user.name; // Nama diambil dari token
    try {
        const items = await prisma.repositoryItem.findMany({
            where: { 
                advisor: advisorName,
                status: 'PRIVATE' // Hanya tampilkan yang butuh review
            },
            orderBy: { createdAt: 'asc' }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data bimbingan' });
    }
};

// Menyetujui dan mempublikasikan item repository
const approveItem = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedItem = await prisma.repositoryItem.update({
            where: { id },
            data: {
                status: 'PUBLISHED',
                publishedAt: new Date(),
            }
        });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: 'Gagal menyetujui item' });
    }
};
module.exports = { getAdvisedItems, approveItem };