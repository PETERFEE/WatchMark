# Chrome Web Store Privacy Form: WatchMark

Copy the answers below into the Chrome Web Store Developer Dashboard.

## Single purpose description

WatchMark has one purpose: let users select one element on a webpage and receive an alert when that element's text changes. Users can monitor class seat availability, appointment openings, product stock, event tickets, or other changing webpage status information. The extension provides Point and Click and Highlight Text selection, checks the selected element for live changes, reloads the page on the user's chosen interval, and sends an alert when the value changes.

## Permission justifications

### activeTab

WatchMark uses `activeTab` to access the webpage the user is actively viewing after the user chooses a monitoring action. This lets the user select one webpage element with Point and Click or Highlight Text mode without requesting permanent access to every tab.

### scripting

WatchMark uses `scripting` to support its webpage element picker and text monitor on the active webpage. The script highlights elements while the user chooses one, observes the selected element for text changes, restores it after a page reload, and displays the on-page update alert.

### notifications

WatchMark uses `notifications` to show a Chrome desktop notification when the text of the user-selected webpage element changes. The notification tells the user that the monitored value changed.

### storage

WatchMark uses `storage` to save the user's alert email address, monitoring URL, selected CSS path, last observed value, refresh interval, tutorial completion state, and monitoring state. This allows monitoring to continue after a page refresh and preserves the user's settings.

### Host permission: https://api.emailjs.com/*

WatchMark uses this host only to send the user's requested email alert through the configured EmailJS email-delivery endpoint. The request contains the user's saved alert email address and the new text value from the selected webpage element. No webpage data is sent unless the user has started monitoring and the selected value changes.

### Content script host access: <all_urls>

WatchMark's content script is declared for webpages so the user can monitor an element on the webpage they choose. The script does not automatically collect all webpage content. It acts only after the user starts a monitoring mode and uses the selected element's text, URL, and CSS path to perform the requested monitoring function.

## Remote code

Select: **No, I am not using Remote code**

No justification is required. All JavaScript used by WatchMark is included in the extension package. EmailJS is accessed through a network API request; the extension does not download or execute remote JavaScript.

## Data usage selections

Select these categories:

- **Personally identifiable information**: The user may enter an email address for alerts.
- **Website content**: WatchMark reads and stores the text of the specific webpage element selected by the user. The changed value may be sent to EmailJS to deliver the requested alert email.
- **Web history**: WatchMark stores the URL of the webpage selected for monitoring so it can restore monitoring after a page reload.

Do not select these categories unless the implementation changes:

- Health information
- Financial and payment information
- Authentication information
- Personal communications
- Location
- User activity

## Required certifications

Check all three certification boxes:

- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

## Privacy policy URL

Use the public GitHub Pages URL for the privacy-policy file after publishing it:

`https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/privacy-policy.html`

Replace `YOUR-GITHUB-USERNAME` and `YOUR-REPOSITORY` with your actual GitHub details. The policy must be publicly accessible without signing in.

## Important accuracy check before submission

Replace the EmailJS demo credentials in `background.js` with production-owned credentials and make sure the privacy policy identifies the real publisher support contact. The form and public policy must describe the production configuration that reviewers will test.
