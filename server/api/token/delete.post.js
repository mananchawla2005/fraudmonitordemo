export default defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        message: "Unauthorized access not allowed",
        statusCode: 401
      })
    }
  
    try {
      const body = await readBody(event)
      
      if (!body.tokenId) {
        throw createError({
          message: "Token ID is required",
          statusCode: 400
        })
      }
  
      const userId = event.context.user.id
      const query = `
        DELETE FROM api_tokens 
        WHERE id = $1 AND auth_user_id = $2
      `
      
      const result = await pool.query(query, [body.tokenId, userId])
      
      if (result.rowCount === 0) {
        throw createError({
          message: "Token not found or unauthorized",
          statusCode: 404
        })
      }
  
      return {
        success: true
      }
  
    } catch (error) {
      throw createError({
        message: "Error deleting token",
        statusCode: 500
      })
    }
  })