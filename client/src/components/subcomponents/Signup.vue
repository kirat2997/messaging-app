<template>
  <div>
    <v-snackbar
      :timeout="2000"
      :top="true"
      v-model="snackbar"
    >{{ text }}</v-snackbar>
    <v-card class="elevation-12">
      <v-toolbar dark color="teal darken-2">
        <v-toolbar-title>Register</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="name" :rules="nameRules" prepend-icon="perm_identity" name="name" label="Name" type="text" required></v-text-field>
          <v-text-field v-model="email" :rules="emailRules" prepend-icon="person" name="login" label="Email" type="email" required></v-text-field>
          <v-text-field v-model="password" :rules="passwordRules" id="password" prepend-icon="lock" name="password" label="Password" type="password" required></v-text-field>
          <v-text-field v-model="cnfPass" :rules="confpasswordRules" id="cnf-password" prepend-icon="lock" name="cnf-password" label="Re-Enter Password" type="password" required></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal darken-2" class="white--text" :disabled="!valid" @click="submit">Register</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { userSignup } from '../../helpers/auth.js'
export default {
  name: 'Signup',
  data () {
    return {
      email: null,
      password: null,
      cnfPass: null,
      name: null,
      valid: true,
      snackbar: false,
      text: null,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 10 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'password must must contain minimum 6 characters'
      ],
      confpasswordRules: [
        v => !!v || 'This field is required',
        v => (v && v === this.password) || 'Password do not match'
      ]
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        const resp = await userSignup(this.name, this.email, this.password)
        if (resp === 'success') {
          this.snackbar = true
          this.text = 'Successfully registered! Login to continue'
        } else if (resp === 'exist') {
          this.snackbar = true
          this.text = 'This email is already registered'
        } else {
          this.snackbar = true
          this.text = 'Some error occured! Please try again'
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
