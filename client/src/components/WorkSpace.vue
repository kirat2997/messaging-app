<template>
  <v-app id="inspire">
    <v-snackbar :top="true" :timeout="1000" v-model="snackbar">
      {{ text }}
    </v-snackbar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title" v-if="workspace">
              {{ workspace.name }}
            </v-list-tile-title>
            <v-list-tile-title class="title" v-else>
              Application
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-subheader>{{ currentUser }}</v-subheader>
      <v-divider></v-divider>
      <v-subheader>Channels</v-subheader>
      <v-list dense>
        <v-list-tile v-for="(m,i) in channels" :key="i" :to="'/workspace/' + m.name">
          <v-list-tile-content>
            <v-list-tile-title v-if="m.pending" class="font-weight-bold subheading"># {{ m.name }}</v-list-tile-title>
            <v-list-tile-title v-else># {{ m.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-subheader>Direct Messages</v-subheader>
      <v-list dense>
        <v-list-tile v-for="m in members" :key="m.name">
          <v-list-tile-content>
            <v-list-tile-title v-if="m.name === currentUser">{{ m.displayName }} (You)</v-list-tile-title>
            <v-list-tile-title v-else>{{ m.displayName }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon :color="m.active ? 'teal' : 'grey'">fiber_manual_record</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-dialog v-model="dialog" persistent max-width="500px">
        <v-btn slot="activator" style="margin-left: 50%;" flat>Invite People</v-btn>
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 md8 offset-md2>
                  <v-text-field v-model="email" label="Email Address" type="email" required></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal darken-2" flat @click.native="dialog = false">Close</v-btn>
            <v-btn color="teal darken-2" flat @click="invite">Invite</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>
    <v-toolbar color="teal darken-2" dark fixed app>
      <v-toolbar-side-icon class="white--text hidden-lg-and-up" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title># {{ channel }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="signout">Sign Out</v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex text-xs-left>
            <ChatRoom v-for="c in channels" @pending="handlePending" @updatePending="handleUpdatePending" :key="c.name" v-if="channel === c.name" v-bind:cname="c.name" v-bind:wsname="workspace.name" v-bind:currentUser="currentUser"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { fetchWorkspace, sendInvite } from '../helpers/account'
import ChatRoom from './ChatRoom.vue'
export default {
  props: ['channel'],
  name: 'WorkSpace',
  data () {
    return {
      dialog: false,
      drawer: true,
      workspace: null,
      currentUser: null,
      email: null,
      members: [],
      channels: [],
      snackbar: false,
      text: null
    }
  },
  components: {
    ChatRoom
  },
  async beforeMount () {
    const workspaceId = this.$store.state.workspace
    this.currentUser = this.$store.state.user.name
    if (!workspaceId) {
      this.$router.push('/home')
    } else {
      this.workspace = await fetchWorkspace(workspaceId)
      this.members = this.workspace.members
      this.channels = this.workspace.channels
    }
    this.$socket.emit('join', {channels: this.channels, userId: this.$store.state.user._id, workspace: this.workspace})
  },
  methods: {
    handlePending (data) {
      this.channels.forEach(channel => {
        if (channel.name === data) {
          channel.pending = true
        }
      })
    },
    handleUpdatePending (data) {
      this.channels.forEach(channel => {
        if (channel.name === data) {
          channel.pending = false
        }
      })
    },
    signout () {
      this.$socket.emit('signout', {workspace: this.workspace, userId: this.$store.state.user._id})
      this.$store.commit('RESET_WORKSPACE')
      this.$router.push('/home')
    },
    async invite () {
      if (this.email) {
        const resp = await sendInvite({email: this.email, from: this.currentUser, workspaceId: this.$store.state.workspace, workspaceName: this.workspace.name})
        if (resp) {
          this.snackbar = true
          this.text = 'Invitaion Sent.'
        } else {
          this.snackbar = true
          this.text = 'This Email is not registerd with us'
        }
        this.dialog = false
      }
    }
  },
  sockets: {
    updateActiveList (data) {
      this.members = data.members
      // this.channels = data.channels
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
  text-align: center;
  cursor: pointer;
  margin: 5vh;
}

a {
  color: #42b983;
}
</style>
