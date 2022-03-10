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

  import ContextMenu from "../Snippets/ContextMenu.svelte";
  import type { File } from "../Struct.svelte";
  import { onMount, onDestroy } from "svelte";
  import { Dropdown, destroy } from "axentix";
  import DotDotDot from "../Snippets/DotDotDot.svelte";

  export let item: File;
  export let readOnly: boolean;

  onMount(() => {
    new Dropdown("#ddGrid-" + item.uuid);
  });

  onDestroy(() => {
    destroy("#ddGrid-" + item.uuid);
  });

  // to be able to specify stopPropagation
  function noop() {}
</script>

<div class="card shadow-1 hoverable-1 rounded-3 overflow-visible white">
  <!-- svelte-ignore missing-declaration -->
  <div class="card-content lh-1">
    <span class="font-w100 hide-sm-down">{item.size}</span>
    <div class="dropdown dd-fix" id="ddGrid-{item.uuid}" style="float: right;">
      <span data-target="ddGrid-{item.uuid}" on:click|stopPropagation={noop}>
        <DotDotDot />
      </span>
      <ContextMenu {item} {readOnly} on:toPaste on:reload on:openPropsModal />
    </div>
    <div style="clear: both;">&nbsp;</div>
    <div class="font-s9 text-center">
      <img alt={item.icon} src="icons/48x48/{item.icon}.svg" />
    </div>
    <div>&nbsp;</div>
    <div class="text-center ellipsis">{item.name}</div>
  </div>
</div>
