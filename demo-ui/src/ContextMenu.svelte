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

  import type { File } from "./Struct.svelte";

  export let item: File;

  // to be able to specify stopPropagation
  function noop() {}
</script>

<div class="dropdown-content dropdown-right white shadow-1 rounded-3">
  <div
    class="dropdown-item modal-trigger"
    data-target={'modal-properties-' + item.uuid}
    on:click|stopPropagation={noop}>
    Properties
  </div>
</div>
