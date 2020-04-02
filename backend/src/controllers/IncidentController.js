const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {

    async index(req, resp) {
        const { page = 1 } = req.query;

        const [count] = await connection('incidents').count();

        const incidents = connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5).offset((page - 1) * 5)
            .select(['inicidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);

        resp.header('X-Total-Count', count['count(*)']);

        return resp.json(incidents);
    },

    async create(req, resp) {
        const { title, descrition, value } = req.body;
        const ong_id = req.headers.authorization;

        const [id] = await connection('incidents').insert({
            title, descrition, value, ong_id
        });

        return resp.json({ id });
    },

    async delete(req, resp) {
        const { id } = req.params;
        const ong_id = req.headers.authorization;

        const incident = connection('inicidents').where('id', id).select('ong_id').first();

        if (incident.ong_id !== ong_id) {
            return resp.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('incident').where('id', id).delete();

        return resp.status(204).send();
    }

};