import { CombinedContext } from './interfaces/context-typing';
import { State, StoreDef, Action, ReducerCallback, MemoryCallback, EffectCallback, SliceCallback } from './interfaces/store-interfaces';
import { useState } from './context';

/**
 * Creates a store that can be used to manage state and dispatch actions.
 * @param initialState the initial state of the store
 * @param reducers a list of reducers that will be applied to the state
 * @param memories a list of memory which computes the state
 * @param effects a list of effects that occur when an action is dispatched
 * @param context the context of the store itself
 * @constructor
 */
export const Store = <S extends State>(
    initialState: S,
    reducers: ReducerCallback<S, any>[],
    memories: MemoryCallback<S, any>[],
    effects: EffectCallback<any>[],
    context: CombinedContext
): StoreDef => {

    // The store's state
    // TODO remove the useStates and implementation of this concept! we don't want to take this approach for state resolving
    const [storeState, setStoreState] = useState<S>(initialState, context);
    const [memoryState, setMemoryState] = useState<{[key: string]: unknown}>(
        memories.reduce((state, memoryCallback) => ({...state, [memoryCallback.toString()]: memoryCallback(storeState)}), {}),
        context
    );

    // Dispatch a change
    const dispatch = <A extends Action>(action: A): void => {

        // Reduce all the states though the action and produce new
        const newStore = reducers.reduce((state, reducerCallback) => reducerCallback(state, action), storeState);
        setStoreState(newStore);

        // Update memory state
        setMemoryState(memories.reduce((state, memoryCallback) => ({...state, [memoryCallback.toString()]: memoryCallback(newStore)}), {}))

        // Call effects on all systems
        effects.forEach((effectCallback) => effectCallback(action));
    }

    // Returns the memory item using the reference to the memory callback.
    const getMemory = <T extends MemoryCallback<unknown, unknown>>(reference: T): ReturnType<T> => {
        return memoryState[reference.toString()] as ReturnType<T>;
    }

    // Returns the memory item using the reference to the memory callback.
    const getSlice = <T extends SliceCallback<S, any>>(sliceCallback: T): ReturnType<T> => {
        return sliceCallback(storeState);
    }

    // Controls to interact with store
    return {
        dispatch,
        getMemory,
        getSlice
    }
}
