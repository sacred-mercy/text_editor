export class InsertCommand {
    constructor(char, buffer) {
        this.char = char;
        this.buffer = buffer;
    }

    execute() {
        this.buffer.insert(this.char);
    }

    undo() {
        this.buffer.remove();
    }
}

export class RemoveCommand {
    constructor(buffer) {
        this.removedChar = null;
        this.buffer = buffer;
    }

    execute() {
        this.removedChar = this.buffer.before.at(this.buffer.getCursorIndex() - 1);
        this.buffer.remove();
    }

    undo() {
        if ( this.removedChar) {
            this.buffer.insert(this.removedChar);
        }
    }
}