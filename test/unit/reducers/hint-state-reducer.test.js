import hintStateReducer, { setHint, updateHint, putHint, putAllHints, removeHint, setUpdateStatus } from '../../../src/reducers/hints-state';

test("initialState", () => {
    let defaultState
    expect(hintStateReducer(defaultState, { type: 'anything' })).toBeDefined();
    expect(hintStateReducer(defaultState, { type: 'anything' }).hints).toEqual([]);
    expect(hintStateReducer(defaultState, { type: 'anything' }).timestamp).toBe(null);
    expect(hintStateReducer(defaultState, { type: 'anything' }).isUpdating).toBe(false);
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
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }, {
            hintId: 'id2',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }, {
            hintId: 'id3',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, updateHint('id2', { visible: true }));
    expect(newState.hints.find(h => h.hintId === 'id2').visible).toBe(true);
});

test("put hint", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, putHint({ id: 'id2', type: 'Extract Procedure', target: 'Sprite3' }));
    expect(newState.hints.find(h => h.id === 'id2')).toBeDefined();
    expect(newState.hints.length).toBe(2);
});

test("put all hints", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: true
        }]
    };

    const newState = hintStateReducer(state, putAllHints([
        { hintId: 'id2', type: 'Extract Procedure', target: 'Sprite3' }, 
        { hintId: 'id1', type: 'Extract Procedure', target: 'Sprite3', visible: false },
        { hintId: 'id3', type: 'Extract Procedure', target: 'Sprite4' }
    ]));
    expect(newState.hints.find(h => h.hintId === 'id2')).toBeDefined();
    expect(newState.hints.find(h => h.hintId === 'id1').visible).toBe(false);
    expect(newState.hints.length).toBe(3);
});

test("remove hint", () => {
    let state = {
        timestamp: 'date',
        hints: [{
            hintId: 'id1',
            type: 'Extract Procedure',
            target: 'sprite1',
            visible: false
        }, {
            hintId: 'id2',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }, {
            hintId: 'id3',
            type: 'Extract Procedure',
            target: 'sprite2',
            visible: false
        }]
    };

    const newState = hintStateReducer(state, removeHint('id2'));
    expect(newState.hints.find(h => h.hintId === 'id2')).not.toBeDefined();
    expect(newState.hints.length).toBe(2);
});

test("update status", () => {
    let state = {
        timestamp: 'date',
        hints: [],
        isUpdating: false
    };
    const newState1 = hintStateReducer(state, setUpdateStatus(true));
    expect(newState1.isUpdating).toBe(true);

    const newState2 = hintStateReducer(newState1, setUpdateStatus(false));
    expect(newState2.isUpdating).toBe(false);

});
