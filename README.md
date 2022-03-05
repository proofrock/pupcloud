# 🐶 Pupcloud v0.2.0

Put your files on the web!

Point pupcloud to a local folder and instantly get its contents exposed as a web
application. Browse, manage, share files... _without a database_!

Pupcloud aims to be as simple as possible, while retaining all the features you
would like it to have. It doesn't need a database, or a particular installation
procedure. Just execute it and be done. In due time, it will have:

- File sharing;
- File operations (delete/copy/move...);
- Everything that fits in a pup-sized cloud ;-)

[Demo here](https://pupcloud-8a4ymrr0t-me-germanorizzo.vercel.app/)

## Basic usage

Pupcloud is distributed as a single executable file. Download and unpack the
proper file for your OS/arch.

Once done, just execute it with the directory to serve as an argument:

```bash
pupcloud -r /my/dir
```

Then, open `http://localhost:17178` with a browser. As simple as that!

Execute `pupcloud -h` to see the other configuration options. For now you can:

- disable all the write operations (`--readonly`);
- setup authentication (see [below](#auth));
- specify a title/brand for the window (`--title`);
- use a different port (`-p`);
- bind to a network interface (`--bind-to`).

### Supported file types for viewing

In the file system view, you can click on a file to open it. Currently pupcloud
supports:

- Images
- Audio
- Video
- PDF documents (for desktop browsers)
- Text-like files (txt, html, sources...)

Detection of file types is done by mime type, and viewing relies on the
browser's capabilities... that are fairly complete, truth to be told.

## <a name="auth"></a>Authentication

You can set a password for accessing pupcloud, by using the `-P` parameter on
the commandline. You must provide the SHA-256 sum of the password you want to
use, in hex format.

You can provide the whole hash, or just the first part, of any length you want
to keep the commandline short. Of course, the longer the hash, the safer the
system.

```bash
# Password is "ciao", with 128 bit of strength (truncated at 16 bytes)
pupcloud -r /my/dir -P b133a0c0e9bee3be20163d2ad31d6248
```

You can use [this site](https://emn178.github.io/online-tools/sha256.html) to
hash the password, it doesn't send the password on the net (at least at the time
I am writing ).

## Roadmap

| Feature                                    | Status | Version |
| ------------------------------------------ | ------ | ------- |
| Basic navigation                           | ✔️     | v0.1.0  |
| File preview/gallery                       | ✔️     | v0.1.0  |
| Authentication                             | ✔️     | v0.2.0  |
| Write operations (delete, copy, rename...) | ✔️     | v0.3.0  |
| Read-only mode                             | ✔️     | v0.3.0  |
| File upload                                | ❌     |         |
| File sharing                               | ❌     |         |
| Special file modes (permissions, links...) | ❌     |         |
| Mobile tweaks (swipe, ...)                 | ❌     |         |
| Internationalization                       | ❌     |         |
| Separate password for Read-Write           | ❌     |         |

## Docker

See [DockerHub's page](https://hub.docker.com/r/germanorizzo/pupcloud) for
instructions.

## Known bugs

- In rare cases, MIME type detection is wrong. It relies on Go builtin
  functions, so it needs to be investigated more.

## Credits

Server:

- [fiber](https://gofiber.io/) [MIT]
- otiai10's [copy](https://github.com/otiai10/copy) [MIT]
- spf13's [pflag](https://github.com/spf13/pflag) [BSD 3-Clause]

Web UI:

- [axentix](https://useaxentix.com/) [MIT]
- [Material Design Icons](https://materialdesignicons.com/) [Pictogrammers Free]
- [svelte](https://svelte.dev/) [MIT]
- [SweetAlert2](https://github.com/sweetalert2/sweetalert2) [MIT] License]
- yeyushengfan258's
  [Win10Sur-icon-theme](https://github.com/yeyushengfan258/Win10Sur-icon-theme)
  [GPLv3]

...and Go, Typescript, VSCode via CodeServer.
