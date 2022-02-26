<script lang="ts">
  export let size: number;
  export let color: string = "#000000";
</script>

<!--https://dev.materialdesignicons.com/icon/view-grid-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"
  width={size}
  height={size}
  viewBox="0 0 {size} {size}">
  <path
    fill={color}
    d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3" />
</svg>
