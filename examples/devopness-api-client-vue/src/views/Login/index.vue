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
        <div v-show="error"  class="error-container">*Invalid credentials</div>
        <div>
          <button type="submit" :class="{ 'disabled': submitted }" >Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import "./styled.css";
import { login } from '../../services/login'

export default {
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
      error: false
    };
  },
  methods: {
    handleSubmit(e) {
      const { username, password } = this
      this.submitted = true

      login(username, password)
        .then(response => {
          this.$router.push('home')
        })
        .catch(error => {
          this.submitted = false
          this.error = true
        })
    }
  },
  watch: {
    username() {
      this.error = false
    },
    password() {
      this.error = false
    }
  },
};
</script>
