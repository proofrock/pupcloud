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

  // https://stackoverflow.com/questions/56483209/import-css-in-node-modules-to-svelte
  import "../node_modules/axentix/dist/axentix.min.css";

  import { Config, File, Mule, SORTERS } from "./Struct.svelte";
  import { onMount } from "svelte";
  import Slideshow from "./Slideshow.svelte";
  import FileManager from "./FileManager.svelte";

  $: config = Config.empty();
  $: mule = Mule.empty();

  $: path = [];
  $: slideshowIndex = -1;

  $: sorter = SORTERS.ABC;
  $: mode = "GRID";

  $: {
    loadPath(path);
  }

  $: {
    mule = mule.sort(sorter);
  }

  async function loadPath(path: string[]) {
    mule = Mule.fromAny(
      await (
        await fetch("/ls?path=" + encodeURIComponent(path.join("/")))
      ).json(),
      path
    ).sort(sorter);
  }

  onMount(async () => {
    config = Config.fromAny(await (await fetch("/features")).json());
  });

  function openSlideshow(event) {
    slideshowIndex = mule.files.findIndex(
      (i: File) => i.uuid == event.detail.uuid
    );
  }

  function chPath(event) {
    path = event.detail.path;
  }

  function closeSlideshow() {
    slideshowIndex = -1;
  }
</script>

<svelte:head>
  <title>Pupcloud {config.version}</title>
</svelte:head>
<main>
  {#if slideshowIndex < 0}
    <nav class="navbar blue dark-2">
      <p class="navbar-brand">{config.title}</p>
    </nav>
    <FileManager
      {path}
      bind:mule
      bind:sorter
      bind:mode
      on:pathEvent={chPath}
      on:message={openSlideshow} />
    <footer
      class="footer blue dark-2 font-s1 lh-1 hide-sm-down"
      style="position:fixed; bottom:0; z-index:11;">
        {config.version} - Made with <a
          class="pup-a"
          href="https://gofiber.io/">Fiber</a>, <a
          class="pup-a"
          href="https://useaxentix.com/">Axentix</a>, <a
          class="pup-a"
          href="https://svelte.dev/">Svelte</a>, <a
          class="pup-a"
          href="https://go.dev/">Go</a> and ❤️</span>
    </footer>
  {:else}
    <Slideshow
      files={mule.files}
      fileIdx={slideshowIndex}
      on:message={closeSlideshow} />
  {/if}
</main>
