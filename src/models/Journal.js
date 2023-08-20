class Journal {
    constructor(id, teacherId, description, attachmentId) {
        this.teacher_id = teacherId;
        this.description = description;
        this.attachment_id = attachmentId;
    }
}

module.exports = Journal;
