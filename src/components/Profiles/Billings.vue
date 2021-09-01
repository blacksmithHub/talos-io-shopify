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
            @click="$refs.billingFormDialog.dialog = true"
          >
            <v-icon
              left
              v-text="'mdi-plus'"
            />
            add billing
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
            :items="billings"
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

    <BillingFormDialog
      ref="billingFormDialog"
      @init="$emit('init')"
    />
  </div>
</template>

<script>
import LocalStorage from '@/mixins/localstorage'
import File from '@/mixins/file'

import BillingFormDialog from '@/components/Profiles/BillingFormDialog'

export default {
  components: {
    BillingFormDialog
  },
  mixins: [LocalStorage, File],
  props: {
    billings: {
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
        { text: 'name', value: 'name' },
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
      this.$refs.billingFormDialog.isEditMode = true
      this.$refs.billingFormDialog.dialog = true
      this.$refs.billingFormDialog.selectedId = item.id
      this.$refs.billingFormDialog.shipping = item.shipping
      this.$refs.billingFormDialog.billing = item.billing
      this.$refs.billingFormDialog.card = item.card
      this.$refs.billingFormDialog.name = item.name
    },
    /**
     * On delete event
     */
    async onDelete (item) {
      const billings = this.billings.slice()
      const index = billings.findIndex(v => v.id === item.id)

      billings.splice(index, 1)

      await this.saveToLocalStorage('billings', billings)

      this.$emit('init')
    },
    /**
     * Import all billings
     */
    async importFromJson () {
      let billings = this.billings.slice()
      let data = await this.importJson('Import Billings')

      if (data && data.length) {
        data = this.setUniqueIds(billings, data)

        billings = [...billings, ...data]

        await this.saveToLocalStorage('billings', billings)

        this.$emit('init')
      }
    },
    /**
     * Export all billings
     */
    exportToJson () {
      let billings = this.billings.slice()

      billings = billings.map(val => {
        delete val.id

        return val
      })

      this.exportJson(billings, 'Export Billings To JSON')
    }
  }
}
</script>
