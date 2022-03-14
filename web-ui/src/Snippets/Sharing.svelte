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
  import { fade } from "svelte/transition";
  import { Modal, destroy } from "axentix";
  import Swal from "sweetalert2";

  import { Config } from "../Struct.svelte";

  export let dir: string;
  export let config: Config;

  $: pwd = "";
  $: readOnly = true;
  $: token = config.sharing.tokens[0];
  $: expires = false;
  $: expiryDate = "";
  $: error = "";

  const dispatch = createEventDispatcher();

  onMount(() => {
    const modal = new Modal("#modal-share");
    const modalQuery = document.querySelector("#modal-share");
    modalQuery.addEventListener("ax.modal.closed", function () {
      destroy("#modal-share");
      dispatch("closeShareModal");
    });
    modal.open();
  });

  async function gen(event) {
    if (expires && !expiryDate) {
      error = "Please provide an expiry date";
      return;
    }
    error = "";

    const url =
      "/shareLink?pwd=" +
      encodeURIComponent(pwd) +
      "&dir=" +
      encodeURIComponent(dir) +
      "&readOnly=" +
      (readOnly ? "1" : "0") +
      "&token=" +
      encodeURIComponent("token") +
      (expires ? "&expiry=" + encodeURIComponent(expiryDate) : "");

    const res: Response = await fetch(url);
    if (res.status != 200) {
      error = await res.text();
    } else {
      await navigator.clipboard.writeText(await res.text());
      await Swal.fire({
        icon: "success",
        titleText: "Done! Link copied to clipboard.",
        confirmButtonColor: "#0a6bb8",
      });
    }
  }
</script>

<div class="modal shadow-1 white rounded-3" id="modal-share">
  <div class="modal-header text-center">Sharing</div>
  <div class="modal-content container">
    <form>
      <div class="grix xs-1 md-3">
        <div class="hide-sm-down">&nbsp;</div>
        <div>
          <div class="form-field">
            <label for="pwd">Password</label>
            <input
              type="password"
              class="form-control rounded-1"
              bind:value={pwd} />
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div class="form-field">
            <label class="form-switch mx-auto">
              <input type="checkbox" bind:checked={readOnly} />
              <span class="form-slider" /> Read Only
            </label>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div class="form-field">
            <label for="token">Token</label>
            <select
              class="form-control rounded-1"
              id="token"
              bind:value={token}>
              {#each config.sharing.tokens as tk}
                <option>{tk}</option>
              {/each}
            </select>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div class="form-field">
            <label class="form-switch mx-auto">
              <input type="checkbox" bind:checked={expires} />
              <span class="form-slider" /> Expiry date
            </label>
          </div>
          {#if expires}
            <div class="form-field">
              <input
                type="date"
                class="form-control rounded-1"
                bind:value={expiryDate} />
            </div>
          {/if}
        </div>
        <div class="hide-sm-down">&nbsp;</div>
      </div>
    </form>
  </div>
  <div class="modal-footer w-100 text-center">
    <div class="btn btn-small rounded-1 primary mb-3" on:click={gen}>
      Copy link
    </div>
    {#if !!error}
      <div
        class="p-3 my-2 rounded-2 red light-3 text-red text-dark-4"
        transition:fade>
        {error}
      </div>
    {/if}
  </div>
</div>
