export const useAnalytics = () => {
    const timeRange = ref('last7days')
    const analytics = ref(null)
    const loading = ref(false)
    const error = ref(null)
  
    const fetchAnalytics = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await $fetch('/api/analytics/dashboard', {
          method: 'POST',
          body: { timeRange: timeRange.value }
        })
        
        if (response.success) {
          analytics.value = response.data
        } else {
          error.value = response.error
        }
      } catch (e) {
        error.value = 'Failed to fetch analytics data'
      } finally {
        loading.value = false
      }
    }
  
    return {
      timeRange,
      analytics,
      loading,
      error,
      fetchAnalytics
    }
  }