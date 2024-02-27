export interface RefContext {
    refMap: WeakMap<any, string>;
};

export interface StateContext {
    stateMap: Map<string, unknown>;
};

export type CombinedContext = RefContext & StateContext;