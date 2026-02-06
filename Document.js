export class Document {
    _before = [];
    _after = [];
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

    getCursorLength() {
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
}