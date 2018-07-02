<template>
  <div>
    <v-snackbar :top="true" :timeout="1000" v-model="snackbar">
      {{ text }}
    </v-snackbar>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-btn slot="activator" color="teal darken-2" dark>Create Workspace</v-btn>
      <v-card>
        <v-toolbar dark color="teal darken-2">
          <v-btn icon dark @click.native="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>CREATE NEW WORKSPACE</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="submit" :disabled="!valid">CREATE</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container justify-center align-center>
          <v-layout>
            <v-flex xs12 md8 offset-md2>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-subheader>Workspace Details</v-subheader>
                <v-text-field v-model="wsname" :rules="wsnameRules" name="name" label="Workspace Name" type="text" required></v-text-field>
                <br />
                <v-subheader>Workspace Creds</v-subheader>
                <v-text-field v-model="userwsname" name="name" label="Display Name For Workspace" type="text" hint="Not Required. Your default name will be used if empty." :persistent-hint="true"></v-text-field>
                <br />
                <v-text-field v-model="userwspassword" :rules="userwspasswordRules" id="password" name="password" label="Workspace Password" type="password" required></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createWorkspace } from '../../helpers/account'
export default {
  name: 'CreateWorkSpace',
  data () {
    return {
      dialog: false,
      snackbar: false,
      text: null,
      valid: true,
      wsname: null,
      wsnameRules: [
        v => !!v || 'Name is required'
      ],
      userwsname: null,
      userwspassword: null,
      userwspasswordRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 6) || 'Password must contain minimum 6 characters'
      ]
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        if (!this.userwsname) {
          this.userwsname = this.$store.state.user.name
        }
        const resp = await createWorkspace(this.wsname, this.userwsname, this.userwspassword)
        if (resp === 'success') {
          this.$emit('response', 'Workspace Successfully Created')
          this.dialog = false
        } else if (resp === 'exist') {
          this.snackbar = true
          this.text = 'WorkSpace already exist.'
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
