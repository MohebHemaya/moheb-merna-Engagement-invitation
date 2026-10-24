import React, { useState, useEffect, useCallback } from 'react';
import GoldFrame from '../components/GoldFrame';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  getLocalMessages,
  deleteLocalMessage,
  syncLocalMessagesToSupabase,
} from '../lib/messagesService';

const arabicNumberFormatter = new Intl.NumberFormat('ar-EG');

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [messages, setMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [actionError, setActionError] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  // Load local messages on mount
  useEffect(() => {
    setLocalMessages(getLocalMessages());
  }, []);

  // Check auth session
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMessages = useCallback(async () => {
    const rawLocals = getLocalMessages();
    // Deduplicate local storage entries internally
    const uniqueLocalsMap = new Map();
    rawLocals.forEach((m) => {
      const key = `${m.name.trim()}_${m.message.trim()}`;
      if (!uniqueLocalsMap.has(key) || m.synced) {
        uniqueLocalsMap.set(key, m);
      }
    });
    const locals = Array.from(uniqueLocalsMap.values());
    setLocalMessages(locals);

    if (!isSupabaseConfigured || !supabase) {
      setMessages(locals);
      return;
    }

    setFetching(true);
    setActionError('');

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const supabaseList = data || [];
      const supabaseIds = new Set(supabaseList.map((m) => m.id));

      // Filter local messages: ONLY keep ones that are truly NOT in Supabase
      const unsyncedLocals = locals.filter((localMsg) => {
        if (localMsg.synced) return false;
        if (supabaseIds.has(localMsg.id)) return false;
        const existsInSupabase = supabaseList.some(
          (sm) =>
            sm.id === localMsg.id ||
            (sm.name.trim() === localMsg.name.trim() && sm.message.trim() === localMsg.message.trim())
        );
        return !existsInSupabase;
      });

      // Update local storage to clean up and mark matching ones as synced
      const updatedLocals = locals.map((lm) => {
        const matching = supabaseList.find(
          (sm) =>
            sm.id === lm.id ||
            (sm.name.trim() === lm.name.trim() && sm.message.trim() === lm.message.trim())
        );
        return matching ? { ...lm, id: matching.id, synced: true } : lm;
      });
      try {
        localStorage.setItem('engagement_guest_messages', JSON.stringify(updatedLocals));
        setLocalMessages(updatedLocals);
      } catch {
        // ignore
      }

      setMessages([...unsyncedLocals, ...supabaseList]);
    } catch (err) {
      console.warn('Error fetching Supabase messages, showing local:', err);
      setActionError('تعذر الاتصال بـ Supabase حالياً، يتم عرض الرسائل المحفوظة محلياً على هذا الجهاز.');
      setMessages(locals);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session, fetchMessages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!isSupabaseConfigured || !supabase) {
      setLoginError('يرجى ضبط بيانات Supabase في ملف .env أولاً (VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY).');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setLoginError(err.message || 'بيانات الدخول غير صحيحة.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  const handleDelete = async (id, name, message) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الرسالة؟')) return;

    // Remove from local storage by id and name+message
    deleteLocalMessage(id, name, message);
    setLocalMessages((prev) =>
      prev.filter((m) => m.id !== id && !(name && message && m.name === name && m.message === message))
    );

    // Remove from Supabase if authenticated
    if (supabase && session) {
      try {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) console.warn('Supabase delete error:', error);
      } catch (err) {
        console.warn('Error deleting message from Supabase:', err);
      }
    }

    setMessages((prev) =>
      prev.filter((m) => m.id !== id && !(name && message && m.name === name && m.message === message))
    );
  };

  const handleSyncLocal = async () => {
    setSyncStatus('جاري المزامنة مع السحابة...');
    const result = await syncLocalMessagesToSupabase();
    if (result.error) {
      setSyncStatus(`تعذرت المزامنة: ${result.error}`);
    } else {
      setSyncStatus(`تمت مزامنة ${result.syncedCount} رسالة بنجاح!`);
      fetchMessages();
    }
    setTimeout(() => setSyncStatus(''), 4000);
  };

  const handleExportCsv = (listToExport = messages) => {
    const list = listToExport.length ? listToExport : localMessages;
    if (!list.length) return;

    const headers = ['المعرف', 'الاسم', 'الرسالة', 'تاريخ الإرسال', 'الحالة'];
    const rows = list.map((m) => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.message.replace(/"/g, '""')}"`,
      `"${new Date(m.created_at).toLocaleString('ar-EG')}"`,
      `"${m.synced === false ? 'محلي' : 'متزامن'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `messages_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream text-brown font-amiri p-4 sm:p-8 flex flex-col items-center">
      {/* If not logged in, show Auth Form with optional Local Messages preview */}
      {!session ? (
        <div className="max-w-md w-full my-auto space-y-6">
          <GoldFrame innerClassName="p-6 sm:p-8">
            <header className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gold-dark mb-1">
                تسجيل الدخول للإدارة
              </h1>
              <p className="text-xs sm:text-sm text-brown-soft">
                لوحة خاصة بالعروسين لقراءة رسائل المهنئين
              </p>
            </header>

            {!isSupabaseConfigured && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded text-amber-800 text-xs text-center">
                تنبيه: لم يتم ضبط مفاتيح Supabase بعد في ملف <code>.env</code>.
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF5EC] border border-gold/70 rounded-[3px] px-3.5 py-2 text-brown font-sans focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">كلمة المرور</label>
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF5EC] border border-gold/70 rounded-[3px] px-3.5 py-2 text-brown font-sans focus:outline-none focus:border-gold"
                  required
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-50 border border-red-300 rounded text-red-700 text-xs text-center">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold text-cream font-medium rounded-[3px] hover:bg-gold-dark transition-colors text-sm disabled:opacity-70 cursor-pointer"
              >
                {loading ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>

            {/* Quick Access to Local Messages Button */}
            <div className="mt-6 pt-4 border-t border-gold/20 text-center">
              <button
                type="button"
                onClick={() => setShowLocalOnly(!showLocalOnly)}
                className="text-xs text-gold-dark hover:underline font-amiri cursor-pointer"
              >
                {showLocalOnly
                  ? 'إخفاء الرسائل المحفوظة على هذا الجهاز'
                  : `عرض الرسائل المحفوظة على هذا الجهاز (${arabicNumberFormatter.format(localMessages.length)})`}
              </button>
            </div>
          </GoldFrame>

          {/* Local Messages Drawer for when Supabase is offline/unconfigured */}
          {showLocalOnly && (
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gold-dark">
                  الرسائل المخزنة محلياً ({arabicNumberFormatter.format(localMessages.length)})
                </h2>
                {localMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleExportCsv(localMessages)}
                    className="px-3 py-1 bg-gold text-cream text-xs rounded hover:bg-gold-dark transition-colors cursor-pointer"
                  >
                    تصدير CSV
                  </button>
                )}
              </div>

              {localMessages.length === 0 ? (
                <p className="text-center text-xs text-brown-soft py-4 bg-[#FAF5EC] border border-gold/30 rounded">
                  لا توجد رسائل مخزنة محلياً على هذا المتصفح.
                </p>
              ) : (
                <div className="space-y-3">
                  {localMessages.map((m) => (
                    <GoldFrame key={m.id} innerClassName="p-3 flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-brown text-sm">{m.name}</span>
                        <span className="text-[11px] text-brown-soft">
                          {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(m.created_at))}
                        </span>
                      </div>
                      <p className="text-xs text-brown/90 leading-relaxed whitespace-pre-line">{m.message}</p>
                      <button
                        type="button"
                        onClick={() => handleDelete(m.id, m.name, m.message)}
                        className="text-[11px] text-red-600 hover:underline self-end mt-1 cursor-pointer"
                      >
                        حذف
                      </button>
                    </GoldFrame>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* If logged in, show Dashboard */
        <div className="max-w-3xl w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gold/30 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gold-dark">
                رسائل التهنئة
              </h1>
              <p className="text-xs sm:text-sm text-brown-soft">
                إجمالي الرسائل: {arabicNumberFormatter.format(messages.length)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {localMessages.some((m) => !m.synced) && (
                <button
                  type="button"
                  onClick={handleSyncLocal}
                  className="px-3 py-2 bg-amber-600 text-cream text-xs sm:text-sm rounded-[3px] hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  مزامنة مع السحابة
                </button>
              )}

              <button
                type="button"
                onClick={() => handleExportCsv(messages)}
                disabled={!messages.length}
                className="px-4 py-2 bg-gold text-cream text-xs sm:text-sm rounded-[3px] hover:bg-gold-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                تصدير CSV
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 border border-gold text-gold-dark text-xs sm:text-sm rounded-[3px] hover:bg-gold/10 transition-colors cursor-pointer"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="mb-4 p-2.5 bg-blue-50 border border-blue-300 rounded text-blue-800 text-xs text-center">
              {syncStatus}
            </div>
          )}

          {actionError && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded text-amber-800 text-xs text-center">
              {actionError}
            </div>
          )}

          {fetching ? (
            <div className="text-center py-12 text-brown-soft">
              جاري تحميل الرسائل...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 border border-gold/30 rounded p-6 bg-cream/50">
              <p className="text-brown font-medium">لا توجد رسائل تهنئة حتى الآن.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <GoldFrame key={m.id} innerClassName="p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-lg font-bold text-brown">{m.name}</h3>
                      <span className="text-xs text-brown-soft">
                        {new Intl.DateTimeFormat('ar-EG', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(m.created_at))}
                      </span>
                      {m.synced === false && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                          محلي
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-brown/90 leading-relaxed whitespace-pre-line">
                      {m.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(m.id, m.name, m.message)}
                    className="text-xs text-red-700 hover:text-red-900 border border-red-300 rounded px-2.5 py-1 hover:bg-red-50 transition-colors self-end sm:self-center cursor-pointer"
                  >
                    حذف
                  </button>
                </GoldFrame>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
