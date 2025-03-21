export default defineEventHandler(async (event) => {
  if (event.context.user) {
    const userId = event.context.user.id
    const body = await readBody(event)
    
    if (!body.transaction_id) {
      throw createError({
        message: "Transaction ID is required",
        statusCode: 400
      })
    }
    
    const transactionData = {
      transaction_id: body.transaction_id,
      transaction_date: body.transaction_date,
      transaction_amount: body.transaction_amount,
      transaction_channel: body.transaction_channel,
      transaction_payment_mode: body.transaction_payment_mode,
      payment_gateway_bank: body.payment_gateway_bank,
      payer_email: body.payer_email,
      payer_mobile: body.payer_mobile,
      payer_card_brand: body.payer_card_brand,
      payer_device: body.payer_device,
      payer_browser: body.payer_browser,
      payee_id: body.payee_id
    }

    let fraudResult
    fraudResult = await detectFraudPatterns(transactionData, body.custom_rules || [])

    try {
      const customRulesJson = body.custom_rules ? JSON.stringify(body.custom_rules) : null;
      
      const insertQuery = `
        INSERT INTO fraud_detection (
          transaction_id, transaction_date, transaction_amount, 
          transaction_channel, transaction_payment_mode, payment_gateway_bank,
          payer_email, payer_mobile, payer_card_brand, payer_device, 
          payer_browser, payee_id, is_fraud_predicted, fraud_source, 
          fraud_reason, fraud_score, user_id, custom_rules
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      `
      const insertValues = [
        body.transaction_id,
        body.transaction_date,
        body.transaction_amount,
        body.transaction_channel,
        body.transaction_payment_mode,
        body.payment_gateway_bank,
        body.payer_email,
        body.payer_mobile,
        body.payer_card_brand,
        body.payer_device,
        body.payer_browser,
        body.payee_id,
        fraudResult.is_fraud_detected,
        fraudResult.fraud_source,
        fraudResult.fraud_reason,
        fraudResult.fraud_score,
        userId,
        customRulesJson
      ]
      
      await pool.query(insertQuery, insertValues)
      
      return {
        transaction_id: body.transaction_id,
        is_fraud: fraudResult.is_fraud_detected,
        fraud_source: fraudResult.fraud_source,
        fraud_reason: fraudResult.fraud_reason,
        fraud_score: fraudResult.fraud_score,
        custom_rules: body.custom_rules
      }
      
    } catch (error) {
      console.error('Database error:', error)
      throw createError({
        message: "Error processing transaction",
        statusCode: 500
      })
    }
  } else {
    throw createError({
      message: "Unauthorised Access not allowed",
      statusCode: 401
    })
  }
})