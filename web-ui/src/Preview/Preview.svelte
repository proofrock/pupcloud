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

    import Slideshow from "./Slideshow.svelte";
    import FullScreen from "./FullScreen.svelte";
    import FullSize from "./FullSize.svelte";
    import {isMimeTypeImage} from "../MimeTypes.svelte";

    export let files: File[];
    export let fileIdx: number;

    $: mode = 0; // 0=slideshow; 1=fullscreen; 2=full size

    let lastChange: number = 0;
    $: {
        fileIdx; // swipe* adds a click at the end. This is to avoid it
        mode; // also let's avoid double clicks
        lastChange = Date.now();
    }

    function doStepMode() {
        if (Date.now() - lastChange > 200)
            mode = (mode + 1) % 3;
    }
</script>

{#if mode == 0}
    <Slideshow {files} bind:fileIdx={fileIdx} on:stepMode={doStepMode} on:closePreview/>
{:else if mode == 1}
    <FullScreen {files} bind:fileIdx={fileIdx} on:stepMode={doStepMode}/>
{:else}
    <FullSize file={files[fileIdx]} on:stepMode={doStepMode}/>
{/if}
