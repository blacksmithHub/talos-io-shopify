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
          <v-textarea
            v-if="!isEditMode"
            :value="accountList"
            hint="Insert new account per line"
            :placeholder="placeholder"
            outlined
            :error-messages="accountsErrors"
            auto-grow
            rows="10"
            @blur="$v.accounts.$touch()"
            @input="onInputTextArea"
          />

          <v-text-field
            v-else
            filled
            hint="Format: email:password"
            placeholder="johndoe@email.com:password"
            :value="selectedItem"
            :error-messages="selectedErrors"
            @blur="$v.selected.$touch()"
            @input="onInputTextField"
          />
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
import { requiredUnless, email } from 'vuelidate/lib/validators'
import LocalStorage from '@/mixins/localstorage'

export default {
  mixins: [LocalStorage],
  data () {
    return {
      selected: {},
      isEditMode: false,
      dialog: false,
      loading: false,
      accounts: []
    }
  },
  computed: {
    /**
     * Display title
     */
    title () {
      return this.isEditMode ? 'edit account' : 'new accounts'
    },
    /**
     * Display form placeholder
     */
    placeholder () {
      return ['johndoe@email.com:password', 'janedoe@email.com:password'].join('\n')
    },
    /**
     * Errors for account list
     */
    accountsErrors () {
      const errors = []

      if (!this.$v.accounts.$dirty) return errors

      this.$v.accounts.required || errors.push('Required')

      this.accounts.forEach((element, index) => {
        const item = this.$v.accounts.$each[index]
        const email = element.email

        if (item) {
          item.email.required || errors.push(`"${email}" - Email is Required`)
          item.email.email || errors.push(`"${email}" - Invalid Email`)

          item.password.required || errors.push(`"${email}" - Password is Required`)
        }
      })

      return errors
    },
    /**
     * Errors for selected item
     */
    selectedErrors () {
      const errors = []

      if (!this.$v.selected.$dirty) return errors

      this.$v.selected.email.required || errors.push('Email is Required')
      this.$v.selected.email.email || errors.push('Invalid Email')

      this.$v.selected.password.required || errors.push('Password is Required')

      return errors
    },
    /**
     * Display account lists to text area
     */
    accountList () {
      const data = this.accounts.slice().map(value => (value.email && value.password) ? `${value.email}:${value.password}` : value.email)

      return data.join('\n')
    },
    /**
     * Display selected item to text field
     */
    selectedItem () {
      const data = [this.selected.email, this.selected.password].filter(v => v)

      return data.join(':')
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
      this.selected = {}
      this.accounts = []
      this.isEditMode = false

      this.$emit('init')
    },
    /**
     * Submit form event
     */
    async submit () {
      if (this.isEditMode) {
        this.$v.selected.$touch()

        if (this.$v.selected.$invalid) return
      } else {
        this.$v.accounts.$touch()

        if (this.$v.accounts.$invalid) return
      }

      await this.store()

      this.close()
    },
    /**
     * On text area input event
     */
    onInputTextArea (data) {
      this.accounts = data.split('\n')
        .filter(v => v)
        .map(value => {
          const credential = value.split(':')

          return {
            email: credential[0] || null,
            password: credential[1] || null
          }
        })

      this.$v.accounts.$touch()
    },
    /**
     * On text field input event
     */
    onInputTextField (data) {
      const value = data.split(':')

      this.selected.email = value[0]
      this.selected.password = value[1]

      this.$v.selected.$touch()
    },
    /**
     * Store form to JSON
     */
    async store () {
      this.loading = true

      let data = []

      await this.getLocalStorage('accounts')
        .then(res => {
          data = res || []
        })
        .catch(err => console.log(err))

      if (this.isEditMode) {
        data = data.map((val) => {
          if (val.id === this.selected.id) {
            val.email = this.selected.email
            val.password = this.selected.password
          }

          return val
        })
      } else {
        this.accounts = this.setUniqueIds(data, this.accounts)

        data = [...data, ...this.accounts]
      }

      this.saveToLocalStorage('accounts', data)

      this.loading = false
    }
  },
  /**
   * All form validations
   */
  validations: {
    accounts: {
      required: requiredUnless('!isEditMode'),
      $each: {
        email: {
          required: requiredUnless('!isEditMode'),
          email
        },
        password: {
          required: requiredUnless('!isEditMode')
        }
      }
    },
    selected: {
      email: {
        required: requiredUnless('isEditMode'),
        email
      },
      password: {
        required: requiredUnless('isEditMode')
      }
    }
  }
}
</script>
