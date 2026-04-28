<script lang="ts">
  interface Props {
    placeholder: string;
    privacyNotice: string;
    notifyLabel?: string;
  }
  let { placeholder, privacyNotice, notifyLabel = "Notify me" }: Props = $props();

  let email = $state("");

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log("[notify-form] submit:", email);
  }
</script>

<form class="notify-form" onsubmit={handleSubmit}>
  <input
    type="email"
    name="email"
    required
    class="notify-email"
    {placeholder}
    bind:value={email}
  />
  <button type="submit" class="caps-button notify-submit" aria-label={notifyLabel}>
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  </button>
  <p class="privacy-notice">{privacyNotice}</p>
</form>

<style>
  .notify-form {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    width: 100%;
    max-width: 500px;
    align-items: flex-start;
  }

  .notify-email {
    flex: 1;
    min-width: 200px;
    height: 56px;
    padding: 0 1.2em;
    font-size: 1rem;
    font-family: inherit;
    color: var(--text);
    background: var(--surface);
    border: 2px solid var(--text);
    border-radius: var(--radius-none);
    outline: none;
    box-sizing: border-box;
    transition: box-shadow 0.2s ease;
  }

  .notify-email::placeholder {
    color: var(--text);
    opacity: 0.6;
  }

  .notify-email:focus {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--text) 20%, transparent);
  }

  .notify-submit {
    width: 56px;
    height: 56px;
    min-width: 56px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--text);
    color: var(--surface);
    border: 2px solid var(--text);
    border-radius: var(--radius-none);
    cursor: pointer;
    overflow: hidden;
    -webkit-appearance: none;
    appearance: none;
  }

  .notify-submit svg {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .notify-submit:hover svg {
    transform: translateY(-3px) rotate(-12deg);
  }

  .privacy-notice {
    flex-basis: 100%;
    font-family: var(--font-caption-family);
    font-size: var(--font-caption-size);
    line-height: var(--font-caption-line-height);
    color: var(--text);
    opacity: 0.7;
    margin: var(--space-md) 0 0 0;
    text-align: center;
  }
</style>
