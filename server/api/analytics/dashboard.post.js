
export default defineEventHandler(async (event) => {
  const { timeRange } = await readBody(event)

  const dateFilter = timeRange === 'last7days' 
    ? `WHERE transaction_date >= NOW() - INTERVAL '7 days'`
    : timeRange === 'last30days'
      ? `WHERE transaction_date >= NOW() - INTERVAL '30 days'`
      : timeRange === 'last90days' 
        ? `WHERE transaction_date >= NOW() - INTERVAL '90 days'`
        : ''

  const queries = {
    totalTransactions: `
      SELECT COUNT(*) as count FROM fraud_detection ${dateFilter}
    `,
    fraudulentTransactions: `
      SELECT COUNT(*) as count FROM fraud_detection ${dateFilter} AND is_fraud_predicted = true
    `,
    totalAmount: `
      SELECT SUM(transaction_amount) as total FROM fraud_detection ${dateFilter}
    `,
    transactionsByDay: `
      SELECT 
        DATE(transaction_date) as date,
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN is_fraud_predicted THEN 1 END) as fraudulent_transactions,
        SUM(transaction_amount) as total_amount
      FROM fraud_detection
      ${dateFilter}
      GROUP BY DATE(transaction_date)
      ORDER BY date DESC
    `,
    topChannels: `
      SELECT 
        transaction_channel,
        COUNT(*) as transaction_count,
        SUM(transaction_amount) as total_amount
      FROM fraud_detection
      ${dateFilter}
      GROUP BY transaction_channel
      ORDER BY transaction_count DESC
      LIMIT 5
    `,
    fraudByReason: `
      SELECT 
        fraud_reason,
        COUNT(*) as count,
        AVG(fraud_score) as avg_score
      FROM fraud_detection
      ${dateFilter} AND is_fraud_predicted = true
      GROUP BY fraud_reason
      ORDER BY count DESC
    `,
    paymentModes: `
      SELECT 
        transaction_payment_mode,
        COUNT(*) as count,
        SUM(CASE WHEN is_fraud_predicted THEN 1 ELSE 0 END) as fraud_count
      FROM fraud_detection
      ${dateFilter}
      GROUP BY transaction_payment_mode
      ORDER BY count DESC
    `
  }

  try {
    const results = {}
    for (const [key, query] of Object.entries(queries)) {
      const { rows } = await pool.query(query)
      results[key] = rows
    }

    return {
      success: true,
      data: results
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch analytics data'
    }
  }
})