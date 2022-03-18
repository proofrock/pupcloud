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
    import type {File} from "../Struct.svelte";
    import Swal from "sweetalert2";

    export let item: File;
    export let readOnly: boolean;

    const dispatch = createEventDispatcher();
    let modal = null;

    onMount(() => {
        modal = new Modal("#modal-properties");
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
    <div class="modal-header text-center ellipsis">
        <img alt={item.icon} src="icons/48x48/{item.icon}.svg"/>&nbsp;{item.name}
    </div>
    <div class="modal-content container">
        <div class="grix xs1 md3 gutter-md2">
            <div class="text-left col-md2">
                <table>
                    <tr>
                        <th>File name:</th>
                        <td>{item.name}</td>
                    </tr>
                    <tr>
                        <th>Size:</th>
                        <td>{item.size}</td>
                    </tr>
                    <tr>
                        <th>Mod. date:</th>
                        <td>{item.chDate}</td>
                    </tr>
                    <tr>
                        <th>Type:</th>
                        <td>{item.mimeType}</td>
                    </tr>
                    <tr>
                        <th>Owner:</th>
                        <td>{item.owner}</td>
                    </tr>
                    <tr>
                        <th>Group:</th>
                        <td>{item.group}</td>
                    </tr>
                    <tr>
                        <th>Permissions:</th>
                        <td>{item.permissions}</td>
                    </tr>
                </table>
                <div>&nbsp;</div>
            </div>
            <div>
                {#if !readOnly && (!item.isDir || item.name != '../')}
                    <div class="pup-a font-s3 mb-2 cursor-pointer" on:click|stopPropagation={toPaste(true)}>Cut</div>
                    <div class="pup-a font-s3 mb-2 cursor-pointer" on:click|stopPropagation={toPaste(false)}>Copy</div>
                    <div class="pup-a font-s3 mb-2 cursor-pointer" on:click|stopPropagation={rename}>Rename</div>
                    <div class="pup-a font-s3 mb-2 cursor-pointer" on:click|stopPropagation={del}>Delete</div>
                {/if}
            </div>
        </div>
        <div>&nbsp;</div>
    </div>
</div>
