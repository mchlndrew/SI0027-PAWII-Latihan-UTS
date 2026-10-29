// TODO B: Controller Menu - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Menu tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Menu = require("../models/menuModel");

const MAX_LIMIT = 100;

// GET /menu
// Query opsional:
//   kantinId  filter berdasarkan kantin
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=nama,kode
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kantinId yang ter-populate (objek Kantin)
exports.getAll = async (req, res) => {
  // TODO B1
  const filter = {};
  if (req.query.kantinId) {
    filter.kantinId = req.query.kantinId;
  }
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, MAX_LIMIT);
  const sortField = req.query.sort || "createdAt";
  const projection = req.query.fields ? req.query.fields.split(",").join(" ") : "";

  const data = await Menu.find(filter)
    .populate("kantinId")
    .select(projection)
    .sort({ [sortField]: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Menu.countDocuments(filter);

  res.json({ data, page, limit, total });
};

// GET /menu/:id
//   - 200 -> dokumen menu, kantinId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  // TODO B2
  const data = await Menu.findById(req.params.id).populate("kantinId");
  if (!data) throw { status: 404, message: "Tidak ditemukan" };
  res.json(data);
};

// POST /menu
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
  const menu = await Menu.create(req.body);
  res.status(201).json(menu);
};

// PUT /menu/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
  const data = await Mahasiswa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) throw { status: 404, message: "Tidak ditemukan" };
  res.json(data);
};

// DELETE /menu/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
  const data = await Menu.findByIdAndDelete(req.params.id);
  if (!data) throw { status: 404, message: "Tidak ditemukan" };
  res.status(204).send();
};
