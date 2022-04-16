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

    import ListRow from "./ListRow.svelte";
    import type {File} from "../Struct.svelte";
    import {SORTERS} from "../Struct.svelte";

    export let itemList: File[];
    export let sorter: (f1: File, f2: File) => number;

    const CARET_DOWN = '<span class="monospace font-s1">️ᐁ&nbsp;</span>';
    const CARET_UP = '<span class="monospace font-s1">ᐃ&nbsp;</span>';
    const CARET_NO = '<span class="monospace font-s1">&nbsp;&nbsp;</span>';
    const CARETS = [CARET_UP, CARET_DOWN];
    const WHERES = {NAME: "N", DATE: "D", SIZE: "S"};

    const SORTERS_DECODED: Map<(f1: File, f2: File) => number, [string, number]> = new Map<>();
    SORTERS_DECODED.set(SORTERS.ABC, [WHERES.NAME, 0]);
    SORTERS_DECODED.set(SORTERS.CBA, [WHERES.NAME, 1]);
    SORTERS_DECODED.set(SORTERS.OldFirst, [WHERES.DATE, 0]);
    SORTERS_DECODED.set(SORTERS.OldLast, [WHERES.DATE, 1]);
    SORTERS_DECODED.set(SORTERS.SmallFirst, [WHERES.SIZE, 0]);
    SORTERS_DECODED.set(SORTERS.SmallLast, [WHERES.SIZE, 1]);

    const SORTERS_BY_COORDS: Map<string, [(f1: File, f2: File) => number, (f1: File, f2: File) => number]> = new Map<>();
    SORTERS_BY_COORDS.set(WHERES.NAME, [SORTERS.ABC, SORTERS.CBA]);
    SORTERS_BY_COORDS.set(WHERES.DATE, [SORTERS.OldFirst, SORTERS.OldLast]);
    SORTERS_BY_COORDS.set(WHERES.SIZE, [SORTERS.SmallFirst, SORTERS.SmallLast]);

    let sortingWhere: string;
    let sortingHow: number;

    $: {
        [sortingWhere, sortingHow] = SORTERS_DECODED.get(sorter);
    }

    function getCaret(where: string) {
        if (sortingWhere != where)
            return CARET_NO;
        return CARETS[sortingHow];
    }

    function chSorter(where: string) {
        return function () {
            if (sortingWhere == where) {
                sortingHow = 1 - sortingHow;
            } else {
                sortingWhere = where;
                sortingHow = 0;
            }
            sorter = SORTERS_BY_COORDS.get(sortingWhere)[sortingHow];
        }
    }
</script>

<div class="table-responsive w100">
    <table class="table">
        <tr>
            <th class="noSelect cursor-pointer" on:click={chSorter(WHERES.NAME)}>{@html getCaret(WHERES.NAME, sorter)}
                Name
            </th>
            <th on:click={chSorter(WHERES.SIZE)}>{@html getCaret(WHERES.SIZE, sorter)}Size</th>
            <th class="hide-sm-down" on:click={chSorter(WHERES.DATE)}>{@html getCaret(WHERES.DATE, sorter)}Mod. Date
            </th>
        </tr>
        {#each itemList as item (item.uuid)}
            <ListRow {item} on:openItem on:reload on:openPropsModal/>
        {/each}
    </table>
</div>
