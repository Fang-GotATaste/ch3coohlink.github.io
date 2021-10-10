const { log, dir, clear } = console; clear()
const stamp = (tag, point, elapse) => ({ tag, point, elapse })
const mktimer = (s = performance.now(), a = [stamp("start", s, 0)]) => (m = "",
  n = performance.now()) => (a.push(stamp(m, n, n - a[a.length - 1].elapse)), a)

const forrg = (e, f, s = 0, d = 1) => {
  if (d > 0) for (let i = s; i < e; i += d) f(i)
  else for (let i = s; i > e; i += d) f(i)
}, maprg = (e, f, s, d, a = []) => (forrg(e, i => a.push(f(i)), s, d), a)
const forin = (o, f) => { for (const k in o) f(o[k], k) }
const forof = (o, f) => { for (const v of o) f(v) }
const cases = (h, ...t) => ((m, d) => (c, ...a) =>
  m.has(c) ? m.get(c)(...a) : d(...a))(new Map(t), h)
const panic = e => { throw isstr(e) ? Error(e) : e }

const isnum = o => typeof o == "number", isfct = o => typeof o == "function"
const isstr = o => typeof o == "string", isbgi = o => typeof o == "bigint"
const isudf = o => o === undefined, isnth = o => isudf(o) || isnul(o)
const isobj = o => o && typeof o == "object", isnul = o => o === null
const tarr = [Float32Array, Int32Array, Uint32Array, Float64Array, Int8Array,
  Int16Array, Uint8Array, Uint16Array, Uint8ClampedArray, BigInt64Array, BigUint64Array]
const _istarr = o => { for (const A of tarr) if (o instanceof A) return true; return false }
const isarr = Array.isArray, istarr = o => isobj(o) && _istarr(o)
const isnumstr = s => isstr(s) && !isNaN(parseFloat(s))

const raf = requestAnimationFrame, render = (f, c = Infinity, i = 0,
  l = t => (f(t), r()), r = () => i++ < c ? raf(l) : 0) => r()
const dfrag = document.createDocumentFragment.bind(document)
const dsplice = (p, i, c, ...n) => ((d = p.childNodes, rm = [], l = d.length
  , f = dfrag(), s = i < 0 ? l + i : i, e = isnum(c) ? s + c : l) => (
  forrg(e, () => d[s] ? rm.push(p.removeChild(d[s])) : 0, s),
  forof(n, e => f.appendChild(e)), p.insertBefore(f, d[s]), rm))()

const style = (e, ...s) => (forof(s, s =>
  forin(s, (v, k) => e.style[k] = isnum(v) ? `${v}px` : v)), e)
const _dom = cases((e, v, k) => (isfct(v) ? e[k] = v : e.setAttribute(k, v)),
  ["class", (e, v) => e.className = isarr(v) ? v.join(" ") : v],
  ["child", (e, v) => e.append(...v)],
  ["parent", (e, v) => v ? v.appendChild(e) : 0],
  ["text", (e, v) => e.textContent = v],
  ["style", (e, v) => style(e, ...isarr(v) ? v : [v])])
const dom = (n, o = {}, e = isstr(n) ? document.createElement(n) : n) =>
  (forin(o, (v, k) => v ? _dom(k, e, v, k) : 0), e)
const exec = (e, a = [], n = (forin(e, (_, k) => a.push(k)), a.join(", "))) =>
  c => new Function(`"use strict";\nreturn async ({ ${n} }) => { \n${c}\n }`)()(e)

