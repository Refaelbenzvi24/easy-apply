<script setup lang="ts">
import {sendMessage} from 'webext-bridge'
import Divider from "~/components/UI/Divider/Divider.vue";
import {userData} from "~/logic";

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const autoFill = async () => {
  const currentTab = (await browser.tabs.query({
    active: true,
    currentWindow: true
  }))[0]
  const currentTabId = currentTab.id as number

  await sendMessage('auto-fill', {}, {
    tabId: currentTabId,
    context: 'content-script'
  })
}
</script>

<template>
  <main class="w-[300px]">
    <div class="py-2">
      <div class="px-4">
        <h3 class="text-2xl text-gray-600">Easy Apply</h3>
      </div>
      <div class="flex justify-around px-4 py-4">
        <button class="btn text-3.5" @click="openOptionsPage">
          Open Settings
        </button>

        <button class="btn text-3.5" @click="autoFill">
          Autofill
        </button>
      </div>

      <divider/>

      <div class="flex justify-center pt-2">
        <h5 class="text-5 font-600 text-gray-800">Stats</h5>
      </div>
      <div class="flex py-2 w-full">
        <div class="flex flex-col flex-1 h-full justify-around items-center">
          <p class="text-3 text-gray-500">Non-relevant</p>
          <p class="text-3 text-gray-500">positions viewed</p>
          <h4 class="text-8 text-gray-900">{{ userData.stats.nonRelevantPositions }}</h4>
        </div>

        <div class="flex flex-col flex-1 h-full justify-around items-center">
          <p class="text-3 text-gray-500">Relevant positions</p>
          <p class="text-3 text-gray-500">viewed</p>
          <h4 class="text-8 text-gray-900">{{ userData.stats.relevantPositions }}</h4>
        </div>
      </div>
      <div class="flex py-2 w-full">
        <div class="flex flex-col flex-1 h-full justify-around items-center">
          <p class="text-3 text-gray-500">Positions removed</p>
          <p class="text-3 text-gray-500">from view</p>
          <h6 class="text-8 text-gray-900">{{ userData.stats.positionsRemoved }}</h6>
        </div>

        <div class="flex flex-col flex-1 h-full justify-around items-center">
          <p class="text-3 text-gray-500">Auto Filled</p>
          <p class="text-3 text-gray-500">applications</p>
          <h6 class="text-8 text-gray-900">{{ userData.stats.autoFilledApplications }}</h6>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.btn {
  @apply h-10 px-6 rounded inline-block
  bg-teal-600 text-white cursor-pointer
  hover:bg-teal-700
  disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50;
}
</style>
