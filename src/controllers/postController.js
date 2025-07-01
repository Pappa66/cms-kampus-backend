const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        const whereClause = search ? {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { author: { name: { contains: search, mode: 'insensitive' } } },
            ],
        } : {};

        const posts = await prisma.post.findMany({
            skip: skip,
            take: limit,
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true } },
                menuItem: { select: { name: true } },
                submenuItem: { select: { name: true, menuItem: { select: { name: true } } } }
            }
        });

        const totalPosts = await prisma.post.count({ where: whereClause });

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data postingan' });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        // --- PERUBAHAN: Include author ---
        const post = await prisma.post.findUnique({ 
            where: { id },
            include: { author: { select: { name: true } } }
        });
        if (!post) return res.status(404).json({ message: 'Postingan tidak ditemukan' });
        res.json(post);
    } catch (error) { res.status(500).json({ message: 'Gagal mengambil data' }); }
};

const updatePost = async (req, res) => {
    const { id } = req.params;
    // Ambil imageUrl juga jika ada
    const { title, content, imageUrl } = req.body;
    try {
        const updatedPost = await prisma.post.update({ 
            where: { id }, 
            data: { title, content, imageUrl } 
        });
        res.json(updatedPost);
    } catch (error) { res.status(400).json({ message: 'Gagal menyimpan konten' }); }
};

// --- FUNGSI BARU ---
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({ where: { id } });
        res.json({ message: 'Post berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ message: 'Gagal menghapus post' });
    }
};

module.exports = { getPosts, getPostById, updatePost, deletePost };