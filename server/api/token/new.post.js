export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      message: "Unauthorized access not allowed",
      statusCode: 401
    });
  }

  try {
    const body = await readBody(event);
    
    if (!body.name || body.name.trim() === '') {
      throw createError({
        message: "Token name is required",
        statusCode: 400
      });
    }
    
    const userId = event.context.user.id;
    const tokenValue = uuidv4() + uuidv4().replace(/-/g, '');
    
    const query = `
      INSERT INTO api_tokens (api_token, name, auth_user_id) 
      VALUES ($1, $2, $3)
    `;
    
    await pool.query(query, [tokenValue, body.name, userId]);
    
    return {
      success: true,
      token: tokenValue
    };
    
  } catch (error) {
    console.error('Error creating token:', error);
    throw createError({
      message: "Error creating token",
      statusCode: 500
    });
  }
});