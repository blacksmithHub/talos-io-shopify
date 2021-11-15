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
          <v-text-field
            v-model="name"
            label="Name"
            outlined
            dense
          />

          <v-textarea
            :value="proxyList"
            hint="Insert new proxy per line"
            :placeholder="placeholder"
            outlined
            :error-messages="proxiesErrors"
            auto-grow
            rows="10"
            hide-details="auto"
            @blur="$v.$touch()"
            @input="onInputTextArea"
          />

          <v-checkbox
            v-model="split"
            color="primary"
            dense
            label="Split proxies"
            hide-details
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
import { required, requiredIf } from 'vuelidate/lib/validators'
import LocalStorage from '@/mixins/localstorage'

export default {
  mixins: [LocalStorage],
  data () {
    return {
      isEditMode: false,
      dialog: false,
      loading: false,

      split: false,
      selectedId: null,
      name: null,
      proxies: []
    }
  },
  computed: {
    /**
     * Display title
     */
    title () {
      return this.isEditMode ? 'edit proxy list' : 'new proxy list'
    },
    /**
     * Display form placeholder
     */
    placeholder () {
      return ['127.0.0.1:8080:username:password', '127.0.0.1:8081'].join('\n')
    },
    /**
     * Return proxy list
     */
    proxyList () {
      const proxies = this.proxies.slice()

      return proxies.map(el => {
        const values = Object.values(el).filter(v => v)

        return values.join(':')
      })
        .join('\n')
    },
    /**
     * Errors for proxies
     */
    proxiesErrors () {
      const errors = []

      if (!this.$v.proxies.$dirty) return errors

      this.$v.proxies.required || errors.push('Required')

      this.proxies.forEach((element, index) => {
        const item = this.$v.proxies.$each[index]

        if (item) {
          item.host.required || errors.push(`"${element.host}${(element.port) ? `:${element.port}` : ''}" - Host is Required`)
          item.port.required || errors.push(`"${element.host}${(element.port) ? `:${element.port}` : ''}" - Port is Required`)
          item.password.required || errors.push(`"${element.host}${(element.port) ? `:${element.port}` : ''}" - Password is Required`)
        }
      })

      return errors
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

      this.split = false
      this.selectedId = null
      this.name = null
      this.proxies = []
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
     * On text area input event
     */
    onInputTextArea (data) {
      this.proxies = data.split('\n')
        .filter(v => v)
        .map(value => {
          const item = value.split(':')

          return {
            host: item[0] || null,
            port: item[1] || null,
            username: item[2] || null,
            password: item[3] || null
          }
        })

      this.$v.$touch()
    },
    /**
     * Store form to JSON
     */
    async store () {
      this.loading = true

      let data = []

      await this.getLocalStorage('proxies')
        .then(res => {
          data = res || []
        })
        .catch(err => console.log(err))

      if (this.isEditMode) {
        if (this.split) {
          const index = data.findIndex(v => v.id === this.selectedId)

          data.splice(index, 1)

          data = this.mergeNewRecords(data)
        } else {
          data = data.map((val) => {
            if (val.id === this.selectedId) {
              val.name = this.name || `proxy${val.id}`
              val.items = this.proxies
            }

            return val
          })
        }
      } else {
        data = this.mergeNewRecords(data)
      }

      this.saveToLocalStorage('proxies', data)

      this.loading = false
    },
    /**
     * Merge old and new records
     */
    mergeNewRecords (data) {
      let newRecords = []

      if (this.split) {
        this.proxies.forEach(el => {
          newRecords.push({
            name: null,
            items: [{ ...el }]
          })
        })
      } else {
        newRecords.push({
          name: this.name,
          items: this.proxies
        })
      }

      newRecords = this.setUniqueIds(data, newRecords)
      newRecords = this.setUniqueNames(this.name || 'proxy', newRecords)

      return [...data, ...newRecords]
    }
  },
  /**
   * All form validations
   */
  validations: {
    proxies: {
      required,
      $each: {
        host: { required },
        port: {
          required: requiredIf(function (form) {
            return !!form.host
          })
        },
        password: {
          required: requiredIf(function (form) {
            return !!form.username
          })
        }
      }
    }
  }
}
</script>
