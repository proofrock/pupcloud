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

  import { onMount, createEventDispatcher } from "svelte";
  import { Modal, destroy } from "axentix";
  import type { File } from "../Struct.svelte";

  export let item: File;

  const dispatch = createEventDispatcher();

  onMount(() => {
    const modal = new Modal("#modal-properties");
    const modalQuery = document.querySelector("#modal-properties");
    modalQuery.addEventListener("ax.modal.closed", function () {
      destroy("#modal-properties");
      dispatch("closePropsModal");
    });
    modal.open();
  });
</script>

<div
  class="modal shadow-1 white rounded-3 modal-bouncing"
  style="max-width:90vh"
  id="modal-properties">
  <div class="modal-header ellipsis">
    <img class="centered" alt={item.icon} src="icons/48x48/{item.icon}.svg" />&nbsp;{item.name}
  </div>
  <div class="modal-content">
    <table>
      <tr>
        <td>File name:</td>
        <td>{item.name}</td>
      </tr>
      <tr>
        <td>Size:</td>
        <td>{item.size}</td>
      </tr>
      <tr>
        <td>Mod. date:</td>
        <td>{item.chDate}</td>
      </tr>
      <tr>
        <td>Type:</td>
        <td>{item.mimeType}</td>
      </tr>
      <tr>
        <td>Owner:</td>
        <td>{item.owner}</td>
      </tr>
      <tr>
        <td>Group:</td>
        <td>{item.group}</td>
      </tr>
      <tr>
        <td>Permissions:</td>
        <td>{item.permissions}</td>
      </tr>
    </table>
  </div>
</div>
