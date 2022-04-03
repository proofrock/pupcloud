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
    import {Config} from "./Struct.svelte";
    import {onMount} from "svelte";
    import Swal from "sweetalert2";

    let cycleHandler: number = -1;
    let firstAuth: boolean = true;

    $: config = null;

    onMount(async () => {
        await auth();
    });

    async function auth() {
        const params = new URLSearchParams(window.location.search);

        let url = "/mocks/features.json";
        if (params.has("x")) {
            url +=
                "?p=" + encodeURIComponent(params.get("p")) +
                "&r=" + encodeURIComponent(params.get("r")) +
                "&x=" + encodeURIComponent(params.get("x"));
        }

        let password: string = "";
        while (true) {
            let res: Response | any = null;
            try {
                res = await fetch(url, {
                    headers: {
                        "x-pupcloud-pwd": password,
                    },
                });
            } catch (e) {
                res = {
                    status: 500,
                    text: () => "Server is down"
                }
            }

            if (res.status == 200) {
                const cfgObj = await res.json();
                config = Config.fromAny(cfgObj);
                firstAuth = false;
                cycleHandler = setTimeout(auth, 2000);
                break;
            }

            config = null;

            if (res.status == 499) {
                if (firstAuth)
                    firstAuth = false;
                else {
                    await Swal.fire({
                        icon: "error",
                        text: await res.text(),
                        confirmButtonColor: "#0a6bb8",
                    });
                }

                const {value: pwd} = await Swal.fire({
                    titleText: "Enter password",
                    confirmButtonColor: "#0a6bb8",
                    input: "password",
                    inputAttributes: {
                        autocapitalize: "off",
                        autocorrect: "off",
                    },
                });
                password = pwd;
            } else {
                await Swal.fire({
                    icon: "error",
                    text: await res.text(),
                    confirmButtonColor: "#0a6bb8",
                });
            }
        }
    }

    // adapted from https://www.geeksforgeeks.org/how-to-clear-all-cookies-using-javascript/
    function deleteCookies() {
        const allCookies = document.cookie.split(';');
        for (let i = 0; i < allCookies.length; i++)
            document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();
    }

    async function logout() {
        deleteCookies();
        config = null;
        firstAuth = true;
        if (cycleHandler >= 0)
            clearTimeout(cycleHandler);
        await auth();
    }
</script>

{#if config != null}
    <App {config} on:logout={logout}/>
{:else}
    <div class="blanket"/>
{/if}
