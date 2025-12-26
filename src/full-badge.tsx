import React from 'react'
import satori, { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web'
import yogaWasm from '../node_modules/yoga-wasm-web/dist/yoga.wasm'
import type { AppDetails } from "./google-play-scraper.js";
import { compactNumberFormatter } from "./utils";

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        tw?: string;
    }
}

const yoga = await initYoga(yogaWasm)
init(yoga)

// https://developers.google.com/fonts/docs/developer_api?apix_params=%7B%22family%22%3A%5B%22Inter%22%5D%7D
// https://github.com/orioncactus/pretendard/blob/main/LICENSE
const fonts = {
    Inter: {
        regular: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        semibold: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    },
    MaterialSymbolsOutlined: {
        regular: "https://fonts.gstatic.com/s/materialsymbolsoutlined/v115/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOembd5zrTgt.ttf",
    },
    Pretendard: {
        regular: "https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff",
        semibold: "https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff",
    }
}

type Theme = 'light' | 'dark';

function cva({ base, light, dark }: { base?: string; light: string; dark: string }, theme: Theme): string {
    return [base, theme === 'dark' ? dark : light].filter(Boolean).join(' ')
}

export async function fullBadge(appDetails: AppDetails, theme: Theme) {

    const markup = (
        <div
            tw={cva({
                base: "flex items-center h-full w-full px-3 rounded-3xl border-2",
                light: "bg-white border-gray-100",
                dark: "bg-black border-gray-800",
            }, theme)}
            style={{ fontFamily: 'Pretendard, Inter, "Material Symbols Outlined"' }}>
            <img src={appDetails.icon!} width={120} height={120} tw="rounded-2xl shadow-lg mr-4" alt="app icon" />
            <div tw="flex-1 flex flex-col h-full">
                <div tw="flex-1 flex flex-col">
                    <p tw={cva({ base: "text-xl font-semibold leading-5", light: "text-black", dark: "text-white" }, theme)}>
                        {appDetails.title}
                    </p>
                    <p tw={cva({ base: "font-semibold", light: "text-green-700", dark: "text-green-400" }, theme)}>
                        {appDetails.developer}
                    </p>
                </div>
                <div tw="flex justify-between items-center">
                    <p tw="flex items-center">
                        <span tw={cva({ base: "text-xl leading-5", light: "text-gray-500", dark: "text-gray-400" }, theme)}>&#xf090;</span>
                        <span tw={cva({ base: "font-semibold", light: "text-black", dark: "text-white" }, theme)}>
                            {compactNumberFormatter.format(Number(appDetails.maxInstalls))}
                        </span>
                    </p>
                    {!appDetails.ratings ? (
                        <p>
                            <span tw={cva({ light: "text-yellow-500", dark: "text-yellow-400" }, theme)}>★</span>
                            <span tw={cva({ light: "text-gray-500", dark: "text-gray-400" }, theme)}>N/A</span>
                        </p>
                    ) : (
                        <p>
                            <span tw={cva({ base: "font-semibold", light: "text-black", dark: "text-white" }, theme)}>
                                {appDetails.scoreText}
                            </span>
                            <span tw={cva({ light: "text-yellow-500", dark: "text-yellow-400" }, theme)}>★</span>
                            <span tw={cva({ light: "text-gray-500", dark: "text-gray-400" }, theme)}>
                                ({compactNumberFormatter.format(Number(appDetails.ratings))})
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )

    return await satori(markup, {
        width: 350,
        height: 150,
        // debug: true,
        fonts: [
            {
                name: 'Pretendard',
                data: await fetch(fonts.Pretendard.regular).then(res => res.arrayBuffer()),
                weight: 400,
                style: 'normal',
            },
            {
                name: 'Pretendard',
                data: await fetch(fonts.Pretendard.semibold).then(res => res.arrayBuffer()),
                weight: 600,
                style: 'normal',
            },
            {
                name: 'Inter',
                data: await fetch(fonts.Inter.regular).then(res => res.arrayBuffer()),
                weight: 400,
                style: 'normal',
            },
            {
                name: 'Inter',
                data: await fetch(fonts.Inter.semibold).then(res => res.arrayBuffer()),
                weight: 600,
                style: 'normal',
            },
            {
                name: 'Material Symbols Outlined',
                data: await fetch(fonts.MaterialSymbolsOutlined.regular).then(res => res.arrayBuffer()),
                weight: 400,
                style: 'normal',
            }
        ],
    });
}
