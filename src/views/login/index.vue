<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card w-25">
      <div class="card-body">
        <h2 class="card-title my-3">Welcome</h2>
        <form @submit="login()">
          <div class="mb-3 text-start px-3">
            <label for="email" class="form-label">E-mail:</label>
            <input type="email" class="form-control" id="email" placeholder="abc@example.com" />
          </div>
          <div class="mb-3 text-start px-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" class="form-control" id="password" placeholder="Password" />
          </div>
          <button type="submit" class="btn btn-primary my-2 px-5">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'login-view',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')

    const login = () => {
      if (email.value === 'abc@example.com' && password.value === '123') {
        router.push({ name: 'homepage' })
      } else {
        alert('E-posta veya şifre hatalı')
      }
    }

    return {
      email,
      password,
      login
    }
  }
})
</script>
