# PlayBadges ![][stats badge]

Show off your Play Store™ app's downloads and rating in your repo

## Usage

1. Card

    This card displays the app title, logo, developer name, downloads, and ratings along with the total reviews.
    
    ![card][card]

    ```
    https://PlayBadges.pavi2410.me/badge/full?id=<YOUR APP'S PACKAGE NAME>
    ```

2. Get downloads badge

    | config | badge |
    | --- | :---: |
    | Default | ![Downloads badge][downloads badge] |
    | Pretty | ![Downloads badge pretty][downloads badge pretty] |

    ```
    https://PlayBadges.pavi2410.me/badge/downloads?id=<YOUR APP'S PACKAGE NAME>[&pretty]
    ```

3. Get ratings badge
    
    | config | badge |
    | --- | :---: |
    | Default | ![Ratings badge][ratings badge] |
    | Pretty | ![Ratings badge pretty][ratings badge pretty] |

    ```
    https://PlayBadges.pavi2410.me/badge/ratings?id=<YOUR APP'S PACKAGE NAME>[&pretty]
    ```
    
### Options

- `pretty`: Shows the numbers prettily (default = disabled; add the flag to enable, remove to disable)
- `country`: Country code (default = `us` or wherever the request is coming from)

## Credits

- https://github.com/vercel/satori
- https://github.com/facundoolano/google-play-scraper
- https://shields.io

## Created By
[pavi2410](https://github.com/pavi2410)

[downloads badge]: https://PlayBadges.pavi2410.me/badge/downloads?id=appinventor.ai_pavitragolchha.VR
[downloads badge pretty]: https://PlayBadges.pavi2410.me/badge/downloads?id=appinventor.ai_pavitragolchha.VR&pretty
[downloads badge style]: https://PlayBadges.pavi2410.me/badge/downloads?id=appinventor.ai_pavitragolchha.VR&style=for-the-badge

[ratings badge]: https://PlayBadges.pavi2410.me/badge/ratings?id=appinventor.ai_pavitragolchha.VR
[ratings badge pretty]: https://PlayBadges.pavi2410.me/badge/ratings?id=appinventor.ai_pavitragolchha.VR&pretty
[ratings badge style]: https://PlayBadges.pavi2410.me/badge/ratings?id=appinventor.ai_pavitragolchha.VR&style=for-the-badge

[card]: https://PlayBadges.pavi2410.me/badge/full?id=appinventor.ai_pavitragolchha.VR

[stats badge]: https://PlayBadges.pavi2410.me/stats
