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
  import ContextMenu from "./ContextMenu.svelte";
  import DotDotDot from "./DotDotDot.svelte";
  import type { File } from "./Struct.svelte";

  export let file: File;

  const dispatch = createEventDispatcher();

  onMount(() => {
    new Dropdown("#ddList-" + file.uuid);
  });

  onDestroy(() => {
    destroy("#ddList-" + file.uuid);
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

<!-- svelte-ignore missing-declaration -->
<tr>
  <td on:click={click(file.uuid)}>
    <div class="cursor-pointer wid220 ellipsis hide-md-up">
      {file.icon}&nbsp;<span>{file.name}</span>
    </div>
    <div class="cursor-pointer hide-sm-down">
      {file.icon}&nbsp;<span>{file.name}</span>
    </div>
  </td>
  <td>{file.size}</td>
  <td class="hide-sm-down">{file.chDate}</td>
  <td>
    <div class="w100 dropdown" id="ddList-{file.uuid}">
      <span class="dropdown-trigger" on:click|stopPropagation={noop}>
        <DotDotDot />
      </span>
      <ContextMenu {file} />
    </div>
  </td>
</tr>
