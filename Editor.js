import {Document} from "./Document.js";

class Editor {
    constructor(elementId) {
        this.display = document.getElementById('editor-container');
        this.buffer = new Document();
        this.cursorIndex = 0;
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (e.key.length === 1) {
            this.insert(e.key);
        } else if (e.key === 'Backspace') {
            this.remove();
        } else if (e.key === 'Enter') {
            this.buffer.insert('\n');
        } else if (e.key === 'ArrowLeft') {
            this.decrementCursorIndex()
        } else if (e.key === 'ArrowRight') {
            this.incrementCursorIndex()
        }

        this.render();
    }

    render() {
        this.display.innerText = this.buffer.getContentString();
    }

    incrementCursorIndex() {
        this.cursorIndex++;
    }

    decrementCursorIndex() {
        if (this.cursorIndex.length <= 0)
            return;
        this.cursorIndex--;
    }

    insert(key) {
        this.buffer.insert(key, this.cursorIndex);
        this.incrementCursorIndex();
    }

    remove() {
        this.buffer.remove(this.cursorIndex);
        this.decrementCursorIndex();
    }
}

const myEditor = new Editor('editor-container');