dom("h1", { text: "ENV.JS Demo Page", parent: document.body })
const description = `Env.js is a web-based coding environment focusing
on exposing the original ideas behind the code, it gives reader
and coder themselves a better vision of what's going on behind
the source code.`
const ctn = dom("div", { text: description, parent: document.body })
style(document.body, { paddingBottom: "50vh", minWidth: 800 })
const demos = []

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 0: simple eval", parent: demo, id: "demo0" })
  const text = `The following demo shows a basic js evaluation environment, which
  offers a simple textarea (right) to write code and a simple console (left) to show your output.`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })

  const h = 200, w = h * 16 / 9, d = dom("div", {
    parent: demo, style: [
      { overflow: "auto", display: "inline-block", height: h, width: w },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: d, ...o })
    d.scrollTop = d.scrollHeight
  }
  const console = {
    log: dlog({}),
    warn: dlog({ style: { color: "yellow" } }),
    error: dlog({ style: { color: "red" } }),
    clear: () => d.innerHTML = "",
  }

  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w}px)` }],
    onkeydown: e => {
      if (e.key == "Alt") { e.preventDefault() }
      if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault()
        try { exec({ console })(t.value) } catch (e) { console.error(e) }
      }
    },
  })
  t.value = `// Use shift + Enter to execute. (alt + Enter, ctrl + Enter also works)
