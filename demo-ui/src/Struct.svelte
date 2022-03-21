<script lang="ts" context="module">
    /*
     * This file is part of PupCloud, Copyright (c) 2022-2078, Germano Rizzo
     *
     * PupCloud is free software: you can redistribute it and/or modify
     * it under the terms of the GNU General Public License as published by
     * the Free Software Foundation, either version 3 of the License, or
     * (at your option) any later version.
     *
     * PupCloud is distributed in the hope that it will be useful,
     * but WITHOUT ANY WARRANTY; without even the implied warranty of
     * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     * GNU General Public License for more details.
     *
     * You should have received a copy of the GNU General Public License
     * along with PupCloud.  If not, see <http://www.gnu.org/licenses/>.
     */

    import {getIcon} from "./MimeTypes.svelte";

    function sortDirs(f1: File, f2: File): number {
        const f1Dir = f1.mimeType === "directory";
        const f2Dir = f2.mimeType === "directory";
        return f1Dir == f2Dir ? 0 : f2Dir ? 1 : -1;
    }

    export class ConfigSharing {
        readonly allowRW: boolean;
        readonly profiles: string[];

        constructor(allowRW: boolean, profiles: string[]) {
            this.allowRW = allowRW;
            this.profiles = profiles;
        }
    }

    export class Config {
        readonly version: string;
        readonly title: string;
        readonly readOnly: boolean;
        readonly maxReqSize: number;
        readonly sharing: ConfigSharing;

        constructor(
            version: string,
            title: string,
            readOnly: boolean,
            maxReqSize: number,
            sharing: ConfigSharing
        ) {
            this.version = version;
            this.title = title;
            this.readOnly = readOnly;
            this.maxReqSize = maxReqSize;
            this.sharing = sharing;
        }

        static empty(): Config {
            return new Config("", "", false, -1, null);
        }

        static fromAny(obj: any): Config {
            const sharing: ConfigSharing =
                obj.sharing == null
                    ? null
                    : new ConfigSharing(obj.sharing.allowRW, obj.sharing.profiles);
            return new Config(obj.version, obj.title, obj.readOnly, obj.maxReqSize, sharing);
        }
    }

    export class File {
        readonly uuid: string;
        readonly mimeType: string;
        readonly isDir: boolean;
        readonly isRoot: boolean;
        readonly icon: string;
        readonly name: string;
        readonly path: string;
        readonly size: string;
        readonly numSize: number;
        readonly chDate: string;
        readonly numChDate: number;
        readonly owner: string;
        readonly group: string;
        readonly permissions: string;

        constructor(
            mimeType: string,
            name: string,
            size: number,
            chDate: number,
            owner: string,
            group: string,
            permissions: string,
            path: string[]
        ) {
            this.uuid = Math.random().toString().substring(2);
            this.mimeType = mimeType;
            this.isDir = mimeType == "directory";
            this.isRoot = this.isDir && this.name == "..";
            this.icon = getIcon(mimeType);
            this.name = name + (this.isDir ? "/" : "");
            this.size = formatBytes(size);
            this.numSize = size;
            this.chDate = new Date(chDate * 1000).toLocaleString();
            this.numChDate = chDate;
            this.owner = owner;
            this.group = group;
            this.permissions = permissions;
            this.path = path.join("") + this.name;

            // Adapted from
            // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
            function formatBytes(bytes: number, decimals: number = 2): string {
                if (bytes < 0) return "";
                if (bytes === 0) return "0 b";

                const k = 1024;
                const dm = decimals < 0 ? 0 : decimals;
                const sizes = ["b", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];

                const i = Math.floor(Math.log(bytes) / Math.log(k));

                return (
                    parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
                );
            }
        }

        getWS(forDl: boolean = false): string {
            return "/testFs/" + this.path;
        }
    }

    export const SORTERS: { [key: string]: (f1: File, f2: File) => number } = {
        ABC: function (f1: File, f2: File): number {
            const fromDir = sortDirs(f1, f2);
            return fromDir == 0 ? f1.name.localeCompare(f2.name) : fromDir;
        },
        CBA: function (f1: File, f2: File): number {
            const fromDir = sortDirs(f1, f2);
            return fromDir == 0 ? f2.name.localeCompare(f1.name) : fromDir;
        },
        OldFirst: function (f1: File, f2: File): number {
            const fromDir = sortDirs(f1, f2);
            return fromDir == 0 ? Math.sign(f1.numChDate - f2.numChDate) : fromDir;
        },
        OldLast: function (f1: File, f2: File): number {
            const fromDir = sortDirs(f1, f2);
            return fromDir == 0 ? Math.sign(f2.numChDate - f1.numChDate) : fromDir;
        },
        SmallFirst: function (f1: File, f2: File): number {
            const fromDir = sortDirs(f1, f2);
            return fromDir == 0 ? Math.sign(f1.numSize - f2.numSize) : fromDir;
        },
        SmallLast: function (f1: File, f2: File): number {
            const fromDir = sortDirs(f1, f2);
            return fromDir == 0 ? Math.sign(f2.numSize - f1.numSize) : fromDir;
        },
    };

    export class Mule {
        readonly items: File[] = [];
        readonly files: File[] = []; // without dirs
        constructor(items: any[], path: string[]) {
            for (let i = 0; i < items.length; i++) {
                const nf = new File(
                    items[i].mimeType,
                    items[i].name,
                    items[i].size,
                    items[i].chDate,
                    items[i].owner,
                    items[i].group,
                    items[i].permissions,
                    path
                );
                this.items.push(nf);
                if (!nf.isDir) {
                    this.files.push(nf);
                }
            }
            if (path.length > 0) {
                // Is not root
                this.items.unshift(
                    new File("directory", "..", -1, 0, "--", "--", "--", path)
                );
            }
        }

        sort(sorter: (f1: File, f2: File) => number): Mule {
            this.items.sort(sorter);
            this.files.sort(sorter);
            return this;
        }

        static empty(): Mule {
            return new Mule([], []);
        }

        static fromAny(obj: any, path: string[]): Mule {
            return new Mule(obj.items, path);
        }
    }
</script>
