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
  import { Dropdown, destroy } from "axentix";

  import Breadcrumb from "./Breadcrumb.svelte";
  import Grid from "./Grid.svelte";
  import List from "./List.svelte";
  import { File, Mule, SORTERS } from "./Struct.svelte";
  import Properties from "./Properties.svelte";

  export let path: string[];
  export let mule: Mule;
  export let sorter: (f1: File, f2: File) => number;
  export let mode: string;

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

  function resort(_sorter: (f1: File, f2: File) => number): () => void {
    return function () {
      sorter = _sorter;
    };
  }
</script>

<nav class="navbar">
  <Breadcrumb {path} on:pathEvent />
  <button
    class="btn btn-small shadow-1 mx-2 ml-auto"
    on:click={() => {
      mode = mode == 'GRID' ? 'LIST' : 'GRID';
    }}>
    {mode == 'GRID' ? 'List' : 'Grid'}
  </button>
  <div class="dropdown" id="SortBy">
    <button class="btn btn-small shadow-1 mx-2 dropdown-trigger">Sort by...
    </button>
    <div class="dropdown-content dropdown-right white shadow-1 rounded-3">
      <div
        class="dropdown-item"
        on:click={resort(SORTERS.ABC)}
        class:active={sorter == SORTERS.ABC}>
        By name, ascending
      </div>
      <div
        class="dropdown-item"
        on:click={resort(SORTERS.CBA)}
        class:active={sorter == SORTERS.CBA}>
        By name, descending
      </div>
      <div
        class="dropdown-item"
        on:click={resort(SORTERS.OldFirst)}
        class:active={sorter == SORTERS.OldFirst}>
        By mod. date, ascending
      </div>
      <div
        class="dropdown-item"
        on:click={resort(SORTERS.OldLast)}
        class:active={sorter == SORTERS.OldLast}>
        By mod. date, descending
      </div>
      <div
        class="dropdown-item"
        on:click={resort(SORTERS.SmallFirst)}
        class:active={sorter == SORTERS.SmallFirst}>
        By size, ascending
      </div>
      <div
        class="dropdown-item"
        on:click={resort(SORTERS.SmallLast)}
        class:active={sorter == SORTERS.SmallLast}>
        By size, descending
      </div>
    </div>
  </div>

  <!--button class="btn btn-small shadow-1 mx-2" style="float: right;">
    Filter...
  </button-->
</nav>
<div>&nbsp;</div>
{#if mode == 'GRID'}
  <Grid fileList={mule.items} on:message={click} />
{:else}
  <List fileList={mule.items} on:message={click} />
{/if}
<div>&nbsp;</div>
<div>&nbsp;</div>
<div>&nbsp;</div>
{#each mule.items as file (file.uuid)}
  <Properties {file} />
{/each}
