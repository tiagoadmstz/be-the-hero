const connection = require('../database/connection');

module.exports = {

    async create(req, resp) {
        const { id } = resp.body;
        const ong = await connection('ongs').where('id', id).select('name').orderBy('name').first();

        if (!ong) {
            return resp.status(400).json({ error: 'No ONG found  with this ID' });
        }

        return resp.json(ong.name);
    }

}