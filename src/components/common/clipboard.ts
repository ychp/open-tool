import * as clipboard from 'clipboard-polyfill'

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    // Fallback for browsers that don't support the native API
    await clipboard.writeText(text)
  }
}
