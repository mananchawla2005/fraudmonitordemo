export default defineEventHandler(async (event) => {
  const { limit = 10 } = await readBody(event)
  
  const query = `
    SELECT 
      transaction_id,
      transaction_date,
      transaction_amount,
      transaction_channel,
      transaction_payment_mode,
      is_fraud_predicted,
      fraud_reason,
      fraud_score
    FROM fraud_detection
    ORDER BY transaction_date DESC
    LIMIT $1
  `

  try {
    const { rows } = await pool.query(query, [limit])
    const formattedTransactions = rows.map(transaction => ({
      id: transaction.transaction_id,
      date: transaction.transaction_date,
      amount: transaction.transaction_amount,
      channel: transaction.transaction_channel,
      paymentMode: transaction.transaction_payment_mode,
      isFraud: transaction.is_fraud_predicted,
      fraudReason: transaction.fraud_reason || null,
      fraudScore: transaction.fraud_score || null
    }))

    return {
      success: true,
      data: formattedTransactions
    }
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return {
      success: false,
      error: 'Failed to fetch recent transactions'
    }
  }
})
