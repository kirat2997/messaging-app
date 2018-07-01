<template>
  <v-app id="inspire">
    <v-toolbar color="teal darken-2" class="white--text">
      <v-toolbar-title class="white--text">Messaging App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="reset" flat class="white--text">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <v-layout>
        <v-flex v-if="workspace.length === 0">
          You have no workspace yet. Create One
        </v-flex>
        <v-flex v-else>
          WORKSPACE LIST
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 md4 offset-md4>
          <v-btn>CREATE WORKSPACE</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  props: ['data'],
  name: 'Home',
  data () {
    return {
      login: true,
      workspace: []
    }
  },
  methods: {
    reset () {
      this.$store.commit('RESET_STATE')
      this.$router.push('/')
    }
  },
  beforeMount () {
    const user = this.$store.state.user
    this.workspace = user.workspace
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
