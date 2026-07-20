// Corre 3 veces al dia (8/12/16 hora Chile) como Render Cron Job. Scrapea
// titulares de CNBC (finanzas/economia/tecnologia/politica) y Cointelegraph
// (crypto), los traduce al espanol y los acumula en src/data/newsData.json
// durante el dia. Al detectar un dia nuevo (hora Chile), vacia todo antes de
// sumar los nuevos — asi el archivo nunca crece sin limite. Si GITHUB_TOKEN
// esta seteado, commitea y pushea para que Render redespliegue el sitio.

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'newsData.json')

const TARGET_HOURS = [8, 12, 16]
const MAX_ITEMS_PER_CATEGORY = 24
const ITEMS_PER_FETCH = 10
const TRANSLATE_EMAIL = 'cris.saez12@gmail.com' // sube el limite gratis de MyMemory

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

function decodeEntities(str) {
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

function parseCnbc(html) {
  const re = /<a href="([^"]+)" class="Card-title" target="">([^<]+)/g
  const items = []
  const seen = new Set()
  let m
  while ((m = re.exec(html))) {
    const url = m[1]
    const title = decodeEntities(m[2])
    if (seen.has(url)) continue
    seen.add(url)
    items.push({ title, url })
    if (items.length >= ITEMS_PER_FETCH) break
  }
  return items
}

function parseCointelegraph(html) {
  const re =
    /href="(\/news\/[^"]+)"[\s\S]{0,400}?data-testid="post-latest-card__title"[^>]*><!--\[-->([^<]+)<!--\]-->/g
  const items = []
  const seen = new Set()
  let m
  while ((m = re.exec(html))) {
    const url = `https://cointelegraph.com${m[1]}`
    const title = decodeEntities(m[2])
    if (seen.has(url)) continue
    seen.add(url)
    items.push({ title, url })
    if (items.length >= ITEMS_PER_FETCH) break
  }
  return items
}

const CATEGORY_CONFIG = [
  { key: 'finanzas', label: 'Finanzas', source: 'CNBC', url: 'https://www.cnbc.com/finance/', parse: parseCnbc },
  { key: 'economia', label: 'Economía', source: 'CNBC', url: 'https://www.cnbc.com/economy/', parse: parseCnbc },
  { key: 'tecnologia', label: 'Tecnología', source: 'CNBC', url: 'https://www.cnbc.com/technology/', parse: parseCnbc },
  { key: 'politica', label: 'Política', source: 'CNBC', url: 'https://www.cnbc.com/politics/', parse: parseCnbc },
  { key: 'crypto', label: 'Crypto', source: 'Cointelegraph', url: 'https://cointelegraph.com/', parse: parseCointelegraph },
]

async function translate(text) {
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

function chileNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (t) => parts.find((p) => p.type === t)?.value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
    hour: Number(get('hour')),
  }
}

function loadExisting() {
  if (!existsSync(OUTPUT_PATH)) return null
  try {
    return JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'))
  } catch {
    return null
  }
}

async function main() {
  const now = chileNow()
  const forced = process.env.FORCE_RUN === '1'

  if (!forced && !TARGET_HOURS.includes(now.hour)) {
    console.log(`Hora Chile: ${now.hour}h — no es horario de actualizacion (8/12/16). Sin cambios.`)
    return
  }

  const existing = loadExisting()
  const isNewDay = !existing || existing.date !== now.date

  const categories = {}
  for (const cfg of CATEGORY_CONFIG) {
    categories[cfg.key] = isNewDay ? [] : (existing?.categories?.[cfg.key] ?? [])
  }

  for (const cfg of CATEGORY_CONFIG) {
    console.log(`Scrapeando ${cfg.label} (${cfg.url})...`)
    let fresh = []
    try {
      const res = await fetch(cfg.url, { headers: { 'User-Agent': UA, Accept: 'text/html' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const html = await res.text()
      fresh = cfg.parse(html)
    } catch (err) {
      console.log(`  Fallo el fetch de ${cfg.label}: ${err.message} — se mantiene lo que ya habia.`)
      continue
    }

    const existingUrls = new Set(categories[cfg.key].map((i) => i.url))
    const newOnes = fresh.filter((i) => !existingUrls.has(i.url))
    console.log(`  ${fresh.length} encontrados, ${newOnes.length} nuevos.`)

    for (const item of newOnes) {
      const titleEs = await translate(item.title)
      categories[cfg.key].unshift({ title: titleEs, url: item.url, source: cfg.source })
      await new Promise((r) => setTimeout(r, 250))
    }

    if (categories[cfg.key].length > MAX_ITEMS_PER_CATEGORY) {
      categories[cfg.key] = categories[cfg.key].slice(0, MAX_ITEMS_PER_CATEGORY)
    }
  }

  const output = { date: now.date, updatedAt: now.time, categories }
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log('Escrito:', OUTPUT_PATH)

  if (process.env.GITHUB_TOKEN && process.env.GIT_REPO) {
    const repo = process.env.GIT_REPO.replace('https://', '')
    const remote = `https://x-access-token:${process.env.GITHUB_TOKEN}@${repo}`
    execSync(`git config user.email "cron@empire-session.local"`, { stdio: 'inherit' })
    execSync(`git config user.name "Empire Session Cron"`, { stdio: 'inherit' })
    execSync(`git add src/data/newsData.json`, { stdio: 'inherit' })
    try {
      execSync(`git commit -m "chore: actualizar noticias (${now.date} ${now.time} CLT)"`, { stdio: 'inherit' })
      execSync(`git push ${remote} HEAD:main`, { stdio: 'inherit' })
      console.log('Commit y push OK.')
    } catch (e) {
      console.log('Nada nuevo para commitear, o el push fallo:', e.message)
    }
  } else {
    const missing = []
    if (!process.env.GITHUB_TOKEN) missing.push('GITHUB_TOKEN')
    if (!process.env.GIT_REPO) missing.push('GIT_REPO')
    console.log(`Falta(n) seteadas: ${missing.join(', ')} — solo se actualizo el archivo local, sin commit.`)
  }
}

main().catch((err) => {
  console.error('ERROR en update-news:', err.message)
  process.exit(1)
})
