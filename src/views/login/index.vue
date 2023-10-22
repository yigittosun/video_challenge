<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card wider-card">
      <div class="card-body">
        <h2 class="card-title my-3 text-navy">Welcome</h2>
        <form @submit.prevent="login">
          <div class="mb-3 text-start px-3">
            <label for="email" class="form-label">Email:</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="email"
              placeholder="abc@example.com"
            />
          </div>
          <div class="mb-3 text-start px-3">
            <label for="password" class="form-label">Password:</label>
            <span
              class="ms-1"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="First 3 numbers"
            >
              <i class="bi bi-info-circle h6"></i>
            </span>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
            />
          </div>
          <ButtonComponent
            type="submit"
            btnClass="btn-navy my-2 px-5"
            :disabled="false"
            buttonText="Login"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import ButtonComponent from '@/components/ButtonComponent.vue'

export default defineComponent({
  name: 'login-view',
  components: {
    ButtonComponent
  },
  setup() {
    const router = useRouter()
    const email = ref('abc@example.com')
    const password = ref('123')

    const login = (event: Event) => {
      event.preventDefault()

      if (email.value === 'abc@example.com' && password.value === '123') {
        router.push({ name: 'homepage-view' })
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Invalid email or password',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        })
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
