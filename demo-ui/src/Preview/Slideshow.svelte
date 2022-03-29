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
    import * as Hammer from 'hammerjs';

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

    export let files: File[];
    export let fileIdx: number;

    const dispatch = createEventDispatcher();

    let manager;

    onMount(() => {
        document.addEventListener('keydown', handleKeyboardEvent);

        manager = new Hammer.Manager(document.getElementById("slide-container"));
        manager.add(new Hammer.Swipe());
        manager.on('swipeleft', next);
        manager.on('swiperight', prev);
    });

    onDestroy(() => {
        document.removeEventListener('keydown', handleKeyboardEvent);
        manager.destroy();
    });

    // adapted from https://siongui.github.io/2012/06/25/javascript-keyboard-event-arrow-key-example/
    function handleKeyboardEvent(evt) {
        const keycode = evt.keyCode || evt.which;
        switch (keycode) {
            case 37: // Left
                prev();
                break;
            case 39: // Right
                next();
                break;
        }
    }

    function close(e: Event) {
        dispatch("closePreview", {});
    }

    function stepMode() {
        dispatch("stepMode", {});
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
<div id="slide-container" class="blanket" transition:fade>
    <div class="x-top-right cursor-pointer" on:click={close}></div>
    <div class="slideshow-container">
        <div class="numbertext">{fileIdx + 1} / {files.length}</div>
        {#if isMimeTypeSupported(files[fileIdx].mimeType)}
            {#if isMimeTypeText(files[fileIdx].mimeType)}
                <div class="centered-slide centered-maxscreen text-pane">
                    <TextShower url={files[fileIdx].getWS(false)} file={files[fileIdx]}/>
                </div>
            {:else if isMimeTypeImage(files[fileIdx].mimeType)}
                <img alt={files[fileIdx].name} title={files[fileIdx].name} draggable="false"
                     ondragstart="return false;" class="centered-slide centered-maxscreen cursor-zoom-in"
                     src={files[fileIdx].getWS(false)} on:click={stepMode}/>
            {:else if isMimeTypeVideo(files[fileIdx].mimeType)}
                <div class="centered-slide">
                    <video controls>
                        <source src={files[fileIdx].getWS(false)} type={files[fileIdx].mimeType}/>
                        Your browser does not support the video tag.
                    </video>
                </div>
            {:else if isMimeTypeAudio(files[fileIdx].mimeType)}
                <div class="centered-slide">
                    <audio controls>
                        <source src={files[fileIdx].getWS(false)} type={files[fileIdx].mimeType}/>
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            {:else if isMimeTypePDF(files[fileIdx].mimeType)}
                <embed class="centered-slide centered-maxscreen w100 h100" type={files[fileIdx].mimeType}
                       src={files[fileIdx].getWS(false)}/>
            {/if}
        {:else}
            <img class="centered-slide" alt={files[fileIdx].icon} draggable="false" ondragstart="return false;"
                 src="icons/48x48/{files[fileIdx].icon}.svg"/>
        {/if}
        <div class="caption ellipsis" title={files[fileIdx].name}>{files[fileIdx].name}</div>
    </div>
    <div class="download" title="Download">
        <a target="_blank" href={files[fileIdx].getWS(true)}>
            <IconDownload size={24} color="white"/>
        </a>
    </div>
    <div class="prev" on:click={prev}>&#10094;</div>
    <div class="next" on:click={next}>&#10095;</div>
</div>
