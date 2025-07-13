# PlayBadges ![][stats badge]

Show off your Play Store™ app's downloads and rating in your repo

## Usage

1. Card

    This card displays the app title, logo, developer name, downloads, and ratings along with the total reviews.
    
    [![PlayBadges Card VRCC][card vrcc]][card vrcc]
    
    [![PlayBadges Card Folo][card folo]][card folo]

    ```
    https://playbadges.pavi2410.me/badge/full?id=<YOUR APP'S PACKAGE NAME>
    ```

2. Get downloads badge

    | config | badge |
    | --- | :---: |
    | Default | [![PlayBadges Downloads][downloads badge]][downloads badge] |
    | Pretty | [![PlayBadges Downloads Pretty][downloads badge pretty]][downloads badge pretty] |

    ```
    https://playbadges.pavi2410.me/badge/downloads?id=<YOUR APP'S PACKAGE NAME>[&pretty]
    ```

3. Get ratings badge
    
    | config | badge |
    | --- | :---: |
    | Default | [![PlayBadges Ratings][ratings badge]][ratings badge] |
    | Pretty | [![PlayBadges Ratings Pretty][ratings badge pretty]][ratings badge pretty] |

    ```
    https://playbadges.pavi2410.me/badge/ratings?id=<YOUR APP'S PACKAGE NAME>[&pretty]
    ```
    
### Options

| Parameter | Description | Default | Example |
| --- | --- | --- | --- |
| `pretty` | Shows the numbers prettily | disabled | `?id=com.app&pretty` |
| `country` | Country code | `us` or request origin | `?id=com.app&country=in` |

## Credits

- https://github.com/vercel/satori
- https://github.com/facundoolano/google-play-scraper
- https://shields.io

## Created By
[pavi2410](https://github.com/pavi2410)

[downloads badge]: https://playbadges.pavi2410.me/badge/downloads?id=appinventor.ai_pavitragolchha.VR
[downloads badge pretty]: https://playbadges.pavi2410.me/badge/downloads?id=appinventor.ai_pavitragolchha.VR&pretty
[downloads badge style]: https://playbadges.pavi2410.me/badge/downloads?id=appinventor.ai_pavitragolchha.VR&style=for-the-badge

[ratings badge]: https://playbadges.pavi2410.me/badge/ratings?id=appinventor.ai_pavitragolchha.VR
[ratings badge pretty]: https://playbadges.pavi2410.me/badge/ratings?id=appinventor.ai_pavitragolchha.VR&pretty
[ratings badge style]: https://playbadges.pavi2410.me/badge/ratings?id=appinventor.ai_pavitragolchha.VR&style=for-the-badge

[card vrcc]: https://playbadges.pavi2410.me/badge/full?id=appinventor.ai_pavitragolchha.VR
[card folo]: https://playbadges.pavi2410.me/badge/full?id=me.pavi2410.folo

[stats badge]: https://playbadges.pavi2410.me/stats
