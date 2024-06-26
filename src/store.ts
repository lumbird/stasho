import { StoreDef, Action, ReducerCallback, MemoryCallback, EffectCallback } from './interfaces/store-interfaces';

/**
 * Creates a store that can be used to manage state and dispatch actions.
 * @param initialState the initial state of the store
 * @param reducers a list of reducers that will be applied to the state
 * @param memories a list of memory which computes the state
 * @param effects a list of effects that occur when an action is dispatched
 * @constructor
 */

export const Store = <S>(
    initialState: S,
    reducers: ReducerCallback<S, any>[] = [],
    memories: MemoryCallback<S, any>[] = [],
    effects: EffectCallback<any>[] = []
): StoreDef<S> => {

    let state: S = initialState;
    const memoryState: Map<Function, string> = new Map<Function, string>();

    const updateMemories = () => {
        memories.forEach((memory) => {
            memoryState.set(memory, memory(state));
        });
    }

    // Dispatch a change
    const dispatch = <A extends Action>(action: A): void => {

        // Reduce all the states though the action and produce new
        state = reducers.reduce((state, reducerCallback) => reducerCallback(state, action), state);

        // Update memory state
        updateMemories();

        // Call effects on all systems
        effects.forEach((effectCallback) => effectCallback(action));
    }

    // Returns the memory item using the reference to the memory callback.
    const getMemory = <T extends MemoryCallback<S, unknown>>(reference: T): ReturnType<T> => {
        return memoryState.get(reference) as ReturnType<T>;
    }

    // Attaches the reducer callback to the array of reducers
    const attachReducer = function(reducerCallback: ReducerCallback<S, any>) {
        reducers.push(reducerCallback);
    }

    // Attaches the memory callback to the array of memories
    const attachMemory = function(memoryCallback: MemoryCallback<S, any>) {
        memories.push(memoryCallback);
        updateMemories();
    }

    // Attaches the effect callback to the array of effects
    const attachEffect = function(effectCallback: EffectCallback<any>) {
        effects.push(effectCallback);
    }

    // Initialise the state of the store
    updateMemories();

    // Controls to interact with store
    return {
        dispatch,
        getMemory,
        attachReducer,
        attachMemory,
        attachEffect
    }
}
