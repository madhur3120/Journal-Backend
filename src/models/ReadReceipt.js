/**
 * ReadReceipt Model
 * Tracks when a student has read a journal entry
 */
class ReadReceipt {
    constructor(journalId, studentId) {
        this.journal_id = journalId;
        this.student_id = studentId;
    }
}

module.exports = ReadReceipt;
