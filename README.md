# Easy Apply - Web extension

<p align="center">
<img width="655" src="./assets/icon-512.png"><br/>
</p>

## About

This extension aims to help developers in their job search by providing a convenient way to quickly assess their experience for a given position and streamline the application process.

Here's what the extension does:

1. Extracts the required experience for a job position from the job posting page and displays it to the user.
2. Allows the user to set their own experience in years on the settings page of the extension.
3. Show experience requirement in a way that the user can easily see if it is relevant to them. A red color indicates that the user does not meet the experience requirement, a green color indicates that the user meets the requirement, and an orange color indicates that the extension was unable to determine the relevance.
4. Autofill job application forms with the user's information, saving them time and effort.
5. Customization options: The user can customize the extension to their preference by specifying which information they want to be included when autofilling forms and by setting their own experience level on the settings page.


We hope these features save you time and help you in your job search.


## Installation

### Unpacked

1. Download the extension file from the releases page.
2. Open Chrome or your preferred browser and go to the extensions page (chrome://extensions for Chrome).
3. Enable developer mode by clicking the toggle in the top right corner (if using Chrome).
4. Click the "Load unpacked" button and select the extension folder.

### From Store

1. Go to the extensions store
2. Search for Easy Apply
3. Download the extension

## Configuration
The extension can be configured to use specific information for each form field. To do this, click the extension icon in the top right corner of the browser window and select "Options". From there, you can choose which information to use for each field.

## Usage

When you are on a job application page, you can click the autofill button in the popup window to fill out the form with the information you have previously provided.

When you are viewing a job listing on LinkedIn, the extension will display the experience required for the job in the popup window.

## Support

If you have any questions or issues with the extension, please file a bug report on the GitHub page. We will do our best to address any issues in a timely manner.

## Contributing

Feel free to submit PRs for small issues. For large issues or features, open an issue first.

### Option 1 - Simple Typo Fixes

For small issues, like a typo or broken link, use Github's inline file editor or web editor (open by pressing . in your fork's code tab) to make the fix and submit a pull request.

### Option 2 - Work on your own Fork

For more complex contributions, like new features, you should work on the project on your local system.

First, follow the steps in Running the project.

```shell
git checkout -b my-fix
# fix some code / add feature...

git commit -m "fix: corrected a typo"
git push origin my-fix
```

Lastly, open a pull request on GitHub.

## Technicalities

### Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `styles` - styles shared in popup and options page
  - `assets` - assets used in Vue components
  - `manifest.ts` - manifest for the extension.
- `assets` - static assets (mainly for `manifest.json`).
- `extension` - extension package root.
- `scripts` - development and bundling helper scripts.

### Development

```bash
pnpm dev
```

Then **load extension in browser with the `extension/` folder**.

For Firefox developers, you can run the following command instead:

```bash
pnpm start:firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommanded for cleaner hard reloading.

### Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `extension`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.


This repo's based on the [vitesse-webext](https://github.com/antfu/vitesse-webext) template.
