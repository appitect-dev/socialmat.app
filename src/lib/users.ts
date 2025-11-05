/**
 * IN-MEMORY USER STORE
 *
 * Pro demo účely - v produkci by to byla databáze (PostgreSQL, MongoDB, etc.)
 * Tento soubor simuluje databázové operace s uživateli
 */

import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;
}

// Simulace databáze - v paměti
const users: User[] = [
  // Demo uživatel pro testování
  {
    id: '1',
    email: 'demo@socialmat.app',
    // heslo: "demo123" (už zahashované)
    password: '$2b$10$xFBFGVKSohyzrWbVA8wNr.mldQqFZ9aUU8ug8xVGZc47eJ218E9UK',
    name: 'Demo Uživatel',
    createdAt: new Date('2024-01-01'),
  },
];

/**
 * Najde uživatele podle emailu
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = users.find((u) => u.email === email);
  return user || null;
}

/**
 * Najde uživatele podle ID
 */
export async function getUserById(id: string): Promise<User | null> {
  console.log('getUserById called with id:', id);
  console.log('Available users:', users.map(u => ({ id: u.id, email: u.email })));
  const user = users.find((u) => u.id === id);
  console.log('Found user:', !!user);
  return user || null;
}

/**
 * Vytvoří nového uživatele
 */
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  // Zahashuj heslo
  const hashedPassword = await bcrypt.hash(password, 10);

  // Vytvoř nového uživatele
  const newUser: User = {
    id: (users.length + 1).toString(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  };

  // Přidej do "databáze"
  users.push(newUser);

  return newUser;
}

/**
 * Ověří heslo uživatele
 */
export async function verifyPassword(
  user: User,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}
