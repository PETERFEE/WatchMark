# WatchMark

WatchMark watches one element on a webpage and alerts you when its text changes.

## What it can do

- Point and click an element on a webpage to monitor it.
- Highlight text, then monitor the selected area.
- Detect live updates with `MutationObserver`.
- Reload the page every 30 seconds through 5 minutes in 30-second steps.
- Send a Chrome notification, an on-page alert, and an email when the value changes.
- Restore the monitored element after a page reload.

Example uses include class seat availability, appointment openings, product stock, event tickets, and status dashboards.

## Load locally

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this folder.
4. Open a normal webpage, click the WatchMark toolbar icon, and complete the tutorial.

The extension cannot run on Chrome internal pages such as `chrome://extensions`.

## Project layout

- Runtime files stay in the repository root because Chrome loads this folder directly as an unpacked extension.
- `icons/` contains extension icons.
- `store-screenshots/` contains Chrome Web Store screenshots.
- `docs/` contains the privacy policy, store listing, and submission form.
- `scripts/package.ps1` creates a release ZIP containing only the extension runtime and icons.

## Publish checklist

- Test on representative webpages and confirm alerts arrive.
- Replace the EmailJS demo service, template, and public key in `background.js` with production-owned settings.
- Host and link a public privacy policy. The extension stores the email address and sends the watched value to EmailJS; see `PRIVACY.md`.
- Add store screenshots showing the popup, picker, and a notification.
- In the Chrome Web Store listing, disclose the `activeTab`, page content access, notifications, storage, and EmailJS network access.
- Run `pwsh -File .\scripts\package.ps1` and upload the generated ZIP from `releases/` in the Chrome Web Store developer dashboard.

See [`docs/submission/STORE_LISTING.md`](docs/submission/STORE_LISTING.md) and [`docs/submission/CHROME_WEB_STORE_PRIVACY_FORM.md`](docs/submission/CHROME_WEB_STORE_PRIVACY_FORM.md) for submission copy.

## Name ideas

- **WatchMark**: chosen name; clearly describes marking one element to watch.
- **ChangeBeacon**: emphasizes alerts for changing webpage values.
- **SignalPin**: emphasizes pinning a changing signal on a page.
- **ElementPulse**: emphasizes live element monitoring.

WatchMark is the selected name because it is short, memorable, and broad enough for seats, appointments, stock, and other use cases.
