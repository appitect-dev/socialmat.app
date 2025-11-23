/**
 * SERVER ACTIONS PRO AUTENTIZACI
 *
 * Next.js Server Actions - funkce běžící na serveru, volatelné z klienta
 * https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUserByEmail, createUser, verifyPassword } from '@/lib/users';
import { createSession, deleteSession } from '@/lib/session';

// Validační schémata pomocí Zod
const LoginSchema = z.object({
  email: z.string().email({ message: 'Neplatný email' }).min(1, 'Email je povinný'),
  password: z.string().min(6, 'Heslo musí mít alespoň 6 znaků'),
});

const SignupSchema = z.object({
  firstName: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  lastName: z.string().min(2, 'Příjmení musí mít alespoň 2 znaky'),
  email: z.string().email({ message: 'Neplatný email' }).min(1, 'Email je povinný'),
  password: z.string().min(6, 'Heslo musí mít alespoň 6 znaků'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Hesla se neshodují',
  path: ['confirmPassword'],
});

// Typy pro odpovědi
type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * LOGIN ACTION
 * Přihlásí uživatele a vytvoří session
 */
export async function login(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // 1. Validace vstupů
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 2. Najdi uživatele v databázi
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: 'Neplatný email nebo heslo',
    };
  }

  // 3. Ověř heslo
  const isPasswordValid = await verifyPassword(user, password);

  if (!isPasswordValid) {
    return {
      success: false,
      message: 'Neplatný email nebo heslo',
    };
  }

  // 4. Vytvoř session
  await createSession(user.id, user.email, `${user.firstName} ${user.lastName}`);

  // 5. Revalidate a přesměruj
  // redirect() throwuje error interně - to je normální chování Next.js
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/**
 * SIGNUP ACTION
 * Zaregistruje nového uživatele a vytvoří session
 */
export async function signup(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // 1. Validace vstupů
  const validatedFields = SignupSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  // 2. Zkontroluj, jestli uživatel už existuje
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message: 'Uživatel s tímto emailem už existuje',
    };
  }

  // 3. Vytvoř nového uživatele
  const newUser = await createUser(email, password, firstName, lastName);

  // 4. Vytvoř session
  await createSession(newUser.id, newUser.email, `${newUser.firstName} ${newUser.lastName}`);

  // 5. Revalidate a přesměruj
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/**
 * LOGOUT ACTION
 * Odhlásí uživatele a smaže session
 */
export async function logout() {
  await deleteSession();
  redirect('/');
}
