# Changelog

| Feature                                    | Version |
|--------------------------------------------|---------|
| Basic navigation                           | v0.1.0  |
| File preview/gallery                       | v0.1.0  |
| Authentication                             | v0.2.0  |
| Write operations (delete, copy, rename...) | v0.3.0  |
| Read-only mode                             | v0.3.0  |
| File upload                                | v0.4.0  |
| Folder sharing                             | v0.5.0  |

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
