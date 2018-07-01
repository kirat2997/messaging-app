<template>
  <div>
    <v-card class="elevation-12">
      <v-toolbar dark color="teal darken-2">
        <v-toolbar-title>Login</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field prepend-icon="person" name="login" label="Email" type="email"></v-text-field>
          <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal darken-2" class="white--text">Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      drawer: null
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
