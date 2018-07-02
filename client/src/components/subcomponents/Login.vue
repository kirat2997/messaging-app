<template>
  <div>
    <v-snackbar
      :timeout="2000"
      :top="true"
      v-model="snackbar"
    >{{ text }}</v-snackbar>
    <v-card class="elevation-12">
      <v-toolbar dark color="teal darken-2">
        <v-toolbar-title>Login</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field prepend-icon="person" v-model="email" :rules="emailRules" name="login" label="Email" type="email" required></v-text-field>
          <v-text-field id="password" prepend-icon="lock" v-model="password" :rules="passwordRules" name="password" label="Password" type="password" required></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal darken-2" class="white--text" :disabled="!valid" @click="submit">Login</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { userLogin } from '../../helpers/auth'
export default {
  name: 'Login',
  data () {
    return {
      drawer: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      email: null,
      password: null,
      valid: true,
      snackbar: false,
      text: null
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        const resp = await userLogin(this.email, this.password)
        if (resp === 'no account') {
          this.snackbar = true
          this.text = 'Email or password is incorrect.'
        }
      }
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
