<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex>
          <ol>
            <li v-for="m in messageSet" v-bind:message="m" :key="m.key">
              <b>{{ m.from }}: </b> {{ m.text }}
              <p style="color: lightgrey">{{ m.createdAt }}</p>
            </li>
        </ol>
        </v-flex>
      </v-layout>
    </v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-form style="position: absolute; bottom:0; left: 5%; width: 90%" method="post" @submit.prevent="sendMessage">
          <v-text-field outline v-model="message" color="teal darken-2" placeholder="Enter Message" type="text" append-icon="send" @click:append="sendMessage"></v-text-field>
        </v-form>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: ['cname', 'wsname', 'currentUser'],
  name: 'ChatRoom',
  data () {
    return {
      drawer: true,
      message: null,
      messageSet: []
    }
  },
  beforeMount () {
    this.$emit('updatePending', this.cname)
  },
  sockets: {
    newMessage (data) {
      if (data.channel === this.cname) {
        this.messageSet.push(data)
      } else {
        this.$emit('pending', data.channel)
      }
    }
  },
  methods: {
    sendMessage () {
      if (this.message) {
        this.$socket.emit('sendMessage', {workspace: this.wsname, channel: this.cname, text: this.message, from: this.currentUser})
        this.message = null
      }
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
ol {
  list-style-type: none;
  padding: 0;
}
a {
  color: #42b983;
}
</style>
