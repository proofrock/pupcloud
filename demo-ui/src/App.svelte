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

    import {Config, File, Mule, SORTERS} from "./Struct.svelte";
    import Slideshow from "./Preview/Slideshow.svelte";
    import FileManager from "./FileManager/FileManager.svelte";

    export let config: Config;

    $: mule = Mule.empty();

    $: path = [];
    $: slideshowIndex = -1;

    $: sorter = SORTERS.ABC;
    $: mode = "GRID";

    $: {
        loadPath(path);
    }

    $: {
        mule = mule.sort(sorter);
    }

    async function loadPath(path: string[]) {
        mule = Mule.fromAny(
            await (await fetch("/mocks/ls" + path.length + ".json")).json(),
            path
        ).sort(sorter);
    }

    function openSlideshow(event) {
        slideshowIndex = mule.files.findIndex(
            (i: File) => i.uuid == event.detail.uuid
        );
    }

    function chPath(event) {
        path = event.detail.path;
    }

    function closeSlideshow() {
        slideshowIndex = -1;
    }

    function reload() {
        loadPath(path);
    }
</script>

<svelte:head>
    <title>Pupcloud {config.version}</title>
</svelte:head>
<main>
    {#if slideshowIndex < 0}
        <nav class="navbar blue dark-2">
            <p class="navbar-brand">{config.title}</p>
        </nav>
        <FileManager {path} {config} bind:mule bind:sorter bind:mode on:pathEvent={chPath} on:message={openSlideshow}
                     on:reload={reload}/>
        <footer class="footer blue dark-2 font-s1 lh-1 hide-sm-down"
                style="position:fixed; bottom:0; z-index:798;"><span>
          <a class="pup-a" target="_blank" href="https://github.com/proofrock/pupcloud/">Pupcloud</a>
            {config.version} - Made with <a class="pup-a" target="_blank" href="https://gofiber.io/">Fiber</a>,
          <a class="pup-a" target="_blank" href="https://useaxentix.com/">Axentix</a>,
          <a class="pup-a" target="_blank" href="https://svelte.dev/">Svelte</a>,
          <a class="pup-a" target="_blank" href="https://go.dev/">Go</a> and ❤️
        </span></footer>
    {:else}
        <Slideshow files={mule.files} fileIdx={slideshowIndex} on:message={closeSlideshow}/>
    {/if}
</main>
