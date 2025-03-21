<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">API Tokens (TO BE IMPLEMENTED )</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Create New API Token</h2>
      
      <form @submit.prevent="createToken" class="space-y-4">
        <div>
          <label for="tokenName" class="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
          <input
            id="tokenName"
            v-model="tokenName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a name for your token"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Creating...' : 'Create Token' }}
          </button>
        </div>
      </form>
    </div>
    
    <div v-if="newToken" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div class="flex items-center mb-2">
        <span class="text-green-600 font-semibold">Your new token has been created!</span>
      </div>
      <p class="text-sm text-gray-600 mb-2">Please copy your token now. You won't be able to see it again.</p>
      <div class="flex items-center space-x-2">
        <code class="bg-gray-100 px-2 py-1 rounded text-sm flex-1 overflow-x-auto">{{ newToken }}</code>
        <button 
          @click="copyToClipboard(newToken)" 
          class="text-blue-600 hover:text-blue-800"
        >
          Copy
        </button>
      </div>
    </div>
    
    <div v-if="tokens.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="token in tokens" :key="token.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ token.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(token.created_at) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="deleteToken(token.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
    </table>
    </div>
    
    <div v-else class="text-center py-6 text-gray-500">
      You haven't created any API tokens yet.
    </div>
  </div>
</template>

<script setup>
const tokenName = ref('')
const isLoading = ref(false)
const newToken = ref('')
const tokens = ref([])

onMounted(async () => {
  await fetchTokens()
})

async function fetchTokens() {
  try {
    const data = await $fetch('/api/token/list', {
        method: "POST"
    })
    tokens.value = data || []
  } catch (error) {
    console.error('Error fetching tokens:', error)
  }
}

async function createToken() {
  if (!tokenName.value) return
  
  try {
    isLoading.value = true
    const data = await $fetch('/api/token/new', {
      method: 'POST',
      body: {
        name: tokenName.value
      }
    })
    
    if (data && data.token) {
      newToken.value = data.token
      tokenName.value = ''
      await fetchTokens()
    }
  } catch (error) {
    console.error('Error creating token:', error)
  } finally {
    isLoading.value = false
  }
}

async function deleteToken(tokenId) {
  if (!confirm('Are you sure you want to delete this token? This action cannot be undone.')) {
    return
  }
  
  try {
    await useFetch(`/api/token/delete`, {
      method: 'POST',
      body: {
        tokenId: tokenId
      }
    })
    await fetchTokens()
  } catch (error) {
    console.error('Error deleting token:', error)
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Token copied to clipboard!')
    })
    .catch(err => {
      console.error('Failed to copy:', err)
    })
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}
</script>