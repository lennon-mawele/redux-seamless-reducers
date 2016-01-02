import { isError } from 'flux-standard-action';
import reduceReducers from 'reduce-reducers';
import Immutable from 'seamless-immutable';


const isFunction = (obj) => typeof obj === 'function';

const handle = (type, reducers) => {
    return (state, action) => {
        if (action.type !== type) {
            return state;
        }

        const handlerKey = isError(action)
            ? 'throw'
            : 'next';

        if (isFunction(reducers)) {
            reducers.next = reducers;
        }

        const reducer = reducers[handlerKey];

        return isFunction(reducer)
            ? Immutable(reducer(state, action))
            : state;
    };
};

export default (reducers, defaultState = {}) => {
    const handlers = Object.keys(reducers).map((type) => handle(type, reducers[type]));
    return (state = Immutable(defaultState), action) => reduceReducers(...handlers)(state, action);
};
