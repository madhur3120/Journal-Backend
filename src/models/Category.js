/**
 * Category Model
 * Represents a journal category/subject
 */
class Category {
    constructor(name, description = null) {
        this.name = name;
        this.description = description;
    }
}

module.exports = Category;
