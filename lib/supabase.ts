import 'react-native-url-polyfill/auto';

import { createClient, Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const fallbackAdminEmail = 'najileila308@gmail.com';
const appScheme = 'tasmimapp';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const configuredAdminEmail = process.env.EXPO_PUBLIC_ADMIN_EMAIL?.trim();
export const adminEmail = configuredAdminEmail || fallbackAdminEmail;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);
export const isAdminConfigured = Boolean(adminEmail);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
        flowType: 'pkce',
      },
    })
  : null;

export type SocialOAuthProvider = 'google' | 'facebook';
export type AuthProvider = SocialOAuthProvider | 'email' | 'unknown';

type AuthCallbackPayload = {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  type: string | null;
  error: string | null;
  errorDescription: string | null;
};

function parseAuthCallbackUrl(url: string): AuthCallbackPayload {
  const [base, hash = ''] = url.split('#');
  const queryString = base.includes('?') ? base.slice(base.indexOf('?') + 1) : '';
  const queryParams = new URLSearchParams(queryString);
  const hashParams = new URLSearchParams(hash);
  const getValue = (key: string) => queryParams.get(key) ?? hashParams.get(key);

  return {
    accessToken: getValue('access_token'),
    refreshToken: getValue('refresh_token'),
    code: getValue('code'),
    type: getValue('type'),
    error: getValue('error'),
    errorDescription: getValue('error_description'),
  };
}

export function createRedirectUrl(path: string) {
  const normalizedPath = path.replace(/^\/+/, '');
  return Linking.createURL(normalizedPath, { scheme: appScheme });
}

export async function completeAuthSessionFromUrl(url: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const payload = parseAuthCallbackUrl(url);

  if (payload.errorDescription || payload.error) {
    throw new Error(payload.errorDescription ?? payload.error ?? 'Authentification interrompue.');
  }

  if (payload.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(payload.code);

    if (error) throw error;

    return {
      session: data.session,
      type: payload.type,
    };
  }

  if (payload.accessToken && payload.refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: payload.accessToken,
      refresh_token: payload.refreshToken,
    });

    if (error) throw error;

    return {
      session: data.session,
      type: payload.type,
    };
  }

  return {
    session: null,
    type: payload.type,
  };
}

async function syncProfileProvider(session: Session | null, provider: SocialOAuthProvider) {
  if (!supabase || !session?.user) {
    return;
  }

  const user = session.user;
  const metadata = user.user_metadata ?? {};
  const { data: existingProfile, error: readError } = await supabase
    .from('profiles')
    .select('email, provider_user_id, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (readError) throw readError;

  const profileRecord: {
    id: string;
    email: string | null;
    auth_provider: SocialOAuthProvider;
    provider_user_id: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } = {
    id: user.id,
    email: user.email ?? existingProfile?.email ?? null,
    auth_provider: provider,
    provider_user_id:
      metadata.provider_id ?? metadata.sub ?? existingProfile?.provider_user_id ?? null,
    full_name:
      metadata.full_name ?? metadata.name ?? existingProfile?.full_name ?? null,
    avatar_url: metadata.avatar_url ?? existingProfile?.avatar_url ?? null,
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(profileRecord, { onConflict: 'id' });

  if (error) throw error;
}

export async function signInWithOAuthProvider(provider: SocialOAuthProvider) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const redirectTo = createRedirectUrl('/auth');
  const { data, error } = await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo,
    skipBrowserRedirect: true,
    scopes:
      provider === 'facebook'
        ? 'public_profile email'
        : 'email profile',
  },
});

  if (error) throw error;
  if (!data?.url) {
    throw new Error("L'URL d'authentification n'a pas ete generee.");
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !('url' in result)) {
    throw new Error("L'authentification a ete annulee.");
  }

  const authResult = await completeAuthSessionFromUrl(result.url);
  await syncProfileProvider(authResult.session, provider);

  return authResult;
}

export async function sendPasswordResetEmail(email: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: createRedirectUrl('/reset-password'),
  });

  if (error) throw error;
}

export type ContactMessageInsert = {
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  message: string;
};

export async function saveContactMessage(payload: ContactMessageInsert) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('contact_messages').insert(payload);

  if (error) throw error;
}

export type ContactMessageRecord = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function isAllowedAdminSession(session: Session | null) {
  return Boolean(session?.user?.email && adminEmail && session.user.email === adminEmail);
}

export async function signInAdmin(email: string, password: string) {
  return signInUser(email, password);
}

export async function signInUser(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
}

export async function signUpUser(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return session;
}

export async function signOutAdmin() {
  return signOutUser();
}

export async function signOutUser() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function updateUserPassword(password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
}

export async function getSessionFromUrl(url: string) {
  return completeAuthSessionFromUrl(url);
}

export async function getCurrentSession() {
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) throw error;
  return session;
}

export type UserProfileRecord = {
  id: string;
  email: string | null;
  auth_provider: AuthProvider;
};

export async function getCurrentUserProfile() {
  if (!supabase) {
    return null;
  }

  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, auth_provider')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfileRecord | null;
}

export async function fetchContactMessages() {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []) as ContactMessageRecord[];
}

export async function markContactMessageAsRead(id: number) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);

  if (error) throw error;
}

export async function deleteContactMessage(id: number) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('contact_messages').delete().eq('id', id);

  if (error) throw error;
}
