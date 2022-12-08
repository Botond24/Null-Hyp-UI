<script setup lang="ts">
import { mdiPageLayoutHeader } from '@mdi/js';
import { listen, emit } from '@tauri-apps/api/event';
import { ref } from 'vue';

interface Payload {
    UTCtime?: string,
    GPS?: Sensor,
    accelerometer?: Sensor,
    magnetometer?: Sensor,
    gyroscope?: Sensor,
    pressure?: number,
    temp?: number
}
interface Sensor {
    x: number,
    y: number,
    z: number
}

const payload = ref(<Payload>{});

listen<string>('data', (e) => {
    payload.value = JSON.parse(e.payload);

})

</script>
<template>
    <div id="dataList">
        <ul>
            <li>
                Time:
                {{payload.UTCtime}}
            </li>
            <li>
                GPS: <br/>
                {{}}
            </li>
            <li>
                {{}}
            </li>
            <li>
                {{}}
            </li>
        </ul>
    </div>
</template>
<style>
</style>