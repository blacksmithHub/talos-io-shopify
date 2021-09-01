<template>
  <v-container fluid>
    <v-row>
      <v-col class="pr-1 pb-1">
        <Accounts
          :accounts="accounts"
          @init="init"
        />
      </v-col>

      <v-col class="pl-1 pb-1">
        <Billings
          :billings="billings"
          @init="init"
        />
      </v-col>

      <v-col
        cols="12"
        class="pt-2"
      >
        <Groups
          :accounts="accounts"
          :billings="billings"
          :groups="groups"
          @init="init"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocalStorage from '@/mixins/localstorage'

import Accounts from '@/components/Profiles/Accounts'
import Billings from '@/components/Profiles/Billings'
import Groups from '@/components/Profiles/Groups'

export default {
  components: {
    Accounts,
    Billings,
    Groups
  },
  mixins: [LocalStorage],
  data () {
    return {
      accounts: [],
      billings: [],
      groups: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * Initialize list
     */
    async init () {
      this.accounts = await this.getAccounts()
      this.billings = await this.getBillings()
      this.groups = await this.getGroups()

      this.syncGroups()
    },
    /**
     * Fetch all accounts
     */
    getAccounts () {
      return this.getLocalStorage('accounts')
        .then(res => res || [])
        .catch(err => console.log(err))
    },
    /**
     * Fetch all billings
     */
    getBillings () {
      return this.getLocalStorage('billings')
        .then(res => res || [])
        .catch(err => console.log(err))
    },
    /**
     * Fetch all groups
     */
    getGroups () {
      return this.getLocalStorage('groups')
        .then(res => res || [])
        .catch(err => console.log(err))
    },
    /**
     * Sync group items
     */
    async syncGroups () {
      let groups = this.groups.slice()

      if (!groups.length) return

      groups = groups.map(group => {
        group.items = group.items.map(item => {
          const account = this.accounts.find(el => el.id === item.account.id)
          const billing = this.billings.find(el => el.id === item.billing.id)

          if (!account || !billing) return null

          return {
            ...item,
            account: account,
            billing: billing
          }
        })
          .filter(el => el)

        return group
      })
        .filter(el => el.items.length)

      await this.saveToLocalStorage('groups', groups)

      this.groups = await this.getGroups()
    }
  }
}
</script>
