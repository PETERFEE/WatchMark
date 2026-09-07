# WatchMark Store Listing

## Product details

**Title:** WatchMark

**Summary:** Watch any webpage element and get notified when its text changes.

**Description:**

WatchMark helps you keep an eye on changing information on webpages. Mark one element, choose how often to check it, and get notified when its text changes.

Use Point and Click mode to select an element directly on a page, or use Highlight Text mode when you can select the exact text you want to watch. WatchMark can detect live page updates and reconnect to your selected element after a scheduled page refresh.

Choose a refresh interval from 30 seconds to 5 minutes in 30-second steps. When the watched value changes, WatchMark can show a Chrome notification, display an alert on the page, and send an email to your saved address.

Useful for:

- Class seat availability and registration systems
- Appointment and booking openings
- Product inventory and restock pages
- Event tickets and availability
- Status dashboards and changing public information

Your selected page URL, element path, last observed value, email address, refresh interval, and tutorial preference are stored in Chrome extension storage. The watched value and alert address are sent to the configured EmailJS service only when an email alert is delivered. See the included privacy policy for details.

WatchMark is a focused webpage monitor. It does not read or monitor every page element automatically; you choose the single element to watch.

## Recommended selections

**Category:** Productivity

**Language:** English (United States)

**Mature content:** No

**Homepage URL:** Leave blank unless you have a public WatchMark website.

**Support URL:** Leave blank unless you have a public support page. A public support page is recommended before publishing.

**Official URL:** Leave blank unless you have verified a website in Google Search Console.

## Graphic assets

**Store icon:** `icons/icon128.png`

**Screenshots:** The workspace includes five upload-ready JPEGs in `store-screenshots/`. Each is exactly 1280x800, opaque, and contains no alpha channel. Upload these files in order:

1. `watchmark-screenshot-01.jpg`: WatchMark popup with the Point and Click and Highlight Text controls.
2. `watchmark-screenshot-02.jpg`: Chrome alert showing a detected update.
3. `watchmark-screenshot-03.jpg`: A webpage with a selected element and the active monitoring panel.
4. `watchmark-screenshot-04.jpg`: WatchMark popup with an active monitor and interval slider.
5. `watchmark-screenshot-05.jpg`: Tutorial step highlighting the active monitoring panel.

**Small promo tile:** Optional. Use a 440x280 PNG/JPEG with the WatchMark logo and the words “Watch webpage changes”.

**Marquee promo tile:** Optional. Use a 1400x560 PNG/JPEG only if you have a polished wide promotional design.

## Access: test instructions

Install the uploaded package as an unpacked extension or from the draft item. Open a normal webpage such as a public class schedule, appointment page, or product page. Click the WatchMark toolbar icon and complete the tutorial. Enter an email address, save it, select an interval, then use Point and Click mode to select a visible text element. Change or reload the page content to verify the notification and email behavior.

Do not use Chrome internal pages such as `chrome://extensions` for testing.

## Before publishing

Replace the demo EmailJS `service_id`, `template_id`, and `user_id` in `background.js` with production-owned settings. Replace the placeholder support contact in `PRIVACY.md` with a real publisher support email and host that policy at a public URL. Upload `WatchMark-v1.0.0.zip` from the workspace.
