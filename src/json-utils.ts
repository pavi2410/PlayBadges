// The callback object is `{key: 'ds:5', hash: '11', data: <valid JSON>, sideChannel: {}}`.
// Only the keys and the single-quoted values before `data:` need fixing; the data itself is
// already JSON and may contain apostrophes (e.g. "King's Cup"), so it must be left alone.
export function cleanJsonString(malformedJsonString: string): string {
    const dataIndex = malformedJsonString.indexOf('data:');
    if (dataIndex === -1) return fixHeader(malformedJsonString);
    const header = malformedJsonString.slice(0, dataIndex);
    const rest = malformedJsonString.slice(dataIndex + 'data:'.length);
    const tail = rest.replace(/,\s*sideChannel:\s*\{\}\s*}\s*$/, '}');
    return fixHeader(header) + '"data":' + tail;
}

function fixHeader(json: string): string {
    return doubleQuouteJsonStrings(quoteJsonKeys(json));
}

function quoteJsonKeys(json: string): string {
    return json.replace(/(?<={|, )(\w+)(?=:)/g, '"$1"');
}

function doubleQuouteJsonStrings(json: string): string {
    return json.replace(/'(.+?)'/g, '"$1"');
}
