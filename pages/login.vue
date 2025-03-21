<script lang="js" setup>
const error = ref("")
async function login(e) {
  error.value = ""
  const formData = new FormData(e.target)
  try {
    await $fetch("/api/login", {
      method: "POST",
      body: {
              username: formData.get("email"),
              password: formData.get("password")
          }
    });
    await navigateTo("/dashboard");
  }
  catch(err){
    error.value = err.statusMessage
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-6">
    <div class="max-w-md w-full relative">
      <div class="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg blur opacity-75"></div>
      <div class="relative bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 class="text-3xl font-bold mb-6 text-center">
          <span class="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
            Login
          </span>
        </h2>
        <form method="post" action="/api/login" @submit.prevent="login">
          <div class="mb-4">
            <label for="email" class="block text-gray-300 font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:ring-green-500/50"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-gray-300 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring focus:ring-green-500/50"
            />
          </div>
          <p class="text-sm text-red-400 text-center mb-4">
            {{ error }}
          </p>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-green-500 to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>
        <div class="mt-6 text-center text-gray-400">
          Don't have an account? 
          <NuxtLink to="/signup" class="text-green-400 hover:text-green-300 font-medium">
            Sign up
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>