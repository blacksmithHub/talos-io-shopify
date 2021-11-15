<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1000"
  >
    <v-form @submit.prevent="submit">
      <v-card rounded>
        <v-card-title class="px-0 pt-0">
          <v-toolbar flat>
            <v-toolbar-title
              class="text-capitalize"
              v-text="title"
            />

            <v-text-field
              v-model="name"
              label="Name"
              outlined
              dense
              hide-details
              class="ml-5"
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
            <v-col cols="4">
              <p>Shipping details</p>

              <v-row>
                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="shipping.firstName"
                    label="First name"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.firstName || []"
                    @blur="$v.shipping.firstName.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="shipping.lastName"
                    label="Last name"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.lastName || []"
                    @blur="$v.shipping.lastName.$touch()"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="shipping.address"
                    label="Address"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.address || []"
                    @blur="$v.shipping.address.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="shipping.appartment"
                    label="Appartment"
                    outlined
                    dense
                    hide-details
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="shipping.postalCode"
                    label="Postal code"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.postalCode || []"
                    type="number"
                    @blur="$v.shipping.postalCode.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="shipping.city"
                    label="City"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.city || []"
                    @blur="$v.shipping.city.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="shipping.region"
                    label="Region"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.region || []"
                    @blur="$v.shipping.region.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="shipping.country"
                    label="Country"
                    outlined
                    dense
                    hide-details
                    disabled
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="shipping.phoneNumber"
                    label="Phone"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="shippingErrors.phoneNumber || []"
                    type="number"
                    @blur="$v.shipping.phoneNumber.$touch()"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-divider vertical />

            <v-col cols="4">
              <p>Billing details</p>

              <v-row>
                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="billing.firstName"
                    label="First name"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.firstName || []"
                    @blur="$v.billing.firstName.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="billing.lastName"
                    label="Last name"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.lastName || []"
                    @blur="$v.billing.lastName.$touch()"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="billing.address"
                    label="Address"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.address || []"
                    @blur="$v.billing.address.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="billing.appartment"
                    label="Appartment"
                    outlined
                    dense
                    hide-details
                    :disabled="sameAsShipping"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="billing.postalCode"
                    label="Postal code"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.postalCode || []"
                    type="number"
                    @blur="$v.billing.postalCode.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="billing.city"
                    label="City"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.city || []"
                    @blur="$v.billing.city.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="billing.region"
                    label="Region"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.region || []"
                    @blur="$v.billing.region.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="billing.country"
                    label="Country"
                    outlined
                    dense
                    hide-details
                    disabled
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="billing.phoneNumber"
                    label="Phone"
                    outlined
                    dense
                    hide-details="auto"
                    :disabled="sameAsShipping"
                    :error-messages="billingErrors.phoneNumber || []"
                    type="number"
                    @blur="$v.billing.phoneNumber.$touch()"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="py-0"
                >
                  <v-checkbox
                    v-model="sameAsShipping"
                    color="primary"
                    dense
                    label="Same as shipping"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-divider vertical />

            <v-col cols="4">
              <p>Card details</p>

              <v-row>
                <v-col
                  cols="12"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="card.name"
                    label="Name on card"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="cardErrors.name || []"
                    @blur="$v.card.name.$touch()"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="pt-0"
                >
                  <v-text-field
                    v-model="card.number"
                    label="Card number"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="cardErrors.number || []"
                    type="number"
                    @blur="$v.card.number.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pr-1"
                >
                  <v-text-field
                    v-model="card.expiry"
                    label="Expiry"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="cardErrors.expiry || []"
                    @blur="$v.card.expiry.$touch()"
                  />
                </v-col>

                <v-col
                  cols="6"
                  class="pt-0 pl-1"
                >
                  <v-text-field
                    v-model="card.cvv"
                    label="CVV"
                    outlined
                    dense
                    hide-details="auto"
                    :error-messages="cardErrors.cvv || []"
                    type="number"
                    @blur="$v.card.cvv.$touch()"
                  />
                </v-col>
              </v-row>
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
import { required, numeric } from 'vuelidate/lib/validators'
import LocalStorage from '@/mixins/localstorage'

