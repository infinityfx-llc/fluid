import { FluidStyles, Selectors } from "../types";
import { mergeRecursive, ruleToString } from "./utils";

class StyleStore {

    rules: {
        [key: string]: {
            selectors: Selectors;
            rules: string;
        }
    } = {};

    get(key: string) {
        return key in this.rules ? this.rules[key].selectors : null;
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
            rules
        };

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

    update() {
        if (typeof window === 'undefined') return;

        const tag = document.getElementById('fluid__styles') || document.createElement('style');
        if (!tag.isConnected) {
            (document.head || document.getElementsByName('head')[0]).appendChild(tag);
        }

        tag.innerText = this.serialize();
    }

    serialize() {
        return Object.values(this.rules).reduce((str, { rules }) => str + rules, '');
    }

}

const FluidStyleStore = new StyleStore();

export default FluidStyleStore;