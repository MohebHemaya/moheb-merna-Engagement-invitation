import React, { useState, useEffect, useCallback } from 'react';
import GoldFrame from '../components/GoldFrame';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const arabicNumberFormatter = new Intl.NumberFormat('ar-EG');

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [messages, setMessages] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [actionError, setActionError] = useState('');

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
    if (!isSupabaseConfigured || !supabase) return;
    setFetching(true);
    setActionError('');

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setActionError('تعذر جلب الرسائل. تأكد من تفعيل صلاحيات RLS في Supabase.');
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

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذه الرسالة؟')) return;

    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('تعذر حذف الرسالة. تأكد من صلاحيات السياسة (RLS policy).');
    }
  };

  const handleExportCsv = () => {
    if (!messages.length) return;

    const headers = ['المعرف', 'الاسم', 'الرسالة', 'تاريخ الإرسال'];
    const rows = messages.map((m) => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.message.replace(/"/g, '""')}"`,
      `"${new Date(m.created_at).toLocaleString('ar-EG')}"`,
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
      {/* If not logged in, show Auth Form */}
      {!session ? (
        <div className="max-w-md w-full my-auto">
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
          </GoldFrame>
        </div>
      ) : (
        /* If logged in, show Dashboard */
        <div className="max-w-3xl w-full">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gold/30">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gold-dark">
                رسائل التهنئة
              </h1>
              <p className="text-xs sm:text-sm text-brown-soft">
                إجمالي الرسائل: {arabicNumberFormatter.format(messages.length)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
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

          {actionError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-xs text-center">
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
                    </div>
                    <p className="text-sm sm:text-base text-brown/90 leading-relaxed whitespace-pre-line">
                      {m.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
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
