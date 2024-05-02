
import { genuuidv4 } from "./guuid";
import { CombinedContext, RefContext, StateContext } from "./interfaces/context-typing";

const defaultRefContext: RefContext = (document as any).refContext = {} as RefContext;
const defaultTokenContext: StateContext = (document as any).tokenContext = {} as StateContext;

export const getIdByObject = (key: object, context: RefContext = defaultRefContext): string => {
    const referenceMap: WeakMap<any, string> = context.refMap || (context.refMap = new WeakMap());
    const id = referenceMap.get(key) || genuuidv4();
    return id;
}

export const setIdByObject = (key: object, id: string, context: RefContext = defaultRefContext): void => {
    const referenceMap: WeakMap<any, string> = context.refMap || (context.refMap = new WeakMap());
    referenceMap.set(key, id);
}

export const clearObjectId = (key: object, context: RefContext = defaultRefContext): void => {
    const referenceMap: WeakMap<any, string> = context.refMap || (context.refMap = new WeakMap());
    referenceMap.delete(key);
}

export const getObjectByToken = <T>(key: string, context: StateContext = defaultTokenContext): T | undefined => {
    const stateMap: Map<string, unknown> = context.stateMap || (context.stateMap = new Map());
    return stateMap.get(key) as T | undefined;
}

export const setObjectByToken = (key: string, value: unknown, context: StateContext = defaultTokenContext): void => {
    const stateMap: Map<string, unknown> = context.stateMap || (context.stateMap = new Map());
    stateMap.set(key, value);
}

export const clearToken = (key: string, context: StateContext = defaultTokenContext): void => {
    const stateMap: Map<string, unknown> = context.stateMap || (context.stateMap = new Map());
    stateMap.delete(key);
}