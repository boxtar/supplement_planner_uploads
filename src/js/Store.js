/**
 * Store class by Johnpaul McMahon
 *
 * Simple Store object to save state that can be passed
 * around app.
 *
 * Imports:
 *
 */

class Store {
    constructor(store = {}) {
        this.store = Object.freeze({ ...store });
    }
    getState(field) {
        let state = this.store[field];
        if (Array.isArray(state)) return [ ...state ];
        if (typeof state === "") return { ...state };
        return state;
    }
    setState(field, value) {
        let store = { ...this.store };
        store[field] = value;
        this.store = Object.freeze(store);
    }
}
