<template>
  <div class="ui">

    <Head></Head>
    <div class="interface">
      <div class="status card">
        <p>API Status</p>
        <p v-if="data.api.status == 'checking'">Checking...</p>
        <p class="online" v-if="data.api.status == 'online'">Online ({{ data.api.ms }}ms)</p>
      </div>
      <div class="preview">
        <h2>Preview</h2>
        <img :src="`${data.config.api}/wallpaper/1920/1080/${data.config.luminance}`" alt="" srcset="">
      </div>
      <div class="setup card">
        <h2>Setup</h2>
        <div class="option">
          <p>Automatic Update</p>
          <select name="luminance" id="luminance" v-model="data.config.enabled">
            <option :value="true">Enabled</option>
            <option :value="false">Disabled</option>
          </select>
        </div>
        <div class="option">
          <p>Update Interval</p>
          <select name="interval" id="interval" v-model="data.config.interval">
            <option :value="900000" ty>15 Minutes</option>
            <option :value="3600000">1 Hour</option>
            <option :value="10800000">3 Hours</option>
            <option :value="86400000">24 Hours</option>
          </select>
        </div>
        <div class="option">
          <p>Luminance</p>
          <select name="luminance" id="luminance" v-model="data.config.luminance">
            <option :value="20">Dark</option>
            <option :value="50">Medium</option>
            <option :value="150">Bright</option>
          </select>
        </div>
      </div>
      <button @click="setConfig">Apply</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Head from './components/Head.vue';
import axios from 'axios';

const data = reactive({
  config: {} as Config,
  api: {
    status: 'checking',
    ms: 0
  }
})

window.ipcRenderer.on('config-get', (_event, ...args) => {
  init(args[0])
})

function setConfig() {
  window.ipcRenderer.send("config-set", JSON.stringify(data.config))
}

async function init(config: Config) {
  data.config = config

  //test API
  try {
    const t0 = performance.now();
    const res = await axios.get(`${config.api}/status`)

    data.api.status = 'online'
    data.api.ms = Math.round(performance.now() - t0)
  }
  catch (err) {
    console.log(err);
  }
}
</script>

<style>
.interface {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 15px;
  padding-top: 15px;
}

.card {
  background-color: var(--background);
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
  color: var(--text);
  border-radius: 5px;
  box-shadow: 0px 0px 5px var(--shadow);
}

.status {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: small;
}

.online {
  color: var(--success);
}

.option {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

.option select {
  outline: none;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.829);
  border: none;
  cursor: pointer;
  width: 100px;
}

.preview {
  margin-left: 15px;
  margin-right: 15px;
  color: var(--text);
  border-radius: 5px;
  box-shadow: 0px 0px 5px var(--shadow);
  position: relative;
  height: 140px;
}

.preview img {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  object-fit: cover;
}

.preview h2 {
  position: absolute;
  color: white;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-shadow: 0px 0px 15px black;
}

button {
  background-color: var(--background);
  color: var(--primary);
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 5px;
  box-shadow: 0px 0px 5px var(--shadow);
  outline: none;
  border: 0;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  color: white;
  background-color: var(--primary);
}
</style>
