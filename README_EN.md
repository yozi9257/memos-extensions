# memos-extensions

<p align="center">
 [<a href="https://github.com/yozi9257/memos-extensions/blob/main/README_EN.md">English</a>]  [<a href="https://github.com/yozi9257/memos-extensions/blob/main/README.md">简体中文</a>] 
</p>

A browser extension for [memos](https://github.com/usememos/memos), designed to help you use the memos service more conveniently.

This extension is developed based on the [memos-bber](https://github.com/lmm214/memos-bber) project and rewritten with React + TypeScript to improve code maintainability and scalability.

### Features

*   One-click send text, links, and images to your memos service without switching pages.
*   Support quick sharing via right-click menu, covering multiple scenarios:
    
    *   Send selected text on the page
    *   Send the link of the current browsing page
    *   Send images from the page
*   Built-in editor with rich features:
    
    *   Natively supports Markdown syntax
    *   Quick insertion of to-do items (Todo)
    *   One-click addition of the current page link
    *   Supports file and image uploads; pasted images trigger automatic uploads
*   Flexible content visibility settings, including three permissions: Visible only to you, Visible to logged-in users, Visible to everyone.
*   Built-in multi-language support, including Chinese and English by default.

### Installation

1.  Visit the project's [Releases page](https://github.com/yozi9257/memos-extensions/releases) and download the latest version of the extension package.
2.  Open the browser extension management page (Chrome/Edge browser address: `chrome://extensions/`).
3.  Enable "Developer mode" in the upper right corner of the page.
4.  Drag and drop the downloaded extension package to the extensions page to complete the installation.

### Usage

1.  After installation, click the "memos" icon in the browser toolbar to open the extension panel.
2.  Go to the settings page and fill in your memos service URL and access token:
    
    *   Access token acquisition path: Memos platform → Personal Settings → My Account → Access Tokens → Create Token.
3.  After configuration, you can directly create and publish new memos in the extension editor.
4.  When browsing web pages, you can quickly share content to memos via the right-click menu.

### License

This project is open-source under the **MIT License**. For detailed license terms, please refer to the [LICENSE](LICENSE) file.

