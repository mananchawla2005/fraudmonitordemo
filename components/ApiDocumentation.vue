<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">API Documentation</h1>
  
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-bold mb-4">Authentication</h2>
        <p class="text-gray-600 mb-4">All endpoints require authentication via API tokens. Include the token in your request headers:</p>
        <div class="bg-gray-50 p-4 rounded-md font-mono text-sm">
            X-API-Token: api_token
        </div>
      </div>
  
      <div v-for="(endpoint, index) in endpoints" :key="index" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">{{ endpoint.name }}</h2>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">{{ endpoint.method }}</span>
        </div>
        <p class="text-gray-600 mb-4">{{ endpoint.description }}</p>
        
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Endpoint</h3>
          <div class="bg-gray-50 p-3 rounded-md font-mono text-sm">{{ endpoint.url }}</div>
        </div>
  
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Request Body</h3>
          <pre class="bg-gray-50 p-3 rounded-md overflow-x-auto"><code>{{ endpoint.requestBody }}</code></pre>
        </div>
  
        <div>
          <h3 class="font-semibold mb-2">Response</h3>
          <pre class="bg-gray-50 p-3 rounded-md overflow-x-auto"><code>{{ endpoint.response }}</code></pre>
        </div>
      </div>
  
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold mb-4">Error Responses</h2>
        <ul class="space-y-2">
          <li v-for="(message, code) in errorCodes" :key="code" class="flex">
            <span class="font-mono text-red-600 w-12">{{ code }}</span>
            <span class="text-gray-600">{{ message }}</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  const endpoints = [
    {
      name: 'Detect Single Transaction',
      method: 'POST',
      url: '/api/detect',
      description: 'Analyze a single transaction for potential fraud',
      requestBody: JSON.stringify({
        transaction_id: 'string',
        transaction_date: 'string',
        transaction_amount: 'number',
        transaction_channel: 'string',
        transaction_payment_mode: 'string',
        payment_gateway_bank: 'string',
        payer_email: 'string',
        payer_mobile: 'string',
        payer_card_brand: 'string',
        payer_device: 'string',
        payer_browser: 'string',
        payee_id: 'string',
        custom_rules: [{
          field: 'string',
          condition: 'equals|contains|greater_than|less_than|starts_with|ends_with',
          value: 'string'
        }]
      }, null, 2),
      response: JSON.stringify({
        transaction_id: 'string',
        is_fraud: 'boolean',
        fraud_source: 'string',
        fraud_reason: 'string',
        fraud_score: 'number',
        custom_rules: []
      }, null, 2)
    },
    {
      name: 'Batch Detection',
      method: 'POST',
      url: '/api/detect/batch',
      description: 'Analyze multiple transactions for potential fraud',
      requestBody: JSON.stringify([{
        transaction_id: 'string',
        transaction_date: 'string',
        transaction_amount: 'number',
        transaction_channel: 'string'
      }], null, 2),
      response: JSON.stringify({
        'transaction_id': {
          is_fraud: 'boolean',
          fraud_source: 'string',
          fraud_reason: 'string',
          fraud_score: 'number',
          custom_rules: []
        }
      }, null, 2)
    },
    {
      name: 'Report Fraud',
      method: 'POST',
      url: '/api/report',
      description: 'Report a fraudulent transaction',
      requestBody: JSON.stringify({
        transaction_id: 'string',
        reporting_entity_id: 'string',
        fraud_details: 'string',
        is_fraud_reported: 'boolean'
      }, null, 2),
      response: JSON.stringify({
        id: 'number',
        transaction_id: 'string',
        reporting_acknowledged: 'boolean',
        failure_code: 'number|null',
        message: 'string'
      }, null, 2)
    }
  ]
  
  const errorCodes = {
    401: 'Unauthorized access',
    400: 'Bad request/Invalid input',
    404: 'Transaction not found',
    500: 'Internal server error'
  }
  </script>