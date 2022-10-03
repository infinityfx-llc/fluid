import { hashObject, styleMapToRuleList } from '@infinityfx/fluid/utils';

class Store {

    constructor() {
        this.globalStyles = {};
        this.defaultStyles = {};
        this.rules = {};

        this.hydrated = false;
    }

    getComponentStyles(key) {
        return this.defaultStyles[key];
    }

    insertStyles(key, styleMap) {
        if (!key) {
            this.globalStyles[hashObject(styleMap)] = styleMapToRuleList(styleMap).rules;
        } else {
            this.defaultStyles[key] = styleMap;
        }
    }

    insertRules(key, rules, page) {
        if (key in this.rules) {
            this.rules[key].pages.push(page);
        } else {
            this.rules[key] = {
                rules,
                pages: [page]
            };
        }
    }

    getCssFiles() {
        const key = 'FLUID_GLOBAL_COMPILED_STYLES';
        const files = {};

        Object.values(this.globalStyles).forEach(rules => {
            const str = rules.map(({ string }) => string).join('');

            files[key] = key in files ? files[key] + str : str;
        });

        Object.values(this.rules).forEach(({ rules, pages }) => {
            const str = rules.map(({ string }) => string).join('');

            pages.forEach(page => {
                files[page] = page in files ? files[page] + str : str;
            });
        });

        return files;
    }

}

export default new Store();