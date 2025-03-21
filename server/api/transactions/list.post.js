export default defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        message: "Unauthorized access not allowed",
        statusCode: 401
      });
    }
  
    try {
      const body = await readBody(event);
      const userId = event.context.user.id;
      const page = body.page || 1;
      const pageSize = body.pageSize || 10;
      const offset = (page - 1) * pageSize;
      
      const queryParams = [userId, pageSize, offset];
      
      const transactionsQuery = `
        SELECT 
          transaction_id, 
          transaction_date, 
          transaction_amount, 
          transaction_channel, 
          transaction_payment_mode,
          payee_id,
          payer_email,
          payer_mobile,
          is_fraud_predicted,
          fraud_source,
          fraud_reason,
          fraud_score,
          created_at
        FROM fraud_detection
        WHERE user_id = $1
        ORDER BY transaction_date DESC
        LIMIT $2 OFFSET $3
      `;
      
      const countQuery = `
        SELECT COUNT(*) as total
        FROM fraud_detection
        WHERE user_id = $1
      `;
      
      const [transactionsResult, countResult] = await Promise.all([
        pool.query(transactionsQuery, queryParams),
        pool.query(countQuery, [userId])
      ]);
      
      return {
        transactions: transactionsResult.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        pageSize,
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / pageSize)
      };
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw createError({
        message: "Error fetching transactions",
        statusCode: 500
      });
    }
});