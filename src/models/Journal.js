/**
 * Journal Model
 * Represents a journal entry created by a teacher
 */
class Journal {
    constructor(teacherId, description, attachmentId = null, categoryId = null, isDraft = false) {
        this.teacher_id = teacherId;
        this.description = description;
        this.attachment_id = attachmentId;
        this.category_id = categoryId;
        this.is_draft = isDraft;
    }
}

module.exports = Journal;
