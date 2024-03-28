export interface StoreDef {
    dispatch: (action: Action) => void,
    getMemory: <T extends MemoryCallback<any, any>>(reference: T) => ReturnType<T>,
    getSlice: <T extends SliceCallback<any, any>>(sliceCallback: T) => ReturnType<T>
}

// Application State
export interface State {}

// Action
export interface Action {
    type: string;
}

export interface ActionCallbackContext {
    type: string;
    equals: (equalToo: Action | string) => boolean;
}

export type ActionCallbackWithParams<T> = ((params: T) => Action) & ActionCallbackContext;
export type ActionCallbackWithoutParams = (() => Action) & ActionCallbackContext;


export type EffectCallback<A extends Action> = (action: A) => void;
export type ReducerCallback<S extends State, A extends Action> = (oldState: S, action: A) => S;
export type MemoryCallback<IV, OV> = (state: IV) => OV;
export type SliceCallback<S extends State, V> = (state: S) => V;

export type MemoryCallbackArray<T extends any[]> = {
    [K in keyof T]: K extends 0 ? MemoryCallback<T[K], any> : MemoryCallback<T[K], T[Extract<K, keyof T>]>;
}[number];
