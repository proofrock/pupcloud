# Changelog

## Main features history

| Feature                                    | Version |
|--------------------------------------------|---------|
| Basic navigation                           | v0.1.x  |
| File preview/gallery                       | v0.1.x  |
| Authentication                             | v0.2.x  |
| Write operations (delete, copy, rename...) | v0.3.x  |
| Read-only mode                             | v0.3.x  |
| File upload                                | v0.4.x  |
| Folder sharing                             | v0.5.x  |
| Follow symlinks                            | v0.6.x  |

## v0.8.0

- Every CLI parameter can be specified as an env variable [addresses #10]
- Added parameter `--share-profiles` to specify profiles as comma-separated [addresses #14]

## v0.7.2

- [#1] Support for browser's back/forward buttons navigation
- [#11] Webservices allows paths with '..'
- Docker cross-compiling for amd64, arm, arm64 and multiplatform manifest

## v0.7.1

- [#2] Can't enter directory made by pupcloud
- [#4] When cd to a dir fails, dir name gets appended to the breadcrumb "forever"
- [#5] Provide systemd example/docs (in proofrock/pupcloud-docs)
- [#6] More functional footer
- [#7] Click on title to go to root
- [#8] Listview's whole row should be clickable
- [#9] Listviews' columns should be clickable to change sorting
- Library upgrades

## v0.7.0

- Plain-text password for auth (`-P`)
  - breaking change: old `-P` is now `-H` (for hashed password)
- Shorter sharing links and better detection of failures (root changes after sharing, ...)
  - breaking change: you'll need to re-generate any sharing link you had from previous versions
- Cross-compilation support (removed CGO dependency)
- Manual mimetype resolution for problematic files

## v0.6.4

- IPV6 support
- "splash footer" disappears after 1,5s

## v0.6.1 - 0.6.3

- fixes
- library updates

## v0.6.0

- Ability to follow symbolic links (`--follow-symlinks`)
- Preview now switches between slideshow, full-screen and full size
- Swipe support in slideshow screen, on mobile
- It's now forbidden to run as root (unless `--allow-root`)
- Logout (if password is required)
- Session invalidation when preconditions fail after login (root deletion, expiration...)
- Go 1.18
- Minor fixes and improvements

## v0.5.0

- Folder sharing
- UserID/GroupID support in docker
- Ability to specify max upload size on the CLI
- Many fixes, refactorings and performance improvements

## v0.4.2

- Fixed z-indexes
- Improved performances when listing a huge number of items
- Upgrade to libs

## v0.4.1

- Fix: paste didn't work
- Reload button

## v0.4.0

- File upload
- CSRF protection

## v0.3.0

- "Write" operations
 - Cut/Copy/Paste
 - Delete
 - Rename
 - Create Folder
- Read-only mode (`--readonly`)
- Support for Windows
- Minor UI fixes

## v0.2.0

- Authentication (`-P`);
- Updates to library (particularly Axentix and Fiber);
- Workaround for dropdown triggers (`...`) being rendered over the dropdown
  itself.

## v0.1.2

- Fixes to HTML layout.

## v0.1.1

- Stable demo site;
- Fixes to Dockerfile.

## v0.1.0

- First version;
- Navigation, preview, download of files.
