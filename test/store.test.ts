import { Store } from '../dist';
import { StoreDef } from '../dist/interfaces/store-interfaces';

describe('Testing the Store to ensure it works', () => {
    const testFooMemory = (state: {foo: string}) => state.foo;

    describe('creation of store with an initial reducer and memory', () => {
        let store: StoreDef<{foo: string}>;

        test('create a store', () => {
            store = Store({
                foo: 'bar'
            }, [function (state, action) {
                return Object.assign(state, {foo: 'bar2'});
            }], [testFooMemory], [])
        });

        test('ensure store is initialized', () => {
            expect(store.getMemory(testFooMemory)).toEqual('bar')
        });

        it('fires event to change store', () => {
            store.dispatch({ type: 'action' });
        })

        test('ensure store is changed', () => {
            expect(store.getMemory(testFooMemory)).toEqual('bar2')
        });
    });


    describe('creation of store without an initial reducer and memory', () => {
        let store: StoreDef<{foo: string}>;

        test('create a store without initial values', () => {
            store = Store({ foo: 'bar' })
        });

        test('attach reducer and memory', () => {
            store.attachReducer((state, action) => Object.assign(state, {foo: 'bar2'}))
            store.attachMemory(testFooMemory)
        });

        test('ensure store is initialized', () => {
            expect(store.getMemory(testFooMemory)).toEqual('bar')
        });

        it('fires event to change store', () => {
            store.dispatch({ type: 'action' });
        })

        test('ensure store is changed', () => {
            expect(store.getMemory(testFooMemory)).toEqual('bar2')
        });
    })





})