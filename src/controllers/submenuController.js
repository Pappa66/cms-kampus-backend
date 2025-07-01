const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSubMenuItem = async (req, res) => {
    const { menuItemId, name } = req.body;
    
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: 'Otentikasi gagal, ID user tidak ditemukan.' });
    }
    const authorId = req.user.userId;

    if (!menuItemId || !name) {
        return res.status(400).json({ message: 'Nama submenu dan ID menu utama diperlukan.' });
    }

    try {
        const newSubMenuItem = await prisma.$transaction(async (tx) => {
            const newPost = await tx.post.create({
                data: {
                    title: name,
                    content: `<p>Konten untuk halaman ${name} belum diisi.</p>`,
                    authorId: authorId,
                }
            });

            const subMenuItem = await tx.subMenuItem.create({
                data: {
                    name: name,
                    menuItemId: menuItemId,
                    postId: newPost.id,
                }
            });

            return subMenuItem;
        });

        res.status(201).json(newSubMenuItem);

    } catch (error) {
        console.error("DETAIL ERROR CREATE SUBMENU:", error); 
        res.status(500).json({ message: 'Gagal membuat submenu. Periksa log server untuk detail.' });
    }
};

const deleteSubMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.subMenuItem.delete({ where: { id } });
        res.json({ message: 'Submenu berhasil dihapus' });
    } catch (error) {
        console.error("Error saat menghapus submenu:", error);
        res.status(400).json({ message: 'Gagal menghapus submenu' });
    }
};

module.exports = { createSubMenuItem, deleteSubMenuItem };