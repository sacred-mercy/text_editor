import {Document} from "./Document.js";

class Editor {
    constructor(elementId) {
        this.display = document.getElementById(elementId);
        this.buffer = new Document();
        this.cursorIndex = 0;
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        // List of keys we want to handle ourselves
        const handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Enter'];

        if (e.key.length === 1 || handledKeys.includes(e.key)) {
            e.preventDefault(); // Stop the browser from scrolling or doing weird things
        }

        if (e.key.length === 1) {
            this.insert(e.key);
        } else if (e.key === 'Backspace') {
            this.remove();
        } else if (e.key === 'Enter') {
            this.insert('\n');
        } else if (e.key === 'ArrowLeft') {
            this.decrementCursorIndex()
        } else if (e.key === 'ArrowRight') {
            this.incrementCursorIndex()
        }
        console.log(this.cursorIndex)
        this.render();
    }

    render() {
        const text = this.buffer.getContentString();
        const index = this.cursorIndex;

        const before = text.slice(0, index);
        const after = text.slice(index);
        const cursor = `<span class = "cursor">&#8203;</span>`;
        this.display.innerHTML = before+cursor+after;
    }

    incrementCursorIndex() {
        if (this.cursorIndex === this.buffer.content.length) {
            return;
        }
        this.cursorIndex++;
    }

    decrementCursorIndex() {
        if (this.cursorIndex === 0)
            return;
        this.cursorIndex--;
    }

    insert(key) {
        this.buffer.insert(key, this.cursorIndex);
        this.incrementCursorIndex();
    }

    remove() {
        if (this.cursorIndex <=0) {
            return;
        }
        this.buffer.remove(this.cursorIndex);
        this.decrementCursorIndex();
    }
}

new Editor('editor-container');