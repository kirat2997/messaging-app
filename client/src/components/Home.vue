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
            <v-flex xs8 offset-xs2 v-else>
              INVITAION LIST
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
export default {
  props: ['data'],
  name: 'Home',
  data () {
    return {
      login: true,
      workspace: [],
      invitation: [],
      snackbar: false,
      text: null
    }
  },
  components: {
    CreateWorkSpace,
    EnterWorkSpace
  },
  methods: {
    reset () {
      this.$store.commit('RESET_STATE')
      this.$router.push('/')
    },
    showResponse (data) {
      this.snackbar = true
      this.text = data
      this.workspace = this.$store.state.user.workspace
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
