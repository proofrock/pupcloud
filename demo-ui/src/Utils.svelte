<script lang="ts" context="module">
    // Adapted from https://www.tabnine.com/academy/javascript/how-to-get-cookies/
    // TODO cache?
    export function getCookie(cName: string): string {
        const name = cName + "=";
        const vals = decodeURIComponent(document.cookie).split("; ");
        for (let i = 0; i < vals.length; i++) {
            if (vals[i].indexOf(name) == 0) return vals[i].substring(name.length);
        }
        return "";
    }
</script>
