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

  import ListRow from "./ListRow.svelte";
  import Properties from "../Snippets/Properties.svelte";
  import type { File } from "../Struct.svelte";

  export let itemList: File[];
  export let readOnly: boolean;
</script>

<div class="table-responsive w100">
  <table class="table">
    <tr>
      <th>Name</th>
      <th>Size</th>
      <th class="hide-sm-down">Mod. Date</th>
      <th />
    </tr>
    {#each itemList as item (item.uuid)}
      <ListRow {item} {readOnly} on:message on:toPaste on:reload />
    {/each}
  </table>
</div>
{#each itemList as item (item.uuid)}
  <Properties {item} />
{/each}