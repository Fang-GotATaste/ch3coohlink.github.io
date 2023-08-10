// indexed database
// idb



$.idb = (name = "default", store = "default") => {
  let $ = { name, store }

  with ($) {
    $.dbp = new Promise((r, j, d = indexedDB.open(name)) => (
      d.onsuccess = () => r(d.result),
      d.onerror = () => j(d.error),
      d.onupgradeneeded = () => d.result.createObjectStore(store)))

    $.deletedatabase = () => dbp.then(db => (db.close(),
      new Promise((r, j, d = indexedDB.deleteDatabase(name)) =>
        (d.onerror = j, d.onsuccess = r))))

    $.upgrade = f => dbp.then(db => (db.close(), $.dbp = new Promise(
      (r, j, d = indexedDB.open(name, db.version + 1)) => (
        d.onsuccess = () => r(d.result),
        d.onerror = () => j(d.error),
        d.onupgradeneeded = () => f(d.result)))))

    $.action = (type, cb, s = store) => dbp.then(db => new Promise(
      (r, j, t = db.transaction(s ?? db.objectStoreNames, type)) => (
        t.oncomplete = () => r(),
        t.onabort = t.onerror = () => j(t.error),
        cb(t))))

    $.request = rq => new Promise((r, j) => (
      rq.onsuccess = r(rq.result), rq.onerror = j))

    $.ro = f => action("readonly", t => f(t.objectStore(store)))
    $.rw = f => action("readwrite", t => f(t.objectStore(store)))

    $.get = (k, r) => ro(s => r = s.get(k)).then(() => r.result)
    $.set = (k, v) => rw(s => s.put(v, k))
    $.del = k => rw(s => s.delete(k))
    $.clr = () => rw(s => s.clear())

    $.key = r => ro(s => r = s.getAllKeys()).then(() => r.result)
    $.val = r => ro(s => r = s.getAll()).then(() => r.result)
    $.search = (kr, r = []) => ro(s =>
      s.openCursor(kr).onsuccess = (e, c = e.target.result) =>
        !c ? 0 : (r.push([c.key, c.value]), c.continue())).then(() => r)

    const fcc = String.fromCharCode
    const inc = (s, l = s.length - 1) => s.substring(0, l) + fcc(s.charCodeAt(l) + 1)
    $.path = s => IDBKeyRange.bound(s, inc(s), 0, 1)
    $.getpath = s => search(path(s))

    const debounce = (f, t = 100, o = {}) => (k, v) => (
      clearTimeout(o[k]), o[k] = setTimeout(() => f(k, v), t))
    const { set: rset, deleteProperty: rdel } = Reflect
    $.saveobj = id => {
      const dset = debounce((k, v) => set(key + k, v))
      const pset = (o, k, v) => (dset(k, v), rset(o, k, v))
      const pdel = (o, k) => (del(key + k), rdel(o, k))
      const remove = () => del(path(key)), key = `/saveobj/${id}/`, kl = key.length
      const init = getpath(key).then(a => a.forEach(([k, v]) => o[k.slice(kl)] = v))
      const o = eventtarget({ init, remove, id })
      return new Proxy(Object.create(o), { set: pset, deleteProperty: pdel })
    }
  }

  return $
}