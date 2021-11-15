<template>
  <v-app>
    <AppBar />

    <v-main>
      <v-tabs
        vertical
        style="height: 100% !important"
      >
        <v-tab
          v-for="(tab, index) in tabs"
          :key="index"
          class="justify-start"
        >
          <v-icon
            small
            left
            v-text="tab.icon"
          />
          <span
            class="overline"
            v-text="tab.title"
          />
        </v-tab>

        <v-tab-item>
          <Tasks />
        </v-tab-item>

        <v-tab-item>
          <Proxies />
        </v-tab-item>

        <v-tab-item>
          <Profiles />
        </v-tab-item>

        <v-tab-item>
          <Settings />
        </v-tab-item>
      </v-tabs>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/App/AppBar'
import Tasks from '@/components/Tasks/Index.vue'
import Proxies from '@/components/Proxies/Index.vue'
import Profiles from '@/components/Profiles/Index.vue'
import Settings from '@/components/Settings/Index.vue'

export default {
  components: {
    AppBar,
    Tasks,
    Proxies,
    Profiles,
    Settings
  },
  data () {
    return {
      tabs: [
        {
          icon: 'mdi-robot',
          title: 'tasks'
        },
        {
          icon: 'mdi-web',
          title: 'proxies'
        },
        {
          icon: 'mdi-badge-account-horizontal',
          title: 'profiles'
        },
        {
          icon: 'mdi-tools',
          title: 'settings'
        }
      ]
    }
  }
}
</script>
