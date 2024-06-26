export interface StoreDef<S> {
    dispatch: (action: Action) => void,
    getMemory: <T extends MemoryCallback<any, any>>(reference: T) => ReturnType<T>,
    attachReducer: (reducer: ReducerCallback<S, any>) => void,
    attachMemory: (memory: MemoryCallback<S, any>) => void,
    attachEffect: (effect: EffectCallback<any>) => void
}

// Action
export interface Action {
    type: string;
}

export interface ActionCallbackContext {
    type: string;
    equals: (equalToo: Action | string) => boolean;
}

export type ActionCallbackWithParams<T> = ((params: T) => Action & T) & ActionCallbackContext;
export type ActionCallbackWithoutParams = (() => Action) & ActionCallbackContext;


export type EffectCallback<A extends Action> = (action: A) => void;
export type ReducerCallback<S, A extends Action> = (oldState: S, action: A) => S;
export type MemoryCallback<IV, OV> = (state: IV) => OV;
export type SliceCallback<S, V> = (state: S) => V;

export type MemoryCallbackArray<T extends any[]> = {
    [K in keyof T]: K extends 0 ? MemoryCallback<T[K], any> : MemoryCallback<T[K], T[Extract<K, keyof T>]>;
}[number];
