export class Document {
    get content() {
        return this._content;
    }
    constructor() {
        this._content = [];
    }

    // Now accepts index as a parameter
    insert(char, index) {
        this._content.splice(index, 0, char);
    }

    // Now accepts index as a parameter
    remove(index) {
        if (index > 0) {
            this._content.splice(index - 1, 1);
        }
    }

    getContentString() {
        return this._content.join('');
    }

    get length() {
        return this._content.length;
    }
}