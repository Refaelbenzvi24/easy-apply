<script setup lang="ts">
import AutoFillSettings from "~/components/Settings/AutoFillSettings.vue";
import Tabs from "~/components/UI/Tabs/Tabs.vue";
import Tab from "~/components/UI/Tabs/Tab.vue";
import JobsSettings from "~/components/Settings/JobsSettings.vue";
import AppBar from "~/components/UI/AppBar/AppBar.vue";

const tabs = ['Auto Fill', 'Jobs']
const activeTab = ref(tabs[0])

const show = ref(true)


</script>

<template>
  <main>
    <app-bar>
      <h1>Settings</h1>

      <Tabs class="ml-20" v-model="activeTab">
        <Tab
            v-for="tab of tabs"
            @click="() => activeTab = tab"
            :active-tab="activeTab"
            :key="tab"
            :value="tab">
          {{ tab }}
        </Tab>
      </Tabs>
    </app-bar>


    <div class="flex flex-col pt-15 h-full">
      <div class="h-full w-[1000px] mx-auto">
        <TransitionGroup>
          <Transition key="auto-fill">
            <div class="flex h-full w-full justify-center pt-10" v-if="activeTab === 'Auto Fill'">
              <auto-fill-settings/>
            </div>
          </Transition>

          <Transition key="Jobs">
            <jobs-settings v-if="activeTab === 'Jobs'"/>
          </Transition>
        </TransitionGroup>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  @apply text-10;
}

main {
  @apply flex flex-col text-gray-700 dark:text-gray-200 h-full bg-light-50;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 300ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
