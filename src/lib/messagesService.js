import { supabase, isSupabaseConfigured } from './supabaseClient.js';

const STORAGE_KEY = 'engagement_guest_messages';

/**
 * Get all messages stored in browser localStorage.
 */
export function getLocalMessages() {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Could not read messages from localStorage:', err);
    return [];
  }
}

/**
 * Save a message into browser localStorage.
 */
export function saveLocalMessage(msg) {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const existing = getLocalMessages();
    const updated = [msg, ...existing.filter((m) => m.id !== msg.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Could not save message to localStorage:', err);
    return [];
  }
}

/**
 * Mark a local message as synced with Supabase.
 */
export function markLocalMessageSynced(id) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const existing = getLocalMessages();
    const updated = existing.map((m) =>
      m.id === id ? { ...m, synced: true } : m
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not update sync status:', err);
  }
}

/**
 * Delete a message from localStorage.
 */
export function deleteLocalMessage(id) {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const existing = getLocalMessages();
    const updated = existing.filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Could not delete local message:', err);
    return [];
  }
}

/**
 * Submit a guest message.
 * Resilient offline-first approach:
 * 1. Saves to localStorage immediately (message is never lost).
 * 2. Attempts to push to Supabase with timeout.
 * 3. Returns success even if Supabase network fails, so guests always get confirmation.
 */
export async function submitGuestMessage({ name, message }) {
  const trimmedName = name.trim();
  const trimmedMsg = message.trim();

  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const localRecord = {
    id,
    name: trimmedName,
    message: trimmedMsg,
    created_at: new Date().toISOString(),
    synced: false,
  };

  // 1. Save locally first
  saveLocalMessage(localRecord);

  // 2. If Supabase is configured, try sending to Supabase with 5s timeout
  if (isSupabaseConfigured && supabase) {
    try {
      const insertPromise = supabase.from('messages').insert([
        { name: trimmedName, message: trimmedMsg },
      ]);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Supabase request timeout')), 5000)
      );

      const response = await Promise.race([insertPromise, timeoutPromise]);
      if (response && response.error) {
        throw response.error;
      }

      // Mark local copy as synced
      markLocalMessageSynced(id);
      return { success: true, synced: true, id };
    } catch (err) {
      console.warn('Supabase sync failed (message safely stored locally):', err);
      // Return success with localFallback flag so user experience remains smooth
      return { success: true, synced: false, localFallback: true, id };
    }
  }

  // Supabase not configured: local storage success
  return { success: true, synced: false, localFallback: true, id };
}

/**
 * Try to sync all unsynced local messages to Supabase.
 */
export async function syncLocalMessagesToSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return { syncedCount: 0, error: 'Supabase is not configured' };
  }

  const localMessages = getLocalMessages();
  const unsynced = localMessages.filter((m) => !m.synced);

  if (unsynced.length === 0) {
    return { syncedCount: 0 };
  }

  let syncedCount = 0;
  for (const m of unsynced) {
    try {
      const { error } = await supabase.from('messages').insert([
        { name: m.name, message: m.message },
      ]);
      if (!error) {
        markLocalMessageSynced(m.id);
        syncedCount++;
      }
    } catch (err) {
      console.warn(`Failed to sync message ${m.id}:`, err);
    }
  }

  return { syncedCount };
}
