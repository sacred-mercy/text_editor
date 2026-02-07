import {Document} from "./Document.js";

class Editor {
    constructor(elementId) {
        this.display = document.getElementById(elementId);
        this.buffer = new Document();
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.render();
    }

    handleKeyPress(e) {
        this.preventDefaultOfInternalKeysInBrowser(e);

        if (e.key.length === 1) {
            this.buffer.insert(e.key);
        } else if (e.key === 'Backspace') {
            this.buffer.remove();
        } else if (e.key === 'Enter') {
            this.buffer.insertNewLine();
        } else if (e.key === 'ArrowLeft') {
            this.buffer.decrementCursorIndex()
        } else if (e.key === 'ArrowRight') {
            this.buffer.incrementCursorIndex()
        } else if (e.key === 'ArrowUp') {
            this.buffer.moveCursorUp();
        }

        this.render();
    }

    render() {
        const text = this.buffer.getContentString();
        const index = this.buffer.getCursorIndex();

        const before = text.slice(0, index);
        const after = text.slice(index);
        const cursor = `<span class = "cursor">&#8203;</span>`;
        this.display.innerHTML = before+cursor+after;
    }


    preventDefaultOfInternalKeysInBrowser(e) {
        const handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Enter'];

        if (e.key.length === 1 || handledKeys.includes(e.key)) {
            e.preventDefault();
        }
    }
}

new Editor('editor-container');