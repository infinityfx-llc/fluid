import { styleMapToRuleList } from './utils/css';
import { tag } from './utils/helper';

// do serverside rendering

export default class Stylesheet {

    constructor() {
        this.id = 'fluid__styles__' + tag(); // get server and client to sync this value
        this.cache = {
            fragments: {},
            size: 0
        };
    }

    inject() {
        if (this.stylesheet) return;

        let tag = document.getElementById(this.id);

        if (!tag) {
            tag = document.createElement('style');
            tag.id = this.id;
            (document.head || document.getElementsByName('head')[0]).appendChild(tag);
        }

        tag.innerText = this.toString();
        this.stylesheet = tag.sheet;
    }

    remove() {
        document.getElementById(this.id)?.remove();
        this.stylesheet = null;
    }

    toString() {
        return Object.values(this.cache.fragments).reduce((str, { rules }) => str + rules.join(''), '');
    }

    set(key, { rules, selectors }) {
        this.cache.fragments[key] = {
            rules,
            selectors,
            references: 1,
            head: this.cache.size
        };
        this.cache.size += rules.length;
    }

    get(key) {
        this.cache.fragments[key];
    }

    delete(key) {
        const cached = this.get(key);
        if (!cached) return;

        cached.references--;
        if (cached.references > 0) return;

        const { head, rules } = cached;
        this.cache.size -= rules.length;
        
        for (const key in this.cache.fragments) {
            const val = this.cache.fragments[key];
            if (val.head > head) val.head -= rules.length;
        }

        if (!this.stylesheet) return;

        for (let i = head; i < head + rules.length; i++) this.stylesheet.deleteRule(i);
    }

    insert(key, rules) {
        const cached = this.get(key);
        if (cached) {
            cached.references++;
            return cached.selectors;
        }

        const list = styleMapToRuleList(rules, key);
        this.set(key, list);

        if (this.stylesheet) {
            for (const rule of list.rules) this.stylesheet.insertRule(rule, this.stylesheet.cssRules.length);
        }

        return list.selectors;
    }

}