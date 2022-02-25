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
  import { fade } from "svelte/transition";
  import type { File } from "./Struct.svelte";
  import {
    isMimeTypeText,
    isMimeTypeImage,
    isMimeTypeSupported,
    isMimeTypeVideo,
    isMimeTypeAudio,
  } from "./MimeTypes.svelte";
  import TextShower from "./TextShower.svelte";
  import IconDownload from "./SVG/IconDownload.svelte";

  export let files: File[] = [];
  export let fileIdx: number = 0;

  $: fullscreen = false;

  const dispatch = createEventDispatcher();

  function close(e: Event) {
    dispatch("message", {});
  }

  function getWS(f: File, forDl: boolean = false): string {
    return "/file?path=" + f.path + (forDl ? "&dl=1" : "");
  }

  function openFullscreen() {
    fullscreen = true;
  }

  async function closeFullscreen() {
    fullscreen = false;
  }

  function next() {
    if (++fileIdx == files.length) fileIdx = 0;
  }

  function prev() {
    if (fileIdx-- == 0) fileIdx = files.length - 1;
  }
</script>

<style>
  .blanket {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    background: slategray;
    z-index: 0;
    padding: 0px;
  }

  .blanket-fullscreen {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    background: slategray;
    z-index: 0;
    padding: 0px;
  }

  /* 'X' to close slideshow and fullscreen */
  .x-top-right {
    position: fixed;
    right: 8px;
    top: 8px;
  }

  .x-top-right::before {
    color: white;
    content: "×";
    font-size: 32px;
  }

  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .centered-maxscreen {
    max-width: 100%;
    max-height: 100%;
  }

  .very-big-text {
    font-size: 200px;
  }

  .download {
    color: white;
    text-decoration: underline dotted;
    font-size: 16px;
    padding: 8px 12px;
    position: fixed;
    top: 12px;
    right: 28px;
  }

  .text-pane {
    background-color: floralwhite;
    min-width: 40%;
    min-height: 60%;
    width: fit-content;
    height: fit-content;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 10px;
    padding-top: 0px;
  }

  /* Slideshow; adapted from https://www.w3schools.com/howto/howto_js_slideshow.asp */

  * {
    box-sizing: border-box;
  }

  .slideshow-container {
    display: block;
    position: fixed;
    top: 50px;
    left: 50px;
    bottom: 50px;
    right: 50px;
  }

  .prev,
  .next {
    cursor: pointer;
    position: fixed;
    color: white;
    font-weight: bold;
    font-size: 16px;
    top: 48vh;
    padding: 16px;
    user-select: none;
  }

  .prev {
    left: 0px;
  }

  .next {
    right: 0px;
  }

  .caption {
    position: fixed;
    color: white;
    font-size: 16px;
    padding: 8px 12px;
    top: 12px;
    left: 20px;
    right: 20px;
    text-align: center;
  }

  .numbertext {
    position: fixed;
    color: white;
    font-size: 16px;
    padding: 8px 12px;
    top: 12px;
    left: 0px;
  }
</style>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- svelte-ignore missing-declaration -->
{#if fullscreen}
  <div class="blanket-fullscreen" on:click={closeFullscreen} transition:fade>
    <img
      alt={files[fileIdx].name}
      title={files[fileIdx].name}
      class="centered"
      src={getWS(files[fileIdx])} />
  </div>
{:else}
  <div class="blanket" transition:fade>
    <div class="x-top-right" on:click={close} />
    {#each files as file, idx (file.uuid)}
      {#if fileIdx == idx}
        <div class="slideshow-container" transition:fade>
          <div class="numbertext">{idx + 1} / {files.length}</div>
          {#if isMimeTypeSupported(file.mimeType)}
            {#if isMimeTypeText(file.mimeType)}
              <div class="centered text-pane">
                <TextShower url={getWS(file)} {file} />
              </div>
            {:else if isMimeTypeImage(file.mimeType)}
              <img
                alt={file.name}
                title={file.name}
                class="centered centered-maxscreen cursor-pointer"
                src={getWS(file)}
                on:click={openFullscreen} />
            {:else if isMimeTypeVideo(file.mimeType)}
              <div class="centered">
                <video controls>
                  <source src={getWS(file)} type={file.mimeType} />
                  Your browser does not support the video tag.
                </video>
              </div>
            {:else if isMimeTypeAudio(file.mimeType)}
              <div class="centered">
                <audio controls>
                  <source src={getWS(file)} type={file.mimeType} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            {/if}
          {:else}
            <img
              class="centered"
              alt={file.icon}
              src="icons/48x48/{file.icon}.svg" />
          {/if}
          <div class="caption">{file.name}</div>
        </div>
      {/if}
    {/each}
    <div class="download" title="Download">
      <a target="_blank" href={getWS(files[fileIdx], true)}>
        <IconDownload size={24} color="white" />
      </a>
    </div>
    <div class="prev" on:click={prev}>&#10094;</div>
    <div class="next" on:click={next}>&#10095;</div>
  </div>
{/if}
