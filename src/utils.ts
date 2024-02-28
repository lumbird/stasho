import { State, Action, EffectCallback, MemoryCallback, ReducerCallback } from "./interfaces/store-interfaces";

export function buildMemory<T extends MemoryCallback<any, any>[]>(...callbacks: [...T]) {
    return function (input: Parameters<T[0]>[0]) {
        return callbacks.reduce((acc, callback, i) => callback(acc), input);
    };
}

export function buildReducer<T extends ReducerCallback<any, any>[]>(...callbacks: [...T]) {
    return (previousState: Parameters<T[0]>[0], action: Parameters<T[0]>[1]) => {
        return callbacks.reduce((state, reducerCallback) => reducerCallback(state, action), previousState) as ReturnType<T[number]>;
    };
}

export function buildEffect<T extends EffectCallback<any>[]>(...callbacks: [...T]) {
    return (action: Parameters<T[0]>[0]) => callbacks.forEach((effectCallback) => effectCallback(action));;
}

export function isAction(actionA: Action, actionB: Action): boolean {
    return actionA.type === actionB.type;
}

export function actionWithParams<T extends object>(type: string): (params: T) => Action & T {
    return (params: T) => {
        return {
            type,
            ...params
        }
    }


}

export function actionWithoutParams(type: string) {
    return () => ({
        type
    })
}


export function filteredReducer<S extends State, A extends Action>(whitelist: ((() => any) | ((value: any) => any))[], callback: (state: S, action: A) => S) {
    return (state: S, action: A): S => {
        // Filter out action types
        const isActionWhitelisted = whitelist.find((actionCaller) => {
            return (actionCaller as any as () => Action)().type == action.type
        });

        // Call the action if it's whitelisted
        if (isActionWhitelisted) {
            return callback(state, action);
        }
        else {
            return state;
        }
    }

}