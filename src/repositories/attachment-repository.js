const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

class AttachementRepository extends CrudRepository {
    constructor() {
        super('attachments');
    }
}

module.exports = AttachementRepository;
