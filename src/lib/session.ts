/**
 * SESSION MANAGEMENT
 *
 * Podle Next.js dokumentace - používá stateless sessions s šifrovanými cookies
 * https://nextjs.org/docs/app/building-your-application/authentication
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Typ pro session data
export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  expiresAt: Date;
}

// Secret klíč pro šifrování (v produkci by to mělo být v .env)
const SECRET_KEY = process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production';
const key = new TextEncoder().encode(SECRET_KEY);

// Název cookie
const COOKIE_NAME = 'session';

// Doba platnosti session (7 dní)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Zašifruje a vytvoří JWT token ze session dat
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

/**
 * Dešifruje JWT token a vrátí session data
 */
export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    // Validuj že payload obsahuje požadované fieldy
    if (
      !payload ||
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      expiresAt: new Date(payload.exp! * 1000), // JWT exp je v sekundách
    };
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}

/**
 * Vytvoří novou session (uloží do cookie)
 */
export async function createSession(userId: string, email: string, name: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const session: SessionPayload = {
    userId,
    email,
    name,
    expiresAt,
  };

  // Zašifruj session data
  const encryptedSession = await encrypt(session);

  // Ulož do HTTP-only cookie
  (await cookies()).set(COOKIE_NAME, encryptedSession, {
    httpOnly: true, // Bezpečnost: JavaScript nemůže přistoupit
    secure: process.env.NODE_ENV === 'production', // HTTPS only v produkci
    expires: expiresAt,
    sameSite: 'lax', // CSRF ochrana
    path: '/',
  });
}

/**
 * Získá aktuální session z cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;

  return decrypt(cookie);
}

/**
 * Smaže session (odhlášení)
 */
export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * Aktualizuje session (refresh)
 */
export async function updateSession() {
  const session = await getSession();
  if (!session) return null;

  // Obnov session s novým expiration časem
  await createSession(session.userId, session.email, session.name);
  return session;
}
