<script lang="ts">
import { ref } from 'vue';

let series: object = {}
let options: object = {}
</script>
<template>
    <apexchart width="700" :options="options" :series="series"></apexchart>
</template>
<style>
</style>