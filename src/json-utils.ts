export function cleanJsonString(malformedJsonString: string): string {
    let j = quoteJsonKeys(malformedJsonString);
    j = doubleQuouteJsonStrings(j);
    return j;
}

function quoteJsonKeys(json: string): string {
    return json.replace(/(?<={|, )(\w+)(?=:)/g, '"$1"');
}

function doubleQuouteJsonStrings(json: string): string {
    return json.replace(/'(.+?)'/g, '"$1"');
}
