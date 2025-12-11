/**
 * SERVER ACTIONS PRO AUTENTIZACI
 *
 * Next.js Server Actions - funkce běžící na serveru, volatelné z klienta
 * https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { login as apiLogin, register as apiRegister, type AuthResponseDTO } from '@/lib/api';

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

const SESSION_COOKIE = 'session';
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;
const cookieOptions = {
  httpOnly: false,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
} satisfies Parameters<(typeof cookies)>[0];

async function setSessionCookie(auth: AuthResponseDTO) {
  const value = encodeURIComponent(JSON.stringify(auth));
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, value, { ...cookieOptions, maxAge: ONE_WEEK_SECONDS });
}

async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}

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

  // 2. Zavolej reálné API
  const response = await apiLogin({ email, password });
  if (response.status !== 200 || !response.data?.token) {
    return {
      success: false,
      message: 'Neplatný email nebo heslo',
    };
  }

  // 3. Ulož session/tokeny
  await setSessionCookie(response.data);

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

  // 2. Zavolej reálné API
  const response = await apiRegister({ email, password, firstName, lastName });
  if (response.status !== 200 || !response.data?.token) {
    return {
      success: false,
      message: 'Registrace selhala, zkuste to znovu',
    };
  }

  // 3. Ulož session/tokeny
  await setSessionCookie(response.data);

  // 5. Revalidate a přesměruj
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

/**
 * LOGOUT ACTION
 * Odhlásí uživatele a smaže session
 */
export async function logout() {
  await clearSessionCookie();
  redirect('/login');
}
