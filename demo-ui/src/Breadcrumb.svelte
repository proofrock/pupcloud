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

  export let path: string[] = [];

  const dispatch = createEventDispatcher();

  function goto(idx: number) {
    return () => {
      dispatch("pathEvent", {
        path: path.slice(0, idx + 1),
      });
    };
  }
</script>

<p class="font-w100" style="float: left;">
  <!-- svelte-ignore a11y-missing-attribute -->
  📍 {#if path.length > 0}
    <a
      on:click={goto(-1)}
      class="font-w300 cursor-pointer"><u><i>root</i></u></a>
  {/if}&nbsp;/&nbsp; {#each path as pItem, idx}
    {#if idx < path.length - 1}
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        on:click={goto(idx)}
        class="font-w300 cursor-pointer"><u>{pItem.replace('/', '')}</u></a>
    {:else}
      <span class="font-w600">{pItem.replace('/', '')}</span>
    {/if}&nbsp;/&nbsp;
  {/each}
</p>
