<template>
  <div class="container h-50">
    <div class="row h-100 justify-content-center align-items-center">
      <div class="col-md-6">
        <div class="col-md-12">
          <div v-if="errors.length" class="alert alert-danger" role="alert">
            Identifiants invalides
          </div>
          <div class="card shadow">
            <div class="card-header bg-primary">
              <span>Formulaire de connexion</span>
            </div>
            <div class="card-body p-4">
              <Form @submit="onSubmit" :validation-schema="schema">
                <div class="mb-3">
                  <label for="username" class="form-label">Nom d'utilisateur :</label>
                  <Field name="username" type="text" class="form-control" id="username" placeholder="ex. jdupont" />
                  <ErrorMessage name="username" class="invalid-feedback" />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Mot de passe :</label>
                  <Field name="password" type="password" class="form-control" id="password" placeholder="********" />
                  <ErrorMessage name="password" class="invalid-feedback" />
                </div>
                <button class="btn btn-secondary w-100 rounded-pill" type="submit">Connexion</button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { POST_LOGIN } from '../store/action.type'
import * as yup from 'yup'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    const errors = computed(() => store.state.auth.errors)

    const schema = yup.object({
      username: yup.string().required(),
      password: yup.string().required()
    })

    const onSubmit = (values: any) => {
      store.dispatch(POST_LOGIN, values).then(() => {
        if (errors.value.length === 0) {
          router.push({ name: 'simulation' })
        }
      })
    }

    return {
      schema,
      onSubmit,
      errors
    }
  }
})
</script>
