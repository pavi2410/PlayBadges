import { fontFromUrl, googleFonts } from 'takumi-js/helpers'

const fonts = {
    Inter: {
        regular: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        semibold: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    },
    MaterialSymbolsOutlined: {
        regular: "https://fonts.gstatic.com/s/materialsymbolsoutlined/v115/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOembd5zrTgt.ttf",
    },
    Pretendard: {
        regular: "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-Regular.woff2",
        semibold: "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-SemiBold.woff2",
    },
}

let badgeFonts: Promise<Awaited<ReturnType<typeof loadBadgeFonts>>> | undefined

async function loadBadgeFonts() {
    const inter = await googleFonts({
        families: [{ name: 'Inter', weight: [400, 600] }],
    })

    return [
        ...inter,
        fontFromUrl(fonts.Pretendard.regular),
        fontFromUrl(fonts.Pretendard.semibold),
        fontFromUrl(fonts.Inter.regular),
        fontFromUrl(fonts.Inter.semibold),
        fontFromUrl(fonts.MaterialSymbolsOutlined.regular),
    ]
}

export function getBadgeFonts() {
    badgeFonts ??= loadBadgeFonts()
    return badgeFonts
}
