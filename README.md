# dexy
Desktop application that allows you to see glucose numbers through Dexcom.

> [!WARNING]
> `dexy` is most definitely still a **work in progress**. If you notice a bug, please open an issue or PR. We are not affiliated with Dexcom in any way.

## About
`dexy` is a desktop application that allows you to see your numbers via Dexcom, given your username and password. Dexcom Share must be enabled for `dexy` to work properly. Nothing is sent to a remote server and absolutely everything is ran locally. Under the hood, [`dexrs`](https://github.com/makors/dexrs) is used.

Features:
- A nice UI with color-coded glucose numbers
- Built in Rust so it's fast (but the website is JS, so not really)
- Your data isn't sold to a big tech company

If you have an issue or even just a feature suggestion, feel free to contact me.

## Installation
- Clone this repository with Bun and Rust installed
- In one terminal window, run `bun tauri dev`
- In another terminal window, run `bun dev` to start the NextJS server
- Wait for the app to compile and then you'll have a `dexy` instance!

## Contributing
If you wish to contribute improvements, bug fixes, or even new features, feel free to open a PR. *Everyone* is welcome to contribute.

## License
Everything is licensed under MIT. See [LICENSE](https://github.com/makors/dexy/tree/main/LICENSE) for more.