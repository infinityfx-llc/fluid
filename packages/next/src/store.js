import { hash, hashObject, styleMapToRuleList } from '@infinityfx/fluid/utils';
import { GLOBAL_IMPORT_PATH } from './globals';

class Store {

    constructor() {
        this.globalStyles = {};
        this.defaultStyles = {};
        this.scopes = {};

        this.hydrated = false;
        this.bundled = false;
        this.GLOBAL_SCOPE = hash(GLOBAL_IMPORT_PATH);
    }

    getComponentStyles(key) {
        return this.defaultStyles[key];
    }

    insertStyles(key, styleMap) {
        this.defaultStyles[key] = styleMap;
    }

    insertGlobalStyles(styleMap) {
        const { rules } = styleMapToRuleList(styleMap);
        this.setScopedRules(this.GLOBAL_SCOPE, hashObject(styleMap), rules);
    }

    setScopedRules(scope, key, rules) {
        if (!(scope in this.scopes)) this.scopes[scope] = {};
        this.scopes[scope][key] = rules;
    }

    getScopedRules(scope) {
        if (!(scope in this.scopes)) return '';

        return Object.values(this.scopes[scope])
            .map(arr => {
                return arr.map(({ string }) => string).join('');
            }).join('');
    }

    getScopes() {
        const scopes = {};

        for (const key in this.scopes) {
            scopes[key] = this.getScopedRules(key);
        }

        return scopes;
    }

    scopeIsEmpty(scope) {
        return !(scope in this.scopes);
    }

}

export default new Store();