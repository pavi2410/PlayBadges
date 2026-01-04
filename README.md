# PlayBadges

Show off your Play Store™ app's downloads and rating in your repo

## Usage

1. Card

    This card displays the app title, logo, developer name, downloads, and ratings along with the total reviews.
   
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://playbadges.pavi2410.com/badge/full?id=appinventor.ai_pavitragolchha.VR&theme=dark">
      <img alt="PlayBadges Card VRCC" src="https://playbadges.pavi2410.com/badge/full?id=appinventor.ai_pavitragolchha.VR">
    </picture>

    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://playbadges.pavi2410.com/badge/full?id=me.pavi2410.folo&theme=dark">
      <img alt="PlayBadges Card Folo" src="https://playbadges.pavi2410.com/badge/full?id=me.pavi2410.folo">
    </picture>
    
    ```
    https://playbadges.pavi2410.com/badge/full?id=<YOUR APP'S PACKAGE NAME>[&theme=light|dark]
    ```

    To use with auto theming in markdown, use this snippet:

    ```md
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://playbadges.pavi2410.com/badge/full?id=<YOUR APP'S PACKAGE NAME>&theme=dark">
      <img alt="PlayBadges Card Folo" src="https://playbadges.pavi2410.com/badge/full?id=<YOUR APP'S PACKAGE NAME>">
    </picture>
    ```

3. Get downloads badge

    | config | badge |
    | --- | :---: |
    | Default | [![PlayBadges Downloads][downloads badge]][downloads badge] |
    | Pretty | [![PlayBadges Downloads Pretty][downloads badge pretty]][downloads badge pretty] |

    ```
    https://playbadges.pavi2410.com/badge/downloads?id=<YOUR APP'S PACKAGE NAME>[&pretty]
    ```

4. Get ratings badge
    
    | config | badge |
    | --- | :---: |
    | Default | [![PlayBadges Ratings][ratings badge]][ratings badge] |
    | Pretty | [![PlayBadges Ratings Pretty][ratings badge pretty]][ratings badge pretty] |

    ```
    https://playbadges.pavi2410.com/badge/ratings?id=<YOUR APP'S PACKAGE NAME>[&pretty]
    ```

5. Get version badge
    
    | config | badge |
    | --- | :---: |
    | Default | [![PlayBadges Version][version badge]][version badge] |

    ```
    https://playbadges.pavi2410.com/badge/version?id=<YOUR APP'S PACKAGE NAME>[&fallback=<FALLBACK_TEXT>]
    ```

6. Get app details as JSON
    
    Returns detailed information about the app in JSON format.
    
    ```
    https://playbadges.pavi2410.com/app/details?id=<YOUR APP'S PACKAGE NAME>
    ```
    
### Options

| Parameter | Description | Default | Example |
| --- | --- | --- | --- |
| `id` | App package name | required | `?id=com.example.app` |
| `pretty` | Shows the numbers prettily | disabled | `&pretty` |
| `fallback` | Fallback text for version badge when version is unavailable | `Varies` | `&fallback=Unknown` |
| `country` | Country code | `us` or request origin | `&country=in` |
| `theme` | Theme for the card | `light` | `&theme=dark` |
| `label` | Text to show in the badge | `Downloads`/`Ratings`/`Version` | `&label=Installs` |

## Credits

- https://github.com/vercel/satori
- https://github.com/facundoolano/google-play-scraper
- https://shields.io

## Created By
[pavi2410](https://github.com/pavi2410)

[downloads badge]: https://playbadges.pavi2410.com/badge/downloads?id=appinventor.ai_pavitragolchha.VR
[downloads badge pretty]: https://playbadges.pavi2410.com/badge/downloads?id=appinventor.ai_pavitragolchha.VR&pretty
[downloads badge style]: https://playbadges.pavi2410.com/badge/downloads?id=appinventor.ai_pavitragolchha.VR&style=for-the-badge

[ratings badge]: https://playbadges.pavi2410.com/badge/ratings?id=appinventor.ai_pavitragolchha.VR
[ratings badge pretty]: https://playbadges.pavi2410.com/badge/ratings?id=appinventor.ai_pavitragolchha.VR&pretty
[ratings badge style]: https://playbadges.pavi2410.com/badge/ratings?id=appinventor.ai_pavitragolchha.VR&style=for-the-badge

[version badge]: https://playbadges.pavi2410.com/badge/version?id=appinventor.ai_pavitragolchha.VR

[card vrcc]: https://playbadges.pavi2410.com/badge/full?id=appinventor.ai_pavitragolchha.VR
[card folo]: https://playbadges.pavi2410.com/badge/full?id=me.pavi2410.folo
