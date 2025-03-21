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
    
    const reportsQuery = `
      SELECT 
        fr.id,
        fr.transaction_id, 
        fr.reporting_entity_id,
        fr.fraud_details,
        fr.is_fraud_reported,
        fr.reporting_acknowledged,
        fr.failure_code,
        fr.created_at,
        fd.transaction_amount,
        fd.transaction_date,
        fd.payer_email,
        fd.payer_mobile
      FROM fraud_reporting fr
      LEFT JOIN fraud_detection fd ON fr.transaction_id = fd.transaction_id
      WHERE fr.user_id = $1
      ORDER BY fr.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM fraud_reporting
      WHERE user_id = $1
    `;
    
    const [reportsResult, countResult] = await Promise.all([
      pool.query(reportsQuery, queryParams),
      pool.query(countQuery, [userId])
    ]);
    
    return {
      reports: reportsResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      pageSize,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / pageSize)
    };
    
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw createError({
      message: "Error fetching reports",
      statusCode: 500
    });
  }
});
