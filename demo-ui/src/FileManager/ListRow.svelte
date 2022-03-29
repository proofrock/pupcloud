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
    import type {File} from "../Struct.svelte";

    export let item: File;

    const dispatch = createEventDispatcher();

    function click(uuid: string): (e: Event) => void {
        return (e: Event) => {
            dispatch("openItem", {uuid: uuid,});
        };
    }

    function toProperties() {
        dispatch("openPropsModal", {file: item});
    }
</script>

<style>
    .txt-mid {
        vertical-align: middle;
    }
</style>

<!-- svelte-ignore missing-declaration -->
<tr>
    <td on:click={click(item.uuid)}>
        <div class="cursor-pointer wid220 ellipsis hide-md-up">
            <img alt={item.icon[0]} class="txt-mid" src="icons/16x16/{item.icon[0]}.svg"/>&nbsp;<span
                class="txt-mid">{item.icon[2]}{item.name}</span>
        </div>
        <div class="cursor-pointer hide-sm-down">
            <img alt={item.icon[0]} class="txt-mid" src="icons/16x16/{item.icon[0]}.svg"/>&nbsp;<span
                class="txt-mid">{item.icon[2]}{item.name}</span>
        </div>
    </td>
    <td>{item.size}</td>
    <td class="hide-sm-down">{item.chDate}</td>
    <td>
        <div class="w100 dropdown dd-fix">
            <span on:click|stopPropagation={toProperties} class="cursor-pointer menu">️</span>
        </div>
    </td>
</tr>
