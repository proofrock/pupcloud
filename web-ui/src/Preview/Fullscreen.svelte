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

    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import * as Hammer from 'hammerjs';

    import type {File} from "../Struct.svelte";
    import {isMimeTypeImage} from "../MimeTypes.svelte";

    export let files: File[];
    export let fileIdx: number;

    const dispatch = createEventDispatcher();

    let manager;

    onMount(() => {
        document.addEventListener('keydown', handleKeyboardEvent);

        manager = new Hammer.Manager(document.getElementById("img-container"));
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

    function stepMode() {
        dispatch("stepMode", {});
    }

    function next() {
        const next = files.findIndex((f, i) => {
            return i > fileIdx && isMimeTypeImage(f.mimeType)
        });
        if (next < 0)
            fileIdx = files.findIndex((f) => {
                return isMimeTypeImage(f.mimeType)
            });
        else
            fileIdx = next;
    }

    function prev() {
        function findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
            let l = array.length;
            while (l--) {
                if (predicate(array[l], l, array))
                    return l;
            }
            return -1;
        }

        const prev = findLastIndex(files, (f, i) => {
            return i < fileIdx && isMimeTypeImage(f.mimeType)
        });
        if (prev < 0)
            fileIdx = findLastIndex(files, (f) => {
                return isMimeTypeImage(f.mimeType)
            });
        else
            fileIdx = prev;
    }
</script>

<style>
    .full-screen {
        max-width: 100%;
        max-height: 100%
    }
</style>

<div id="img-container" class="blanket blanket-clear" transition:fade>
    <img alt={files[fileIdx].name} title={files[fileIdx].name} draggable="false" ondragstart="return false;"
         class="centered-slide cursor-zoom-in shadow-5 full-screen" src={files[fileIdx].getWS(false)}
         on:click={stepMode}/>
</div>
