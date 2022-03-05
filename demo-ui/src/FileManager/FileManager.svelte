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

  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { Dropdown, destroy, config } from "axentix";
  import { fade } from "svelte/transition";

  import Breadcrumb from "../Snippets/Breadcrumb.svelte";
  import Grid from "./Grid.svelte";
  import List from "./List.svelte";
  import { File, Mule, SORTERS } from "../Struct.svelte";
  import IconGrid from "../SVG/IconGrid.svelte";
  import IconList from "../SVG/IconList.svelte";
  import IconSortAlphAsc from "../SVG/IconSortAlphAsc.svelte";
  import IconSortAlphDesc from "../SVG/IconSortAlphDesc.svelte";
  import IconSortDateAsc from "../SVG/IconSortDateAsc.svelte";
  import IconSortDateDesc from "../SVG/IconSortDateDesc.svelte";
  import IconSortSizeAsc from "../SVG/IconSortSizeAsc.svelte";
  import IconSortSizeDesc from "../SVG/IconSortSizeDesc.svelte";
  import IconPaste from "../SVG/IconPaste.svelte";
  import IconUnpaste from "../SVG/IconUnpaste.svelte";

  export let path: string[];
  export let mule: Mule;
  export let sorter: (f1: File, f2: File) => number;
  export let mode: string;
  export let readOnly: boolean;

  $: toPaste = null;

  const dispatch = createEventDispatcher();

  onMount(() => {
    resort(SORTERS.ABC)();
    new Dropdown("#SortBy");
  });

  onDestroy(() => {
    destroy("#SortBy");
  });

  function click(event) {
    const file = mule.items.find((i: File) => i.uuid == event.detail.uuid);
    if (file.isDir) {
      // cd
      if (file.name == "../") path = path.slice(0, path.length - 1);
      else path = [...path, file.name];
      dispatch("pathEvent", { path: path });
    } else {
      dispatch("message", event.detail);
    }
  }

  function markToPaste(event) {
    console;
    toPaste = event.detail.file;
  }

  function unmarkToPaste() {
    toPaste = null;
  }

  function nodo() {
    alert("Not implemented in the demo site");
  }

  function resort(_sorter: (f1: File, f2: File) => number): () => void {
    return function () {
      sorter = _sorter;
    };
  }

  function gridOrList() {
    mode = mode == "GRID" ? "LIST" : "GRID";
  }
</script>

<nav class="navbar" style="height: 40px;">
  <Breadcrumb {path} on:pathEvent />
  <div class="navbar-menu ml-auto" style="height: 40px;">
    {#if !!toPaste}
      <div class="navbar-link" title="Paste" transition:fade on:click={nodo}>
        <IconPaste color="#BBBBBB" size={24} />
      </div>
      <div
        class="navbar-link"
        title="Abort paste"
        transition:fade
        on:click={unmarkToPaste}>
        <IconUnpaste color="#BBBBBB" size={24} />
      </div>
    {/if}
    <div>&nbsp;</div>
    <div class="navbar-link" title="View mode" on:click={gridOrList}>
      {#if mode == 'GRID'}
        <IconGrid size={24} />
      {:else}
        <IconList size={24} />
      {/if}
    </div>
    <div class="dropdown dd-fix" id="SortBy">
      <div
        class="navbar-link"
        data-target="SortBy"
        title="Sort by"
        style="height: 40px;">
        {#if sorter == SORTERS.ABC}
          <IconSortAlphAsc size={24} />
        {:else if sorter == SORTERS.CBA}
          <IconSortAlphDesc size={24} />
        {:else if sorter == SORTERS.OldFirst}
          <IconSortDateAsc size={24} />
        {:else if sorter == SORTERS.OldLast}
          <IconSortDateDesc size={24} />
        {:else if sorter == SORTERS.SmallFirst}
          <IconSortSizeAsc size={24} />
        {:else if sorter == SORTERS.SmallLast}
          <IconSortSizeDesc size={24} />
        {/if}
      </div>
      <div class="dropdown-content dd-cnt-fix dropdown-right white shadow-1">
        <div
          class="dropdown-item"
          on:click={resort(SORTERS.ABC)}
          class:active={sorter == SORTERS.ABC}
          title="Sort alphabetically, ascending">
          <IconSortAlphAsc size={24} />
        </div>
        <div
          class="dropdown-item"
          on:click={resort(SORTERS.CBA)}
          class:active={sorter == SORTERS.CBA}
          title="Sort alphabetically, descending">
          <IconSortAlphDesc size={24} />
        </div>
        <div
          class="dropdown-item"
          on:click={resort(SORTERS.OldFirst)}
          class:active={sorter == SORTERS.OldFirst}
          title="Sort by date, ascending">
          <IconSortDateAsc size={24} />
        </div>
        <div
          class="dropdown-item"
          on:click={resort(SORTERS.OldLast)}
          class:active={sorter == SORTERS.OldLast}
          title="Sort by date, descending">
          <IconSortDateDesc size={24} />
        </div>
        <div
          class="dropdown-item"
          on:click={resort(SORTERS.SmallFirst)}
          class:active={sorter == SORTERS.SmallFirst}
          title="Sort by size, ascending">
          <IconSortSizeAsc size={24} />
        </div>
        <div
          class="dropdown-item"
          on:click={resort(SORTERS.SmallLast)}
          class:active={sorter == SORTERS.SmallLast}
          title="Sort by size, descending">
          <IconSortSizeDesc size={24} />
        </div>
      </div>
    </div>
  </div>
</nav>
{#if mode == 'GRID'}
  <Grid
    itemList={mule.items}
    {readOnly}
    on:message={click}
    on:toPaste={markToPaste} />
{:else}
  <List
    itemList={mule.items}
    {readOnly}
    on:message={click}
    on:toPaste={markToPaste} />
{/if}
<div>&nbsp;</div>
<div>&nbsp;</div>
<div>&nbsp;</div>