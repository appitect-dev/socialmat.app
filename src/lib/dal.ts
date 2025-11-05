/**
 * DATA ACCESS LAYER (DAL)
 *
 * Centralizuje autorizační logiku podle Next.js best practices
 * Používá React cache() pro memoizaci a optimalizaci výkonu
 * https://nextjs.org/docs/app/building-your-application/authentication#creating-a-data-access-layer-dal
 */

import 'server-only'; // Zajistí, že tento modul lze použít pouze na serveru
import { cache } from 'react';
import { getSession } from './session';
import { getUserById } from './users';

/**
 * Ověří, zda je uživatel přihlášený a vrátí session data
 * Používá React cache() - výsledek se cachuje během jednoho requestu
 */
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    return { isAuth: false, userId: null };
  }

  return { isAuth: true, userId: session.userId };
});

/**
 * Získá aktuálního přihlášeného uživatele
 * Používá React cache() pro optimalizaci
 */
export const getUser = cache(async () => {
  console.log('DAL: Getting user...');
  const session = await verifySession();
  console.log('DAL: Session check:', session);

  if (!session.isAuth || !session.userId) {
    console.log('DAL: No valid session');
    return null;
  }

  try {
    const user = await getUserById(session.userId);
    console.log('DAL: User from DB:', !!user);

    // Vrať user data bez hesla
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
});

/**
 * Zkontroluje, zda má uživatel přístup k určitému projektu
 * (Příklad autorizační logiky - můžeš rozš

ířit podle potřeby)
 */
export async function canAccessProject(projectId: string): Promise<boolean> {
  const user = await getUser();

  if (!user) {
    return false;
  }

  // Tady by byla logika kontroly vlastnictví projektu
  // Například: SELECT * FROM projects WHERE id = projectId AND userId = user.id
  // Pro demo vrátíme true
  return true;
}
