<template>
  <div>
    <v-snackbar :top="true" :timeout="1000" v-model="snackbar">{{ text }}</v-snackbar>
    <div v-if="progress" style="z-index:1; background:rgba(0,0,0,0.3); position: fixed; top:0; padding-top:50vh; bottom:0; left:0; right:0;">
      <v-progress-circular :size="50" indeterminate color="teal darken-2"></v-progress-circular>
    </div>
    <v-expansion-panel>
      <v-expansion-panel-content>
        <div slot="header">{{ item.workspaceName }}</div>
        <v-card>
          <v-container>
            <v-layout v-bind="binding">
              <v-flex xs12 md7>
                <v-text-field prepend-icon="lock" v-model="password" name="login" label="Enter Password" type="password" required></v-text-field>
              </v-flex>
              <v-flex xs12 md4 offset-md1>
                <v-btn style="width: 100%" @click="enter">Enter</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script>
import { workspaceLogin } from '../../helpers/account'
export default {
  props: ['item'],
  name: 'EnterWorkSpace',
  data () {
    return {
      password: null,
      progress: false,
      snackbar: false,
      text: null
    }
  },
  methods: {
    async enter () {
      if (this.password) {
        this.progress = true
        const resp = await workspaceLogin(this.item.id, this.password)
        if (resp === 'some error') {
          this.snackbar = true
          this.text = 'Some error occured! Please try again.'
        } else {
          this.snackbar = true
          this.text = 'Incorrect Password'
        }
        this.progress = false
      }
    }
  },
  computed: {
    binding () {
      const binding = {}
      binding.column = true
      if (this.$vuetify.breakpoint.mdAndUp) binding.column = false
      return binding
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
