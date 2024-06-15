const db = require('../config/db');

const createContactsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(255),
      email VARCHAR(255),
      linked_id INTEGER,
      link_precedence VARCHAR(20) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP WITH TIME ZONE
    )
  `;
  await db.query(createTableQuery);
};

createContactsTable();

const findByPhoneOrEmail = async (phone, email) => {
  const query = 'SELECT * FROM contacts WHERE phone_number = $1 OR email = $2 ORDER BY created_at ASC';
  const { rows } = await db.query(query, [phone, email]);
  return rows;
};

const findByLinkedIdOrId = async (linkedId, id) => {
  const query = 'SELECT * FROM contacts WHERE linked_id = $1 OR id = $2';
  const { rows } = await db.query(query, [linkedId, id]);
  console.log(linkedId, id, rows.length, rows)
  return rows;
};

const create = async (contact) => {
  const query = `
    INSERT INTO contacts (phone_number, email, linked_id, link_precedence)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await db.query(query, [contact.phoneNumber, contact.email, contact.linkedId, contact.linkPrecedence]);
  return rows[0];
};

const findById = async (id) => {
  const query = 'SELECT * FROM contacts WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

module.exports = {
  findByPhoneOrEmail,
  findByLinkedIdOrId,
  create,
  findById,
};