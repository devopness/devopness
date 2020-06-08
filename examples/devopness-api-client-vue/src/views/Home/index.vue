<template>
  <div>
    <h2>You are logged in!</h2>
    <button v-on:click="logout">logout</button>
  </div>
</template>

<script>
import auth from '../../services/auth'

export default {
  methods: {
    logout() {
      this.$router.push('/')
    }
  }
}
</script>
