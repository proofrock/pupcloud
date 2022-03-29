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

    import {createEventDispatcher, onMount} from "svelte";
    import {fade} from "svelte/transition";

    import type {File} from "../Struct.svelte";

    export let file: File;

    const dispatch = createEventDispatcher();

    async function stepMode() {
        dispatch("stepMode", {});
    }

    let img;

    onMount(() => {
        const img = document.getElementById("image");
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const iw = img.clientWidth;
        const ih = img.clientHeight;
        if (ww > iw)
            img.style.left = (ww - iw) / 2 + "px";
        if (wh > ih)
            img.style.top = (wh - ih) / 2 + "px";
    });
</script>

<style>
    .top-left {
        position: absolute;
        top: 0px;
        left: 0px;
    }
</style>

<div class="blanket blanket-very-clear" transition:fade></div>
<img id="image" alt={file.name} title={file.name} class="top-left cursor-zoom-out shadow-5" draggable="false"
     ondragstart="return false;" src={file.getWS(false)} on:click={stepMode}/>
