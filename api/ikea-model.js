// IKEA nábytok z odkazu pre 3D stránku bytu 7C (/vizualizacie/3d): server stiahne stránku produktu, prečíta z nej rozmery a obrázky
// (ten istý čítač ako 3D aplikácia, lib/product.js), pošle obrázky Claudovi a ten napíše 3D model v tvare, ktorý aplikácia kreslí (layout/models.js).
// Kľúč je len tu na serveri: Vercel env ANTHROPIC_API_KEY. Ak je nastavené TATINO_IKEA_PASSWORD, bez neho sa model nerobí (každý model niečo stojí).
import { parseProduct, mainPart } from '../public/vizualizacie/3d/lib/product.js'
import { modelKeyOf, modelProblems } from '../public/vizualizacie/3d/layout/models.js'
import { PRODUCT_TYPES, isProductType } from '../public/vizualizacie/3d/layout/products.js'

export const config = { maxDuration: 120 }

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'

async function fetchPage(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml', 'accept-language': 'sk,en;q=0.8' }, redirect: 'follow' })
  if (!r.ok) throw new Error('IKEA stránka vrátila ' + r.status)
  return r.text()
}

const FORMAT = `Return ONLY a JSON object, no prose, no code fence:
{ "type": one of [TYPES], "name": short product name, "parts": [ ... ] }
Frame: metres, x = width (centre 0), z = depth with the FRONT of the piece at +z (centre 0), y = up from the floor (0).
A part: { "shape": "box" | "rbox" | "cyl", "x", "z" (centre of the part), "y" (bottom of the part), "w", "d", "h", "color": "#rrggbb",
optional "r" (corner rounding of an rbox), "rx", "ry", "rz" (turn in radians around the part's centre), "metal": true, "opacity" (0.1 to 1 for glass) }.
A cyl is w across (d the same) and h high. Every part must stay inside the box w x d x h of the piece (3 cm of slack at most) and not go below the floor.
Use 6 to 120 parts: the main volumes, legs, doors, drawers, handles, cushions, so the piece is recognisable from the pictures. Colours from the pictures.
Example (a coffee table 90 x 55 x 45 cm): {"type":"coffee_table","name":"LACK","parts":[{"shape":"box","color":"#f2f1ec","x":0,"z":0,"y":0.4,"w":0.9,"d":0.55,"h":0.05},{"shape":"box","color":"#f2f1ec","x":-0.42,"z":-0.245,"y":0,"w":0.05,"d":0.05,"h":0.4},{"shape":"box","color":"#f2f1ec","x":0.42,"z":-0.245,"y":0,"w":0.05,"d":0.05,"h":0.4},{"shape":"box","color":"#f2f1ec","x":-0.42,"z":0.245,"y":0,"w":0.05,"d":0.05,"h":0.4},{"shape":"box","color":"#f2f1ec","x":0.42,"z":0.245,"y":0,"w":0.05,"d":0.05,"h":0.4}]}`

async function askClaude(product, dims, feedback) {
  const types = PRODUCT_TYPES.map((t) => t.type).join(', ')
  const text = `Build a simple 3D model of this IKEA product from its pictures.
Product: ${product.name}${product.category ? ' (' + product.category + ')' : ''}. Colour: ${product.color || 'see pictures'}.
Real size: width ${dims.w} m, depth ${dims.d} m, height ${dims.h} m${product.evidence ? ' (page says: ' + product.evidence + ')' : ''}.
${FORMAT.replace('[TYPES]', '[' + types + ']')}${feedback ? '\nYour previous answer had these problems, fix them: ' + feedback : ''}`
  const content = [...product.images.slice(0, 4).map((url) => ({ type: 'image', source: { type: 'url', url } })), { type: 'text', text }]
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 12000, messages: [{ role: 'user', content }] }),
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error('Claude: ' + (j.error?.message || r.status))
  const out = (j.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('')
  const s = out.indexOf('{'), e = out.lastIndexOf('}')
  if (s < 0 || e < s) throw new Error('Claude nevrátil model')
  return { json: JSON.parse(out.slice(s, e + 1)), usage: j.usage }
}

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ enabled: Boolean(process.env.ANTHROPIC_API_KEY), password: Boolean(process.env.TATINO_IKEA_PASSWORD) })
  if (req.method !== 'POST') return res.status(405).json({ message: 'Len POST.' })
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ message: 'Na serveri chýba ANTHROPIC_API_KEY.' })
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  if (process.env.TATINO_IKEA_PASSWORD && body.password !== process.env.TATINO_IKEA_PASSWORD) return res.status(401).json({ message: 'Nesprávne heslo.' })
  let url
  try { url = new URL(String(body.link || '').trim()) } catch { return res.status(400).json({ message: 'To nie je odkaz.' }) }
  if (!/(^|\.)ikea\.[a-z.]+$/i.test(url.hostname)) return res.status(400).json({ message: 'Zatiaľ len odkazy z ikea.com / ikea.sk.' })

  try {
    let product = parseProduct(await fetchPage(url.href), url.href)
    if (!product.complete && product.parts?.length) {          // IKEA "set": the real sizes are on the page of its main part
      const part = mainPart(product.parts)
      if (part) { const p = parseProduct(await fetchPage(part.url), part.url); if (p.complete) product = { ...product, dims: p.dims, evidence: p.evidence, complete: true, images: product.images.length ? product.images : p.images } }
    }
    const dims = product.dims
    if (!product.complete) return res.status(422).json({ message: 'Na stránke som nenašiel všetky rozmery (šírka, hĺbka, výška).', product })
    if (!product.images.length) return res.status(422).json({ message: 'Na stránke nie sú obrázky produktu.', product })

    const key = modelKeyOf(url.href)
    let model = null, problems = [], usage = []
    for (let round = 0; round < 2 && !model; round++) {
      const { json, usage: u } = await askClaude(product, dims, problems.slice(0, 8).join('; '))
      usage.push(u)
      const m = { key, name: product.name, link: url.href, dims: { ...dims }, note: 'Model napísal Claude z obrázkov produktu.', parts: json.parts }
      problems = modelProblems(m)
      if (!problems.length) model = { m, type: json.type }
    }
    if (!model) return res.status(502).json({ message: 'Model sa nepodaril: ' + problems.slice(0, 3).join('; ') })
    const type = isProductType(product.type) ? product.type : isProductType(model.type) ? model.type : 'sideboard'
    return res.status(200).json({ model: model.m, product: { link: url.href, name: product.name, image: product.images[0] || '', type, dims }, usage })
  } catch (e) {
    return res.status(502).json({ message: String(e.message || e) })
  }
}
