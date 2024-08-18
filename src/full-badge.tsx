import React from 'react'
import satori, { init } from 'satori/wasm'
import initYoga from 'yoga-wasm-web'
import yogaWasm from '../node_modules/yoga-wasm-web/dist/yoga.wasm'
import { AppDetails } from "./google-play-scraper.js";
import { compactNumberFormatter } from "./utils";

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        tw?: string;
    }
}

const yoga = await initYoga(yogaWasm)
init(yoga)

// https://developers.google.com/fonts/docs/developer_api?apix_params=%7B%22family%22%3A%5B%22Inter%22%5D%7D
const fonts = {
    Inter: {
        regular: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        semibold: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
    },
    MaterialSymbolsOutlined: {
        regular: "https://fonts.gstatic.com/s/materialsymbolsoutlined/v115/kJF1BvYX7BgnkSrUwT8OhrdQw4oELdPIeeII9v6oDMzByHX9rA6RzaxHMPdY43zj-jCxv3fzvRNU22ZXGJpEpjC_1v-p_4MrImHCIJIZrDCvHOembd5zrTgt.ttf",
    }
}

export async function fullBadge(appDetails: AppDetails) {

    const markup = (
        <div
            tw="flex items-center bg-white h-full w-full px-3 rounded-3xl border-2 border-gray-200"
            style={{ fontFamily: 'Inter, "Material Symbols Outlined"' }}>
            <img src={appDetails.icon!} width={120} height={120} tw="rounded-2xl shadow-lg mr-4" alt="app icon" />
            <div tw="flex-1 flex flex-col h-full">
                <div tw="flex-1 flex flex-col">
                    <p tw="text-xl font-semibold leading-5">
                        {appDetails.title}
                    </p>
                    <p tw="text-green-700 font-semibold">
                        {appDetails.developer}
                    </p>
                </div>
                <div tw="flex justify-between items-center">
                    <p tw="flex items-center">
                        <span tw="text-gray-500 text-xl leading-5">&#xf090;</span>
                        <span tw="font-semibold">
                            {compactNumberFormatter.format(Number(appDetails.maxInstalls))}
                        </span>
                    </p>
                    {!appDetails.ratings ? (
                        <p>
                            <span tw="text-yellow-400">★</span>
                            <span tw="text-gray-500">N/A</span>
                        </p>
                    ) : (
                        <p>
                            <span tw="font-semibold">
                                {appDetails.scoreText}
                            </span>
                            <span tw="text-yellow-500">★</span>
                            <span tw="text-gray-500">
                                ({compactNumberFormatter.format(Number(appDetails.ratings))})
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )

    return await satori(markup,
        {
            width: 350,
            height: 150,
            // debug: true,
            fonts: [
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
        }
    )
}
