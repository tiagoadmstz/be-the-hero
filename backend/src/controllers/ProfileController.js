const connection = require('../database/connection');

module.exports = {

    async index(req, resp){
        const ong_id = req.headers.authorization;

        const incidents = connection('inicidents').where('ong_id', ong_id).select('*');

        return resp.json(incidents);
    }

}