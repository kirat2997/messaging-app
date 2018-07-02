<template>
  <div>
    {{ channel }}
  </div>
</template>

<script>
export default {
  props: ['channel'],
  name: 'ChatRoom',
  data () {
    return {
      drawer: true,
      workspace: null,
      currentUser: null,
      members: []
    }
  },
  updated () {
    console.log('HERE')
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
