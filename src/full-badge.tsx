import React from 'react'
import { renderSvg } from 'takumi-js'
import type { AppDetails } from "./google-play-scraper.js";
import { getBadgeFonts } from "./badge-fonts.js";
import { compactNumberFormatter } from "./utils";

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        tw?: string;
    }
}

type Theme = 'light' | 'dark';

const BADGE_WIDTH = 350
const BADGE_HEIGHT = 150
const ICON_SIZE = 120

function cva({ base, light, dark }: { base?: string; light: string; dark: string }, theme: Theme): string {
    return [base, theme === 'dark' ? dark : light].filter(Boolean).join(' ')
}

function debugOutline(enabled: boolean, color: string) {
    return enabled ? `border border-${color}-500` : ''
}

function starIcon(theme: Theme) {
    return cva({
        base: "flex items-center justify-center text-base font-semibold leading-none shrink-0",
        light: "text-yellow-500",
        dark: "text-yellow-400",
    }, theme)
}

export async function fullBadge(appDetails: AppDetails, theme: Theme, debug = false) {
    const markup = (
        <div
            tw={[
                cva({
                    base: "flex flex-row items-center box-border w-full h-full px-3 rounded-3xl border-2",
                    light: "bg-white border-gray-100",
                    dark: "bg-black border-gray-800",
                }, theme),
                debugOutline(debug, 'purple'),
            ].filter(Boolean).join(' ')}
            style={{ fontFamily: 'Pretendard, Inter, "Material Symbols Outlined"' }}>
            <img
                src={appDetails.icon!}
                width={ICON_SIZE}
                height={ICON_SIZE}
                tw={["flex shrink-0 rounded-2xl shadow-lg mr-4", debugOutline(debug, 'orange')].filter(Boolean).join(' ')}
                alt="app icon"
            />
            <div
                tw={[
                    "flex flex-1 flex-col justify-between h-[120px] min-w-0 overflow-hidden py-1",
                    debugOutline(debug, 'red'),
                ].filter(Boolean).join(' ')}>
                <div
                    tw={[
                        "flex flex-col gap-1 min-h-0 overflow-hidden",
                        debugOutline(debug, 'blue'),
                    ].filter(Boolean).join(' ')}>
                    <div
                        tw={cva({
                            base: "flex text-xl font-semibold leading-tight",
                            light: "text-black",
                            dark: "text-white",
                        }, theme)}>
                        {appDetails.title}
                    </div>
                    <div
                        tw={cva({
                            base: "flex font-semibold",
                            light: "text-green-700",
                            dark: "text-green-400",
                        }, theme)}>
                        {appDetails.developer}
                    </div>
                </div>
                <div
                    tw={[
                        "flex flex-row items-center justify-between w-full shrink-0",
                        debugOutline(debug, 'green'),
                    ].filter(Boolean).join(' ')}>
                    <div tw="flex flex-row items-center gap-1">
                        <span
                            tw={cva({
                                base: "flex items-center justify-center text-xl leading-none w-5",
                                light: "text-gray-500",
                                dark: "text-gray-400",
                            }, theme)}>
                            &#xf090;
                        </span>
                        <span tw={cva({ base: "flex font-semibold", light: "text-black", dark: "text-white" }, theme)}>
                            {compactNumberFormatter.format(Number(appDetails.maxInstalls))}
                        </span>
                    </div>
                    {!appDetails.ratings ? (
                        <div tw="flex flex-row items-center gap-1">
                            <span tw={starIcon(theme)} style={{ fontFamily: 'Pretendard, Inter' }}>★</span>
                            <span tw={cva({ base: "flex", light: "text-gray-500", dark: "text-gray-400" }, theme)}>N/A</span>
                        </div>
                    ) : (
                        <div tw="flex flex-row items-center gap-1">
                            <span tw={cva({ base: "flex font-semibold", light: "text-black", dark: "text-white" }, theme)}>
                                {appDetails.scoreText}
                            </span>
                            <span tw={starIcon(theme)} style={{ fontFamily: 'Pretendard, Inter' }}>★</span>
                            <span tw={cva({ base: "flex", light: "text-gray-500", dark: "text-gray-400" }, theme)}>
                                ({compactNumberFormatter.format(Number(appDetails.ratings))})
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    return renderSvg(markup, {
        width: BADGE_WIDTH,
        height: BADGE_HEIGHT,
        fonts: await getBadgeFonts(),
        emoji: 'from-font',
    })
}
