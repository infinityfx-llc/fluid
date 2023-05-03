import { styleMapToRuleList } from './utils/css';
import { hash, is } from './utils/helper';

export default class Stylesheet {

    constructor(id) {
        this.id = 'fluid__styles__' + hash(id);
        this.ssr = false;
        this.cache = {
            preconnect: {},
            fragments: {},
            rules: []
        };
    }

    hydrate() {
        if (this.stylesheet) return;

        let tag = document.getElementById(this.id);

        if (!tag) {
            tag = document.createElement('style');
            tag.id = this.id;
            (document.head || document.getElementsByName('head')[0]).appendChild(tag);

            tag.innerText = this.toString();
        } else {
            (tag.innerText.match(/^\/\*(.+?)\*\//) || [0, ''])[1].split(';').forEach(key => {
                this.cache.fragments[key] = {
                    references: 1
                };
            });

            document.querySelectorAll('link[rel="preconnect"]').forEach(el => {
                this.cache.preconnect[el.href] = true;
            });

            this.ssr = true;
        }

        this.stylesheet = tag.sheet;
    }

    cleanup(ssr = false) {
        if (!this.ssr || ssr) this.stylesheet = null;
        if (!this.ssr) document.getElementById(this.id).remove();
    }

    toString() {
        if (this.stylesheet) return this.stylesheet.ownerNode.innerText;

        const rules = Object.values(this.cache.rules).reduce((str, { rule }) => str + rule.string, '');
        const keys = Object.keys(this.cache.fragments).join(';');

        return `/*${keys}*/${rules}`;
    }

    get(key) {
        return this.cache.fragments[key];
    }

    set(key, { rules, selectors }) {
        for (const rule of rules) {
            this.cache.rules[rule.top ? 'unshift' : 'push']({
                key,
                rule
            });
        }

        this.cache.fragments[key] = {
            references: 1,
            selectors
        };
    }

    delete(key) {
        const frags = this.cache.fragments;
        if (!(key in frags)) return;

        if (--frags[key].references > 0) return;
        delete frags[key];

        const rules = this.cache.rules;
        for (let i = rules.length - 1; i >= 0; i--) {
            if (rules[i].key === key) {
                rules.splice(i, 1);

                if (this.stylesheet) {
                    this.stylesheet.deleteRule(i);
                }
            }
        }
    }

    insert(key, rules, global = false) {
        const cached = this.get(key);
        const ssr = cached && !cached.selectors;

        if (cached && !ssr) {
            cached.references++;
            return cached.selectors;
        }

        const list = styleMapToRuleList(rules, global ? undefined : key);
        this.set(key, list);

        if (this.stylesheet && !ssr) {
            for (const { string, top } of list.rules) this.stylesheet.insertRule(string, top ? 0 : this.stylesheet.cssRules.length);
        }

        return list.selectors;
    }

    preconnect(uri) {
        this.cache.preconnect[uri] = true;
    }

    preconnects() {
        return Object.keys(this.cache.preconnect);
    }

}