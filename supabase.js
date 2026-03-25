// ─────────────────────────────────────────────
//  PathPM – Supabase shared client
//  Include AFTER the Supabase CDN script tag
// ─────────────────────────────────────────────

const SUPABASE_URL      = 'https://bykhhsijcbbxknlliofx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5a2hoc2lqY2JieGtubGxpb2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzIxMzksImV4cCI6MjA4OTc0ODEzOX0.xCo3XooIGLLoTTTxJW-Sr35aLZWw9_fd6Ba307Jl1CE';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Returns the currently logged-in Supabase user, or null
async function getCurrentUser() {
  const { data: { user } } = await sb.auth.getUser();
  return user || null;
}

// Redirects to auth.html if no session
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'auth.html';
    return null;
  }
  return user;
}

// ── Sign out ──────────────────────────────────

async function signOut() {
  await sb.auth.signOut();
  // Force-clear Supabase tokens from localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.includes('supabase')) {
      localStorage.removeItem(key);
    }
  });
  sessionStorage.clear();
  window.location.href = 'auth.html';
}

// ── Score helper ──────────────────────────────

async function updateScore(userId, newScore) {
  await sb.from('user_role_selection')
    .update({ final_score: newScore, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  sessionStorage.setItem('pathpm_score', newScore);
}
