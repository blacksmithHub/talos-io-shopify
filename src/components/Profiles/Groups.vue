<template>
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
          style="width: 100%"
        >
          <template v-slot:item.actions>
            <div class="text-right">
              <v-btn
                icon
                color="warning"
                depressed
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
</template>

<script>
export default {
  data () {
    return {
      windowSize: {
        x: 0,
        y: 0
      },
      headers: [
        { text: 'name', value: 'name' },
        { text: 'actions', value: 'actions' }
      ],
      items: []
    }
  },
  methods: {
    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    }
  }
}
</script>
