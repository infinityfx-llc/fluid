export function mergeRecursive(a: any, b: any) {
    if (a === undefined) return b;
    if (typeof a !== 'object') return a;

    const merged: any = Object.assign({}, a);
    for (const key in b) {
        merged[key] = mergeRecursive(merged[key], b[key]);
    }

    return merged;
}