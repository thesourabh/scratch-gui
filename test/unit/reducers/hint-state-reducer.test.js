import hintStateReducer, {setHint} from '../../../src/reducers/hints-state';

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

test("update hint item", ()=>{

});

test("sort hints", ()=>{

});

