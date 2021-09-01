<template>
  <div>
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
            @click="$refs.accountFormDialog.dialog = true"
          >
            <v-icon
              left
              v-text="'mdi-plus'"
            />
            add accounts
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

      <v-card-text class="px-0 pb-1">
        <v-layout
          v-resize="onResize"
          fluid
        >
          <v-data-table
            :height="windowSize.y - 105 - 65 - 100 - 77"
            :headers="headers"
            :items="accounts"
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

    <AccountFormDialog
      ref="accountFormDialog"
      @init="$emit('init')"
    />
  </div>
</template>

<script>
import LocalStorage from '@/mixins/localstorage'
import File from '@/mixins/file'

import AccountFormDialog from '@/components/Profiles/AccountFormDialog'

export default {
  components: {
    AccountFormDialog
  },
  mixins: [LocalStorage, File],
  props: {
    accounts: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      windowSize: {
        x: 0,
        y: 0
      },
      headers: [
        { text: 'email', value: 'email' },
        { text: 'actions', value: 'actions' }
      ]
    }
  },
  methods: {
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    /**
     * On edit event
     */
    onEdit (item) {
      this.$refs.accountFormDialog.isEditMode = true
      this.$refs.accountFormDialog.selected = { ...item }
      this.$refs.accountFormDialog.dialog = true
    },
    /**
     * On delete event
     */
    async onDelete (item) {
      const accounts = this.accounts.slice()
      const index = accounts.findIndex(v => v.id === item.id)

      accounts.splice(index, 1)

      await this.saveToLocalStorage('accounts', accounts)

      this.$emit('init')
    },
    /**
     * Import all accounts
     */
    async importFromJson () {
      let accounts = this.accounts.slice()
      let data = await this.importJson('Import Accounts')

      if (data && data.length) {
        data = this.setUniqueIds(accounts, data)

        accounts = [...accounts, ...data]

        await this.saveToLocalStorage('accounts', accounts)

        this.$emit('init')
      }
    },
    /**
     * Export all accounts
     */
    exportToJson () {
      let accounts = this.accounts.slice()

      accounts = accounts.map(val => {
        delete val.id

        return val
      })

      this.exportJson(accounts, 'Export Accounts To JSON')
    }
  }
}
</script>
