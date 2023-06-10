import React from 'react'
import satori, {init} from 'satori/wasm'
import initYoga from 'yoga-wasm-web'
// @ts-ignore
import yogaWasm from '../node_modules/yoga-wasm-web/dist/yoga.wasm'
import {AppDetails} from "./google-play-scraper.js";
import {compactNumberFormatter} from "./utils";

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
            tw="flex items-center bg-white h-full w-full p-4 px-6 rounded-3xl border-4 border-black text-xl text-black"
            style={{fontFamily: 'Inter, "Material Symbols Outlined"'}}>
            <div tw="flex pr-6">
                <img src={appDetails.icon} width={180} height={180} tw="rounded-2xl shadow-xl" alt="app icon"/>
            </div>
            <div tw="flex flex-1 flex-col h-full justify-between">
                <p tw="text-3xl font-semibold">{appDetails.title}</p>
                <p tw="text-sky-400 font-semibold">{appDetails.developer}</p>
                <div tw="flex justify-between">
                    <p tw="pr-6">
                        <span>&#xf090;</span>
                        <span
                            tw="font-semibold">{compactNumberFormatter.format(parseFloat(appDetails.maxInstalls))}+</span>
                    </p>
                    <p>
                        <span tw="font-semibold">{appDetails.scoreText}</span>
                        <span tw="text-yellow-400">★</span>
                        <span>({compactNumberFormatter.format(parseFloat(appDetails.ratings))}+)</span>
                    </p>
                </div>
            </div>
        </div>
    )

    return await satori(markup,
        {
            width: 560,
            height: 240,
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
