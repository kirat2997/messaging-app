<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout v-bind="binding" align-center justify-center>
          WORKSPACE {{ id }}
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  props: ['id'],
  name: 'WorkSpace',
  data () {
    return {
      login: true
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
