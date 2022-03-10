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

  import type { File } from "../Struct.svelte";
  import { getCookie } from "../Utils.svelte";
  import Swal from "sweetalert2";

  export let item: File;
  export let readOnly: boolean;

  const dispatch = createEventDispatcher();

  async function rename() {
    const { value: nuName } = await Swal.fire({
      titleText: "Enter new name",
      confirmButtonColor: "#0a6bb8",
      showCancelButton: true,
      input: "text",
      inputValue: item.name.replaceAll("/", ""),
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
    });

    if (!nuName) {
      return;
    }

    if (item.name == nuName) {
      await Swal.fire({
        icon: "error",
        text: "Old and new name must be different",
        confirmButtonColor: "#0a6bb8",
      });
      return;
    }

    const res: Response = await fetch(
      "/fsOps/rename?path=" +
        encodeURIComponent(item.path) +
        "&name=" +
        encodeURIComponent(nuName),
      {
        method: "POST",
        headers: {
          "X-Csrf-Token": getCookie("csrf_"),
        },
      }
    );
    if (res.status != 200) {
      await Swal.fire({
        icon: "error",
        text: await res.text(),
        confirmButtonColor: "#0a6bb8",
      });
    } else {
      await Swal.fire({
        icon: "success",
        titleText: "Done!",
        confirmButtonColor: "#0a6bb8",
      });
      dispatch("reload", {});
    }
  }

  async function del() {
    const { value: confirm } = await Swal.fire({
      html:
        "Do you really want to delete<br/><code>" +
        item.path +
        "</code>&nbsp;?",
      icon: "question",
      confirmButtonColor: "#0a6bb8",
      showCancelButton: true,
      cancelButtonText: "No",
    });
    if (!confirm) {
      return;
    }

    const res: Response = await fetch(
      "/fsOps/del?path=" + encodeURIComponent(item.path),
      {
        method: "DELETE",
        headers: {
          "X-Csrf-Token": getCookie("csrf_"),
        },
      }
    );
    if (res.status != 200) {
      await Swal.fire({
        icon: "error",
        text: await res.text(),
        confirmButtonColor: "#0a6bb8",
      });
    } else {
      await Swal.fire({
        icon: "success",
        titleText: "Done!",
        confirmButtonColor: "#0a6bb8",
      });
      dispatch("reload", {});
    }
  }

  function toPaste(isCut: boolean) {
    return function () {
      dispatch("toPaste", { file: item, isCut: isCut });
    };
  }

  function toProperties() {
    dispatch("openPropsModal", { file: item });
  }
</script>

<div
  class="dropdown-content dd-cnt-fix dropdown-right white shadow-1 rounded-3">
  {#if item.isDir && item.name == '../'}
    <div class="dropdown-item text-grey">Special dir</div>
  {:else if readOnly}
    <div class="dropdown-item" on:click|stopPropagation={toProperties}>
      Properties
    </div>
  {:else}
    <div class="dropdown-item divider" on:click|stopPropagation={toProperties}>
      Properties
    </div>
    <div class="dropdown-item" on:click|stopPropagation={toPaste(true)}>
      Cut
    </div>
    <div
      class="dropdown-item divider"
      on:click|stopPropagation={toPaste(false)}>
      Copy
    </div>
    <div class="dropdown-item" on:click|stopPropagation={rename}>Rename</div>
    <div class="dropdown-item" on:click|stopPropagation={del}>Delete</div>
  {/if}
</div>
