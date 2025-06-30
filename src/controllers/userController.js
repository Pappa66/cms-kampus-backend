const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.json(users);
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: 'Gagal membuat user', error: error.message });
  }
};

// @desc    Bulk create new users
// @route   POST /api/users/bulk
// @access  Private/Admin
const bulkCreateUsers = async (req, res) => {
  const usersData = req.body; // Mengharapkan array of user objects

  if (!Array.isArray(usersData) || usersData.length === 0) {
    return res.status(400).json({ message: 'Data yang dikirim harus berupa array dan tidak boleh kosong' });
  }

  try {
    const usersToCreate = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        };
      })
    );

    const createdUsers = await prisma.user.createMany({
      data: usersToCreate,
      skipDuplicates: true, // Lewati jika ada email yang sudah terdaftar
    });

    res.status(201).json({ message: `${createdUsers.count} pengguna berhasil dibuat.` });
  } catch (error) {
    res.status(400).json({ message: 'Gagal membuat pengguna secara massal', error: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Gagal memperbarui pengguna', error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(400).json({ message: 'Gagal menghapus pengguna', error: error.message });
  }
};

// @desc    Reset user password
// @route   PUT /api/users/:id/reset-password
// @access  Private/Admin
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password baru tidak boleh kosong' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    res.json({ message: 'Password berhasil direset' });
  } catch (error) {
    res.status(400).json({ message: 'Gagal mereset password', error: error.message });
  }
};

module.exports = { 
  getUsers, createUser, bulkCreateUsers, updateUser, deleteUser, resetPassword
};