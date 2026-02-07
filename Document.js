export class Document {
    _before = [];
    _after = [];
    newLineChar = '\n';
    get after() {
        return this._after;
    }

    get before() {
        return this._before;
    }

    insert(char) {
        this.before.push(char);
    }

    remove() {
        this.before.pop();
    }

    getContentString() {
        //reverse edits the original array can use toReversed but it is new using spread for backward compatibility
        const reversedAfter = [...this.after].reverse();
        return this.before.join('') + reversedAfter.join('');
    }

    getLength() {
        return this._before.length + this._after.length;
    }

    getCursorIndex() {
        return this._before.length;
    }

    incrementCursorIndex() {
        if (this._after.length === 0)
            return;

        this._before.push(this._after.pop());
    }

    decrementCursorIndex() {
        if (this._before.length === 0)
            return;

        this._after.push(this._before.pop());
    }

    getLineCount() {
        return this._before.reduce(
            (a, b) => ((b === this.newLineChar) ? ++a : a),
            0
        );
    }

    getCurrentLineCursorCount() {
        let currentColumn = 0;
        const beforeCursorLength = this._before.length;
        if (this.getLineCount() === 0) {
            currentColumn = beforeCursorLength;
        } else {
            const startIndex = beforeCursorLength - 1;
            for (let i = startIndex; i >= 0; i--) {
                // console.log(this._before.at(i))
                if (this._before.at(i) === this.newLineChar) {
                    currentColumn = startIndex - i;
                    break;
                }
            }
        }

        return currentColumn;
    }

    insertNewLine() {
        this.insert(this.newLineChar);
    }

    moveCursorTo(targetIndex) {
        const currentIndex = this.getCursorIndex();

        if (targetIndex === currentIndex) {
            return;
        }
        if (currentIndex > targetIndex) {
            while (this.getCursorIndex() > targetIndex) {
                this.decrementCursorIndex();
            }
        } else {
            while (this.getCursorIndex() < targetIndex) {
                this.incrementCursorIndex();
            }
        }
    }

    findStartOfLineIndex(fromIndex) {
        for (let i = fromIndex; i >= 0; i--) {
            const char = this._before.at(i);
            if (char === this.newLineChar) {
                return i +1;
            }
        }

        return 0;
    }

    moveCursorUp() {
        const currentLine = this.getLineCount();
        if (currentLine === 0) {
            this.moveCursorTo(0);
            return;
        }
        const currentColumn = this.getCurrentLineCursorCount();
        const currentLineStartIndex = this.findStartOfLineIndex(this.getCursorIndex());
        const prevLineStartIndex = this.findStartOfLineIndex(currentLineStartIndex - 2);
        const charInPrevLine = (currentLineStartIndex - 1) - prevLineStartIndex;
        const additionalColumns = Math.min(charInPrevLine, currentColumn);
        const targetIndex = prevLineStartIndex + additionalColumns;
        this.moveCursorTo(targetIndex);
    }
}