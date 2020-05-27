<template>
  <div class="login">
    <h2>Login</h2>
    <div class="login-container">
      <form @submit.prevent="handleSubmit">
        <div class="input-container">
          <input
            type="text"
            v-model="username"
            name="username"
            placeholder="Username"
            :class="{'input-error': error}"
          />
        </div>
        <div class="input-container">
          <input
            type="password"
            v-model="password"
            name="password"
            placeholder="Password"
            :class="{'input-error': error}"
          />
        </div>
        <div v-if="error != null"  class="error-container">
          <strong>{{error.message}}</strong>
        </div>
        <div>
          <button type="submit" :class="{'disabled': submitted}" >Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import "./styled.css";
import auth from '../../services/auth'

export default {
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      error: null
    };
  },
  methods: {
    handleSubmit(e) {
      const { username, password } = this
      this.submitted = true

      auth.login(username, password)
        .then(response => {
          this.$router.push('home')
        })
        .catch(error => {
          this.error = error
          this.submitted = false
        })
    }
  },
  watch: {
    username() {
      this.error = null
    },
    password() {
      this.error = null
    }
  },
};
</script>
