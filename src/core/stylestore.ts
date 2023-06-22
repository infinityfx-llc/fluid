import { FluidStyles, Selectors } from "../types";
import { mergeRecursive, ruleToString } from "./utils";

class StyleStore {

    synchronized = false;
    styles: { [key: string]: FluidStyles; } = {};
    rules: {
        [key: string]: {
            selectors: Selectors;
            rules: string;
            injected: boolean;
        }
    } = {};

    add(key: string, ruleset: FluidStyles) {
        this.styles[key] = ruleset;
    }

    compile__TEST() {
        // feed this.styles through insert and hard code result into this.rules
        // that way useStyles hook calling .get will return hardcodes result
        // when using compiled mode, .serialize() can be can be hardcoded as well
        // this serialized string can then be rendered only on the server
        // .update() shouldnt do anything in compiled mode
    }

    get(key: string) {
        return this.rules[key]?.selectors || null;
    }

    has(key: string) {
        return key in this.rules;
    }

    insert(key: string, ruleset: FluidStyles, global = false) {
        const selectors: Selectors = {};
        let rules = '';

        for (const selector in ruleset) {
            rules += ruleToString(selector, ruleset[selector], selectors, global ? undefined : key);
        }

        this.rules[key] = {
            selectors,
            rules,
            injected: this.rules[key]?.injected || false
        };

        this.update();

        return selectors;
    }

    merge(...styles: FluidStyles[]) {
        const merged: FluidStyles = {};

        for (const ruleset of styles) {
            for (const selector in ruleset) {
                const value = mergeRecursive(merged[selector], ruleset[selector]);
                if (value !== undefined) merged[selector] = value;
            }
        }

        return merged;
    }

    hash(...styles: FluidStyles[]) {
        const str = JSON.stringify(styles);

        let l = 0xdeadbeef, r = 0x41c6ce57;
        for (let i = 0, char; i < str.length; i++) {
            char = str.charCodeAt(i);

            l = Math.imul(l ^ char, 2654435761);
            r = Math.imul(r ^ char, 1597334677);
        }

        l = Math.imul(l ^ (l >>> 16), 2246822507) ^ Math.imul(r ^ (r >>> 13), 3266489909);
        r = Math.imul(r ^ (r >>> 16), 2246822507) ^ Math.imul(l ^ (l >>> 13), 3266489909);

        l = 4294967296 * (2097151 & r) + (l >>> 0);
        return l.toString(16).slice(-8).padStart(8, '0');
    }

    update(inject = false) {
        let tag = typeof window !== 'undefined' && document.querySelector('[data-href="fluid__styles"]') as HTMLStyleElement;
        if (!tag) {
            if (!inject) return;
            
            tag = document.createElement('style');
            tag.dataset.href = 'fluid__styles';
            (document.head || document.getElementsByName('head')[0]).appendChild(tag);
        }

        if (!this.synchronized) {
            const header = (tag.innerText.match(/\/\*(.+?)\*\//)?.[1] || '').split(',');
            header.forEach(key => {
                key in this.rules ? this.rules[key].injected = true : this.rules[key] = { injected: true } as any;
            });

            this.synchronized = true;
        }

        let styles = '';
        for (const key in this.rules) {
            if (this.rules[key].injected) continue;

            this.rules[key].injected = true;
            styles += this.rules[key].rules;
        }

        if (styles) tag.innerText += styles;
    }

    serialize() {
        const styles = Object.values(this.rules).reduce((str, { rules }) => str + rules, '');

        return `/*${Object.keys(this.rules)}*/${styles}`;
    }

}

const FluidStyleStore = new StyleStore();

export default FluidStyleStore;