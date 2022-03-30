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

    import {onMount, createEventDispatcher} from "svelte";
    import {Modal, destroy} from "axentix";
    import {getCookie} from "../Utils.svelte";
    import type {File} from "../Struct.svelte";
    import Swal from "sweetalert2";

    export let item: File;
    export let readOnly: boolean;

    const dispatch = createEventDispatcher();
    let modal = null;

    onMount(() => {
        modal = new Modal("#modal-properties", {bodyScrolling: true});
        const modalQuery = document.querySelector("#modal-properties");
        modalQuery.addEventListener("ax.modal.closed", function () {
            destroy("#modal-properties");
            dispatch("closePropsModal");
        });
        modal.open();
    });

    async function rename() {
        const {value: nuName} = await Swal.fire({
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

        await Swal.fire({
            icon: "warning",
            text: "Not implemented in the demo site",
            confirmButtonColor: "#0a6bb8",
        });

        modal.close();
    }

    async function del() {
        const {value: confirm} = await Swal.fire({
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

        await Swal.fire({
            icon: "warning",
            text: "Not implemented in the demo site",
            confirmButtonColor: "#0a6bb8",
        });

        modal.close();
    }

    function toPaste(isCut: boolean) {
        return function () {
            dispatch("toPaste", {file: item, isCut: isCut});
            modal.close();
        };
    }
</script>

<div class="modal shadow-1 white rounded-3 modal-bouncing" id="modal-properties">
    <div class="modal-header ellipsis">
        <img alt={item.icon[0]} src="icons/48x48/{item.icon[0]}.svg"/>&nbsp;{item.name}
    </div>
    <div class="modal-content container">
        <p class="ellipsis"><b>File name:</b> <span title={item.name}>{item.name}</span></p>
        <p class="ellipsis"><b>Size:</b> {item.size}</p>
        <p class="ellipsis"><b>Mod. date:</b> {item.chDate}</p>
        <p class="ellipsis"><b>Type:</b> {item.mimeType}</p>
        <p class="ellipsis"><b>Owner:</b> {item.owner}</p>
        <p class="ellipsis"><b>Group:</b> {item.group}</p>
        <p class="ellipsis"><b>Permissions:</b> {item.permissions}</p>
        <div>&nbsp;</div>
        {#if !readOnly && (!item.isDir || item.name != '../')}
            <div class="btn-group btn-group-small rounded-1 hide-xs mx-auto">
                <div class="btn primary" on:click|stopPropagation={toPaste(true)}>Cut</div>
                <div class="btn primary" on:click|stopPropagation={toPaste(false)}>Copy</div>
                <div class="btn primary" on:click|stopPropagation={rename}>Rename</div>
                <div class="btn error" on:click|stopPropagation={del}>Delete</div>
            </div>
            <div class="hide-sm-up">
                <div class="btn-group btn-group-small rounded-1 mx-auto">
                    <div class="btn primary" on:click|stopPropagation={toPaste(true)}>Cut</div>
                    <div class="btn primary" on:click|stopPropagation={toPaste(false)}>Copy</div>
                </div>
                <div>&nbsp;</div>
                <div class="btn-group btn-group-small rounded-1 mx-auto">
                    <div class="btn primary" on:click|stopPropagation={rename}>Rename</div>
                    <div class="btn error" on:click|stopPropagation={del}>Delete</div>
                </div>
            </div>
        {/if}
    </div>
</div>
