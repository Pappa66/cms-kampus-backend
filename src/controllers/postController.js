const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ message: 'Postingan tidak ditemukan' });
        res.json(post);
    } catch (error) { res.status(500).json({ message: 'Gagal mengambil data' }); }
};
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updatedPost = await prisma.post.update({ where: { id }, data: { title, content } });
        res.json(updatedPost);
    } catch (error) { res.status(400).json({ message: 'Gagal menyimpan konten' }); }
};
module.exports = { getPostById, updatePost };