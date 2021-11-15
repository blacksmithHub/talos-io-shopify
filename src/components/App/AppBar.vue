<template>
  <v-app-bar
    dense
    app
    class="systemBar"
  >
    <v-toolbar-title>
      <v-img
        class="shrink"
        contain
        :src="require('@/assets/talos.png')"
        transition="scale-transition"
        width="35"
      />
    </v-toolbar-title>

    <v-spacer />

    <v-menu
      offset-y
      :close-on-content-click="false"
      max-width="400"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          avatar
          bordered
          overlap
          :value="!!notifCount"
        >
          <template v-slot:badge>
            <v-avatar v-text="notifCount" />
          </template>

          <v-btn
            depressed
            icon
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-text="'mdi-bell-outline'" />
          </v-btn>
        </v-badge>
      </template>

      <v-list
        two-line
        dense
      >
        <template v-for="(item, index) in items">
          <v-list-item
            :key="`${index}-a`"
            dense
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />

              <v-list-item-subtitle
                class="text--primary"
                v-text="item.headline"
              />

              <v-list-item-subtitle v-text="item.subtitle" />
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text v-text="item.action" />

              <v-row
                no-gutters
                justify="center"
                align="center"
              >
                <v-col
                  align-self="center"
                  cols="6"
                >
                  <v-btn
                    icon
                    small
                  >
                    <v-icon
                      color="grey lighten-1"
                      small
                      v-text="'mdi-check'"
                    />
                  </v-btn>
                </v-col>

                <v-col
                  align-self="center"
                  cols="6"
                >
                  <v-btn
                    icon
                    small
                  >
                    <v-icon
                      color="grey lighten-1"
                      small
                      v-text="'mdi-close'"
                    />
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-action>
          </v-list-item>

          <v-divider
            v-if="index < items.length - 1"
            :key="`${index}-b`"
          />
        </template>
      </v-list>
    </v-menu>

    <div class="mx-8">
      <v-row
        no-gutters
        align="center"
        justify="center"
      >
        <v-col align-self="center">
          <v-avatar
            size="36"
            class="avatar"
          >
            <img :src="avatar">
          </v-avatar>
        </v-col>

        <v-col
          class="ml-3"
          align-self="center"
        >
          <span v-text="username" />
        </v-col>
      </v-row>
    </div>

    <div class="win-actions">
      <v-btn
        depressed
        tile
        class="pl-3 black btn-radius"
        dark
        x-small
        @click="onMinimize"
      >
        <v-icon
          x-small
          v-text="'mdi-window-minimize'"
        />
      </v-btn>

      <v-btn
        depressed
        tile
        class="pl-3 black"
        dark
        x-small
        @click="onMaximize"
      >
        <v-icon
          x-small
          v-text="(isMaximized) ? 'mdi-window-restore' : 'mdi-window-maximize'"
        />
      </v-btn>

      <v-btn
        depressed
        tile
        class="pl-3 close black"
        x-small
        dark
        @click="onClose"
      >
        <v-icon
          x-small
          v-text="'mdi-window-close'"
        />
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { remote } from 'electron'

export default {
  data () {
    return {
      notifCount: 2,
      username: 'Blacksmith#3105',
      avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
      items: [
        {
          action: '15 min',
          headline: 'Brunch this weekend?',
          subtitle: 'I\'ll be in your neighborhood doing errands this weekend. Do you want to hang out?',
          title: 'Ali Connors'
        },
        {
          action: '2 hr',
          headline: 'Summer BBQ',
          subtitle: 'Wish I could come, but I\'m out of town this weekend.',
          title: 'me, Scrott, Jennifer'
        },
        {
          action: '6 hr',
          headline: 'Oui oui',
          subtitle: 'Do you have Paris recommendations? Have you ever been?',
          title: 'Sandra Adams'
        },
        {
          action: '12 hr',
          headline: 'Birthday gift',
          subtitle: 'Have any ideas about what we should get Heidi for her birthday?',
          title: 'Trevor Hansen'
        },
        {
          action: '18hr',
          headline: 'Recipe to try',
          subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
          title: 'Britta Holt'
        }
      ],
      isMaximized: false
    }
  },
  methods: {
    onClose () {
      remote.getCurrentWindow().close()
    },
    onMaximize () {
      const win = remote.getCurrentWindow()

      if (!win.isMaximized()) {
        this.isMaximized = true
        win.maximize()
      } else {
        this.isMaximized = false
        win.unmaximize()
      }
    },
    onMinimize () {
      remote.getCurrentWindow().minimize()
    }
  }
}
</script>

<style scoped>
.close:hover {
  background-color: red !important;
}
.avatar {
  border: 1px solid var(--v-primary-base) !important;
}
.win-actions {
  margin-bottom: 30px;
  margin-right: -15.5px;
}
.btn-radius {
  border-bottom-left-radius: 10px;
}
</style>
