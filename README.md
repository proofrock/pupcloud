## **Warning**

> *This project is suspended - for now - as I cannot follow it as it would deserve, due to... lack of time, to make it short.
> I am quite fond of it, so I really want to restart working on it again; but I cannot say when or how, unfortunately.
> Thank you all for your appreciation and the support you've shown me, it's been really nice for me working on it so far.*
>
> *Of course, feel free to fork it as you like; and if I can be of any help on understanding the code, ask away!*

# 🐶 Pupcloud v0.8.0

Put your files on the browser!

_[Documentation](https://germ.gitbook.io/pupcloud/) - [Demo](https://pupcloud.vercel.app/) - [Roadmap](https://github.com/proofrock/pupcloud/wiki/Roadmap)_

Point pupcloud to a local folder and instantly get its contents exposed as a web application. Browse, manage, share
files... in a truly portable way!

Pupcloud doesn't need a database, [a config file](https://github.com/proofrock/pupcloud/discussions/26), nor it leaves
.dotfiles on the filesystem; it is packaged as a single executable file (written in Go+Svelte+Typescript), so you'll
just need to [download](https://germ.gitbook.io/pupcloud/guides/installation-and-building)
and [run](https://germ.gitbook.io/pupcloud/guides/running-pupcloud) it.

It is an exercise in minimalism: it aims to be as simple as possible, while retaining all the features you would like it
to have. Just run it! It has everything that fits in a pup-sized cloud ;-)

If you are curious, go see the [Demo](https://pupcloud.vercel.app/)!

## Features

- [Web interface](https://germ.gitbook.io/pupcloud/guides/basic-usage) that scales well on mobile;
- Nothing is saved on disk (no database, no .dotfiles...);
- [Authentication](https://germ.gitbook.io/pupcloud/guides/authentication) (also see [below](#auth));
- [Read-only mode](https://germ.gitbook.io/pupcloud/guides/running-pupcloud) for avoiding fs writes;
- [File previews](https://germ.gitbook.io/pupcloud/guides/basic-usage#preview-screen);
- (Revokable) [folder sharing](https://germ.gitbook.io/pupcloud/guides/sharing-a-folder), on a separate URL (also
  see [below](#sharing)):
- "[Branding](https://germ.gitbook.io/pupcloud/guides/running-pupcloud)" (you can specify the title of the app screen).

It doesn't include HTTPS, as this can be done easily (and much more securely) with
a [reverse proxy](https://germ.gitbook.io/pupcloud/guides/reverse-proxy).

See the [ROADMAP](ROADMAP.md) file for a glimpse of what's in store!

## Basic usage

Pupcloud is distributed as a single executable file. Download and unpack the proper file for your OS/arch.

Once done, just execute it with the directory to serve as an argument:

```bash
pupcloud -r /my/dir
```

Then, open `http://localhost:17178` with a browser. As simple as that!

Run `pupcloud --help` to see the other [config options](https://germ.gitbook.io/pupcloud/guides/running-pupcloud). You
can also:

- enable "write" operations (delete/cut/paste/upload...; `-E` or `--allow-edits`);
- setup [authentication](#auth) (`-P`/`-H`);
- setup [folder sharing](#sharing) (`--share-profile`, `--share-port`, `--share-prefix`)
- specify a title/brand for the window (`--title`);
- use a different port then the default of 17178 (`-p`);
- bind to a network interface (`--bind-to`);
- instruct pupcloud to follow symlinks (`--follow-symlinks`);
- specify a maximum size for upload, in Megabytes (`--max-upload-size`).

By default, it's forbidden to run it as root. Use `--allow-root` if you (really) want to.

### Supported file types for viewing

In the file system view, you can click on a file to open it. Currently pupcloud supports:

- Images, Audio, Video (when supported by the browser)
- PDF documents (for desktop browsers)
- Text-like files (txt, html, sources...)

Detection of file types is done by mime type, and viewing relies on the browser's capabilities.

## <a name="auth"></a>Authentication

You can set a password for accessing pupcloud, by using the `-P` or `-H` parameter on the commandline.

Using `-P`, you can specify the password in plain text. There is a more secure option, `-H`, using which you must
provide the SHA-256 sum of the password you want to use, in (lowercase) hex format.

You can provide the whole hash, or just the first part, of any length you want to keep the commandline short. Of course,
the longer the hash, the safer the system.

```bash
# Password is "ciao", with 128 bit of strength (truncated at 16 bytes)
pupcloud -r /my/dir -P b133a0c0e9bee3be20163d2ad31d6248
```

You can use [this site](https://emn178.github.io/online-tools/sha256.html) to hash the password, it doesn't send the
password on the net (at least at the time I am writing, you may want to check).

**BEWARE**: The password is sent in clear text over the net,
so *[always use a HTTPS-capable reverse proxy](https://germ.gitbook.io/pupcloud/guides/reverse-proxy)* if you plan to
serve over the public internet.

## <a name="sharing"></a>Folder sharing

Sharing a folder is possible. Pupcloud will launch a separate server, on another port, to allow to remap it on a reverse
proxy.

In order to set up a share, one or more *profiles* must be specified. Each profile is in the form *name*:*secret*, where
the secret must not be shared with the recipient, and it's used to protect the confidentiality of the share.

In the Web interface, the sharing URL can be obtained using the "share" button, and specifying:

- the profile;
- a password (optional);
- an expiry date (optional);
- if the share must be read-only.

The share can be "revoked" by relaunching pupcloud without a particular profile, or changing the secret of a profile.
All the links tied to that profile will be invalidated. Also, if the main app is launched as read-only, all its share
links will be read-only.

Relevant CLI parameters are:

- `--share-profile`: a share profile, in the form *name*:*secret* (e.g. `Family:abc0123`). Can be repeated for more
  profiles.
- `--share-port`: the port for the share server; by default `17179`;
- `--share-prefix`: useful when using a reverse proxy, it's the base URL of the share link. By
  default, `http://localhost:17179`.

Sharing is enabled if at least one profile is defined.

## Docker

Official docker image available. See [DockerHub's page](https://hub.docker.com/r/germanorizzo/pupcloud) for
instructions.

## Known bugs

- In rare cases, MIME type detection is wrong. It relies on Go builtin functions, so it needs to be investigated more.
- On mobile, some glitches may be present. Please report them in the issue tracker!
- In general, pupcloud is not (yet) mature and well
  audited. [Take appropriate measures](https://app.gitbook.com/s/BIkxAX0ktzzPPM6PIcMj/security) if you want to publish
  it over the public internet!

## Credits

Kindly supported by [JetBrains for Open Source development](https://jb.gg/OpenSourceSupport).

#### Server

- [fiber](https://gofiber.io/) [MIT]
- otiai10's [copy](https://github.com/otiai10/copy) [MIT]
- spf13's [pflag](https://github.com/spf13/pflag) [BSD 3-Clause]

#### Web UI

- [axentix](https://useaxentix.com/) [MIT]
- [hammer.js](https://github.com/hammerjs/hammer.js) [MIT]
- [Material Design Icons](https://materialdesignicons.com/) [Pictogrammers Free]
- [svelte](https://svelte.dev/) [MIT]
- [SweetAlert2](https://github.com/sweetalert2/sweetalert2) [MIT]
- yeyushengfan258's
  [Win10Sur-icon-theme](https://github.com/yeyushengfan258/Win10Sur-icon-theme) [GPLv3]

#### Languages

- [Go](https://go.dev)
- [Typescript](https://www.typescriptlang.org)
