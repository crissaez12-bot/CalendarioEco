// Traduccion EN->ES compartida por los crons (update-news.mjs, update-calendar.mjs).
// Usa MyMemory (gratis), con el email de Cris como parametro `de=` para subir
// el limite de la cuota gratuita.
const TRANSLATE_EMAIL = 'cris.saez12@gmail.com'

export function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2019;/g, '’')
    .replace(/&#8217;/g, '’')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export async function translate(text) {
  try {
    const q = encodeURIComponent(text)
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=en|es&de=${TRANSLATE_EMAIL}`)
    const json = await res.json()
    const translated = json?.responseData?.translatedText
    if (!translated || json?.responseStatus !== 200) return text
    return decodeEntities(translated)
  } catch {
    return text
  }
}
