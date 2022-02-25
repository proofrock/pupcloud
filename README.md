# 🐶 Pupcloud v0.0.1

Put your files on the web!

Point pupcloud to a local folder and instantly get its contents exposed as a web
application. Browse, manage, share files... _without a database_!

Pupcloud aims to be as simple as possible, while retaining all the features you
would like it to have. It doesn't need a database, or a particular installation
procedure. Just execute it and be done. In due time, it will have:

- Authentication;
- File sharing;
- File operations (delete/copy/move...);
- Everything that fits in a pup-sized cloud ;-)

## Basic usage

Pupcloud is distributed as a single executable file. Download and unpack the
proper file for your OS/arch.

Once done, just execute it with the directory to serve as an argument:

```bash
pupcloud -r /my/dir
```

Then, open `http://localhost:17178` with a browser. As simple as that!

Execute `pupcloud -h` to see the other configuration options. For now you can:

- specify a title/brand for the window;
- specify a different port;
- bind to a network interface.

## Supported file types for viewing

In the file system view, you can click on a file to open it. Currently it
supports:

- Images
- Audio
- Video
- PDF documents
- Text-like files (txt, html, sources...)

Detection of file types is done by mime type, and viewing relies on the
browser's capabilities... that are fairly complete, truth to be told.

## Changelog

### v0.0.1

- First version;
- Navigation, preview, download of files.

## Credits

Server:

- [fiber](https://gofiber.io/) [MIT]
- spf13's [pflag](https://github.com/spf13/pflag) [BSD 3-Clause]

Web UI:

- [svelte](https://svelte.dev/) [MIT]
- [axentix](https://useaxentix.com/) [MIT]
- [Material Design Icons](https://materialdesignicons.com/) [Pictogrammers Free
  License]
- yeyushengfan258's
  [Win10Sur-icon-theme](https://github.com/yeyushengfan258/Win10Sur-icon-theme)
  [GPLv3]

...and Go, Typescript, VSCode!