export default {
  mixins: [LocalStorage],
  data () {
    return {
      isEditMode: false,
      dialog: false,
      loading: false,
      selectedId: null,

      name: null,
      sameAsShipping: true,

      shipping: {
        firstName: null,
        lastName: null,
        address: null,
        appartment: null,
        postalCode: null,
        city: null,
        region: null,
        country: 'Phillippines',
        phoneNumber: null
      },
      billing: {
        firstName: null,
        lastName: null,
        address: null,
        appartment: null,
        postalCode: null,
        city: null,
        region: null,
        country: 'Phillippines',
        phoneNumber: null
      },
      card: {
        name: null,
        number: null,
        expiry: null,
        cvv: null
      }
    }
  },
  computed: {
    /**
     * Display title
     */
    title () {
      return this.isEditMode ? 'edit billing' : 'new billing'
    },
    /**
     * Errors for shipping fields
     */
    shippingErrors () {
      const errors = {}

      if (this.$v.shipping.firstName.$dirty) {
        errors.firstName = []
        this.$v.shipping.firstName.required || errors.firstName.push('Required')
      }

      if (this.$v.shipping.lastName.$dirty) {
        errors.lastName = []
        this.$v.shipping.lastName.required || errors.lastName.push('Required')
      }

      if (this.$v.shipping.address.$dirty) {
        errors.address = []
        this.$v.shipping.address.required || errors.address.push('Required')
      }

      if (this.$v.shipping.postalCode.$dirty) {
        errors.postalCode = []
        this.$v.shipping.postalCode.required || errors.postalCode.push('Required')
        this.$v.shipping.postalCode.numeric || errors.postalCode.push('Invalid')
      }

      if (this.$v.shipping.city.$dirty) {
        errors.city = []
        this.$v.shipping.city.required || errors.city.push('Required')
      }

      if (this.$v.shipping.region.$dirty) {
        errors.region = []
        this.$v.shipping.region.required || errors.region.push('Required')
      }

      if (this.$v.shipping.phoneNumber.$dirty) {
        errors.phoneNumber = []
        this.$v.shipping.phoneNumber.required || errors.phoneNumber.push('Required')
        this.$v.shipping.phoneNumber.numeric || errors.phoneNumber.push('Invalid')
      }

      return errors
    },
    /**
     * Errors for billing fields
     */
    billingErrors () {
      const errors = {}

      if (this.$v.billing.firstName.$dirty) {
        errors.firstName = []
        this.$v.billing.firstName.required || errors.firstName.push('Required')
      }

      if (this.$v.billing.lastName.$dirty) {
        errors.lastName = []
        this.$v.billing.lastName.required || errors.lastName.push('Required')
      }

      if (this.$v.billing.address.$dirty) {
        errors.address = []
        this.$v.billing.address.required || errors.address.push('Required')
      }

      if (this.$v.billing.postalCode.$dirty) {
        errors.postalCode = []
        this.$v.billing.postalCode.required || errors.postalCode.push('Required')
        this.$v.billing.postalCode.numeric || errors.postalCode.push('Invalid')
      }

      if (this.$v.billing.city.$dirty) {
        errors.city = []
        this.$v.billing.city.required || errors.city.push('Required')
      }

      if (this.$v.billing.region.$dirty) {
        errors.region = []
        this.$v.billing.region.required || errors.region.push('Required')
      }

      if (this.$v.billing.phoneNumber.$dirty) {
        errors.phoneNumber = []
        this.$v.billing.phoneNumber.required || errors.phoneNumber.push('Required')
        this.$v.billing.phoneNumber.numeric || errors.phoneNumber.push('Invalid')
      }

      return errors
    },
    /**
     * Errors for card fields
     */
    cardErrors () {
      const errors = {}

      if (this.$v.card.name.$dirty) {
        errors.name = []
        this.$v.card.name.required || errors.name.push('Required')
      }

      if (this.$v.card.number.$dirty) {
        errors.number = []
        this.$v.card.number.required || errors.number.push('Required')
        this.$v.card.number.numeric || errors.number.push('Invalid')
      }

      if (this.$v.card.expiry.$dirty) {
        errors.expiry = []
        this.$v.card.expiry.required || errors.expiry.push('Required')
      }

      if (this.$v.card.cvv.$dirty) {
        errors.cvv = []
        this.$v.card.cvv.required || errors.cvv.push('Required')
        this.$v.card.cvv.numeric || errors.cvv.push('Invalid')
      }

      return errors
    }
  },
  watch: {
    shipping: {
      handler () {
        if (this.sameAsShipping) {
          this.billing.firstName = this.shipping.firstName
          this.billing.lastName = this.shipping.lastName
          this.billing.address = this.shipping.address
          this.billing.appartment = this.shipping.appartment
          this.billing.postalCode = this.shipping.postalCode
          this.billing.city = this.shipping.city
          this.billing.region = this.shipping.region
          this.billing.phoneNumber = this.shipping.phoneNumber
        }
      },
      deep: true
    },
    sameAsShipping () {
      if (this.sameAsShipping) {
        this.$v.billing.$reset()

        this.billing.firstName = this.shipping.firstName
        this.billing.lastName = this.shipping.lastName
        this.billing.address = this.shipping.address
        this.billing.appartment = this.shipping.appartment
        this.billing.postalCode = this.shipping.postalCode
        this.billing.city = this.shipping.city
        this.billing.region = this.shipping.region
        this.billing.phoneNumber = this.shipping.phoneNumber
      }
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

      this.name = null
      this.sameAsShipping = true

      this.shipping = {
        firstName: null,
        lastName: null,
        address: null,
        appartment: null,
        postalCode: null,
        city: null,
        region: null,
        country: 'Phillippines',
        phoneNumber: null
      }

      this.billing = {
        firstName: null,
        lastName: null,
        address: null,
        appartment: null,
        postalCode: null,
        city: null,
        region: null,
        country: 'Phillippines',
        phoneNumber: null
      }

      this.card = {
        name: null,
        number: null,
        expiry: null,
        cvv: null
      }
    },
    /**
     * Submit form event
     */
    async submit () {
      this.$v.shipping.$touch()
      this.$v.card.$touch()

      if (this.sameAsShipping) {
        if (this.$v.shipping.$invalid) return
      } else {
        this.$v.billing.$touch()

        if (this.$v.billing.$invalid) return
      }

      if (this.$v.card.$invalid) return

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

      await this.getLocalStorage('billings')
        .then(res => {
          data = res || []
        })
        .catch(err => console.log(err))

      if (this.isEditMode) {
        data = data.map((val) => {
          if (val.id === this.selectedId) {
            val.name = this.name || `billing${val.id}`
            val.shipping = this.shipping
            val.billing = this.billing
            val.card = this.card
          }

          return val
        })
      } else {
        let newRecords = this.setUniqueIds(data, [{
          name: this.name,
          shipping: this.shipping,
          billing: this.billing,
          card: this.card
        }])

        newRecords = this.setUniqueNames('billing', newRecords)

        data = [...data, ...newRecords]
      }

      this.saveToLocalStorage('billings', data)

      this.loading = false
    }
  },
  /**
   * All form validations
   */
  validations: {
    shipping: {
      firstName: { required },
      lastName: { required },
      address: { required },
      postalCode: { required, numeric },
      city: { required },
      region: { required },
      phoneNumber: { required, numeric }
    },

    billing: {
      firstName: { required },
      lastName: { required },
      address: { required },
      postalCode: { required, numeric },
      city: { required },
      region: { required },
      phoneNumber: { required, numeric }
    },

    card: {
      name: { required },
      number: { required, numeric },
      expiry: { required },
      cvv: { required, numeric }
    }
  }
}
</script>
