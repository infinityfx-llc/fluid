export const matchBrackets = (str, from, open = '{', close = '}') => {
    let i = from + 1, res = open, bracket = 1;

    while (bracket > 0 && i < str.length) {
        const char = str.charAt(i);
        if (char === close) bracket--;
        if (char === open) bracket++;
        res += char;

        i++;
    }

    return res;
};

export const objectFromString = (str) => {
    return JSON.parse(str.replace(/(^|,|\s)([\w\$]+?):/gi, '$1"$2":').replace(/'/g, '"'));
};

export const insertInString = (str, start, end, insert) => {
    return str.slice(0, start) + insert + str.slice(end);
};