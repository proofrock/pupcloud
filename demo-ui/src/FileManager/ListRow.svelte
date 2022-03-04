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
  import ContextMenu from "../Snippets/ContextMenu.svelte";
  import DotDotDot from "../Snippets/DotDotDot.svelte";
  import type { File } from "../Struct.svelte";

  export let item: File;

  const dispatch = createEventDispatcher();

  onMount(() => {
    new Dropdown("#ddList-" + item.uuid);
  });

  onDestroy(() => {
    destroy("#ddList-" + item.uuid);
  });

  function click(uuid: string): (e: Event) => void {
    return (e: Event) => {
      dispatch("message", {
        uuid: uuid,
      });
    };
  }

  // to be able to specify stopPropagation
  function noop() {}
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
      <img alt={item.icon} class="txt-mid" src="icons/16x16/{item.icon}.svg" />&nbsp;<span
        class="txt-mid">{item.name}</span>
    </div>
    <div class="cursor-pointer hide-sm-down">
      <img alt={item.icon} class="txt-mid" src="icons/16x16/{item.icon}.svg" />&nbsp;<span
        class="txt-mid">{item.name}</span>
    </div>
  </td>
  <td>{item.size}</td>
  <td class="hide-sm-down">{item.chDate}</td>
  <td>
    <div class="w100 dropdown dd-fix" id="ddList-{item.uuid}">
      <span data-target="ddList-{item.uuid}" on:click|stopPropagation={noop}>
        <DotDotDot />
      </span>
      <ContextMenu {item} />
    </div>
  </td>
</tr>
