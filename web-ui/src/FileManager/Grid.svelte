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

  import { createEventDispatcher } from "svelte";
  import GridCell from "./GridCell.svelte";
  import type { File } from "../Struct.svelte";

  export let itemList: File[];
  export let readOnly: boolean;

  const dispatch = createEventDispatcher();

  function click(uuid: string): (e: Event) => void {
    return (e: Event) => {
      dispatch("message", {
        uuid: uuid,
      });
    };
  }
</script>

<div class="grix xs2 sm3 md4 lg6 xl12">
  {#each itemList as item, i (item.uuid)}
    <!-- z-index is a workaround for a CSS "bug": the dropdown 
         would be rendered "behind" the card under it -->
    <div
      class="m-3 cursor-pointer"
      on:click={click(item.uuid)}
      title={item.name}
      style="z-index: {itemList.length + 1 - i}">
      <GridCell {item} {readOnly} on:toPaste on:reload on:openPropsModal />
    </div>
  {/each}
</div>
