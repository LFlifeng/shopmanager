<template>
    <div id="login">
        <h1>Login</h1>
        <input type="text" name="username" placeholder="Username" :v-model="input.username">
        <input type="password" name="password" placeholder="Password" :v-model="input.password">
        <button type="button"></button>
    </div>
</template>
<script>
export default {
  name: "login_1",
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      if (this.input.username != "" && this.input.password != "") {
        if (
          this.input.username == this.$parent.mockAccount.username &&
          this.input.password.mockAccount.password
        ) {
          this.$emit("authenticated", true);
          this.$router.replace({ name: "secure" });
        } else {
            console.log('The username and / or password is incorrect');
        }
      } else {
          console.log('A username and password must be present')
      }
    }
  }
};
</script>

