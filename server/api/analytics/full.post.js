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

    const query = `
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

    try {
        const result = await pool.query(query, [startDate, endDate, userId])
        
        return {
            success: true,
            data: result.rows.map(row => ({
                date: row.date,
                accepted: Number(row.accepted) || 0,
                refused: Number(row.refused) || 0
            }))
        }
    } catch (error) {
        throw createError({
            message: "Failed to fetch analytics data",
            statusCode: 500
        })
    }
})