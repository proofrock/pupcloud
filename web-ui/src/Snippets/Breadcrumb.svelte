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
    import {destroy, Dropdown} from "axentix";

    export let path: string[] = [];

    const dispatch = createEventDispatcher();

    onMount(() => {
        new Dropdown("#Breadcrumb");
    });

    onDestroy(() => {
        destroy("#Breadcrumb");
    });

    function goto(idx: number) {
        return () => {
            dispatch("pathEvent", {
                path: path.slice(0, idx + 1),
            });
        };
    }
</script>

<div class="hide-xs">
    <!-- svelte-ignore a11y-missing-attribute -->
    📍
    {#if path.length > 0}
        <a on:click={goto(-1)} class="font-w300 cursor-pointer"><u><i>root</i></u></a>
    {/if}&nbsp;/&nbsp;
    {#each path as pItem, idx}
        {#if idx < path.length - 1}
            <!-- svelte-ignore a11y-missing-attribute -->
            <a on:click={goto(idx)} class="font-w300 cursor-pointer"><u>{pItem.replace('/', '')}</u></a>
        {:else}
            <span class="font-w600">{pItem.replace('/', '')}</span>
        {/if}&nbsp;/&nbsp;
    {/each}
</div>
<div class="dropdown hide-sm-up" id="Breadcrumb" style="top: -8px;">
    <div class="navbar-link" data-target="Breadcrumb" title="Folder stack" style="height: 40px;">
        📍&nbsp;<span class="triangle"></span>
    </div>
    <div class="dropdown-content white shadow-1 rounded-1">
        {#if path.length > 0}
            <div class="dropdown-item pup-a-nobold cursor-pointer" on:click={goto(-1)}>
                <i>root</i>
            </div>
        {:else}
            <div class="dropdown-item">
                <i>root</i>
            </div>
        {/if}
        {#each path as pItem, idx}
            {#if idx < path.length - 1}
                <div class="dropdown-item">
                    &nbsp;/&nbsp;<span class="pup-a-nobold cursor-pointer"
                                       on:click={goto(idx)}>{pItem.replace("/", "")}</span>
                </div>
            {:else}
                <div class="dropdown-item">
                    &nbsp;/&nbsp;{pItem.replace("/", "")}
                </div>
            {/if}
        {/each}
    </div>
</div>
