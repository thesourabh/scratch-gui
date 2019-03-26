import { defaultMaxListeners } from "events";

const SET_HINTS = 'scratch-gui/hints-state/UPDATE_HINTS';
const SORT_HINTS = 'scratch-gui/hints-state/SORT_HINTS';


const exampleHintItem = {

};

const initialState = {
    timestamp: null,
    hints: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case SET_HINTS:
            return {
                timestamp: new Date().getTime().toLocaleString(),
                hints: action.hints
            };
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


export {
    reducer as default,
    initialState as hintsInitialState,
    setHint
};