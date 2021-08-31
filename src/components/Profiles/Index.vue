<template>
  <v-container fluid>
    <v-row>
      <v-col class="pr-1 pb-1">
        <Accounts />
      </v-col>

      <v-col class="pl-1 pb-1">
        <Billings />
      </v-col>

      <v-col
        cols="12"
        class="pt-2"
      >
        <Groups />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Accounts from '@/components/Profiles/Accounts'
import Billings from '@/components/Profiles/Billings'
import Groups from '@/components/Profiles/Groups'

export default {
  components: {
    Accounts,
    Billings,
    Groups
  },
  data () {
    return {
      //
    }
  }
}
</script>
