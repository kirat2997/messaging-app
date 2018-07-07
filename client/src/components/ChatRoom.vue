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
              <b>{{ m.from }}: </b> <span v-html="m.text"></span>
              <p style="color: lightgrey">{{ m.createdAt }}</p>
            </li>
        </ol>
        </v-flex>
      </v-layout>
    </v-container>
    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-form style="position: absolute; bottom:0; left: 5%; width: 90%" method="post" @submit.prevent="sendMessage">
          <v-textarea
            full-width
            outline
            v-model="message"
            color="teal darken-2"
            :placeholder="'Message at ' + cname"
            type="text"
            append-icon="send"
            append-outer-icon="mood"
            flat
            height="20px"
            no-resize
            @click:append="sendMessage"
            @click:append-outer="() => displayEmoji = !displayEmoji"
          ></v-textarea>
        </v-form>
        <picker
          v-if="displayEmoji"
          @select="insertSymbol"
          title="Pick your emoji…"
          emoji="point_up"
          id="picker"
          :native="true"
          :sheetSize="20"
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
  props: ['cname', 'wsname', 'currentUser', 'obj', 'type', 'currentUserId'],
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
    if (this.type === 'channel') {
      this.$emit('updatePendingChannel', this.cname)
      this.progress = true
      this.$socket.emit('fetchChannelMessage', {channel: this.cname, workspace: this.wsname})
    } else if (this.type === 'member') {
      this.$emit('updatePendingMember', this.cname)
      this.progress = true
      this.$socket.emit('fetchMemberMessage', {myId: this.currentUserId, otherId: this.obj.id, workspace: this.wsname, user: this.currentUser})
    }
  },
  sockets: {
    newMessage (data) {
      if (data.channel === this.cname) {
        let formatted = this.format(data.text)
        data.text = formatted
        formatted = this.anotherFormat(data.text)
        data.text = formatted
        this.messageSet.push(data)
        setTimeout(() => {
          this.autoScroll()
        }, 300)
      } else {
        this.$emit('pendingChannel', data.channel)
      }
    },
    newMemberMessage (data) {
      if ((data.toId === this.currentUserId && data.fromId === this.obj.id) || (data.fromId === this.currentUserId && data.toId === this.obj.id)) {
        let formatted = this.format(data.text)
        data.text = formatted
        formatted = this.anotherFormat(data.text)
        data.text = formatted
        this.messageSet.push(data)
        setTimeout(() => {
          this.autoScroll()
        }, 300)
      } else {
        this.$emit('pendingMember', data.fromId)
      }
    },
    channelMessages (data) {
      if (data.channel === this.cname) {
        data.messageSet.forEach(m => {
          let formatted = this.format(m.text)
          m.text = formatted
          formatted = this.anotherFormat(m.text)
          m.text = formatted
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
    },
    memberMessages (data) {
      if (data.user === this.currentUser) {
        data.messageSet.forEach(m => {
          let formatted = this.format(m.text)
          m.text = formatted
          formatted = this.anotherFormat(m.text)
          m.text = formatted
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
    format (text) {
      if (text) {
        let match = text.match(/```/gi)
        let length = 0
        if (match) {
          length = match.length
        }
        if (length % 2 !== 0) {
          length = length - 1
        }
        for (let i = 0; i < length; i++) {
          if (i % 2 === 0) {
            text = text.replace(/```/, `<pre style="font-family:Lucida Sans Typewriter; color: black; background-color: whitesmoke; padding:1vh; font-size:12px; border: 1px solid black; border-radius: 1vh">`)
          } else {
            text = text.replace(/```/, `</pre> \n \n`)
          }
        }
      }
      return text
    },
    anotherFormat (text) {
      if (text) {
        let match = text.match(/`/gi)
        let length = 0
        if (match) {
          length = match.length
        }
        if (length % 2 !== 0) {
          length = length - 1
        }
        for (let i = 0; i < length; i++) {
          if (i % 2 === 0) {
            text = text.replace(/`/, `<span style="color: red; background-color: whitesmoke; padding:0.5vh; font-size:12px">`)
          } else {
            text = text.replace(/`/, `</span>`)
          }
        }
      }
      return text
    },
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
      this.message = this.message.trim()
      if (this.message) {
        if (this.type === 'channel') {
          this.$socket.emit('sendChannelMessage', {workspace: this.wsname, channel: this.cname, text: this.message, from: this.currentUser})
        } else if (this.type === 'member') {
          this.$socket.emit('sendMemberMessage', {workspace: this.wsname, fromId: this.currentUserId, text: this.message, from: this.currentUser, toId: this.obj.id})
        }
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
