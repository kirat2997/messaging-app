<template>
  <div>
    <div v-if="progress">
      <v-progress-circular style="position: absolute; top: 50%; left: 50%;" :size="50" indeterminate color="teal darken-2"></v-progress-circular>
    </div>
    <v-container v-else>
      <v-layout>
        <v-flex style="margin-bottom: 10vh;">
          <ol id="chatRoom">
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
          <v-text-field
            full-width
            outline
            v-model="message"
            color="teal darken-2"
            :placeholder="'Message at ' + cname"
            type="text"
            append-icon="mood"
            @click:append="() => displayEmoji = !displayEmoji"
          ></v-text-field>
        </v-form>
        <picker
          v-if="displayEmoji"
          @select="insertSymbol"
          title="Pick your emoji…"
          emoji="point_up"
          id="picker"
          :native="false"
          set="messenger"
          v-click-outside="hide"
          style="position: absolute; right: 5%; bottom: 15%"
          class="hidden-sm-and-down"
          :showPreview="false"
        />
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue'
import ClickOutside from 'vue-click-outside'

export default {
  props: ['cname', 'wsname', 'currentUser'],
  name: 'ChatRoom',
  data () {
    return {
      drawer: true,
      message: '',
      displayEmoji: false,
      progress: false,
      messageSet: []
    }
  },
  components: {
    Picker
  },
  beforeMount () {
    this.$emit('updatePending', this.cname)
    this.progress = true
    this.$socket.emit('fetchChannelMessage', {channel: this.cname, workspace: this.wsname})
  },
  sockets: {
    newMessage (data) {
      if (data.channel === this.cname) {
        this.messageSet.push(data)
        setTimeout(() => {
          this.autoScroll()
        }, 300)
      } else {
        this.$emit('pending', data.channel)
      }
    },
    channelMessages (data) {
      if (data.channel === this.cname) {
        // this.messageSet.push(data)
        data.messageSet.forEach(m => {
          if (m.from === this.currentUser) {
            m.from = 'You'
          }
        })
        this.messageSet = [...data.messageSet, ...this.messageSet]
        setTimeout(() => {
          this.autoScroll()
        }, 300)
      }
      this.progress = false
    }
  },
  methods: {
    insertSymbol (emoji) {
      if (this.message === '') {
        this.message += emoji.native
      } else {
        this.message += ' ' + emoji.native
      }
    },
    hide () {
      this.displayEmoji = false
    },
    autoScroll () {
      const node = document.getElementById('chatRoom')
      const newMessage = node.lastChild
      const clientHeight = node.clientHeight
      const scrollTop = node.scrollTop
      const scrollHeight = node.scrollHeight
      let newMessageHeight, lastMessageHeight
      if (newMessage) {
        newMessageHeight = newMessage.clientHeight
        if (newMessage.previousSibling) {
          lastMessageHeight = newMessage.previousSibling.clientHeight
          if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            window.scrollTo(0, scrollHeight)
          }
        }
      }
    },
    sendMessage () {
      if (this.message) {
        this.$socket.emit('sendMessage', {workspace: this.wsname, channel: this.cname, text: this.message, from: this.currentUser})
        this.message = ''
      }
    }
  },
  directives: {
    ClickOutside
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
