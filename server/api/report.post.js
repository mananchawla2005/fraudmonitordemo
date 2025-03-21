export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      message: "Unauthorised Access not allowed",
      statusCode: 401
    });
  }

  const userId = event.context.user.id;
  const body = await readBody(event);
  
  if (!body.transaction_id) {
    throw createError({
      message: "Transaction ID is required",
      statusCode: 400
    });
  }

  if (!body.reporting_entity_id) {
    throw createError({
      message: "Reporting entity ID is required",
      statusCode: 400
    });
  }

  try {
    let reporting_acknowledged = true;
    let failure_code = null;
    
    try {
      const checkQuery = `SELECT transaction_id FROM fraud_detection WHERE transaction_id = $1`;
      const checkResult = await pool.query(checkQuery, [body.transaction_id]);
      
      if (checkResult.rowCount === 0) {
        reporting_acknowledged = false;
        failure_code = 404;
        
        const insertQuery = `
          INSERT INTO fraud_reporting (
            transaction_id, reporting_entity_id, fraud_details,
            is_fraud_reported, reporting_acknowledged, failure_code, user_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `;
        
        const insertValues = [
          body.transaction_id,
          body.reporting_entity_id,
          body.fraud_details || null,
          body.is_fraud_reported !== undefined ? body.is_fraud_reported : true,
          reporting_acknowledged,
          failure_code,
          userId
        ];
        
        const result = await pool.query(insertQuery, insertValues);
        
        return {
          id: result.rows[0].id,
          transaction_id: body.transaction_id,
          reporting_acknowledged,
          failure_code,
          message: "Report submitted but transaction not found"
        };
      } else {
        const insertQuery = `
          INSERT INTO fraud_reporting (
            transaction_id, reporting_entity_id, fraud_details,
            is_fraud_reported, reporting_acknowledged, failure_code, user_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `;
        
        const insertValues = [
          body.transaction_id,
          body.reporting_entity_id,
          body.fraud_details || null,
          body.is_fraud_reported !== undefined ? body.is_fraud_reported : true,
          true,
          null,
          userId
        ];
        
        const result = await pool.query(insertQuery, insertValues);
        
        // If confirmed as fraud, update the fraud_detection table
        if (body.is_fraud_reported) {
          await pool.query(
            `UPDATE fraud_detection 
             SET is_fraud_predicted = TRUE, 
                 fraud_reason = COALESCE(fraud_reason, $1),
                 fraud_source = COALESCE(fraud_source, 'manual_report')
             WHERE transaction_id = $2`,
            [body.fraud_details?.substring(0, 100) || "Manually reported fraud", body.transaction_id]
          );
        }
        
        return {
          id: result.rows[0].id,
          transaction_id: body.transaction_id,
          reporting_acknowledged: true,
          failure_code: null,
          message: "Report submitted successfully"
        };
      }
    } catch (error) {
      console.error('Database error:', error);
      reporting_acknowledged = false;
      failure_code = 500;
      
      try {
        const insertQuery = `
          INSERT INTO fraud_reporting (
            transaction_id, reporting_entity_id, fraud_details,
            is_fraud_reported, reporting_acknowledged, failure_code, user_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `;
        
        const insertValues = [
          body.transaction_id,
          body.reporting_entity_id,
          body.fraud_details || null,
          body.is_fraud_reported !== undefined ? body.is_fraud_reported : true,
          reporting_acknowledged,
          failure_code,
          userId
        ];
        
        const result = await pool.query(insertQuery, insertValues);
        
        return {
          id: result.rows[0].id,
          transaction_id: body.transaction_id,
          reporting_acknowledged,
          failure_code,
          message: "Report submitted but error occurred"
        };
      } catch (secondaryError) {
        console.error('Failed to log error state:', secondaryError);
        throw createError({
          message: "Failed to process report",
          statusCode: 500
        });
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    throw createError({
      message: "Internal server error",
      statusCode: 500
    });
  }
});
