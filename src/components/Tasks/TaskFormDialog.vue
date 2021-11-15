<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="700"
  >
    <v-form @submit.prevent="submit">
      <v-card rounded>
        <v-card-title class="px-0 pt-0">
          <v-toolbar
            flat
            dense
          >
            <v-toolbar-title
              class="text-capitalize"
              v-text="title"
            />

            <v-spacer />

            <v-btn
              icon
              @click="close"
            >
              <v-icon v-text="'mdi-close'" />
            </v-btn>
          </v-toolbar>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="task.site"
                :items="sites"
                outlined
                dense
                label="Site"
                item-text="name"
                return-object
                hide-details="auto"
                :error-messages="taskErrors.site || []"
                @blur="$v.task.site.$touch()"
              />
            </v-col>

            <v-col
              v-if="!task.product.variant && !task.product.sku"
              :cols="(task.product.link) ? 12 : 4"
              :class="{'pr-1': !task.product.link}"
              class="pt-0"
            >
              <v-text-field
                v-model="task.product.link"
                label="Link"
                outlined
                dense
                hide-details="auto"
                :error-messages="(taskErrors.product) ? (taskErrors.product.link || []) : []"
                @blur="$v.task.product.link.$touch()"
              />
            </v-col>

            <v-col
              v-if="!task.product.link && !task.product.sku"
              :cols="(task.product.variant) ? 12 : 4"
              :class="{'pl-1 pr-1': !task.product.variant}"
              class="pt-0"
            >
              <v-text-field
                v-model="task.product.variant"
                label="Variant"
                outlined
                dense
                hide-details="auto"
                :error-messages="(taskErrors.product) ? (taskErrors.product.variant || []) : []"
                @blur="$v.task.product.variant.$touch()"
              />
            </v-col>

            <v-col
              v-if="!task.product.link && !task.product.variant"
              :cols="(task.product.sku) ? 12 : 4"
              :class="{'pl-1': !task.product.sku}"
              class="pt-0 "
            >
              <v-text-field
                v-model="task.product.sku"
                label="SKU"
                outlined
                dense
                hide-details="auto"
                :error-messages="(taskErrors.product) ? (taskErrors.product.sku || []) : []"
                @blur="$v.task.product.sku.$touch()"
              />
            </v-col>

            <v-col
              cols="12"
              class="pt-0"
            >
              <v-combobox
                v-model="task.product.size"
                chips
                small-chips
                deletable-chips
                clearable
                label="Size"
                multiple
                outlined
                dense
                append-icon=""
                hint="Press Enter per input to apply"
                hide-details="auto"
                :error-messages="(taskErrors.product) ? (taskErrors.product.size || []) : []"
                @blur="$v.task.product.size.$touch()"
              />
            </v-col>

            <v-col
              cols="6"
              class="pt-0 pr-1"
            >
              <v-autocomplete
                v-model="profileGroup"
                :items="profileGroups"
                outlined
                dense
                label="Profile Group"
                item-text="name"
                return-object
                hide-details
                clearable
              />
            </v-col>

            <v-col class="pt-0 pl-1">
              <v-autocomplete
                v-model="task.proxy"
                :items="proxies"
                outlined
                dense
                label="Proxy List"
                item-text="name"
                return-object
                hide-details
              />
            </v-col>

            <v-col
              v-if="!profileGroup"
              cols="6"
              class="pt-0 pr-1"
            >
              <v-autocomplete
                v-model="task.account"
                :items="accounts"
                outlined
                dense
                label="Account"
                item-text="email"
                return-object
                hide-details="auto"
                :error-messages="taskErrors.account || []"
                @blur="$v.task.account.$touch()"
              />
            </v-col>

            <v-col
              v-if="!profileGroup"
              cols="6"
              class="pt-0 pl-1"
            >
              <v-autocomplete
                v-model="task.billing"
                :items="billings"
                outlined
                dense
                label="Billing"
                item-text="name"
                return-object
                hide-details="auto"
                :error-messages="taskErrors.billing || []"
                @blur="$v.task.billing.$touch()"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-3">
          <v-spacer />

          <v-btn
            rounded
            :disabled="loading"
            small
            @click="close"
            v-text="'close'"
          />

          <v-btn
            rounded
            type="submit"
            :loading="loading"
            small
            class="primary"
          >
            <v-icon
              left
              v-text="'mdi-content-save'"
            />
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { required, requiredIf, url } from 'vuelidate/lib/validators'

import Config from '@/config/constant'
import LocalStorage from '@/mixins/localstorage'

