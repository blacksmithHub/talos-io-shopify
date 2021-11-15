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
            @click="$refs.taskFormDialog.dialog = true"
          >
            <v-icon
              left
              v-text="'mdi-plus'"
            />
            add task
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
            :height="windowSize.y - 54 - 14 - 49 - 26"
            :headers="headers"
            :items="tasks"
            disable-filtering
            disable-pagination
            hide-default-footer
            no-data-text="Nothing to display"
            no-results-text="Nothing to display"
            item-key="id"
            fixed-header
            style="width: 100%"
            dense
            class="table"
            show-select
          >
            <template v-slot:item.site="{item}">
              <small v-text="item.site.name" />
            </template>

            <template v-slot:item.product="{item}">
              <small v-text="item.product.link || item.product.variant || item.product.sku" />
            </template>

            <template v-slot:item.size="{item}">
              <small v-text="item.product.size.join(', ')" />
            </template>

            <template v-slot:item.billing="{item}">
              <small v-text="item.billing.name" />
            </template>

            <template v-slot:item.proxy="{item}">
              <small v-text="item.proxy.name" />
            </template>

            <template v-slot:item.status>
              <small>setting shipping details</small>
            </template>

            <template v-slot:item.actions="{item}">
              <div class="text-right">
                <v-btn
                  icon
                  color="success"
                  depressed
                  small
                  @click="onStart(item)"
                >
                  <v-icon
                    small
                    v-text="'mdi-play'"
                  />
                </v-btn>

                <v-btn
                  v-if="false"
                  icon
                  color="red"
                  depressed
                  small
                  @click="onStop(item)"
                >
                  <v-icon
                    small
                    v-text="'mdi-stop'"
                  />
                </v-btn>

                <v-btn
                  icon
                  color="warning"
                  depressed
                  small
                  @click="onEdit(item)"
                >
                  <v-icon
                    x-small
                    v-text="'mdi-pencil'"
                  />
                </v-btn>

                <v-menu offset-y>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      icon
                      depressed
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon
                        small
                        v-text="'mdi-dots-vertical'"
                      />
                    </v-btn>
                  </template>

                  <v-list
                    nav
                    dense
                    rounded
                    class="text-center"
                  >
                    <v-list-item
                      link
                      @click="onDelete(item.id)"
                    >
                      <v-list-item-title v-text="'Delete'" />
                    </v-list-item>

                    <v-list-item
                      link
                      @click="onDuplicate(item)"
                    >
                      <v-list-item-title v-text="'Duplicate'" />
                    </v-list-item>

                    <v-list-item link>
                      <v-list-item-title v-text="'Logs'" />
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-data-table>
        </v-layout>
      </v-card-text>
    </v-card>

    <TaskFormDialog
      ref="taskFormDialog"
      :tasks="tasks"
      :proxies="proxies"
      :accounts="accounts"
      :billings="billings"
      :profile-groups="profileGroups"
      @init="init"
      @onDelete="onDelete"
    />
  </div>
</template>

<script>
import LocalStorage from '@/mixins/localstorage'
import File from '@/mixins/file'

import TaskFormDialog from '@/components/Tasks/TaskFormDialog'

export default {
  components: {
    TaskFormDialog
  },
  mixins: [LocalStorage, File],
  data () {
    return {
      windowSize: {
        x: 0,
        y: 0
      },
      headers: [
        {
          text: 'Site',
          value: 'site'
        },
        {
          text: 'Product',
          value: 'product'
        },
        {
          text: 'Size',
          value: 'size'
        },
        {
          text: 'Billing',
          value: 'billing'
        },
        {
          text: 'Proxy List',
          value: 'proxy'
        },
        {
          text: 'Status',
          value: 'status',
          align: 'center'
        },
        {
          text: 'Actions',
          value: 'actions',
          align: 'center',
          filterable: false,
          sortable: false
        }
      ],
      tasks: [],
      proxies: [],
      accounts: [],
      billings: [],
      profileGroups: []
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
      await this.getLocalStorage('tasks')
        .then(res => {
          this.tasks = []

          if (res) {
            res.forEach(async (el) => {
              await this.getLocalStorage(`task-${el.id}`)
                .then(result => result ? this.tasks.push(result) : null)
                .catch(err => console.log(err))
            })
          }
        })
        .catch(err => console.log(err))

      await this.getLocalStorage('proxies')
        .then(res => {
          this.proxies = res || []
          this.proxies.unshift({
            id: 0,
            name: 'Localhost',
            items: []
          })
        })
        .catch(err => console.log(err))

      await this.getLocalStorage('accounts')
        .then(res => {
          this.accounts = res || []
        })
        .catch(err => console.log(err))

      await this.getLocalStorage('billings')
        .then(res => {
          this.billings = res || []
        })
        .catch(err => console.log(err))

      await this.getLocalStorage('groups')
        .then(res => {
          this.profileGroups = res || []
        })
        .catch(err => console.log(err))
    },
    /**
     * On edit event
     */
    onEdit (item) {
      this.$refs.taskFormDialog.isEditMode = true
      this.$refs.taskFormDialog.dialog = true
      this.$refs.taskFormDialog.selectedId = item.id
      this.$refs.taskFormDialog.task = item
    },
    /**
     * On duplicate event
     */
    async onDuplicate (item) {
      let data = []

      await this.getLocalStorage('tasks')
        .then(res => {
          data = res || []
        })
        .catch(err => console.log(err))

      const newRecord = this.setUniqueIds(data, [{ id: null }])

      await this.saveToLocalStorage('tasks', [...data, ...newRecord])

      const id = newRecord.slice().pop().id

      const task = { ...item }
      task.id = id

      await this.saveToLocalStorage(`task-${id}`, task)

      this.init()
    },
    /**
     * On delete event
     */
    async onDelete (id) {
      await this.getLocalStorage('tasks')
        .then(res => this.saveToLocalStorage('tasks', res ? res.filter(el => el.id !== id) : []))
        .catch(err => console.log(err))

      await this.deleteFromLocalStorage(`task-${id}`)

      this.init()
    },
    /**
     * Import all tasks
     */
    async importFromJson () {
      const tasks = this.tasks.slice()
      let data = await this.importJson('Import Tasks')

      if (data && data.length) {
        data = this.setUniqueIds(tasks, data)

        data.forEach(el => this.saveToLocalStorage(`task-${el.id}`, el))

        await this.saveToLocalStorage('tasks', [...tasks, ...data].map(el => { return { id: el.id } }))

        this.init()
      }
    },
    /**
     * Export all tasks
     */
    exportToJson () {
      let tasks = this.tasks.slice()

      tasks = tasks.map(val => {
        delete val.id

        return val
      })

      this.exportJson(tasks, 'Export Tasks To JSON')
    },
    /**
     * On start event
     */
    onStart (item) {
      //
    },
    /**
     * On stop event
     */
    onStop (item) {
      //
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
