<script setup lang="ts">
import {storageDemo} from '~/logic/storage'
import {sendMessage} from 'webext-bridge'

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

const someTest = async () => {
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
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo/>
    <div>Popup</div>
    <p class="mt-2 opacity-50">
      This is the popup page
    </p>
    <div class="flex flex-row space-x-2 justify-center">
      <button class="btn mt-2" @click="openOptionsPage">
        Open Options
      </button>

      <button class="btn bg-blue-400 mt-2" @click="someTest">
        Autofill
      </button>
    </div>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>
