export default defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        message: "Unauthorized access not allowed",
        statusCode: 401
      })
    }
  
    try {
      const userId = event.context.user.id
      const query = `
        SELECT id, name, created_at, api_token 
        FROM api_tokens 
        WHERE auth_user_id = $1 
        ORDER BY created_at DESC
      `
      
      const result = await pool.query(query, [userId])
      
      const tokens = result.rows.map(token => ({
        id: token.id,
        name: token.name,
        created_at: token.created_at
      }))
      
      return tokens
  
    } catch (error) {
      throw createError({
        message: "Error fetching tokens",
        statusCode: 500
      })
    }
  })