const SET_HINTS = 'scratch-gui/hints-state/UPDATE_HINTS';
const SORT_HINTS = 'scratch-gui/hints-state/SORT_HINTS';
const UPDATE_HINT = 'UPDATE_HINT';
const PUT_HINT = "PUT_HINT";
const REMOVE_HINT = "REMOVE_HINT";

const exampleHintItem = {

};

const initialState = {
    timestamp: null,
    hints: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    const { timestamp, hints } = state;
    switch (action.type) {
        case SET_HINTS:
            return {
                timestamp: new Date().getTime().toLocaleString(),
                hints: action.hints
            };
        case UPDATE_HINT:
            const { id, changes } = action;
            return {
                timestamp: state.timestamp,
                hints: state.hints.map(h => {
                    if (h.id === id) {
                        return Object.assign({}, h, changes);
                    } else {
                        return h;
                    }
                })
            };
        case PUT_HINT:
            return {
                timestamp,
                hints: [...hints, action.hint]
            };
        case REMOVE_HINT:
            return {
                timestamp,
                hints: hints.filter(h => h.id !== action.id)
            }
        default:
            return state;
    }
}


const setHint = function (hints) {
    return {
        type: SET_HINTS,
        hints: hints
    };
}

const updateHint = function (id, changes) {
    return {
        type: UPDATE_HINT,
        id,
        changes
    };
}


const putHint = function (hint) {
    return {
        type: PUT_HINT,
        hint
    };
}

const removeHint = function (id) {
    return {
        type: REMOVE_HINT,
        id
    }
}

export {
    reducer as default,
    initialState as hintsInitialState,
    setHint,
    updateHint,
    putHint,
    removeHint
};