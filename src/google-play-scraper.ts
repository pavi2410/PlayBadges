const MAPPINGS = {
    title: [1, 2, 0, 0],
    description: [1, 2, 72, 0, 1],
    summary: [1, 2, 73, 0, 1],
    installs: [1, 2, 13, 0],
    minInstalls: [1, 2, 13, 1],
    maxInstalls: [1, 2, 13, 2],
    score: [1, 2, 51, 0, 0],
    scoreText: [1, 2, 51, 0, 0],
    ratings: [1, 2, 51, 2, 1],
    icon: [1, 2, 95, 0, 3, 2],
    developer: [1, 2, 68, 0],
};

const DEBUG = process.env.NODE_ENV !== 'production';

type MAPPINGS_TYPE = {
    title: string | null;
    description: string | null;
    summary: string | null;
    installs: string | null;
    minInstalls: number | null;
    maxInstalls: number | null;
    score: number | null;
    scoreText: string | null;
    ratings: number | null;
    icon: string | null;
    developer: string | null;
}

export type AppDetails = MAPPINGS_TYPE;

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

    const jsonStrings = html.match(/AF_initDataCallback\(({key: 'ds:[5]', .*?})\);<\/script>/)

    if (DEBUG) {
        console.log(`jsonStrings for ${appId}:`, jsonStrings ? 'Found' : 'Not found')
    }
    
    const jsonString = jsonStrings ? jsonStrings[1] : null

    if (!jsonString) {
        if (DEBUG) {
            console.log(`No JSON string found for ${appId}`)
        }
        return null
    }

    const cleanedJsonString = jsonString.replace(/({|, )([a-z0-9A-Z_]+?):/g, '$1"$2":')
        .replaceAll("'", '"');

    if (DEBUG) {
        // Export debug files
        try {
            const fs = await import('fs/promises')
            await fs.mkdir('debug', { recursive: true })
            await fs.writeFile(`debug/${appId}-raw.json`, jsonString)
            await fs.writeFile(`debug/${appId}-cleaned.json`, cleanedJsonString)
            console.log(`Exported debug files for ${appId} to debug/ folder`)
        } catch (e) {
            console.log(`Failed to write debug files for ${appId}:`, e)
        }
    }

    const json = JSON.parse(cleanedJsonString)
    const data = json.data

    return Object.fromEntries(
        Object.entries(MAPPINGS)
            .map(([key, path]) => [key, getValue(data, path)])
    ) as AppDetails
}

function getValue(data: any, path: number[]): string | number | null {
    for (const part of path) {
        data = data[part]
        if (!data) return null
    }
    return data
}