console.log(1, "string", JSON.stringify({ a: 1 })) // only string are supported
console.error(new Error("SOME ERROR"))
// console.clear()`
})

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 1: change the environment", parent: demo, id: "demo1" })
  const text = `Demo 1 adds a "$" variable on top of demo 0.
  "$" is just a plain js object, and will be reference to the same object
  during all execution, so we can use it as a sort of global envrionment.
  Thus all the global variable visit has to be started with "$.", which is tedious,
  but I didn't find a better way to do this without using full js code transformation.`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })
  const txt1 = `The middle window will show current name inside "$".`
  dom("div", { parent: demo, text: txt1, style: { marginBottom: "1em" } })

  const h = 200, w = h * 16 / 9, r = 0.3
  const csty = [
    { overflow: "auto", display: "inline-block", height: h, width: w },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const cdiv = dom("div", { parent: demo, style: csty })
  const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: cdiv, ...o })
    cdiv.scrollTop = cdiv.scrollHeight
  }
  const console = {
    log: dlog({}),
    warn: dlog({ style: { color: "yellow" } }),
    error: dlog({ style: { color: "red" } }),
    clear: () => cdiv.innerHTML = "",
  }

  const $ = { console }, shadow = {}; for (const k in window) { shadow[k] = undefined }
  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
    onkeydown: e => {
      if (e.key == "Alt") { e.preventDefault() }
      if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) {
        e.preventDefault()
        try { exec({ ...shadow, $ })(t.value) }
        catch (e) { console.error(e) }
        ediv.innerHTML = ""
        forin($, (_, k) => dom("div", { text: k, parent: ediv }))
      }
    },
  })

  t.value = `// $.a = 1 // uncomment this to see the change of environment
console.log($) // this output to dev tool console
$.console.log(JSON.stringify($)) // this output to the left console`
})

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 2: history", parent: demo, id: "demo2" })
  const text = `Firstly, let's add a simple history feature.
  You can navigate your past input using ctrl + up / down.
  ( Note that in this demo, once you made an execution,
  the textarea will be automatically cleared, just like a repl. )`
  dom("div", { parent: demo, text, style: { marginBottom: "1em" } })

  {
    const h = 200, w = h * 16 / 9, r = 0.3
    const csty = [
      { overflow: "auto", display: "inline-block", height: h, width: w },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
    const cdiv = dom("div", { parent: demo, style: csty })
    const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const dlog = o => (...a) => {
      dom("div", { text: a.join(" "), parent: cdiv, ...o })
      cdiv.scrollTop = cdiv.scrollHeight
    }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
    const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

    const history = [`// You find the history!
// And you can modify it to create more!
// ================ Like delete this line and then eval ============================`,
      "// Use ctrl + up to see the history."]
    let pos = history.length - 1, edit_histroy = []
    const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
    const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
    const eval = (i = val()) => {
      if (!i) { return } try { exec({ ...shadow, $ })(i) } catch (e) { error(e) } finally {
        ediv.innerHTML = "", forin($, (_, k) => dom("div", { text: k, parent: ediv }))
        t.value = "", history.push(i), pos = history.length, edit_histroy = []
      }
    }

    const $ = { log, error, warn, clear }, shadow = {}
    for (const k in window) { shadow[k] = undefined }
    const t = dom("textarea", {
      label: "code", placeholder: "code", spellcheck: "false",
      parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
      { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
      onkeydown: (e, p = true) => {
        if (e.key == "Alt") { }
        else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
        else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
        else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
        else { p = false } p ? e.preventDefault() : 0
      },
      oninput: () => { edit_histroy[pos] = t.value }
    }); t.value = val()
  }

  {
    dom("div", {
      parent: demo, text: `And here comes a problem, what if the history becomes too long
        and we can't find our old definition to modify?`, style: { margin: "1em 0em" }
    })
    dom("div", {
      parent: demo, text: `Actually, that's not very hard to deal with since we have
        a fully working repl, just add a function to save current input as a snippet!
        And that funciton is provided as "$.ssave", it will save current input by the name
        you pass to it, and you can load snippets using "$.sload", have a try!`,
      style: { margin: "1em 0em" }
    })

    const h = 200, w = h * 16 / 9, r = 0.3
    const csty = [
      { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
    const cdiv = dom("div", { parent: demo, style: csty })
    const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const dlog = o => (...a) => {
      dom("div", { text: a.join(" "), parent: cdiv, ...o })
      cdiv.scrollTop = cdiv.scrollHeight
    }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
    const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

    let history = [], pos = 0, loading = ""
    let edit_histroy = [`$.ssave("1") // the left window shows current snippets`]
    const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
    const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
    const update_list = (d, o) => (s = []) => d.innerHTML =
      (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
    const update_env = update_list(ediv, () => $)
    const update_his = i => (history.push(i), pos = history.length,
      edit_histroy = [], edit_histroy[pos] = t.value = loading, loading = "")
    const eval = (i = val()) => {
      try { exec({ ...shadow, $ })(i) } catch (e) { error(e) }
      finally { update_env(), update_snp(), i ? update_his(i) : 0 }
    }

    const snippets = {}, update_snp = update_list(sdiv, () => snippets)
    const ssave = (name) => isstr(name) ? snippets[name] = val() : 0
    const sload = (name, v = snippets[name]) => v ? loading = v : 0

    const $ = { log, error, warn, clear, ssave, sload }, shadow = {}
    for (const k in window) { shadow[k] = undefined }
    const t = dom("textarea", {
      label: "code", placeholder: "code", spellcheck: "false",
      parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
      { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
      onkeydown: (e, p = true) => {
        if (e.key == "Alt") { }
        else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
        else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
        else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
        else { p = false } p ? e.preventDefault() : 0
      }, oninput: () => { edit_histroy[pos] = t.value }
    }); t.value = val()
  }
})

demos.push(() => {
  const demo = dom("div", { parent: ctn })
  dom("h3", { text: "DEMO 3: external script & non-js text", parent: demo, id: "demo3" })
  dom("div", {
    parent: demo, text: `It's quict useful to load external lib, and by the same
      fashion of "$.ssave" and "$.sload", we can add a new function to load
      external script. Here I presented a simple example loading PicoGL.js
      (which is a nice tiny webgl2 helper).
  `, style: { marginBottom: "1em" }
  })
  const canvas = dom("canvas", {
    parent: dom("div", {
      parent: demo, style: [
        { display: "block", width: "100%", boxSizing: "border-box", },
        { border: "0.5px solid black", borderBottom: "none" }]
    }), style: [{ display: "block", margin: "0 auto" },
    { maxHeight: 800, minHeight: 500, maxWidth: "100%" }]
  })

  const h = 200, w = h * 16 / 9, r = 0.3
  const csty = [
    { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
    { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
  const cdiv = dom("div", { parent: demo, style: csty })
  const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
  const dlog = o => (...a) => {
    dom("div", { text: a.join(" "), parent: cdiv, ...o })
    cdiv.scrollTop = cdiv.scrollHeight
  }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
  const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

  let history = [], pos = 0, edit_histroy = [], pending = [], wait, resolve
  const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
  const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
  const update_list = (d, o) => (s = []) => d.innerHTML =
    (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
  const update_env = update_list(ediv, () => $), dummy = () => { }
  const update_his = i => (history.push(i), pos = history.length, edit_histroy = [])
  const update_nxt = (v = pending.shift()) => edit_histroy[pos] = t.value = v ? v : ""
  const update_all = i => (update_env(), update_snp(), i ? update_his(i) : 0, update_nxt())
  const eval = (i = val()) => {
    const p = new Promise((res) => {
      try { wait = false, resolve = dummy, exec({ window: {}, document: {}, $ })(i) }
      catch (e) { error(e), pending.unshift(i) }
      finally { if (!wait) { res() } else { resolve = res } }
    }); p.finally(() => update_all(i))
  }
  const eload = async (url, f = () => { }) => {
    try { wait = true, exec({ window: {}, $ })(await (await fetch(url)).text() + `\n(${f})()`) }
    catch (e) { error(e) } finally { update_env(), update_snp(), resolve() }
  }

  const snippets = {}, update_snp = update_list(sdiv, () => snippets)
  const ssave = (name) => isstr(name) ? snippets[name] = val() : 0
  const sload = (name, v = snippets[name]) => v ? pending.unshift(v) : 0

  const $ = { log, error, warn, clear, ssave, sload, eload, canvas }, shadow = {}
  for (const k in window) { shadow[k] = undefined }
  const t = dom("textarea", {
    label: "code", placeholder: "code", spellcheck: "false",
    parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
    { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
    onkeydown: (e, p = true) => {
      if (e.key == "Alt") { }
      else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
      else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
      else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
      else { p = false } p ? e.preventDefault() : 0
    }, oninput: () => { edit_histroy[pos] = t.value }
  });

  {
    const picogl = "https://raw.githubusercontent.com/tsherif/picogl.js/master/build/picogl.min.js"
    pending.push(`$.eload("${picogl}", () => {$.PicoGL = PicoGL})`, `// now you can use $.PicoGL!
const { PicoGL, canvas } = $
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// Create a PicoGL.js app to manage GL state.
const app = PicoGL.createApp(canvas)
.clearColor(0.0, 0.0, 0.0, 1.0);

const vsSource = \`
#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec3 color;

out vec3 vColor; 
void main() {
    vColor = color;
    gl_Position = position;
}
\`, fsSource = \`
#version 300 es
precision highp float;

in vec3 vColor;

out vec4 fragColor;
void main() {
    fragColor = vec4(vColor, 1.0);
}
\`
let positions = app.createVertexBuffer(PicoGL.FLOAT, 2, new Float32Array([
  -0.5, -0.5,
   0.5, -0.5,
   0.0, 0.5, 
]));

let colors = app.createVertexBuffer(PicoGL.UNSIGNED_BYTE, 3, new Uint8Array([
  255, 0, 0,
  0, 255, 0,
  0, 0, 255
]));

// COMBINE VERTEX BUFFERS INTO VERTEX ARRAY
let triangleArray = app.createVertexArray()
.vertexAttributeBuffer(0, positions)
.vertexAttributeBuffer(1, colors, { normalized: true });

app.createPrograms([vsSource, fsSource]).then(function([program]) {
  // CREATE DRAW CALL FROM PROGRAM AND VERTEX ARRAY
  let drawCall = app.createDrawCall(program, triangleArray);

  // DRAW
  app.clear();
  drawCall.draw();

  // CLEANUP
  program.delete();
  positions.delete();
  colors.delete();
  triangleArray.delete();
});`), eval("")
  }

  {
    dom("div", {
      parent: demo, text: `Another useful feature is editing non-js text, which could
      also be done by providing a global function.`, style: { margin: "1em 0em" }
    })

    const h = 200, w = h * 16 / 9, r = 0.3
    const csty = [
      { overflow: "auto", display: "inline-block", height: h, width: w * (1 - r) },
      { boxSizing: "border-box", border: "0.5px solid black", borderRight: "none" }]
    const cdiv = dom("div", { parent: demo, style: csty })
    const ediv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const sdiv = dom("div", { parent: demo, style: [...csty, { height: h, width: w * r }] })
    const dlog = o => (...a) => {
      dom("div", { text: a.join(" "), parent: cdiv, ...o })
      cdiv.scrollTop = cdiv.scrollHeight
    }, log = dlog({}), warn = dlog({ style: { color: "yellow" } })
    const error = dlog({ style: { color: "red" } }), clear = () => cdiv.innerHTML = ""

    let history = [], pos = 0, edit_histroy = [], pending = [], wait, resolve
    const val = (a = edit_histroy[pos], b = history[pos]) => isudf(a) ? isudf(b) ? "" : b : a
    const load = n => { if (n >= 0 && n <= history.length) { pos = n, t.value = val() } }
    const update_list = (d, o) => (s = []) => d.innerHTML =
      (forin(o(), (_, k) => s.push(`<div>${k}</div>`)), s.join(""))
    const update_env = update_list(ediv, () => $), dummy = () => { }
    const update_his = i => (history.push(i), pos = history.length, edit_histroy = [])
    const update_nxt = (v = pending.shift()) => edit_histroy[pos] = t.value = v ? v : ""
    const update_all = i => (update_env(), update_snp(), i ? update_his(i) : 0, update_nxt())
    const eval = (i = val()) => {
      const p = new Promise((res) => {
        try { wait = false, resolve = dummy, exec({ window: {}, document: {}, $ })(i) }
        catch (e) { error(e), pending.unshift(i) }
        finally { if (!wait) { res() } else { resolve = res } }
      }); p.finally(() => update_all(i))
    }
    const eload = async (url, f = () => { }) => {
      try { wait = true, exec({ window: {}, $ })(await (await fetch(url)).text() + `\n(${f})()`) }
      catch (e) { error(e) } finally { update_env(), update_snp(), resolve() }
    }

    const snippets = {}, update_snp = update_list(sdiv, () => snippets)
    const ssave = (name) => isstr(name) ? snippets[name] = val() : 0
    const sload = (name, v = snippets[name]) => v ? pending.unshift(v) : 0

    const $ = { log, error, warn, clear, ssave, sload, eload, canvas }, shadow = {}
    for (const k in window) { shadow[k] = undefined }
    const t = dom("textarea", {
      label: "code", placeholder: "code", spellcheck: "false",
      parent: demo, style: [{ resize: "none", border: "0.5px solid black", borderRadius: 0 },
      { boxSizing: "border-box", height: h, width: `calc(100% - ${w * (1 + r)}px)` }],
      onkeydown: (e, p = true) => {
        if (e.key == "Alt") { }
        else if (e.key == "ArrowUp" && e.ctrlKey) { load(pos - 1) }
        else if (e.key == "ArrowDown" && e.ctrlKey) { load(pos + 1) }
        else if (e.key == "Enter" && (e.ctrlKey || e.shiftKey || e.altKey)) { eval() }
        else { p = false } p ? e.preventDefault() : 0
      }, oninput: () => { edit_histroy[pos] = t.value }
    });

    {
      pending.push("abc")
      eval("")
    }
  }
})

// demos.push(() => {
//   const demo = dom("div", { parent: ctn })
//   dom("h3", { text: "DEMO 4: Tabs", parent: demo, id: "demo4" })
//   dom("div", {
//     parent: demo, text: `
//   `, style: { marginBottom: "1em" }
//   })
// })

// demos.push(() => {
//   const demo = dom("div", { parent: ctn })
//   dom("h3", { text: "DEMO 5: meta repl / omit mode", parent: demo, id: "demo5" })
//   dom("div", {
//     parent: demo, text: `
//   `, style: { marginBottom: "1em" }
//   })
// })

// DEMO 6: Worker thread

forof(demos, d => d())