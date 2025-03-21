export default defineEventHandler(async (event) => {
    if (!event.context.user) {
        throw createError({
          message: "Unauthorised Access not allowed",
          statusCode: 401
        })
    }
    
    const body = await readBody(event)
    const { startDate, endDate } = body
    const userId = event.context.user.id

    const timeSeriesQuery = `
        SELECT 
            DATE(transaction_date) as date,
            COUNT(CASE WHEN is_fraud_predicted = false THEN 1 END) as accepted,
            COUNT(CASE WHEN is_fraud_predicted = true THEN 1 END) as refused
        FROM fraud_detection
        WHERE transaction_date BETWEEN $1 AND $2
        AND user_id = $3
        GROUP BY DATE(transaction_date)
        ORDER BY date ASC
    `

    const overviewQuery = `
        SELECT 
            COUNT(CASE WHEN is_fraud_predicted = false THEN 1 END) as accepted,
            COUNT(CASE WHEN is_fraud_predicted = true THEN 1 END) as refused
        FROM fraud_detection
        WHERE transaction_date BETWEEN $1 AND $2
        AND user_id = $3
    `

    const paymentMethodQuery = `
        SELECT 
            transaction_payment_mode,
            COUNT(*) as total,
            COUNT(CASE WHEN is_fraud_predicted = true THEN 1 END) as fraud_count
        FROM fraud_detection
        WHERE transaction_date BETWEEN $1 AND $2
        AND user_id = $3
        GROUP BY transaction_payment_mode
        ORDER BY total DESC
    `

    const bankFraudQuery = `
        SELECT 
            payment_gateway_bank,
            COUNT(*) as total_transactions,
            COUNT(CASE WHEN is_fraud_predicted = true THEN 1 END) as fraud_count
        FROM fraud_detection
        WHERE transaction_date BETWEEN $1 AND $2
        AND user_id = $3
        GROUP BY payment_gateway_bank
        ORDER BY fraud_count DESC
    `
    const channelQuery = `
        SELECT 
            transaction_channel,
            COUNT(CASE WHEN is_fraud_predicted = false THEN 1 END) as safe_count,
            COUNT(CASE WHEN is_fraud_predicted = true THEN 1 END) as fraud_count
        FROM fraud_detection
        WHERE transaction_date BETWEEN $1 AND $2
        AND user_id = $3
        GROUP BY transaction_channel
        ORDER BY transaction_channel
    `
    
    try {
        const [timeSeriesResult, overviewResult, paymentMethodResult, bankFraudResult, channelResult] = await Promise.all([
            pool.query(timeSeriesQuery, [startDate, endDate, userId]),
            pool.query(overviewQuery, [startDate, endDate, userId]),
            pool.query(paymentMethodQuery, [startDate, endDate, userId]),
            pool.query(bankFraudQuery, [startDate, endDate, userId]),
            pool.query(channelQuery, [startDate, endDate, userId])
        ])
        
        return {
            success: true,
            data: timeSeriesResult.rows,
            overview: overviewResult.rows[0],
            paymentMethods: paymentMethodResult.rows,
            bankFraud: bankFraudResult.rows,
            channels: channelResult.rows
        }
    } catch (error) {
        console.log(error)
        throw createError({
            message: "Failed to fetch analytics data",
            statusCode: 500
        })
    }
})