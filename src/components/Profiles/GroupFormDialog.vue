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
            dense
            flat
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
              <v-text-field
                v-model="name"
                label="Name"
                outlined
                dense
                hide-details
              />
            </v-col>

            <v-col
              cols="6"
              class="pt-0 pr-1"
            >
              <v-autocomplete
                v-model="account"
                :items="accountsSelection"
                outlined
                dense
                label="Account"
                item-text="email"
                return-object
                hide-details="auto"
                :error-messages="accountErrors"
                @blur="$v.account.$touch()"
              />
            </v-col>

            <v-col
              cols="6"
              class="pt-0 pl-1"
            >
              <v-autocomplete
                v-model="billing"
                :items="billingsSelection"
                outlined
                dense
                label="Billing"
                item-text="name"
                return-object
                hide-details="auto"
                :error-messages="billingErrors"
                @blur="$v.billing.$touch()"
              />
            </v-col>

            <v-col
              cols="12"
              class="pt-0 pl-1 text-right"
            >
              <v-btn
                rounded
                class="primary"
                small
                @click="addToGroup"
              >
                <v-icon
                  left
                  v-text="'mdi-plus'"
                />
                add to group
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="items"
                disable-filtering
                disable-pagination
                disable-sort
                hide-default-footer
                no-data-text="Nothing to display"
                no-results-text="Nothing to display"
                item-key="id"
                fixed-header
                hide-default-header
                dense
              >
                <template v-slot:item.actions="{item}">
                  <div class="text-right">
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
import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'

import LocalStorage from '@/mixins/localstorage'

export default {
  mixins: [LocalStorage],
  props: {
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
      isEditMode: false,
      dialog: false,
      loading: false,
      selectedId: null,

      account: null,
      billing: null,

      name: null,
      items: [],
      headers: [
        { text: 'account', value: 'account.email' },
        { text: 'billing', value: 'billing.name' },
        { text: 'actions', value: 'actions' }
      ]
    }
  },
  computed: {
    /**
     * Display title
     */
    title () {
      return this.isEditMode ? 'edit group' : 'new group'
    },
    /**
     * Errors for account field
     */
    accountErrors () {
      const errors = []

      if (!this.$v.account.$dirty) return errors

      this.$v.account.required || errors.push('Required')

      return errors
    },
    /**
     * Errors for billing field
     */
    billingErrors () {
      const errors = []

      if (!this.$v.billing.$dirty) return errors

      this.$v.billing.required || errors.push('Required')

      return errors
    },
    /**
     * Return filtered accounts
     */
    accountsSelection () {
      const accounts = this.accounts.slice()

      return accounts.filter(v => !this.items.find(el => el.account.id === v.id))
    },
    /**
     * Return filtered billings
     */
    billingsSelection () {
      const billings = this.billings.slice()

      return billings.filter(v => !this.items.find(el => el.billing.id === v.id))
    }
  },
  methods: {
    ...mapActions('snackbar', ['showSnackbar']),

    /**
     * Restore all to default value
     */
    close () {
      this.$v.$reset()

      this.loading = false
      this.dialog = false
      this.isEditMode = false
      this.selectedId = null

      this.account = null
      this.billing = null

      this.name = null
      this.items = []
    },
    /**
     * Submit form event
     */
    async submit () {
      this.$v.items.$touch()

      if (this.$v.items.$invalid) {
        this.showSnackbar({ message: 'Group cannot be empty', color: 'error' })

        return
      }

      await this.store()

      if (this.isEditMode) this.close()

      this.$emit('init')
    },
    /**
     * Store form to JSON
     */
    async store () {
      this.loading = true

      let data = []

      await this.getLocalStorage('groups')
        .then(res => {
          data = res || []
        })
        .catch(err => console.log(err))

      if (this.isEditMode) {
        data = data.map((val) => {
          if (val.id === this.selectedId) {
            val.name = this.name || `group${val.id}`
            val.items = this.items
          }

          return val
        })
      } else {
        let newRecords = this.setUniqueIds(data, [{ name: this.name, items: this.items }])
        newRecords = this.setUniqueNames('group', newRecords)

        data = [...data, ...newRecords]
      }

      this.saveToLocalStorage('groups', data)

      this.loading = false
    },
    /**
     * Add items to group
     */
    addToGroup () {
      this.$v.account.$touch()
      this.$v.billing.$touch()

      if (this.$v.account.$invalid || this.$v.billing.$invalid) return

      let data = {
        account: this.account,
        billing: this.billing
      }

      data = this.setUniqueIds(this.items, [{ ...data }])
      data = this.setUniqueNames('group', data)

      this.items = [...this.items, ...data]

      this.account = null
      this.billing = null

      this.$v.account.$reset()
      this.$v.billing.$reset()
    },
    /**
     * On delete event
     */
    async onDelete (item) {
      const items = this.items.slice()
      const index = items.findIndex(v => v.id === item.id)

      items.splice(index, 1)

      this.items = items
    }
  },
  /**
   * All form validations
   */
  validations: {
    account: { required },
    billing: { required },
    items: { required }
  }
}
</script>
