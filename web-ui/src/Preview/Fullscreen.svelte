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

    import {createEventDispatcher} from "svelte";
    import {fade} from "svelte/transition";

    import type {File} from "../Struct.svelte";

    export let file: File;

    const dispatch = createEventDispatcher();

    async function closeFullscreen() {
        dispatch("toggleFullscreen", {});
    }

    // TODO unify
    function getWS(f: File, forDl: boolean = false): string {
        return "/testFs/" + f.path;
    }
</script>

<style>
    /* TODO unify */
    .centered {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<div class="blanket cursor-pointer"></div>
<img alt={file.name} title={file.name} class="centered cursor-pointer shadow-5" draggable="false"
     ondragstart="return false;" src={getWS(file, false)} on:click={closeFullscreen} transition:fade/>
