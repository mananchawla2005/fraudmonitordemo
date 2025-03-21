import { verifyRequestOrigin } from "lucia"

export default defineEventHandler(async (event) => {
    const apiToken = getHeader(event, "X-API-Token") ?? null
    
    if (!apiToken && event.method !== "GET") {
        const originHeader = getHeader(event, "Origin") ?? null
        const hostHeader = getHeader(event, "Host") ?? null
        if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
            return event.node.res.writeHead(403).end()
        }
    }


    if (apiToken) {
        const query = "SELECT auth_user_id FROM api_tokens WHERE api_token = $1"
        const result = await pool.query(query, [apiToken])
        
        if (result.rows.length > 0) {
            event.context.user = { id: result.rows[0].auth_user_id }
            event.context.session = null
            return
        }
        return event.node.res.writeHead(401).end()
    }

    const sessionId = getCookie(event, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        event.context.session = null
        event.context.user = null
        return
    }

    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        appendResponseHeader(
            event,
            "Set-Cookie",
            lucia.createSessionCookie(session.id).serialize()
        )
    }
    if (!session) {
        appendResponseHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize())
    }
    event.context.session = session
    event.context.user = user
})