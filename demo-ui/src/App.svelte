<script lang="ts">
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

    // https://stackoverflow.com/questions/56483209/import-css-in-node-modules-to-svelte
    import "../node_modules/axentix/dist/axentix.min.css";
    import "./global.css";

    import {onMount} from "svelte";
    import {fade} from 'svelte/transition';
    import {Config, File, Mule, SORTERS} from "./Struct.svelte";
    import Preview from "./Preview/Preview.svelte";
    import FileManager from "./FileManager/FileManager.svelte";

    export let config: Config;

    let hashPathWasSetByMe: boolean = true;

    $: mule = Mule.empty();

    $: path = [];
    $: slideshowIndex = -1;

    $: sorter = SORTERS.ABC;
    $: mode = "GRID";

    $: footer = null;
    let footers = [];
    let footerHandler = -1;

    $: {
        mule = mule.sort(sorter);
    }

    function addFooter(obj: any) {
        function nxtFooter() {
            footer = footers.shift();
            if (!footer) {
                footerHandler = -1;
            } else {
                footerHandler = setTimeout(nxtFooter, 2000);
            }
        }

        if (footerHandler < 0) {
            footer = obj;
            footerHandler = setTimeout(nxtFooter, 2000);
        } else {
            footers.push(obj);
        }
    }

    function hash2path(): string[] {
        return decodeURIComponent(window.location.hash.substring(1))
            .replace(/^\/+/, '').replace(/\/+$/, '') // removes trailing and leading '/'
            .split("/") // splits over '/'
            .filter((el) => el != "" && el != null);
    }

    function setPathAsHash() {
        const nuHash = '#' + encodeURIComponent('/' + path.join('/').replace(/\/+$/, '').replaceAll(/\/+/g, '\/'));
        if (nuHash != window.location.hash) {
            hashPathWasSetByMe = true;
            window.location.hash = nuHash;
        }
    }

    onMount(() => {
        addFooter({
            color: "blue dark-2",
            html: `<span>
          🐶 <a class="pup-a" target="_blank" href="https://github.com/proofrock/pupcloud/">Pupcloud</a>
                ${config.version} -
            <a class="pup-a" href="https://germ.gitbook.io/pupcloud/">Documentation</a> -
            <a class="pup-a" href="https://github.com/proofrock/pupcloud">Github Page</a> -
            <a class="pup-a" href="https://pupcloud.vercel.app/">Demo site</a>
        </span>`
        });

        if (config.readOnly) {
            addFooter({
                color: "yellow",
                html: "<span>🐶 Pupcloud is in <b>read only</b> mode.</span>"
            });
        }

        loadPath(hash2path());
    });

    async function loadPath(nuPath: string[]) {
        const res: Response = await fetch("mocks/ls" + nuPath.length + ".json");
        if (res.status != 200) {
            addFooter({
                color: "red",
                html: "<span><b>ERROR</b> In changing dir: " + await res.text() + "</span>"
            });
        } else {
            mule = Mule.fromAny(await res.json(), nuPath).sort(sorter);
            path = nuPath;
            setPathAsHash();
        }
    }

    window.addEventListener('hashchange', () => {
        if (hashPathWasSetByMe)
            hashPathWasSetByMe = false;
        else
            loadPath(hash2path());
    }, false);

    function openSlideshow(event) {
        slideshowIndex = mule.files.findIndex(
            (i: File) => i.uuid == event.detail.uuid
        );
    }

    function chPath(event) {
        loadPath(event.detail.path);
    }

    function closeSlideshow() {
        slideshowIndex = -1;
    }

    function reload() {
        loadPath(path);
    }

    function goToRoot() {
        loadPath([]);
    }

    function composeTitle(_title, _path) {
        return _title.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '').trim()
            + " - /"
            + _path.join("/").replaceAll("//", "/");
    }
</script>

<svelte:head>
    <title>{composeTitle(config.title, path)}</title>
</svelte:head>
<main>
    {#if slideshowIndex < 0}
        <nav class="navbar blue dark-2">
            <p class="navbar-brand cursor-pointer" on:click={goToRoot}>{config.title}</p>
        </nav>
        <FileManager bind:path {config} bind:mule bind:sorter bind:mode on:pathEvent={chPath}
                     on:openItem={openSlideshow}
                     on:reload={reload} on:logout/>
        {#if !!footer}
            <footer class="footer font-s1 lh-1 {footer.color}" out:fade>{@html footer.html}</footer>
        {/if}
    {:else}
        <Preview files={mule.files} fileIdx={slideshowIndex} on:closePreview={closeSlideshow}/>
    {/if}
</main>
