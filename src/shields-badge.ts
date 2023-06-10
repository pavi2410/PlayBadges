import {badgen} from "badgen";

// https://simpleicons.org/icons/googleplay.svg
const playStoreLogo = `<svg fill="#f5f5f5" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google Play</title><path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/></svg>`
const playStoreLogoDataUri = 'data:image/svg+xml;base64,' + btoa(playStoreLogo)

export function shieldsBadge(format: { label: string, status: string }): string {
    return badgen({
        color: '00cc00',
        labelColor: '0f0f23',
        icon: playStoreLogoDataUri,
        ...format
    })
}
