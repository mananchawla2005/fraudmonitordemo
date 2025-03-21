<template>
  <nav class="bg-gradient-to-r from-gray-900 to-gray-800 py-4 px-6 flex items-center justify-between border-b border-gray-800">
    <div class="text-white font-bold text-2xl">
      <span class="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">FraudShield</span>
    </div>
    <div class="space-x-4">
      <NuxtLink to="/login" class="text-gray-300 hover:text-green-400 font-semibold px-4 py-2 transition">
        Log In
      </NuxtLink>
      <NuxtLink to="/signup" class="bg-gradient-to-r from-green-500 to-emerald-700 text-white font-semibold px-4 py-2 rounded hover:opacity-90 transition">
        Sign Up
      </NuxtLink>
    </div>
  </nav>
</template>
