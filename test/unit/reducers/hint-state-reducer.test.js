import hintStateReducer, {setHint, updateHint, putHint, removeHint} from '../../../src/reducers/hints-state';

test("initialState", () => {
    let defaultState
    expect(hintStateReducer(defaultState, { type: 'anything' })).toBeDefined();
    expect(hintStateReducer(defaultState, { type: 'anything' }).hints).toEqual([]);
    expect(hintStateReducer(defaultState, { type: 'anything' }).timestamp).toBe(null);
});

test("set hints", () => {
    let defaultState
    expect(hintStateReducer(defaultState, setHint([{}])).hints.length).toBe(1);
    expect(hintStateReducer(defaultState, setHint([])).hints.length).not.toBeNull();
});

test("update hint item", () => {
    let state = {

        timestamp: 'date',
        hints: [{
            id: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }, {
            id: 'id2',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }, {
            id: 'id3',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, updateHint('id2', { visible: true }));
    expect(newState.hints.find(h => h.id === 'id2').visible).toBe(true);
});

test("put hint", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            id: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, putHint({ id: 'id2', type: 'Extract Procedure', target: 'Sprite3' }));
    expect(newState.hints.find(h => h.id === 'id2')).toBeDefined();
    expect(newState.hints.length).toBe(2);
});

test("remove hint", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            id: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }, {
            id: 'id2',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }, {
            id: 'id3',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, removeHint('id2'));
    expect(newState.hints.find(h => h.id === 'id2')).not.toBeDefined();
    expect(newState.hints.length).toBe(2);
});
