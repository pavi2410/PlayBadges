import * as R from 'remeda';
import * as z from 'zod';
import { cleanJsonString } from './json-utils';

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
    version: [1, 2, 140, 0, 0, 0],
    recentChanges: [1, 2, 144, 1, 1],
    released: [1, 2, 10, 1, 0],
    updated: [1, 2, 145, 0, 1, 0],
};

const AppDetails = z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    summary: z.string().nullable(),
    installs: z.string().nullable(),
    minInstalls: z.number().nullable(),
    maxInstalls: z.number().nullable(),
    score: z.number().nullable(),
    scoreText: z.string().nullable(),
    ratings: z.number().nullable(),
    icon: z.string().nullable(),
    developer: z.string().nullable(),
    version: z.string().nullable(),
    recentChanges: z.string().nullable(),
    released: z.number().nullable(),
    updated: z.number().nullable(),
});

export type AppDetails = z.infer<typeof AppDetails>;

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

    const jsonString = jsonStrings ? jsonStrings[1] : null

    if (!jsonString) {
        return null
    }

    const cleanedJsonString = cleanJsonString(jsonString);

    const json = JSON.parse(cleanedJsonString)
    const data = json.data

    const extractedData = extractMappings(MAPPINGS, data)

    return AppDetails.parse(extractedData);
}

function extractMappings<F extends string>(mappings: Record<F, number[]>, data: object) {
    const extracted = R.entries(mappings).map(([key, path]) => [key, extractPath(data, path)] as const);
    return R.fromEntries(extracted);
}

function extractPath(data: any, path: number[]): string | number | null {
    for (const part of path) {
        data = data[part]
        if (!data) return null
    }
    return data
}
