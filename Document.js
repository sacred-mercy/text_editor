export class Document {
    _before = [];
    _after = [];
    goalColumn = null;
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
        return this.before.length + this.after.length;
    }

    getCursorIndex() {
        return this.before.length;
    }

    incrementCursorIndex() {
        this.resetGoalColumn()
        this.popAndPush(this.before, this.after);
    }



    popAndPush(pushArr, popArr) {
        if (popArr.length === 0)
            return;
        pushArr.push(popArr.pop());
    }

    decrementCursorIndex() {
        this.resetGoalColumn();
        this.popAndPush(this.after, this.before);
    }

    getLineCount() {
        return this.before.reduce(
            (a, b) => ((b === this.newLineChar) ? ++a : a),
            0
        );
    }

    getCurrentLineCursorCount() {
        let currentColumn = 0;
        const beforeCursorLength = this.before.length;
        if (this.getLineCount() === 0) {
            currentColumn = beforeCursorLength;
        } else {
            const startIndex = beforeCursorLength - 1;
            for (let i = startIndex; i >= 0; i--) {
                // console.log(this.before.at(i))
                if (this.before.at(i) === this.newLineChar) {
                    currentColumn = startIndex - i;
                    break;
                }
            }
        }

        return currentColumn;
    }

    getNewLine() {
        return this.newLineChar;
    }

    resetGoalColumn() {
        this.goalColumn = null;
        console.log('resetting goalColumn');
    }

    setGoalColumn(columnIndex) {
        if (this.goalColumn !== null)
            return;
        this.goalColumn = columnIndex;
    }

    moveCursorTo(targetIndex) {
        const currentIndex = this.getCursorIndex();

        if (targetIndex === currentIndex) {
            return;
        }
        if (currentIndex > targetIndex) {
            while (this.getCursorIndex() > targetIndex) {
                this.popAndPush(this.after, this.before);
            }
        } else {
            while (this.getCursorIndex() < targetIndex) {
                this.popAndPush(this.before, this.after);
            }
        }
    }

    findStartOfLineIndex(fromIndex) {
        for (let i = fromIndex; i >= 0; i--) {
            const char = this.before.at(i);
            if (char === this.newLineChar) {
                return i +1;
            }
        }

        return 0;
    }

    findEndOfLineIndex(offset = 0) {
        // after is reversed
        const afterLengthLastIndex = this.after.length - 1;
        for (let i = afterLengthLastIndex - offset; i >= 0; i--) {
            if (this.after.at(i) === this.newLineChar) {
                return this.getCursorIndex() + (afterLengthLastIndex - i);
            }
        }

        return this.getLength(); // no new line till end of doc
    }

    moveCursorUp() {
        const currentLine = this.getLineCount();
        if (currentLine === 0) {
            this.moveCursorTo(0);
            return;
        }
        const currentColumn = this.getCurrentLineCursorCount();
        this.setGoalColumn(currentColumn)
        const currentLineStartIndex = this.findStartOfLineIndex(this.getCursorIndex());
        const prevLineStartIndex = this.findStartOfLineIndex(currentLineStartIndex - 2);
        const charInPrevLine = (currentLineStartIndex - 1) - prevLineStartIndex;
        const additionalColumns = Math.min(charInPrevLine, this.goalColumn);
        const targetIndex = prevLineStartIndex + additionalColumns;
        this.moveCursorTo(targetIndex);
    }

    moveCursorDown() {
        const currentLineEndIndex = this.findEndOfLineIndex();
        const currentCursorIndex = this.getCursorIndex();
        const totalLength = this.getLength();
        if (currentLineEndIndex === totalLength) {
            this.moveCursorTo(totalLength)
            return;
        }
        const nextLineEndIndex = this.findEndOfLineIndex((currentLineEndIndex - currentCursorIndex)+1);
        const currentColumn = this.getCurrentLineCursorCount();
        this.setGoalColumn(currentColumn);
        const charInNextLine = nextLineEndIndex - (currentLineEndIndex + 1);
        const additionalColumns = Math.min(charInNextLine, this.goalColumn);
        const targetIndex = (currentLineEndIndex + 1) + additionalColumns;
        this.moveCursorTo(targetIndex);
    }
}