export default {
  mixins: [LocalStorage],
  props: {
    profileGroups: {
      type: Array,
      required: true
    },
    proxies: {
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
    },
    tasks: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isEditMode: false,
      dialog: false,
      loading: false,

      task: {
        site: null,
        product: {
          link: null,
          variant: null,
          sku: null,
          size: []
        },
        account: null,
        billing: null
      },
      profileGroup: null
    }
  },
  computed: {
    /**
     * Display title
     */
    title () {
      return this.isEditMode ? 'edit task' : 'new task'
    },
    /**
     * Return list of sites
     */
    sites () {
      return Config.SITES
    },
    /**
     * Errors for task
     */
    taskErrors () {
      const errors = {}

      if (this.$v.task.site.$dirty) {
        errors.site = []
        this.$v.task.site.required || errors.site.push('Required')
      }

      if (this.$v.task.product) {
        errors.product = {}

        if (this.$v.task.product.link.$dirty) {
          errors.product.link = []
          this.$v.task.product.link.required || errors.product.link.push('Required')
          this.$v.task.product.link.url || errors.product.link.push('Invalid')
        }

        if (this.$v.task.product.variant.$dirty) {
          errors.product.variant = []
          this.$v.task.product.variant.required || errors.product.variant.push('Required')
        }

        if (this.$v.task.product.sku.$dirty) {
          errors.product.sku = []
          this.$v.task.product.sku.required || errors.product.sku.push('Required')
        }

        if (this.$v.task.product.size.$dirty) {
          errors.product.size = []
          this.$v.task.product.size.required || errors.product.size.push('Required')
        }
      }

      if (this.$v.task.proxy.$dirty) {
        errors.proxy = []
        this.$v.task.proxy.required || errors.proxy.push('Required')
      }

      if (this.$v.task.account.$dirty) {
        errors.account = []
        this.$v.task.account.required || errors.account.push('Required')
      }

      if (this.$v.task.billing.$dirty) {
        errors.billing = []
        this.$v.task.billing.required || errors.billing.push('Required')
      }

      return errors
    }
  },
  watch: {
    async dialog () {
      if (this.dialog) {
        await this.$emit('init')
        this.task.proxy = this.proxies[0]
      }
    },
    profileGroup () {
      this.$v.task.account.$reset()
      this.$v.task.billing.$reset()
    },
    'task.product.link': function () {
      this.$v.task.product.variant.$reset()
      this.$v.task.product.sku.$reset()
    },
    'task.product.variant': function () {
      this.$v.task.product.link.$reset()
      this.$v.task.product.sku.$reset()
    },
    'task.product.sku': function () {
      this.$v.task.product.link.$reset()
      this.$v.task.product.variant.$reset()
    }
  },
  methods: {
    /**
     * Restore all to default value
     */
    close () {
      this.$v.$reset()

      this.loading = false
      this.dialog = false
      this.isEditMode = false

      this.selectedId = null
      this.profileGroup = null

      this.task = {
        site: null,
        product: {
          link: null,
          variant: null,
          sku: null,
          size: []
        },
        account: null,
        billing: null
      }
    },
    /**
     * Submit form event
     */
    async submit () {
      this.$v.$touch()

      if (this.$v.$invalid) return

      await this.store()

      if (this.isEditMode) this.close()

      this.$emit('init')
    },
    /**
     * Store form to JSON
     */
    async store () {
      this.loading = true

      if (this.isEditMode) {
        await this.update()
      } else {
        await this.create()
      }

      this.loading = false
    },
    /**
     *
     */
    async update () {
      if (this.profileGroup) {
        const ids = []

        this.profileGroup.items.forEach(el => ids.push({ ...el, id: null }))

        let data = []

        await this.getLocalStorage('tasks')
          .then(res => {
            data = res || []
          })
          .catch(err => console.log(err))

        const newRecords = this.setUniqueIds(data, ids)

        data = [...data, ...newRecords.map(el => { return { id: el.id } })]

        await this.saveToLocalStorage('tasks', data)

        newRecords.forEach(el => {
          const task = { ...this.task }

          task.id = el.id
          task.account = el.account
          task.billing = el.billing

          this.saveToLocalStorage(`task-${el.id}`, task)
        })

        this.$emit('onDelete', this.selectedId)
      } else {
        const task = { ...this.task }
        task.id = this.selectedId

        this.saveToLocalStorage(`task-${this.selectedId}`, task)
      }
    },
    /**
     *
     */
    async create () {
      const ids = []

      if (this.profileGroup) {
        this.profileGroup.items.forEach(el => ids.push({ ...el, id: null }))
      } else {
        ids.push({ id: null })
      }

      let data = []

      await this.getLocalStorage('tasks')
        .then(res => {
          data = res || []
        })
        .catch(err => console.log(err))

      const newRecords = this.setUniqueIds(data, ids)

      data = [...data, ...newRecords.map(el => { return { id: el.id } })]

      await this.saveToLocalStorage('tasks', data)

      if (this.profileGroup) {
        newRecords.forEach(el => {
          const task = { ...this.task }

          task.id = el.id
          task.account = el.account
          task.billing = el.billing

          this.saveToLocalStorage(`task-${el.id}`, task)
        })
      } else {
        const id = data.slice().pop().id

        const task = { ...this.task }
        task.id = id

        this.saveToLocalStorage(`task-${id}`, task)
      }
    }
  },
  /**
   * All form validations
   */
  validations: {
    task: {
      site: { required },
      product: {
        link: {
          required: requiredIf(function (form) {
            return !form.variant && !form.sku
          }),
          url
        },
        variant: {
          required: requiredIf(function (form) {
            return !form.link && !form.sku
          })
        },
        sku: {
          required: requiredIf(function (form) {
            return !form.link && !form.variant
          })
        },
        size: { required }
      },
      proxy: { required },
      account: {
        required: requiredIf(function () {
          return !this.profileGroup
        })
      },
      billing: {
        required: requiredIf(function () {
          return !this.profileGroup
        })
      }
    }
  }
}
</script>
