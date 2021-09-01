<template>
  <div>
    <v-container fluid>
      <v-card rounded>
        <v-card-title class="px-0 pt-0 pb-1">
          <v-toolbar
            dense
            flat
            rounded
          >
            <v-btn
              rounded
              class="primary"
              small
              @click="$refs.proxyFormDialog.dialog = true"
            >
              <v-icon
                left
                v-text="'mdi-plus'"
              />
              add proxy list
            </v-btn>

            <v-spacer />

            <v-btn
              rounded
              small
              @click="exportToJson"
            >
              <v-icon
                left
                v-text="'mdi-download'"
              />
              export
            </v-btn>

            <v-btn
              rounded
              class="ml-3"
              small
              @click="importFromJson"
            >
              <v-icon
                left
                v-text="'mdi-upload'"
              />
              import
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-layout
            v-resize="onResize"
            fluid
          >
            <v-data-table
              :height="windowSize.y - 105 - 65 - 100 - 77"
              :headers="headers"
              :items="proxies"
              disable-filtering
              disable-pagination
              disable-sort
              hide-default-footer
              no-data-text="Nothing to display"
              no-results-text="Nothing to display"
              item-key="id"
              fixed-header
              hide-default-header
              style="width: 100%"
            >
              <template v-slot:item.total="{item}">
                <span v-text="`Total: ${item.items.length}`" />
              </template>

              <template v-slot:item.actions="{item}">
                <div class="text-right">
                  <v-btn
                    icon
                    color="warning"
                    depressed
                    @click="onEdit(item)"
                  >
                    <v-icon
                      small
                      v-text="'mdi-pencil'"
                    />
                  </v-btn>

                  <v-btn
                    icon
                    color="red"
                    depressed
                    @click="onDelete(item)"
                  >
                    <v-icon
                      small
                      v-text="'mdi-delete'"
                    />
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>

    <ProxyFormDialog
      ref="proxyFormDialog"
      @init="init"
    />
  </div>
</template>

<script>
import LocalStorage from '@/mixins/localstorage'
import File from '@/mixins/file'

import ProxyFormDialog from '@/components/Proxies/ProxyFormDialog'

export default {
  components: {
    ProxyFormDialog
  },
  mixins: [LocalStorage, File],
  data () {
    return {
      windowSize: {
        x: 0,
        y: 0
      },
      headers: [
        { text: 'name', value: 'name' },
        { text: 'total', value: 'total' },
        { text: 'actions', value: 'actions' }
      ],
      proxies: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    /**
     * Initialize list
     */
    async init () {
      await this.getLocalStorage('proxies')
        .then(res => {
          this.proxies = res || []
        })
        .catch(err => console.log(err))
    },
    /**
     * On edit event
     */
    onEdit (item) {
      this.$refs.proxyFormDialog.isEditMode = true
      this.$refs.proxyFormDialog.dialog = true
      this.$refs.proxyFormDialog.selectedId = item.id
      this.$refs.proxyFormDialog.proxies = item.items
      this.$refs.proxyFormDialog.name = item.name
    },
    /**
     * On delete event
     */
    async onDelete (item) {
      const proxies = this.proxies.slice()
      const index = proxies.findIndex(v => v.id === item.id)

      proxies.splice(index, 1)

      await this.saveToLocalStorage('proxies', proxies)

      this.init()
    },
    /**
     * Import all proxies
     */
    async importFromJson () {
      let proxies = this.proxies.slice()
      let data = await this.importJson('Import Proxies')

      if (data && data.length) {
        data = this.setUniqueIds(proxies, data)

        proxies = [...proxies, ...data]

        await this.saveToLocalStorage('proxies', proxies)

        this.init()
      }
    },
    /**
     * Export all proxies
     */
    exportToJson () {
      let proxies = this.proxies.slice()

      proxies = proxies.map(val => {
        delete val.id

        return val
      })

      this.exportJson(proxies, 'Export Proxies To JSON')
    }
  }
}
</script>
