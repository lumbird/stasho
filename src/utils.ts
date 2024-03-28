import {
    State,
    Action,
    EffectCallback,
    MemoryCallback,
    ReducerCallback,
    ActionCallbackWithParams, ActionCallbackWithoutParams, ActionCallbackContext
} from "./interfaces/store-interfaces";

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

export function isAction(
    actionA: string | Action | ActionCallbackContext,
    actionB: string | Action | ActionCallbackContext
): boolean {

    if (typeof(actionA) === "object" && typeof(actionB) === "object")
    {
        return actionA.type === actionB.type;
    }
    else if(typeof(actionA) === "object") {
        return actionA.type === actionB;
    }
    else if(typeof(actionB) === "object") {
        return actionA === actionB.type;
    }
    else {
        return actionA === actionB;
    }
}

export function actionWithParams<T extends object>(type: string): ActionCallbackWithParams<T> {
    const callback: ((params: T) => Action) = (params: T) => {
        return {
            type,
            ...params
        }
    };

    const callbackContext: ActionCallbackContext = {
        type,
        equals: (action: string | Action | ActionCallbackContext): boolean => {
            if (typeof action == "object") {
                return action.type === type;
            }
            else {
                return action === type;
            }
        }
    };

    return Object.assign(callback, callbackContext);
}

export function actionWithoutParams(type: string): ActionCallbackWithoutParams {
    const callback = () => ({
        type
    });

    const callbackContext: ActionCallbackContext = {
        type,
        equals: (action: string | Action | ActionCallbackContext): boolean => {
            if (typeof action == "object") {
                return action.type === type;
            }
            else {
                return action === type;
            }
        }
    };

    return Object.assign(callback, callbackContext);
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