const pool = require('../config/database');

const galleryRepository = {
  async findAll() {
    const query = `
      SELECT g.*, b.booking_number, c.full_name AS customer_name,
             (SELECT COUNT(*) FROM photos p WHERE p.gallery_id = g.id) AS photo_count,
             (SELECT storage_url FROM photos p WHERE p.gallery_id = g.id AND p.is_cover = 1 LIMIT 1) AS cover_url
      FROM galleries g
      JOIN bookings b ON g.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      ORDER BY g.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT g.*, b.booking_number, c.full_name AS customer_name
       FROM galleries g
       JOIN bookings b ON g.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       WHERE g.id = ?`,
      [id]
    );
    if (!rows[0]) return null;

    const gallery = rows[0];
    const [photos] = await pool.query(
      `SELECT * FROM photos WHERE gallery_id = ? ORDER BY is_cover DESC, created_at ASC`,
      [id]
    );
    gallery.photos = photos;
    return gallery;
  },

  /**
   * Secure lookup by unguessable 64-char token (used for public viewing)
   */
  async findByToken(token) {
    const [rows] = await pool.query(
      `SELECT g.id, g.title, g.is_public, g.status, g.created_at, b.booking_number, c.full_name AS customer_name
       FROM galleries g
       JOIN bookings b ON g.booking_id = b.id
       JOIN customers c ON b.customer_id = c.id
       WHERE g.access_token = ? AND g.status = 'active'`,
      [token]
    );
    if (!rows[0]) return null;

    const gallery = rows[0];
    const [photos] = await pool.query(
      `SELECT id, original_filename, storage_url, thumbnail_url, is_cover
       FROM photos
       WHERE gallery_id = ?
       ORDER BY is_cover DESC, id ASC`,
      [gallery.id]
    );
    gallery.photos = photos;
    return gallery;
  },

  async create(data) {
    const { booking_id, title, access_token, is_public } = data;
    const [res] = await pool.query(
      `INSERT INTO galleries (booking_id, title, access_token, is_public, status)
       VALUES (?, ?, ?, ?, 'active')`,
      [booking_id, title, access_token, is_public !== undefined ? is_public : 1]
    );
    return res.insertId;
  },

  async addPhotos(galleryId, photos) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const photo of photos) {
        await connection.query(
          `INSERT INTO photos (gallery_id, original_filename, storage_url, thumbnail_url, is_cover)
           VALUES (?, ?, ?, ?, ?)`,
          [galleryId, photo.original_filename, photo.storage_url, photo.thumbnail_url || photo.storage_url, photo.is_cover ? 1 : 0]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async deletePhoto(photoId) {
    await pool.query(`DELETE FROM photos WHERE id = ?`, [photoId]);
  },

  async setCoverPhoto(galleryId, photoId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(`UPDATE photos SET is_cover = 0 WHERE gallery_id = ?`, [galleryId]);
      await connection.query(`UPDATE photos SET is_cover = 1 WHERE id = ? AND gallery_id = ?`, [photoId, galleryId]);
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = galleryRepository;
