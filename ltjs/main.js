[, $.basic] = await Promise.all([loadsym("./basic.js"), loadsym("./basic.js", {})])
$.root = $.body = document.body
root.classList.add("grid-bg")
root.addEventListener("contextmenu", e => e.preventDefault())

const paths = "./words.js ./node.js ./port.js";
[$.Cwrds, $.Cnode, $.Cport] = await Promise.all(paths.split(" ").map(v => require(v)))
$.port = ($, name = "", isinput = true, root) => Cport($, { name, isinput, root })
$.node = ($, defunc, root) => Cnode($, { defunc, root })
$.rdword = Cwrds($)

const mdiv = dom({ class: "measure codefont" }, root)
$.measure = t => (mdiv.innerText = t, getComputedStyle(mdiv).width)

$.onpointermove = new Set
window.addEventListener("pointermove", e => onpointermove.forEach(f => f(e)))
$.onwheel = new Set
window.addEventListener("wheel", e => onwheel.forEach(f => f(e)))

const nodename = "registernode texteditor"
$.defaultnode = nodename.split(" "), $.dfno = {}
await Promise.all(defaultnode.map(n => require(`./${n}.js`).then(f => dfno[n] = f)))
await loadsym("./panel.js")