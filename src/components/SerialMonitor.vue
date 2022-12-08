<script setup lang="ts">
import { onMounted, ref } from "vue";
import { listen, emit } from "@tauri-apps/api/event";
import { Serialport } from 'tauri-plugin-serialport-api';
import {  } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { normalize } from "@tauri-apps/api/path";

interface Payload {
    UTCtime: string,
    GPS: Sensor,
    accelerometer: Sensor,
    speedometer: Sensor,
    magnetometer: Sensor,
    gyroscope: Sensor,
    pressure: number,
    temp: number
}

interface Sensor {
    x: number,
    y: number,
    z: number
}

const incoming = ref("");
const input = ref("");
let serialport: Serialport | undefined = undefined;
let path = ""

async function opened() {
    normalize("./received_data.csv").then( (p: string) => {
        path = save({
            defaultPath: p,
            title: "Where to save the incoming data?",
            filters: [{
                name: "data",
                extensions: ["csv"]
            }]
        })
        emit("dataPath", p);
    })
    if (serialport == undefined) {
        emit("error", "Serial not open!");
        return;
    }
    serialport.read()
    serialport
      .listen((data: string) => {
        console.log('listen serialport data: ', data);
        incoming.value += data.replace("\\","\\\\")
        
        
      }, true)
      .then((res) => {
        console.log('listen serialport: ', res);
      })
}

async function sendInput() {
    if (serialport == undefined) {
        emit("error", "Serial not open!");
        return;
    }
    if (input.value != ""){
        serialport.write(input.value);
        return;
    }
}
listen<string>("open", (e) => {
    let p = JSON.parse(e.payload)
    serialport = new Serialport({ path: p.path, baudRate: p.baudRate});
    serialport.open().then((res) => {
        emit("available", true);
        emit("error", "Serial conncetion created!")
        opened();
        return;
    }).catch((err) => {
        emit("error", "Unable to create serial connection!");
        emit("available", false);
        return;
    });
});
listen<string>("change", (e) => {
    if (serialport == undefined) {
        emit("error", "Serial not open!");
        return;
    }
    let p = JSON.parse(e.payload)
    serialport.change({path: p.path, baudRate: p.baudRate})
});
listen<string>("close", (e) => {
    if (serialport == undefined) {
        emit("error", "Serial not open!");
        return;
    }
    serialport.close()
})
</script>
<template>
    <div>
        <div id="SerialMonitor">
            <p id="incoming">{{incoming}}</p>
        </div>
        <div id="input">
            <input type="text" v-model="input" placeholder="Enter command..."/>
            <button type="button" @click="sendInput()">Send</button>
        </div>
    </div>
</template>
<style scoped>

#SerialMonitor{
    overflow-y: scroll;
    border-color: blueviolet;
    border-radius: 10px 10px 0px 0px;
    border-width: 5px;
    border-style: solid;
    border-bottom: 0px;
    height: 70vh;
}
#SerialMonitor>p{
    white-space:pre;
}

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

#input{
    border-color: blueviolet;
    border-radius:0px 0px 10px 10px;
    border-width: 5px;
    border-style: solid;
    border-top: 0px;
    display: flex;
    align-items: flex-start;
}
#input>input{
    width: 100%;
    margin-right: 0.5%;
}

</style>