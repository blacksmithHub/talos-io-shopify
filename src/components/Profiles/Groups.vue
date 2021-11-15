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
            @click="$refs.groupFormDialog.dialog = true"
          >
            <v-icon
              left
              v-text="'mdi-plus'"
            />
            add group
          </v-btn>
        </v-toolbar>
      </v-card-title>

      <v-card-text class="px-0 pb-1">
        <v-layout
          v-resize="onResize"
          fluid
        >
          <v-data-table
            :height="windowSize.y - 131 - 91 - 126 - 103"
            :headers="headers"
            :items="groups"
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
            dense
            class="table"
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

    <GroupFormDialog
      ref="groupFormDialog"
      :accounts="accounts"
      :billings="billings"
      @init="$emit('init')"
    />
  </div>
</template>

<script>
import LocalStorage from '@/mixins/localstorage'

import GroupFormDialog from '@/components/Profiles/GroupFormDialog'

export default {
  components: {
    GroupFormDialog
  },
  mixins: [LocalStorage],
  props: {
    groups: {
      type: Array,
      required: true
    },
    accounts: {
      type: Array,
      required: true
    },
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
        { text: 'total', value: 'total' },
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
      this.$refs.groupFormDialog.isEditMode = true
      this.$refs.groupFormDialog.dialog = true
      this.$refs.groupFormDialog.selectedId = item.id
      this.$refs.groupFormDialog.items = item.items
      this.$refs.groupFormDialog.name = item.name
    },
    /**
     * On delete event
     */
    async onDelete (item) {
      const groups = this.groups.slice()
      const index = groups.findIndex(v => v.id === item.id)

      groups.splice(index, 1)

      await this.saveToLocalStorage('groups', groups)

      this.$emit('init')
    }
  }
}
</script>

<style scoped>
.table >>> td {
  max-width: 100px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
</style>
