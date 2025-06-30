const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMenuItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: { order: 'asc' },
            include: { post: { select: { id: true } }, submenus: { orderBy: { order: 'asc' }, include: { post: { select: { id: true } } } } }
        });
        res.json(items);
    } catch (error) { res.status(500).json({ message: "Gagal mengambil menu" }); }
};

const createMenuItem = async (req, res) => {
    const { name } = req.body;
    try {
        const lastItem = await prisma.menuItem.findFirst({ orderBy: { order: 'desc' } });
        const newOrder = lastItem ? lastItem.order + 1 : 1;
        const newItem = await prisma.menuItem.create({
            data: {
                name,
                order: newOrder,
                post: {
                    create: {
                        title: name,
                        content: `<p>Konten untuk halaman ${name} belum diisi. Silakan edit di sini.</p>`,
                        authorId: req.user.userId,
                    }
                }
            }
        });
        res.status(201).json(newItem);
    } catch (error) { res.status(400).json({ message: 'Gagal membuat menu' }); }
};

const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: { name }
        });
        res.json(updatedItem);
    } catch (error) { res.status(400).json({ message: 'Gagal memperbarui menu' }); }
};

const deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.menuItem.delete({ where: { id } });
        res.json({ message: 'Menu berhasil dihapus' });
    } catch (error) { res.status(400).json({ message: 'Gagal menghapus menu' }); }
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
