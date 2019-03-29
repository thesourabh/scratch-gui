const SET_HINTS = 'scratch-gui/hints-state/UPDATE_HINTS';
const SORT_HINTS = 'scratch-gui/hints-state/SORT_HINTS';
const UPDATE_HINT = 'UPDATE_HINT';
const PUT_HINT = "PUT_HINT";
const PUT_ALL_HINTS = "PUT_ALL_HINTS";
const REMOVE_HINT = "REMOVE_HINT";
const SET_UPDATE_STATUS = "SET_UPDATE_STATUS"

const initialState = {
    timestamp: null,
    hints: [],
    isUpdating: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    const { timestamp, hints, isUpdating } = state;
    switch (action.type) {
        case SET_HINTS:
            return {
                timestamp: action.timestamp,
                hints: action.hints,
                isUpdating: true
            };
        case UPDATE_HINT:
            const { hintId, changes } = action;
            return {
                timestamp: state.timestamp,
                hints: state.hints.map(h => {
                    if (h.hintId === hintId) {
                        return Object.assign({}, h, changes);
                    } else {
                        return h;
                    }
                }),
                isUpdating: true
            };
        case PUT_HINT:
            return {
                timestamp,
                hints: [...hints, action.hint],
                isUpdating: true
            };
        case PUT_ALL_HINTS:
            let hintMap = hints.reduce((map, h) => { 
                map[h.hintId] = h;
                return map;
            }, {});
            hintMap = action.hints.reduce((map,h) =>{
                map[h.hintId] = h;
                return map;
            }, hintMap);

            return {
                timestamp,
                hints: Object.values(hintMap).concat(),
                isUpdating: true
            }
        case REMOVE_HINT:
            return {
                timestamp,
                hints: hints.filter(h => h.hintId !== action.hintId),
                isUpdating: true
            }
        case SET_UPDATE_STATUS:
            return Object.assign({}, state, { isUpdating: action.isUpdating })
        default:
            return state;
    }
}


const setHint = function (hints) {
    return {
        type: SET_HINTS,
        hints: hints,
        timestamp: new Date().toLocaleString()
    };
}

const updateHint = function (hintId, changes) {
    return {
        type: UPDATE_HINT,
        hintId,
        changes
    };
}


const putHint = function (hint) {
    return {
        type: PUT_HINT,
        hint
    };
}

const putAllHints = function (hints) {
    return {
        type: PUT_ALL_HINTS,
        hints
    };
}


const removeHint = function (hintId) {
    return {
        type: REMOVE_HINT,
        hintId
    }
}

const setUpdateStatus = function (isUpdating) {
    return {
        type: SET_UPDATE_STATUS,
        isUpdating
    }
}

export {
    reducer as default,
    initialState as hintsInitialState,
    setHint,
    updateHint,
    putHint,
    putAllHints,
    removeHint,
    setUpdateStatus
};