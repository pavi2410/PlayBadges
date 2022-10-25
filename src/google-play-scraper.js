const MAPPINGS = {
    title: [1, 2, 0, 0],
    description: [1, 2, 72, 0, 1],
    summary: [1, 2, 73, 0, 1],
    installs: [1, 2, 13, 0],
    minInstalls: [1, 2, 13, 1],
    maxInstalls: [1, 2, 13, 2],
    score: [1, 2, 51, 0, 1],
    scoreText: [1, 2, 51, 0, 0],
    ratings: [1, 2, 51, 2, 1],
}

export async function fetchAppDetails({appId, countryCode = 'US'}) {
    const response = await fetch(`https://play.google.com/store/apps/details?id=${appId}&gl=${countryCode}`)

    if (!response.ok) return null

    let html = await response.text()

    let json = html.match(/AF_initDataCallback\(({key: 'ds:5', .*?})\);<\/script>/)[1]
    json = json.replace(/({|, )([a-z0-9A-Z_]+?):/g, '$1"$2":').replaceAll("'", '"');
    json = JSON.parse(json)
    json = json.data

    return Object.fromEntries(
        Object.entries(MAPPINGS)
            .map(([m, p]) => [m, p.reduce((j, k) => j[k], json)])
    )
}
