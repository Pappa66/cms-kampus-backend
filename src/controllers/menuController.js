const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMenuItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: { order: 'asc' },
            include: { 
                post: { select: { id: true } }, 
                submenus: { 
                    orderBy: { order: 'asc' }, 
                    include: { post: { select: { id: true } } } 
                } 
            }
        });
        res.json(items);
    } catch (error) { res.status(500).json({ message: "Gagal mengambil menu" }); }
};

const createMenuItem = async (req, res) => {
    const { name } = req.body;
    const authorId = req.user?.userId;
    if (!authorId) return res.status(401).json({ message: "Otentikasi gagal" });

    try {
        const newMenuItem = await prisma.$transaction(async (tx) => {
            const newPost = await tx.post.create({
                data: {
                    title: name,
                    content: `<p>Konten untuk halaman ${name} belum diisi.</p>`,
                    authorId: authorId,
                }
            });
            const menuItem = await tx.menuItem.create({
                data: {
                    name,
                    postId: newPost.id
                }
            });
            return menuItem;
        });
        res.status(201).json(newMenuItem);
    } catch (error) { res.status(400).json({ message: 'Gagal membuat menu' }); }
};

const updateMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, type, href } = req.body;
    try {
        const dataToUpdate = { name, type };
        if (type === 'EXTERNAL' || type === 'STATIC_PATH') {
            dataToUpdate.href = href;
        } else {
            dataToUpdate.href = null;
        }
        const updatedItem = await prisma.menuItem.update({
            where: { id },
            data: dataToUpdate,
        });
        res.json(updatedItem);
    } catch (error) {
        console.error("ERROR UPDATE MENU:", error);
        res.status(400).json({ message: 'Gagal memperbarui menu' });
    }


    // Kirim respons sukses palsu untuk melihat apakah frontend menerimanya
    console.log("Simulasi update menu berhasil dijalankan.");
    res.status(200).json({ message: 'Update disimulasikan berhasil' });
};

const deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.menuItem.delete({ where: { id } });
        res.json({ message: 'Menu berhasil dihapus' });
    } catch (error) { res.status(400).json({ message: 'Gagal menghapus menu' }); }
};

const reorderMenuItems = async (req, res) => {
    const { items } = req.body; // Menerima array of { id, order }

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Data urutan tidak valid.' });
    }

    try {
        // Gunakan transaksi untuk memastikan semua update berhasil atau semua gagal
        await prisma.$transaction(
            items.map(item => 
                prisma.menuItem.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        );
        res.status(200).json({ message: 'Urutan menu berhasil diperbarui.' });
    } catch (error) {
        console.error("Error saat mengurutkan menu:", error);
        res.status(500).json({ message: 'Gagal menyimpan urutan menu.' });
    }
};

// Jangan lupa ekspor fungsi baru
module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems };
