import { styleMapToRuleList } from './utils/css';
import { hash } from './utils/helper';

export default class Stylesheet {

    constructor(id) {
        this.id = 'fluid__styles__' + hash(id);
        this.ssr = false;
        this.cache = {
            fragments: {},
            size: 0
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
            const header = (tag.innerText.match(/^\/\*(.+?)\*\//) || [])[0];
            header?.split('-').forEach(val => {
                const [key, head, length] = val.split(':');
                this.cache.fragments[key] = { ssr: true, head, rules: { length } };
            });

            this.ssr = true;
        }
        
        this.stylesheet = tag.sheet;
    }

    cleanup(ssr = false) {
        if (this.ssr) return ssr && (this.stylesheet = null);

        document.getElementById(this.id).remove();
        this.stylesheet = null;
    }

    toString() {
        if (this.stylesheet) return this.stylesheet.ownerNode.innerText;

        const rules = Object.values(this.cache.fragments).reduce((str, { rules }) => str + rules.join(''), '');
        const keys = Object.entries(this.cache.fragments).map(([key, val]) => `${key}:${val.head}:${val.rules.length}`).join('-');

        return `/*${keys}*/${rules}`;
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
        return this.cache.fragments[key];
    }

    delete(key) {
        const cached = this.get(key);
        if (!cached) return;

        if (--cached.references > 0) return;

        const { head, rules } = cached;
        this.cache.size -= rules.length;
        delete this.cache.fragments[key];

        for (const key in this.cache.fragments) {
            const val = this.get(key);
            if (val.head > head) val.head -= rules.length;
        }
        
        if (!this.stylesheet) return;

        for (let i = head + rules.length - 1; i >= head; i--) this.stylesheet.deleteRule(i);
    }

    insert(key, rules, global = false) {
        const cached = this.get(key);
        const ssr = cached && cached.ssr;

        if (cached && !ssr) {
            cached.references++;
            return cached.selectors;
        }

        const list = styleMapToRuleList(rules, global ? undefined : key);
        this.set(key, list);

        if (this.stylesheet && !ssr) {
            for (const rule of list.rules) this.stylesheet.insertRule(rule, this.stylesheet.cssRules.length);
        }

        return list.selectors;
    }

}