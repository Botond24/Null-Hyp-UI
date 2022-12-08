<script setup lang="ts">
import { open } from '@tauri-apps/api/shell';
import { emit, listen } from "@tauri-apps/api/event";
import SerialStuff from "./components/SerialStuff.vue";
import { logDir } from '@tauri-apps/api/path';
import { onMounted } from 'vue';
 

let dataPath = ""
let logDirPath = ""
listen<string>("dataPath", (e) => {
  dataPath = e.payload;
})

async function buttonHandler(file:string) {
  console.log(file)
  console.log(logDirPath)
  switch (file) {
    case "logs":
      await open(logDirPath)
      break;
    case "data":
      if (dataPath == ""){
        emit("error", "Data file not selected")
      }
      await open(dataPath);
      break;
  }
}

onMounted( async () =>{
  logDirPath = await logDir();
})
</script>

<template>
  <h1>Null Hypothesis UI Testing</h1>
  <SerialStuff />
  <br />
  <button title="Logs" @click="buttonHandler('log')"><mdicon name="file-clock" /></button>
  <button title="Data" @click="buttonHandler('data')"><mdicon name="file-excel"/></button>
</template>

<style scoped>
</style>
