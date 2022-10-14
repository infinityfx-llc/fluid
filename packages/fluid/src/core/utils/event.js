import { is } from './helper';

const Events = {};

export const addEventListener = (event, callback) => {
    if (!(event in Events)) {
        Events[event] = { unique: 0 };

        window.addEventListener(event, e => {
            for (const cb of Object.values(Events[event])) {
                if (is.function(cb)) cb(e);
            }
        });
    }

    const e = Events[event];
    callback.LivelyID = e.unique;
    e[e.unique++] = callback;
};

export const removeEventListener = (event, callback) => {
    if (!(event in Events) || is.null(callback) || !('LivelyID' in callback)) return;

    delete Events[event][callback.LivelyID];
};

export const onClickOutside = (element, callback) => {
    callback.LivelyID = e => {
        if (!e.path.includes(element)) callback(e);
    };

    addEventListener('click', callback.LivelyID);
};

export const offClickOutside = (callback) => {
    removeEventListener('click', callback.LivelyID);
};