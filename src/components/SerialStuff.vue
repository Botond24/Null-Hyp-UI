<script setup lang="ts">
import 'vue-select/dist/vue-select.css';
import { onMounted, onUpdated, ref } from "vue";
import { emit, listen } from '@tauri-apps/api/event';
import { Serialport } from 'tauri-plugin-serialport-api';
import SerialMonitor from "./SerialMonitor.vue"
import DataList from "./DataList.vue"


const list = ref([""]);
const com = ref("");
const baud = ref(9600);
const error = ref("");
const available = ref(false);
let lastcom = com.value;
let lastbaud = baud.value;
async function getComs() {
    list.value = await Serialport.available_ports();
}

async function asyncOpenSerialPort() {
    if (baud.value != null && com.value != ""){
        if (!available.value) {
            emit("open", {path: com.value, baudRate: baud.value});
        }else{
            emit("change", {path: com.value, baudRate: baud.value});
        }
    }
}

async function close() {
    emit("close")
}

listen<string>("error", (e) =>{
    error.value = e.payload;
})
listen<string>("available", (e) =>{
    available.value = true ? e.payload == "true" : false;
})


onMounted( () => getComs())

onUpdated(() => {
    lastcom = com.value;
    lastbaud = baud.value;
    if ((com.value != lastcom || baud.value != lastbaud) && available.value) {
        emit("change", {path: com.value, baudRate: baud.value});
    }
})
</script>

<template>
    <div id="ComSelector">
        <v-select placeholder="Com Port" v-model="com" id="ComSelect" :options="list"/>
        <v-select taggable placeholder="Baud Rate" v-model="baud" id="BaudSelect" :options="[110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000]"/>
        <button type="button" @click="getComs()" style="margin-right: 0.4%;"><mdicon name="refresh" /></button>
        <button type="button" @click="asyncOpenSerialPort()">Open</button>
        <button type="button" @click="close()">Close</button>
    </div>
    <p id="error">{{error}}</p>
    <div id="views">
        <DataList />
        <SerialMonitor />
    </div>
</template>

<style scoped>
::-webkit-scrollbar{
    width: 10px;
}
::-webkit-scrollbar-track{
    border-radius: 5px;
}
::-webkit-scrollbar-thumb{
    background-color: blueviolet;
    border-radius: 5px;
}
#error{
    text-align: center;
}

#views{
    display: flex;
    align-items: flex-start;
}

#ComSelector{
    width: 100%;
    align-items: flex-start;
}
.v-select {
    width: 100%;
    margin-right: 0.5%;
}
button {
    max-height: 34.4px;
    display: flex;
    align-items: center;
}

:deep() {
    --vs-controls-color: #3a30ff;
    --vs-border-color: #3a30ff;

    --vs-dropdown-bg: #2f2f2f;
    --vs-dropdown-color: #ffffff;
    --vs-dropdown-option-color: #ffffff;

    --vs-selected-bg: #664cc3;
    --vs-selected-color: #eeeeee;

    --vs-search-input-color: #eeeeee;

    --vs-dropdown-option--active-bg: #3700ff;
    --vs-dropdown-option--active-color: #eeeeee;
}
</style>