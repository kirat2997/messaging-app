<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout v-bind="binding" align-center justify-center>
          <v-flex xs12 sm8 md8>
            <h2 v-on:click="login = true">Login</h2>
            <h2 v-on:click="login = false">Register</h2>
          </v-flex>
          <v-flex xs12 sm8 md4>
            <Login v-if="login"/>
            <Signup v-else/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Login from './subcomponents/Login.vue'
import Signup from './subcomponents/Signup.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      login: true
    }
  },
  components: {
    Login,
    Signup
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
