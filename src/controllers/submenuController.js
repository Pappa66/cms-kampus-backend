const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSubMenuItem = async (req, res) => {
    const { menuItemId, name } = req.body;
    try {
        const newItem = await prisma.subMenuItem.create({
            data: {
                name,
                menuItemId,
                post: {
                    create: {
                        title: name,
                        content: `<p>Konten untuk halaman ${name} belum diisi.</p>`,
                        authorId: req.user.userId
                    }
                }
            }
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: 'Gagal membuat submenu' });
    }
};
const deleteSubMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.subMenuItem.delete({ where: { id } });
        res.json({ message: 'Submenu berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ message: 'Gagal menghapus submenu' });
    }
};
module.exports = { createSubMenuItem, deleteSubMenuItem };
