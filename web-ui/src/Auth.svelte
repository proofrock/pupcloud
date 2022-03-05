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

  import App from "./App.svelte";
  import { Config } from "./Struct.svelte";
  import { onMount } from "svelte";
  import Swal from "sweetalert2";

  $: config = null;

  onMount(async () => {
    let password: string = null;

    while (true) {
      const res: Response = await fetch("/features", {
        headers: {
          "x-pupcloud-pwd": password,
        },
      });
      if (res.status != 499) {
        const cfgObj = await res.json();
        config = Config.fromAny(cfgObj);
        break;
      }

      const { value: pwd } = await Swal.fire({
        titleText: "Enter password",
        confirmButtonColor: "#0a6bb8",
        input: "password",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
      });
      password = pwd;
    }
  });
</script>

{#if config != null}
  <App {config} />
{:else}
  <div class="blanket" />
{/if}