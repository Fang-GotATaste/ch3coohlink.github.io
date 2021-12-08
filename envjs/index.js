window.$ = $, $.log = console.log, $.clear = console.clear

$.isnum = o => typeof o == "number", $.isfct = o => typeof o == "function"
$.isstr = o => typeof o == "string", $.isbgi = o => typeof o == "bigint"
$.isudf = o => o === undefined, $.isnth = o => isudf(o) || isnul(o)
$.isobj = o => o && typeof o == "object", $.isnul = o => o === null
$.isarr = Array.isArray, $.asarr = v => isarr(v) ? v : [v]
$.isnumstr = s => isstr(s) && !isNaN(Number(s))

$.forrg = (e, f, s = 0, d = 1) => { for (let i = s; d > 0 ? i < e : i > e; i += d) f(i) }
$.maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
$.forin = (o, f) => { for (const k in o) f(o[k], k) }
$.forof = (o, f) => { for (const v of o) f(v) }
$.cases = (h, ...t) => ((m, d) => (c, ...a) => m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
$.panic = e => { throw isstr(e) ? Error(e) : e }

$.bindall = o => forin(o, (v, k) => isfct(v) ? o[k] = v.bind(o) : 0)
$.style = (e, ...s) => (forof(s, s =>
  forin(s, (v, k) => e.style[k] = isnum(v) ? `${v}px` : v)), e)
const rnd8 = () => Math.random().toString(16).slice(2, 10)
$.uuid = (a = rnd8(), b = rnd8()) => [rnd8(), a.slice(0, 4)
  , a.slice(4), b.slice(0, 4), b.slice(4) + rnd8()].join("-")

bindall(document); const text = document.createTextNode, _elm = document.createElement
const attr = cases((e, v, k) => (e[k] = v, isfct(v) ? 0 : e.setAttribute(k, v)),
  ["class", (e, v) => e.className = isarr(v) ? v.join(" ") : v],
  ["child", (e, v) => e.append(...asarr(v).map(v => isstr(v) ? text(v) : v))],
  ["tag", _ => { }], ["style", (e, v) => style(e, ...asarr(v))])
$.elm = (e, o = {}, f) => (isstr(e) ? e = _elm(e) : 0,
  forin(o, (v, k) => attr(k, e, v, k)), f ? f(e) : 0, e)
$.dom = (o = {}, p, n = o.tag ?? "div") => elm(n, o, p ? p.append.bind(p) : 0)

const px = v => isnum(v) ? `${v}px` : v
const hyphenate = s => s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
const content = s => Object.keys(s).reduce((p, k) => p + `${hyphenate(k)}: ${px(s[k])}; `, "")
$.createcss = e => (r, ...s) => e.sheet.insertRule(`${r} { ${s.map(v => content(v)).join(" ")}}`)

const ra = requestAnimationFrame, ca = cancelAnimationFrame
const si = setInterval, ci = clearInterval
const st = setTimeout, ct = clearTimeout
const _a = new Map, _i = new Map, _t = new Map
$.requestAnimationFrame = f => { _a.set(f, ra(f)) }
$.cancelAnimationFrame = f => { ca(_a.get(f)), _a.delete(f) }
$.setInterval = (f, t) => { _i.set(f, si(f, t)) }
$.clearInterval = f => { ci(_i.get(f)), _i.delete(f) }
$.setTimeout = (f, t) => { _t.set(f, st(f, t)) }
$.clearTimeout = f => { ct(_t.get(f)), _t.delete(f) }

const genc = c => Function("$", `with ($) { return async () => {\n"use strict";\n${c}\n} }`)
const _l = {}, load = async (u, l = _l[u]) => l ? l : _l[u] = await (await fetch(u)).text()
$.scope = (o, e = Object.create(o)) => Object.defineProperty(e, "$", { value: e })
$.asfct = async (u, f) => (f = genc(await load(u)), async (a = {},
  e = $, o = scope(e)) => (forin(a, (v, k) => o[k] = v), await f(o)()))
$.setdef = (o, k, v) => o.hasOwnProperty(k) && !isnth(o[k]) ? 0 : o[k] = v

const loadlist = "./idb.js ./env.js ./sandbox.js";
[$.idb, $.envjs, $.sandbox] = await Promise.all(loadlist.split(" ").map(v => asfct(v)))

const peerjs = async () => (
  (await asfct("../external/peerjs.min.js"))(),
  $.peerjs = window.peerjs, $.Peer = window.Peer,
  delete window.peerjs, delete window.Peer)

const _q = new URL(window.location.href).searchParams
$.query = {}; _q.forEach((v, k) => query[k] = v === "false"
  ? false : v === "true" ? true : isnumstr(v) ? Number(v) : v)

style(document.documentElement, { height: "100%" })
style(document.body, { margin: 0, height: "100%" })
$.rootsdbx = await sandbox({ root: document.body })

style(rootsdbx.document.documentElement, { height: "100%" })
style(rootsdbx.document.body, { margin: 0, height: "100%" })
const root = dom({ style: { height: "100%" } }, rootsdbx.document.body)
await envjs({ root }, rootsdbx)