<script lang="ts">
  const STORAGE_KEY = 'dogtinder_remember';

  // pre-fill from localStorage if remembered
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');

  let email = $state(saved?.email ?? '');
  let password = $state(saved?.password ?? '');
  let emailError = $state('');
  let rememberMe = $state(!!saved);

  function validateEmail() {
    emailError = email.includes('@') ? '' : 'E-Mail muss ein @ enthalten.';
  }

  const passwordValid = $derived(password.length >= 8);
  const canSubmit = $derived(email.length > 0 && passwordValid && emailError === '');

  function handleLogin() {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    console.log('Login:', { email, password, rememberMe });
  }
</script>

<div class="login-wrapper">
  <h1>Login</h1>

  <form onsubmit={(e) => { e.preventDefault(); handleLogin(); }}>
    <label for="email">E-Mail</label>
    <input
      id="email"
      type="text"
      bind:value={email}
      onblur={validateEmail}
      placeholder="name@example.com"
    />
    {#if emailError}
      <span class="error">{emailError}</span>
    {/if}

    <label for="password">Passwort</label>
    <input
      id="password"
      type="password"
      bind:value={password}
      placeholder="mind. 8 Zeichen"
    />
    {#if password.length > 0 && !passwordValid}
      <span class="error">Passwort muss mind. 8 Zeichen lang sein.</span>
    {/if}

    <div class="remember-row">
      <span>Remember me</span>
      <button
        type="button"
        class="toggle"
        class:toggle--on={rememberMe}
        aria-pressed={rememberMe}
        aria-label="Remember me"
        onclick={() => (rememberMe = !rememberMe)}
      >
        <span class="thumb"></span>
      </button>
    </div>

    <button type="submit" disabled={!canSubmit}>Einloggen</button>
  </form>
</div>

<style>
  .login-wrapper {
    max-width: 360px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  label {
    font-weight: 500;
    margin-top: 0.6rem;
  }

  input {
    padding: 0.5rem 0.75rem;
    border: 1px solid color-mix(in srgb, CanvasText 30%, transparent);
    border-radius: 6px;
    font-size: 1rem;
    background: Canvas;
    color: CanvasText;
  }

  input:focus {
    outline: 2px solid CanvasText;
    outline-offset: 1px;
  }

  .error {
    font-size: 0.8rem;
    color: #e74c3c;
  }

  /* ── remember row ── */
  .remember-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.8rem;
  }

  /* ── toggle switch ── */
  .toggle {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    border: none;
    background: color-mix(in srgb, CanvasText 20%, transparent);
    cursor: pointer;
    padding: 0;
    transition: background 0.2s ease;
    flex-shrink: 0;
  }

  .toggle--on {
    background: #2ecc71;
  }

  .thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: Canvas;
    transition: transform 0.2s ease;
  }

  .toggle--on .thumb {
    transform: translateX(20px);
  }

  /* ── submit button ── */
  button[type="submit"] {
    margin-top: 1.2rem;
    padding: 0.65rem;
    border: none;
    border-radius: 6px;
    background: CanvasText;
    color: Canvas;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  button[type="submit"]:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
</style>
