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

    import {onMount, onDestroy, createEventDispatcher} from "svelte";
    import {fade} from "svelte/transition";
    import type {File} from "../Struct.svelte";
    import {
        isMimeTypeText,
        isMimeTypeImage,
        isMimeTypeSupported,
        isMimeTypeVideo,
        isMimeTypeAudio,
        isMimeTypePDF,
    } from "../MimeTypes.svelte";
    import TextShower from "../Snippets/TextShower.svelte";
    import IconDownload from "../SVG/IconDownload.svelte";

    export let files: File[] = [];
    export let fileIdx: number = 0;

    $: fullscreen = false;

    const dispatch = createEventDispatcher();

    onMount(() => {
        document.addEventListener('keydown', handleKeyboardEvent);
    });

    onDestroy(() => {
        document.removeEventListener('keydown', handleKeyboardEvent);

    });

    // adapted from https://siongui.github.io/2012/06/25/javascript-keyboard-event-arrow-key-example/
    function handleKeyboardEvent(evt) {
        const keycode = evt.keyCode || evt.which;
        const info = document.getElementById("info");
        switch (keycode) {
            case 37: // Left
                prev();
                break;
            case 38: // Up
                fileIdx = 0;
                break;
            case 39: // Right
                next();
                break;
            case 40: // Down
                fileIdx = files.length - 1;
                break;
        }
    }

    function close(e: Event) {
        dispatch("message", {});
    }

    function getWS(f: File, forDl: boolean = false): string {
        return "/testFs/" + f.path;
    }

    function openFullscreen() {
        fullscreen = true;
    }

    async function closeFullscreen() {
        fullscreen = false;
    }

    function next() {
        if (++fileIdx == files.length) fileIdx = 0;
    }

    function prev() {
        if (fileIdx-- == 0) fileIdx = files.length - 1;
    }
</script>

<style>
    /* 'X' to close slideshow and fullscreen */
    .x-top-right {
        position: fixed;
        right: 8px;
        top: 8px;
    }

    .x-top-right::before {
        color: white;
        content: "×";
        font-size: 32px;
    }

    .centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .centered-maxscreen {
        max-width: 100%;
        max-height: 100%;
    }

    .download {
        color: white;
        text-decoration: underline dotted;
        font-size: 16px;
        padding: 8px 12px;
        position: fixed;
        top: 10px;
        right: 28px;
    }

    .text-pane {
        background-color: floralwhite;
        min-width: 40%;
        min-height: 60%;
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 10px;
        padding-top: 0px;
    }

    /* Slideshow; adapted from https://www.w3schools.com/howto/howto_js_slideshow.asp */

    * {
        box-sizing: border-box;
    }

    .slideshow-container {
        display: block;
        position: fixed;
        top: 50px;
        left: 50px;
        bottom: 50px;
        right: 50px;
    }

    .prev,
    .next {
        cursor: pointer;
        position: fixed;
        color: white;
        font-weight: bold;
        font-size: 16px;
        top: 50px;
        bottom: 0px;
        padding: 16px;
        padding-top: 48vh;
        user-select: none;
    }

    .prev {
        left: 0px;
    }

    .next {
        right: 0px;
    }

    .caption {
        position: fixed;
        color: white;
        font-size: 16px;
        padding: 8px 12px;
        top: 12px;
        left: 50px;
        right: 50px;
        text-align: center;
    }

    .numbertext {
        position: fixed;
        color: white;
        font-size: 16px;
        padding: 8px 12px;
        top: 12px;
        left: 0px;
    }
</style>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- svelte-ignore missing-declaration -->
{#if fullscreen}
    <div class="blanket cursor-pointer" transition:fade/>
    <img alt={files[fileIdx].name} title={files[fileIdx].name} class="centered cursor-pointer"
         src={getWS(files[fileIdx])} on:click={closeFullscreen} transition:fade/>
{:else}
    <div class="blanket" transition:fade>
        <div class="x-top-right cursor-pointer" on:click={close}/>
        <div class="slideshow-container" transition:fade>
            <div class="numbertext">{fileIdx + 1} / {files.length}</div>
            {#if isMimeTypeSupported(files[fileIdx].mimeType)}
                {#if isMimeTypeText(files[fileIdx].mimeType)}
                    <div class="centered centered-maxscreen text-pane">
                        <TextShower url={getWS(files[fileIdx])} file={files[fileIdx]}/>
                    </div>
                {:else if isMimeTypeImage(files[fileIdx].mimeType)}
                    <img alt={files[fileIdx].name} title={files[fileIdx].name} draggable="false"
                         ondragstart="return false;" class="centered centered-maxscreen cursor-pointer"
                         src={getWS(files[fileIdx])} on:click={openFullscreen}/>
                {:else if isMimeTypeVideo(files[fileIdx].mimeType)}
                    <div class="centered">
                        <video controls>
                            <source src={getWS(files[fileIdx])} type={files[fileIdx].mimeType}/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                {:else if isMimeTypeAudio(files[fileIdx].mimeType)}
                    <div class="centered">
                        <audio controls>
                            <source src={getWS(files[fileIdx])} type={files[fileIdx].mimeType}/>
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                {:else if isMimeTypePDF(files[fileIdx].mimeType)}
                    <embed class="centered centered-maxscreen w100 h100" type={files[fileIdx].mimeType}
                           src={getWS(files[fileIdx])}/>
                {/if}
            {:else}
                <img class="centered" alt={files[fileIdx].icon} draggable="false" ondragstart="return false;"
                     src="icons/48x48/{files[fileIdx].icon}.svg"/>
            {/if}
            <div class="caption ellipsis" title={files[fileIdx].name}>{files[fileIdx].name}</div>
        </div>
        <div class="download" title="Download">
            <a target="_blank" href={getWS(files[fileIdx], true)}>
                <IconDownload size={24} color="white"/>
            </a>
        </div>
        <div class="prev" on:click={prev}>&#10094;</div>
        <div class="next" on:click={next}>&#10095;</div>
    </div>
{/if}
