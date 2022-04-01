<template>
  <v-form>
    <v-text-field
      class="mx-auto"
      style="width: 300px"
      type="email"
      placeholder="Email"
      label="Please enter your email"
    />
    <v-text-field
      class="mx-auto"
      style="width: 300px"
      type="password"
      placeholder="Password"
      label="Please enter your password"
    />
    <v-btn
      class="mx-auto"
      width="200"
      height="50"
      to="/"
    >
      Sign In
    </v-btn>
    <h3 class="mx-auto pt-4">
      Need an account? <a
        href="#/signup"
        class="text-decoration-underline"
      > Sign up now </a>
    </h3>
  </v-form>
</template>

<script>

export default {
  name: 'SignIn',
};
</script>
