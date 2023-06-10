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
    icon: [1, 2, 95, 0, 3, 2],
    developer: [1, 2, 68, 0],
}

export type AppDetails = Record<keyof typeof MAPPINGS, string>

export async function fetchAppDetails(
    appId: string,
    countryCode = 'US'
): Promise<AppDetails | null> {
    const googlePlayUrl = new URL('https://play.google.com/store/apps/details')
    googlePlayUrl.searchParams.set('id', appId)
    googlePlayUrl.searchParams.set('gl', countryCode)

    const response = await fetch(googlePlayUrl)
    if (!response.ok) return null

    const html = await response.text()
    if (html.length == 0) return null

    let jsonString = html.match(/AF_initDataCallback\(({key: 'ds:5', .*?})\);<\/script>/)?.[1]
    if (!jsonString) return null

    jsonString = jsonString.replace(/({|, )([a-z0-9A-Z_]+?):/g, '$1"$2":')
        .replaceAll("'", '"');

    let json = JSON.parse(jsonString)
    json = json.data

    return Object.fromEntries(
        Object.entries(MAPPINGS)
            .map(([m, p]) => [m, p.reduce((j, k) => j[k], json)])
    ) as AppDetails
}
