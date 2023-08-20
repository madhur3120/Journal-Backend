const { DB } = require('../config');
const CrudRepository = require('./crud-repository');

class JournalStudentMappingRepository extends CrudRepository {
    constructor() {
        super('journalstudentmapping');
    }
}

module.exports = JournalStudentMappingRepository;
