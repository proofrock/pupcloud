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

    import {createEventDispatcher, onDestroy, onMount} from "svelte";
    import {fade} from "svelte/transition";
    import {destroy, Dropdown} from "axentix";
    import Swal from "sweetalert2";

    import Breadcrumb from "../Snippets/Breadcrumb.svelte";
    import Grid from "./Grid.svelte";
    import List from "./List.svelte";
    import {Config, File, Mule, SORTERS} from "../Struct.svelte";
    import {getCookie} from "../Utils.svelte";
    import IconGrid from "../SVG/IconGrid.svelte";
    import IconList from "../SVG/IconList.svelte";
    import IconSortAlphAsc from "../SVG/IconSortAlphAsc.svelte";
    import IconSortAlphDesc from "../SVG/IconSortAlphDesc.svelte";
    import IconSortDateAsc from "../SVG/IconSortDateAsc.svelte";
    import IconSortDateDesc from "../SVG/IconSortDateDesc.svelte";
    import IconSortSizeAsc from "../SVG/IconSortSizeAsc.svelte";
    import IconSortSizeDesc from "../SVG/IconSortSizeDesc.svelte";
    import IconPaste from "../SVG/IconPaste.svelte";
    import IconUnpaste from "../SVG/IconUnpaste.svelte";
    import IconNewFolder from "../SVG/IconNewFolder.svelte";
    import IconUpload from "../SVG/IconUpload.svelte";
    import IconReload from "../SVG/IconReload.svelte";
    import IconShare from "../SVG/IconShare.svelte";
    import Properties from "../Snippets/Properties.svelte";
    import Sharing from "../Snippets/Sharing.svelte";
    import IconLogout from "../SVG/IconLogout.svelte";

    export let path: string[];
    export let mule: Mule;
    export let sorter: (f1: File, f2: File) => number;
    export let mode: string;
    export let config: Config;

    $: toPaste = null;
    $: isCut = false;

    $: propForFile = null;
    $: sharingOpen = false;

    const dispatch = createEventDispatcher();

    onMount(() => {
        resort(SORTERS.ABC)();
        new Dropdown("#SortBy");
    });

    onDestroy(() => {
        destroy("#SortBy");
    });

    function click(event) {
        const file = mule.items.find((i: File) => i.uuid == event.detail.uuid);
        if (file.isDir) {
            // cd
            let nuPath: string[] = path;
            if (file.name == "../") nuPath = nuPath.slice(0, nuPath.length - 1);
            else nuPath = [...nuPath, file.name];
            dispatch("pathEvent", {path: nuPath});
        } else {
            dispatch("openItem", event.detail);
        }
    }

    function markToPaste(event) {
        toPaste = event.detail.file;
        isCut = event.detail.isCut;
    }

    function unmarkToPaste() {
        toPaste = null;
        isCut = false;
    }

    async function doPaste() {
        const srv = isCut ? "move" : "copy";

        const dest = path.join("") + "/";

        const res: Response =
            await fetch(
                "fsOps/" + srv + "?path=" + encodeURIComponent(toPaste.path) + "&destDir=" + encodeURIComponent(dest),
                {
                    method: "POST",
                    headers: {
                        "X-Csrf-Token": getCookie("csrf_"),
                        "x-pupcloud-session": sessionStorage.getItem("x-pupcloud-session"),
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
            unmarkToPaste();
            reload();
        }
    }

    function resort(_sorter: (f1: File, f2: File) => number): () => void {
        return function () {
            sorter = _sorter;
        };
    }

    function gridOrList() {
        mode = mode == "GRID" ? "LIST" : "GRID";
    }

    async function newFolder() {
        const {value: name} = await Swal.fire({
            titleText: "Enter folder name",
            confirmButtonColor: "#0a6bb8",
            showCancelButton: true,
            input: "text",
            inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off",
            },
        });

        if (!name) {
            return;
        }

        const res: Response =
            await fetch(
                "fsOps/newFolder?path=" + encodeURIComponent(path.join("") + "/" + name),
                {
                    method: "PUT",
                    headers: {
                        "X-Csrf-Token": getCookie("csrf_"),
                        "x-pupcloud-session": sessionStorage.getItem("x-pupcloud-session"),
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
            reload();
        }
    }

    async function doUpload() {
        const {value: file} = await Swal.fire({
            titleText: "Select files",
            confirmButtonColor: "#0a6bb8",
            showCancelButton: true,
            input: "file",
        });

        if (!file) return;

        if (file.size > config.maxReqSize) {
            await Swal.fire({
                icon: "error",
                html: "File too large; try launching the server<br/>" +
                    "with a larger <code>--max-upload-size</code>.",
                confirmButtonColor: "#0a6bb8",
            });
            return;
        }

        const fd = new FormData();
        fd.append("doc", file);

        try {
            const res: Response =
                await fetch(
                    "fsOps/upload?path=" + encodeURIComponent(path.join("") + "/"),
                    {
                        method: "PUT",
                        body: fd,
                        headers: {
                            "X-Csrf-Token": getCookie("csrf_"),
                            "x-pupcloud-session": sessionStorage.getItem("x-pupcloud-session"),
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
                reload();
            }
        } catch (e: Error) {
            // in Firefox, some network errors (e.g. request too large)
            // are rendered as TypeError's, without further details. NOT NICE
            await Swal.fire({
                icon: "error",
                text: e.message,
                confirmButtonColor: "#0a6bb8",
            });
            return;
        }
    }

    function reload() {
        dispatch("reload", {});
    }

    function doOpenPropsModal(event) {
        propForFile = event.detail.file;
    }

    function doClosePropsModal(event) {
        propForFile = null;
        reload();
    }

    function doOpenSharingModal(event) {
        sharingOpen = true;
    }

    function doCloseSharingModal(event) {
        sharingOpen = false;
    }

    function logout() {
        dispatch("logout", {});
    }
</script>

<nav class="navbar" style="height: 40px;">
    <Breadcrumb bind:path on:pathEvent/>
    <div class="navbar-menu ml-auto" style="height: 40px;">
        {#if !!toPaste}
            <div class="navbar-link" title="Paste" transition:fade on:click={doPaste}>
                <IconPaste color="#AA0000" size={24}/>
            </div>
            <div class="navbar-link" title="Abort paste" transition:fade on:click={unmarkToPaste}>
                <IconUnpaste color="#AA0000" size={24}/>
            </div>
        {/if}
        <div>&nbsp;</div>
        {#if !config.readOnly}
            <div class="navbar-link" title="Create folder" on:click={newFolder}>
                <IconNewFolder size={24}/>
            </div>
            <div class="navbar-link" title="Upload file(s)" on:click={doUpload}>
                <IconUpload size={24}/>
            </div>
        {/if}
        {#if config.sharing != null}
            <div class="navbar-link" title="Share link for this folder" on:click={doOpenSharingModal}>
                <IconShare size={24}/>
            </div>
        {/if}
        <div class="navbar-link" title="Reload file list" on:click={reload}>
            <IconReload size={24}/>
        </div>
        <div class="navbar-link" title="View mode" on:click={gridOrList}>
            {#if mode == 'GRID'}
                <IconGrid size={24}/>
            {:else}
                <IconList size={24}/>
            {/if}
        </div>
        <div class="dropdown" id="SortBy">
            <div class="navbar-link" data-target="SortBy" title="Sort by" style="height: 40px;">
                {#if sorter == SORTERS.ABC}
                    <IconSortAlphAsc size={24}/>
                {:else if sorter == SORTERS.CBA}
                    <IconSortAlphDesc size={24}/>
                {:else if sorter == SORTERS.OldFirst}
                    <IconSortDateAsc size={24}/>
                {:else if sorter == SORTERS.OldLast}
                    <IconSortDateDesc size={24}/>
                {:else if sorter == SORTERS.SmallFirst}
                    <IconSortSizeAsc size={24}/>
                {:else if sorter == SORTERS.SmallLast}
                    <IconSortSizeDesc size={24}/>
                {/if}
            </div>
            <div class="dropdown-content dropdown-right white shadow-1">
                <div class="dropdown-item" on:click={resort(SORTERS.ABC)} class:active={sorter == SORTERS.ABC}
                     title="Sort alphabetically, ascending">
                    <IconSortAlphAsc size={24}/>
                </div>
                <div class="dropdown-item" on:click={resort(SORTERS.CBA)} class:active={sorter == SORTERS.CBA}
                     title="Sort alphabetically, descending">
                    <IconSortAlphDesc size={24}/>
                </div>
                <div class="dropdown-item" on:click={resort(SORTERS.OldFirst)} class:active={sorter == SORTERS.OldFirst}
                     title="Sort by date, ascending">
                    <IconSortDateAsc size={24}/>
                </div>
                <div class="dropdown-item" on:click={resort(SORTERS.OldLast)} class:active={sorter == SORTERS.OldLast}
                     title="Sort by date, descending">
                    <IconSortDateDesc size={24}/>
                </div>
                <div class="dropdown-item" on:click={resort(SORTERS.SmallFirst)}
                     class:active={sorter == SORTERS.SmallFirst} title="Sort by size, ascending">
                    <IconSortSizeAsc size={24}/>
                </div>
                <div class="dropdown-item" on:click={resort(SORTERS.SmallLast)}
                     class:active={sorter == SORTERS.SmallLast} title="Sort by size, descending">
                    <IconSortSizeDesc size={24}/>
                </div>
            </div>
        </div>
        {#if config.hasPassword}
            <div class="navbar-link" title="Log out" on:click={logout}>
                <IconLogout size={24}/>
            </div>
        {/if}
    </div>
</nav>
{#if mode == 'GRID'}
    <Grid itemList={mule.items} on:openItem={click} on:reload on:openPropsModal={doOpenPropsModal}/>
{:else}
    <List itemList={mule.items} bind:sorter on:openItem={click} on:reload on:openPropsModal={doOpenPropsModal}/>
{/if}
<div>&nbsp;</div>
<div>&nbsp;</div>
<div>&nbsp;</div>
{#if propForFile != null}
    <Properties bind:item={propForFile} readOnly={config.readOnly} on:toPaste={markToPaste}
                on:closePropsModal={doClosePropsModal}/>
{/if}
{#if sharingOpen}
    <Sharing dir={path.join("") + "/"} {config} on:closeShareModal={doCloseSharingModal}/>
{/if}
