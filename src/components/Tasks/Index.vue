<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="2"
        class="pr-1"
      >
        <v-card rounded>
          <v-card-text>
            Tasks
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pl-1">
        <Tasks />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Tasks from '@/components/Tasks/Tasks'

export default {
  components: {
    Tasks
  },
  data () {
    return {
      //
    }
  }
}
</script>
