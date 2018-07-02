<template>
  <v-app id="inspire">
    <v-snackbar :top="true" :timeout="1000" v-model="snackbar">
      {{ text }}
    </v-snackbar>
    <v-toolbar color="teal darken-2" class="white--text">
      <v-toolbar-title class="white--text">Messaging App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="reset" flat class="white--text">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <v-layout v-bind="binding">
        <v-flex xs12 md4 class="text-lg-left text-md-center">
          <v-subheader>Invitations</v-subheader>
          <v-layout>
            <v-flex v-if="invitation.length === 0">
              You have no pending invitations
            </v-flex>
            <v-flex xs10 offset-xs1 v-else>
              <v-list three-line flat>
                <template v-for="(item, index) in invitation">
                  <v-list-tile
                    :key="index"
                    avatar
                  >
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.wsname"></v-list-tile-title>
                      <v-list-tile-sub-title>From: {{item.from}}</v-list-tile-sub-title>
                      <v-dialog v-model="dialog" width="500">
                        <v-btn slot="activator" class="white--text" color="teal darken-2">Accept</v-btn>
                        <v-card>
                          <v-card-text>
                            <v-text-field v-model="name" type="text" label="Enter display name" hint="Not Required" :persistent-hint="true"></v-text-field>
                            <v-text-field v-model="password" type="password" label="Enter workspace password" required></v-text-field>
                          </v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="teal darken-2"
                              flat
                              @click="accept(item.wsid)"
                            >
                              Accept
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="index + 10" v-if="index + 1 < invitation.length"></v-divider>
                </template>
              </v-list>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 md8>
          <v-subheader>Your Workspaces</v-subheader>
          <v-layout>
            <v-flex v-if="workspace.length === 0">
              You have no workspace yet. Create One
            </v-flex>
            <v-flex xs8 offset-xs2 v-else>
              <EnterWorkSpace v-for="item in workspace" :key="item._id" v-bind:item="item"/>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 md4 offset-md4>
              <CreateWorkSpace @response="showResponse"/>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import CreateWorkSpace from './subcomponents/CreateWorkSpace.vue'
import EnterWorkSpace from './subcomponents/EnterWorkSpace.vue'
import { acceptInvite } from '../helpers/account'
export default {
  props: ['data'],
  name: 'Home',
  data () {
    return {
      login: true,
      workspace: [],
      invitation: [],
      snackbar: false,
      text: null,
      dialog: false,
      name: null,
      password: null
    }
  },
  components: {
    CreateWorkSpace,
    EnterWorkSpace
  },
  methods: {
    updateList () {
      const user = this.$store.state.user
      this.workspace = user.workspace
      this.invitation = user.invitations
    },
    reset () {
      this.$store.commit('RESET_STATE')
      this.$router.push('/')
    },
    showResponse (data) {
      this.snackbar = true
      this.text = data
      this.workspace = this.$store.state.user.workspace
    },
    async accept (wsid) {
      if (this.password) {
        if (!this.name) {
          this.name = this.$store.state.user.name
        }
        const resp = await acceptInvite({wsid, name: this.name, password: this.password})
        if (resp) {
          this.snackbar = true
          this.text = 'Accepted'
        }
        this.dialog = false
        this.updateList()
      }
    }
  },
  beforeMount () {
    const user = this.$store.state.user
    this.workspace = user.workspace
    this.invitation = user.invitations
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
  text-align: center;
  cursor: pointer;
  margin: 5vh;
}
#inspire {
  text-align: center;
}
a {
  color: #42b983;
}
</style>
