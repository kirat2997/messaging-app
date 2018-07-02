<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout v-if="workspace" v-bind="binding" align-center justify-center>
          {{ workspace.name }}
          <v-btn @click="signout">Sign out</v-btn>
        </v-layout>
        <v-layout v-else>
          LOADING....
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { fetchWorkspace } from '../helpers/account'
export default {
  props: ['channel'],
  name: 'WorkSpace',
  data () {
    return {
      login: true,
      workspace: null
    }
  },
  async beforeMount () {
    const workspaceId = this.$store.state.workspace
    if (!workspaceId) {
      this.$router.push('/home')
    } else {
      this.workspace = await fetchWorkspace(workspaceId)
    }
  },
  methods: {
    signout () {
      this.$store.commit('RESET_WORKSPACE')
      this.$router.push('/home')
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
