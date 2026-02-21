import {Document} from "./Document.js";
import {InsertCommand, RemoveCommand} from "./Commands.js";

class Editor {
    constructor(elementId) {
        this.display = document.getElementById(elementId);
        this.buffer = new Document();
        this.undoStack = [];
        this.redoStack = [];
        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.render();
    }

    handleKeyPress(e) {
        this.preventDefaultOfInternalKeysInBrowser(e);

        const isCtrlKeyPressed = e.ctrlKey || e.metaKey; // meta for mac cmd key

        if (e.key.length === 1) {
            if (isCtrlKeyPressed) {
                this.processCtrlShortcuts(e);
            } else {
                this.executeInsert(e.key);
            }
        } else {
            this.processOtherKeys(e);
        }

        this.render();
    }

    executeInsert(key) {
        this.executeCommand(new InsertCommand(key, this.buffer))
    }

    processCtrlShortcuts(e) {
        const key = e.key;
        if (key === 'z') {
            this.undo();
        } else if (key === 'y') {
            this.redo();
        }
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

    processOtherKeys(e) {
        switch(e.key) {
            case 'Backspace':
                this.executeCommand(new RemoveCommand(this.buffer));
                // this.buffer.remove();
                break;
            case 'Enter':
                this.executeInsert(this.buffer.getNewLine())
                break;
            case 'ArrowLeft':
                this.buffer.decrementCursorIndex();
                break;
            case 'ArrowRight':
                this.buffer.incrementCursorIndex()
                break;
            case 'ArrowUp':
                this.buffer.moveCursorUp();
                break;
            case 'ArrowDown':
                this.buffer.moveCursorDown();
                break;
        }
    }

    executeCommand(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
    }

    undo() {
        const command = this.undoStack.pop();
        if (! command) {
            return;
        }

        command.undo();
        this.redoStack.push(command);
    }

    redo() {
        const command = this.redoStack.pop();
        if (! command) {
            return;
        }

        command.execute();
        this.undoStack.push(command);
    }
}

new Editor('editor-container');