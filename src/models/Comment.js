/**
 * Comment Model
 * Represents a comment on a journal entry
 * Supports threaded replies via parent_id
 */
class Comment {
    constructor(journalId, userId, content, parentId = null) {
        this.journal_id = journalId;
        this.user_id = userId;
        this.content = content;
        this.parent_id = parentId;
    }
}

module.exports = Comment;
