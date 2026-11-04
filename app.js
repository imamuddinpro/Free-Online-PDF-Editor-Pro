(function (e, f) {
    "use strict";
    const o = Object.create(null), m = "6.4.299", j = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${m}/build/pdf.mjs`, h = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${m}/build/pdf.worker.mjs`, _ = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js", E = "https://cdn.jsdelivr.net/npm/jszip@3.10.2/dist/jszip.min.js", FK = "https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js";
    function b(r, i, n) { return e[n] ? Promise.resolve(e[n]) : (o[r] || (o[r] = new Promise((t, l) => { const s = f.createElement("script"); s.src = i, s.async = !0, s.crossOrigin = "anonymous", s.dataset.pdfToolsLibrary = r, s.onload = () => { if (e[n]) {
        t(e[n]);
        return;
    } s.remove(), l(new Error(`${n} loaded without exposing its API.`)); }, s.onerror = () => { s.remove(), l(new Error(`Unable to load ${n} from its CDN.`)); }, f.head.appendChild(s); }).catch(t => { throw o[r] = null, t; })), o[r]); }
    e.__pdfToolsLoadPDFjs = function () { return e.pdfjsLib ? Promise.resolve(e.pdfjsLib) : (o.pdfjs || (o.pdfjs = import(j).then(r => (r.GlobalWorkerOptions.workerSrc = h, e.pdfjsLib = r, r)).catch(r => { throw o.pdfjs = null, r; })), o.pdfjs); }, e.__pdfToolsLoadPDFLib = () => b("pdf-lib", _, "PDFLib"), e.__pdfToolsLoadJSZip = () => b("jszip", E, "JSZip"), e.__pdfToolsLoadFontkit = () => b("fontkit", FK, "fontkit"), e.__pdfToolsCreateObserver = function (r, i = {}) { if ("IntersectionObserver" in e)
        return new e.IntersectionObserver(r, i); const n = new Set, t = i.root || null, l = Number.parseFloat(String(i.rootMargin || "0")) || 0, s = t || e; let p = 0, u = !0; function P() { if (p = 0, !u)
        return; const c = t ? t.getBoundingClientRect() : { top: 0, bottom: e.innerHeight }; Array.from(n).forEach(a => { const L = a.getBoundingClientRect(); L.bottom >= c.top - l && L.top <= c.bottom + l && (n.delete(a), r([{ target: a, isIntersecting: !0 }], v)); }); } function d() { !u || p || (p = e.requestAnimationFrame(P)); } const v = { observe(c) { n.add(c), d(); }, unobserve(c) { n.delete(c); }, disconnect() { u = !1, n.clear(), p && e.cancelAnimationFrame(p), s.removeEventListener("scroll", d), e.removeEventListener("resize", d); } }; return s.addEventListener("scroll", d, { passive: !0 }), e.addEventListener("resize", d, { passive: !0 }), v; }, e.__pdfToolsTriggerDownload = function (r, i) { const n = URL.createObjectURL(r), t = f.createElement("a"); t.href = n, t.download = i, t.rel = "noopener", t.style.position = "fixed", t.style.left = "-10000px", t.style.top = "0", t.setAttribute("aria-hidden", "true"), f.body.appendChild(t); try {
        t.click();
    }
    finally {
        e.setTimeout(() => t.remove(), 12e4);
    } return n; };
})(window, document);
(function () {
    const we = () => {
        const l = document.getElementById("pdf-editor-root");
        if (!l || l.__pdfEditorReady)
            return;
        l.__pdfEditorReady = !0;
        let q = null, j = null, b = null, Y = null, O = "document.pdf", I = 0;
        const U = [];
        let m = [], M = null, ne = 1, D = null, oe = null, V = !1, C = null, P = null, ae = 0, ie = 0, L = 1, h = 0, Wm = !1, whiteoutColor = "#FFFFFF";
        const _ = new Map, re = l.querySelector("#pe-stage"), k = l.querySelector("#pe-stage-wrap");
        function Be(e) { if (e.defaultPrevented || e.ctrlKey || e.metaKey || !e.deltaY || !(e.target instanceof Element))
            return; const t = !!e.target.closest("#pe-stage-wrap"), n = !!e.target.closest("#pdfSplitWorkspace .ps-app"); if (!t && !n)
            return; const o = window.__pdfSuiteMode === "split", i = l.querySelector("#psWorkspace"), a = !!(i && i.classList.contains("active")); if (!(o ? !a : !q))
            return; const d = document.scrollingElement || document.documentElement, p = Math.max(0, d.scrollHeight - window.innerHeight); if (p <= 0)
            return; let s = e.deltaY; e.deltaMode === 1 ? s *= 16 : e.deltaMode === 2 && (s *= window.innerHeight); const f = window.scrollY || d.scrollTop || 0, v = Math.max(0, Math.min(p, f + s)); v !== f && (e.preventDefault(), window.scrollTo({ top: v, left: window.scrollX || 0, behavior: "auto" })); }
        l.addEventListener("wheel", Be, { passive: !1 });
        const se = l.querySelector("#pe-empty-state"), le = l.querySelector("#pe-sidebar-left"), Ye = l.querySelector("#toggleSidebarBtn"), ye = l.querySelector("#sidebarToggleIcon"), F = l.querySelector("#pe-thumbnails-list"), ve = l.querySelector("#headerControls"), ce = l.querySelector("#pdfInput"), xe = l.querySelector("#imgInput"), de = l.querySelector("#toolText"), ue = l.querySelector("#toolImage"), wte = l.querySelector("#toolWhiteout"), rotL = l.querySelector("#rotateLeftBtn"), rotR = l.querySelector("#rotateRightBtn"), Oe = l.querySelector("#openBtnEmpty"), K = l.querySelector("#resetBtn"), G = l.querySelector("#downloadBtn"), Ee = l.querySelector("#filenameTag"), be = l.querySelector("#prevPageBtn"), Te = l.querySelector("#nextPageBtn"), w = l.querySelector("#pageJumpInput"), Le = l.querySelector("#pageTotal"), Ue = l.querySelector("#zoomOutBtn"), Xe = l.querySelector("#zoomInBtn"), W = l.querySelector("#ghost-preview") || document.getElementById("ghost-preview"), Q = l.querySelector("#ghost-text-preview") || document.getElementById("ghost-text-preview"), N = l.querySelector("#pe-toast"), Se = l.querySelector("#pe-loading"), $e = l.querySelector("#pe-loadingText");
        function pe(e) { $e.textContent = e || "Loading...", Se.classList.add("show"); }
        function fe() { Se.classList.remove("show"); }
        function y(e, t = 2600) { N.textContent = e, N.classList.add("show"), clearTimeout(y.timer), y.timer = window.setTimeout(() => N.classList.remove("show"), t); }
        function Ae(e, t, n) { N.replaceChildren(); const o = document.createElement("span"); o.textContent = e; const i = document.createElement("a"); i.className = "pe-toast-download", i.href = t, i.download = n, i.textContent = "Tap here if download did not start", N.append(o, i), N.classList.add("show"), clearTimeout(y.timer), y.timer = window.setTimeout(() => N.classList.remove("show"), 3e4); }
        function je() { U.forEach(e => URL.revokeObjectURL(e)), U.length = 0; }
        function H(e) { if (!(!e || typeof e.destroy != "function"))
            try {
                const t = e.destroy();
                t && typeof t.catch == "function" && t.catch(() => { });
            }
            catch (t) {
                console.warn("PDF.js cleanup warning:", t);
            } }
        function me(e) { e && (e.width = 0, e.height = 0); }
        Ye.addEventListener("click", () => { const e = le.classList.toggle("collapsed"); ye.innerHTML = e ? '<path d="M9 5l7 7-7 7"/>' : '<path d="M15 19l-7-7 7-7"/>'; });
        function Ve(e, t) { if (!e)
            return t.Helvetica; const n = String(e).toLowerCase().replace(/^[a-z]{6}\+/, ""), o = n.includes("bold") || n.includes("bld") || n.includes("black") || n.includes("heavy") || n.includes("demi"), i = n.includes("italic") || n.includes("oblique") || n.includes("ital"), sans = /sans|arial|helvetica|calibri|verdana|tahoma|segoe|roboto|gothic|grotesk/.test(n); return !sans && (n.includes("times") || n.includes("serif") || n.includes("roman") || /georgia|garamond|palatino|cambria|minion/.test(n)) ? o && i ? t.TimesRomanBoldItalic : o ? t.TimesRomanBold : i ? t.TimesRomanItalic : t.TimesRoman : n.includes("courier") || n.includes("mono") || n.includes("consolas") || n.includes("typewriter") ? o && i ? t.CourierBoldOblique : o ? t.CourierBold : i ? t.CourierOblique : t.Courier : o && i ? t.HelveticaBoldOblique : o ? t.HelveticaBold : i ? t.HelveticaOblique : t.Helvetica; }
        /* ===== ImamuddinPro: keep the ORIGINAL PDF fonts when editing existing text ===== */
        const __STD_RE = /^(arial|helvetica|times|courier|symbol|zapf)/i;
        const __BN_RE = /([\u0980-\u09FF\u200C\u200D]+)|([^\u0980-\u09FF\u200C\u200D]+)/g;
        function __pdfFontOf(pg, id) { try {
            const co = pg && pg.pdfPage && pg.pdfPage.commonObjs;
            if (co && id && co.has(id))
                return co.get(id) || null;
        }
        catch (_e) { } return null; }
        function __cleanFontName(f) { return String((f && f.name) || "").replace(/^[A-Z]{6}\+/, ""); }
        function __realFontName(item) { const f = __pdfFontOf(m[item.pageNum - 1], item.fontName); return __cleanFontName(f) || item.fontName || ""; }
        const __baseFracCache = new Map;
        function __baseFrac(fam) {
            if (!fam)
                return .88;
            if (__baseFracCache.has(fam))
                return __baseFracCache.get(fam);
            let r = .88;
            try {
                const c = document.createElement("canvas").getContext("2d");
                c.font = "100px " + fam;
                const t = c.measureText("Hg");
                if (typeof t.fontBoundingBoxAscent === "number" && t.fontBoundingBoxAscent + t.fontBoundingBoxDescent > 0) {
                    const a = t.fontBoundingBoxAscent / 100, d = t.fontBoundingBoxDescent / 100;
                    r = (1 - (a + d)) / 2 + a;
                }
            }
            catch (_e) { }
            __baseFracCache.set(fam, r);
            return r;
        }
        const __fontRegs = new WeakMap;
        function __reg() { if (!q)
            return null; let r = __fontRegs.get(q); if (!r) {
            r = new Map;
            __fontRegs.set(q, r);
        } return r; }
        function __regFont(pg, id) { try {
            const f = __pdfFontOf(pg, id);
            if (!f || !f.loadedName || !f.data || f.missingFile)
                return;
            const r = __reg();
            if (!r)
                return;
            const k = __cleanFontName(f).toLowerCase();
            let a = r.get(k);
            if (!a) {
                a = [];
                r.set(k, a);
            }
            if (a.indexOf(f.loadedName) < 0)
                a.push(f.loadedName);
        }
        catch (_e) { } }
        function __sibNames(f) { try {
            const r = __reg(), a = (r && r.get(__cleanFontName(f).toLowerCase())) || [];
            return a.filter(n => n !== f.loadedName);
        }
        catch (_e) {
            return [];
        } }
        const __cvx = (() => { try {
            return document.createElement("canvas").getContext("2d");
        }
        catch (_e) {
            return null;
        } })();
        const __covMemo = new Map;
        function __charsCovered(chain, text) {
            if (!__cvx)
                return true;
            for (const ch of String(text)) {
                if (/\s/.test(ch))
                    continue;
                const k = chain + "|" + ch;
                let v = __covMemo.get(k);
                if (v === undefined) {
                    __cvx.font = "100px " + chain + ",monospace";
                    const a = __cvx.measureText(ch).width;
                    __cvx.font = "100px " + chain + ",serif";
                    const b = __cvx.measureText(ch).width;
                    v = Math.abs(a - b) < .5;
                    __covMemo.set(k, v);
                }
                if (!v)
                    return false;
            }
            return true;
        }
        function __applyPdfFont(el, pg, id, geo) {
            try {
                const f = __pdfFontOf(pg, id);
                if (!f)
                    return;
                const real = __cleanFontName(f), fam = real.split(/[-,]/)[0].replace(/(PSMT|MT|PS)$/, "").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/["\\]/g, "");
                const g0 = f.fallbackName || (f.isMonospace ? "monospace" : (f.isSerifFont ? "serif" : "sans-serif"));
                const generic = g0 === "sans-serif" ? "Arial,Helvetica,sans-serif" : g0 === "serif" ? '"Times New Roman",Times,serif' : g0 === "monospace" ? '"Courier New",Courier,monospace' : g0;
                const emb = !!(f.data && !f.missingFile && f.loadedName), tail = (fam ? '"' + fam + '",' : "") + generic;
                let useEmb = emb, chain = "";
                if (emb) {
                    chain = [f.loadedName].concat(__sibNames(f)).map(n => '"' + n + '"').join(",");
                    useEmb = __charsCovered(chain, el.innerText || el.textContent || "");
                }
                el.style.fontFamily = useEmb ? chain + "," + tail : tail;
                el.style.fontWeight = useEmb ? "normal" : (f.bold ? "bold" : "normal");
                el.style.fontStyle = useEmb ? "normal" : (f.italic ? "italic" : "normal");
                if (geo) {
                    geo.top = geo.base - geo.size * __baseFrac(el.style.fontFamily);
                    el.style.top = geo.top + "px";
                }
            }
            catch (_e) { }
        }
        function __styleOf(real, f) {
            const n = String(real || "").toLowerCase();
            let w = 400;
            if (/thin|hairline/.test(n))
                w = 100;
            else if (/extra-?light|ultra-?light/.test(n))
                w = 200;
            else if (/light/.test(n))
                w = 300;
            else if (/semi-?bold|demi-?bold/.test(n))
                w = 600;
            else if (/extra-?bold|ultra-?bold|heavy/.test(n))
                w = 800;
            else if (/black/.test(n))
                w = 900;
            else if (/bold|bld/.test(n) || (f && f.bold))
                w = 700;
            else if (/medium/.test(n))
                w = 500;
            return { w: w, it: /italic|oblique/.test(n) || !!(f && f.italic) };
        }
        function __famId(real) {
            let fam = String(real || "").split(/[-,]/)[0].replace(/(PSMT|MT|PS)$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2");
            return fam.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        }
        function __has(fkf, cp) { try {
            if (typeof fkf.hasGlyphForCodePoint === "function")
                return !!fkf.hasGlyphForCodePoint(cp);
            const g = fkf.glyphForCodePoint(cp);
            return !!(g && g.id);
        }
        catch (_e) {
            return false;
        } }
        function __covers(fkf, s) { for (const ch of String(s)) {
            const cp = ch.codePointAt(0);
            if (cp === 32 || cp === 9 || cp === 10 || cp === 13 || cp === 0x200B || cp === 0x200C || cp === 0x200D)
                continue;
            if (!__has(fkf, cp))
                return false;
        } return true; }
        function __isTrueType(d) { return !!d && d.length > 12 && ((d[0] === 0 && d[1] === 1 && d[2] === 0 && d[3] === 0) || (d[0] === 0x74 && d[1] === 0x72 && d[2] === 0x75 && d[3] === 0x65)); }
        function __stdSafe(font, text) { let out = ""; for (const ch of String(text)) {
            if (ch === "\n") {
                out += ch;
                continue;
            }
            try {
                font.encodeText(ch);
                out += ch;
            }
            catch (_e) {
                out += "?";
            }
        } return out; }
        function __newFontCtx(pdf, SF) { return { pdf: pdf, SF: SF, fk: undefined, cache: new Map, remote: new Map, notes: new Set, lossy: false, rast: new Map }; }
        function __noteText(ctx) {
            if (!ctx)
                return "";
            const a = Array.from(ctx.notes).slice(0, 3);
            let s = "";
            if (a.length)
                s += " Closest font used for: " + a.join(", ") + ".";
            if (ctx.lossy)
                s += " Some characters are not supported by the available font.";
            return s;
        }
        /* ===== ImamuddinPro: keep original underlines / borders under edited text ===== */
        function __scanBands(d, W, H) {
            const out = { h: [], v: [] };
            if (W < 4 || H < 3)
                return out;
            const ink = new Uint8Array(W * H);
            let tot = 0;
            for (let y = 0; y < H; y++)
                for (let x = 0; x < W; x++) {
                    const i = (y * W + x) * 4;
                    if (d[i + 3] > 16 && .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2] < 205) {
                        ink[y * W + x] = 1;
                        tot++;
                    }
                }
            if (!tot || tot > W * H * .6)
                return out;
            const rows = [], cols = [];
            for (let y = 0; y < H; y++) {
                let c = 0, r = 0, g = 0, b = 0;
                for (let x = 0; x < W; x++)
                    if (ink[y * W + x]) {
                        const i = (y * W + x) * 4;
                        c++;
                        r += d[i];
                        g += d[i + 1];
                        b += d[i + 2];
                    }
                if (c >= W * .88)
                    rows.push({ k: y, c: [r / c, g / c, b / c] });
            }
            for (let x = 0; x < W; x++) {
                let c = 0, r = 0, g = 0, b = 0;
                for (let y = 0; y < H; y++)
                    if (ink[y * W + x]) {
                        const i = (y * W + x) * 4;
                        c++;
                        r += d[i];
                        g += d[i + 1];
                        b += d[i + 2];
                    }
                if (c >= H * .88)
                    cols.push({ k: x, c: [r / c, g / c, b / c] });
            }
            const group = (list, lim) => {
                const bands = [];
                if (list.length > lim)
                    return bands;
                for (const r of list) {
                    const L = bands[bands.length - 1];
                    if (L && r.k === L.e && Math.max(Math.abs(r.c[0] - L.c[0]), Math.abs(r.c[1] - L.c[1]), Math.abs(r.c[2] - L.c[2])) <= 40) {
                        L.c = [0, 1, 2].map(j => (L.c[j] * L.n + r.c[j]) / (L.n + 1));
                        L.n++;
                        L.e = r.k + 1;
                    }
                    else
                        bands.push({ s: r.k, e: r.k + 1, c: r.c.slice(), n: 1 });
                }
                bands.forEach(b => { b.c = b.c.map(Math.round); });
                return bands;
            };
            out.h = group(rows, H * .5);
            out.v = group(cols, W * .5);
            return out;
        }
        function __pageRaster(ctx, st) {
            const key = st.pageIndex;
            if (ctx.rast.has(key))
                return ctx.rast.get(key);
            const p = (async () => {
                try {
                    const v0 = st.pdfPage.getViewport({ scale: 1, rotation: st.rotation || 0 }), sc = Math.min(2, 4000 / Math.max(v0.width, v0.height));
                    const vp = st.pdfPage.getViewport({ scale: sc, rotation: st.rotation || 0 }), cv = document.createElement("canvas");
                    cv.width = Math.max(1, Math.ceil(vp.width));
                    cv.height = Math.max(1, Math.ceil(vp.height));
                    await st.pdfPage.render({ canvas: cv, viewport: vp }).promise;
                    return { cv: cv, g: cv.getContext("2d"), vp: vp };
                }
                catch (_e) {
                    return null;
                }
            })();
            ctx.rast.set(key, p);
            return p;
        }
        function __freeRaster(ctx) { ctx.rast.forEach(p => { p.then(r => { if (r && r.cv) {
            r.cv.width = 0;
            r.cv.height = 0;
        } }).catch(() => { }); }); ctx.rast.clear(); }
        async function __restoreRules(ctx, page, item, r, rgb) {
            if (/^[\s_\-\u2013\u2014=.]*$/.test(String(item.originalText || "")))
                return;
            const st = m[item.pageNum - 1];
            if (!st || !st.pdfPage)
                return;
            const ras = await __pageRaster(ctx, st);
            if (!ras)
                return;
            const cv = ras.cv, vp = ras.vp, a = vp.convertToViewportPoint(r.x, r.y), b = vp.convertToViewportPoint(r.x + r.w, r.y + r.h);
            const x0 = Math.max(0, Math.floor(Math.min(a[0], b[0]))), x1 = Math.min(cv.width, Math.ceil(Math.max(a[0], b[0])));
            const y0 = Math.max(0, Math.floor(Math.min(a[1], b[1]))), y1 = Math.min(cv.height, Math.ceil(Math.max(a[1], b[1])));
            const W = x1 - x0, H = y1 - y0;
            if (W < 4 || H < 3)
                return;
            const res = __scanBands(ras.g.getImageData(x0, y0, W, H).data, W, H);
            const put = (px0, py0, px1, py1, c) => {
                const p = vp.convertToPdfPoint(x0 + px0, y0 + py0), q = vp.convertToPdfPoint(x0 + px1, y0 + py1);
                page.drawRectangle({ x: Math.min(p[0], q[0]), y: Math.min(p[1], q[1]), width: Math.max(.1, Math.abs(q[0] - p[0])), height: Math.max(.1, Math.abs(q[1] - p[1])), color: rgb(c[0] / 255, c[1] / 255, c[2] / 255) });
            };
            res.h.forEach(bd => put(0, bd.s, W, bd.e, bd.c));
            res.v.forEach(bd => put(bd.s, 0, bd.e, H, bd.c));
        }
        function __screenRules(s, pg, geo) {
            try {
                if (s.getAttribute("data-modified") !== "true") {
                    if (s.__rl) {
                        s.style.backgroundImage = "";
                        s.__rl = 0;
                    }
                    return;
                }
                if (s.__rl)
                    return;
                if (!pg || !pg.rendered || !pg.canvas || !pg.canvas.width || !pg.cssW || !(geo.width > 4))
                    return;
                const cv = pg.canvas, k = cv.width / pg.cssW, x0 = Math.max(0, Math.floor(geo.left * k)), y0 = Math.max(0, Math.floor(geo.top * k));
                const W = Math.min(cv.width - x0, Math.ceil(geo.width * k)), H = Math.min(cv.height - y0, Math.ceil(geo.size * k));
                if (W < 4 || H < 3)
                    return;
                s.__rl = 1;
                const res = __scanBands(cv.getContext("2d").getImageData(x0, y0, W, H).data, W, H);
                if (!res.h.length)
                    return;
                const img = [], size = [], pos = [];
                res.h.forEach(b => { const c = "rgb(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + ")"; img.push("linear-gradient(" + c + "," + c + ")"); size.push("100% " + ((b.e - b.s) / k) + "px"); pos.push("0 " + ((y0 + b.s) / k - geo.top) + "px"); });
                s.style.backgroundImage = img.join(",");
                s.style.backgroundSize = size.join(",");
                s.style.backgroundPosition = pos.join(",");
                s.style.backgroundRepeat = "no-repeat";
            }
            catch (_e) { }
        }
        async function __getFontkit(ctx) {
            if (ctx.fk !== undefined)
                return ctx.fk;
            try {
                const fk = await window.__pdfToolsLoadFontkit();
                ctx.pdf.registerFontkit(fk);
                ctx.fk = fk;
            }
            catch (err) {
                console.warn("fontkit unavailable:", err);
                ctx.fk = null;
            }
            return ctx.fk;
        }
        async function __fetchFont(ctx, url) {
            if (ctx.remote.has(url))
                return ctx.remote.get(url);
            const p = (async () => {
                const ac = typeof AbortController === "function" ? new AbortController : null, t = ac ? setTimeout(() => ac.abort(), 8000) : 0;
                try {
                    const r = await fetch(url, ac ? { signal: ac.signal } : undefined);
                    if (!r.ok)
                        return null;
                    return new Uint8Array(await r.arrayBuffer());
                }
                catch (_e) {
                    return null;
                }
                finally {
                    if (t)
                        clearTimeout(t);
                }
            })();
            ctx.remote.set(url, p);
            return p;
        }
        /* 1) Re-use the font that is embedded in the PDF itself (TrueType only, validated first) */
        async function __entOf(ctx, fk, f) {
            if (!f || f.missingFile || !f.data || !f.loadedName || !__isTrueType(f.data))
                return null;
            const key = "emb:" + f.loadedName;
            let ent = ctx.cache.get(key);
            if (ent === undefined) {
                ent = null;
                try {
                    const data = f.data instanceof Uint8Array ? f.data : new Uint8Array(f.data), fkf = fk.create(data);
                    if (fkf && fkf.unitsPerEm)
                        ent = { fkf: fkf, data: data, font: null, noSpace: !__has(fkf, 32) };
                }
                catch (_e) {
                    ent = null;
                }
                ctx.cache.set(key, ent);
            }
            return ent;
        }
        async function __useEnt(ctx, ent) {
            if (!ent.font)
                ent.font = await ctx.pdf.embedFont(ent.data, { subset: true });
            return { font: ent.font, noSpace: ent.noSpace };
        }
        async function __embeddedList(ctx, item, f) {
            const fk = await __getFontkit(ctx);
            if (!fk || !f)
                return [];
            const own = await __entOf(ctx, fk, f);
            if (!own)
                return [];
            try {
                const orig = String(item.originalText || "");
                if (orig.trim()) {
                    if (!__covers(own.fkf, orig))
                        return [];
                    const w = own.fkf.layout(orig.replace(/\s/g, " ")).advanceWidth * item.fontSize / own.fkf.unitsPerEm, ref = item.width;
                    if (ref > 0 && w > 0) {
                        const r = w / ref;
                        if (r < .6 || r > 1.6)
                            return [];
                    }
                }
            }
            catch (_e) {
                return [];
            }
            const list = [own], pg = m[item.pageNum - 1];
            for (const n of __sibNames(f)) {
                const e = await __entOf(ctx, fk, __pdfFontOf(pg, n));
                if (e)
                    list.push(e);
            }
            return list;
        }
        function __splitByEnt(list, s) {
            const segs = [];
            let cur = null;
            for (const ch of s) {
                const cp = ch.codePointAt(0);
                if (cp === 32 || cp === 9 || cp === 0x200B || cp === 0x200C || cp === 0x200D) {
                    if (!cur) {
                        cur = { ent: list[0], t: "" };
                        segs.push(cur);
                    }
                    cur.t += ch;
                    continue;
                }
                let ent = null;
                if (cur && __has(cur.ent.fkf, cp))
                    ent = cur.ent;
                else
                    for (const e of list) {
                        if (__has(e.fkf, cp)) {
                            ent = e;
                            break;
                        }
                    }
                if (!ent)
                    return null;
                if (!cur || cur.ent !== ent) {
                    cur = { ent: ent, t: "" };
                    segs.push(cur);
                }
                cur.t += ch;
            }
            return segs;
        }
        /* 2) Same family from Google Fonts (via fontsource on jsDelivr) */
        async function __remoteEmbed(ctx, id, subset, w, it, text) {
            const fk = await __getFontkit(ctx);
            if (!fk || !id)
                return null;
            const ws = [w];
            if (w !== 400 && w !== 700)
                ws.push(w >= 600 ? 700 : 400);
            const its = it ? [true, false] : [false];
            for (const ii of its)
                for (const ww of ws) {
                    const key = "rem:" + id + ":" + subset + ":" + ww + ":" + ii;
                    let ent;
                    if (ctx.cache.has(key))
                        ent = ctx.cache.get(key);
                    else {
                        ent = null;
                        const bytes = await __fetchFont(ctx, "https://cdn.jsdelivr.net/npm/@fontsource/" + id + "@5/files/" + id + "-" + subset + "-" + ww + "-" + (ii ? "italic" : "normal") + ".woff");
                        if (bytes) {
                            try {
                                const fkf = fk.create(bytes), font = await ctx.pdf.embedFont(bytes, { subset: true });
                                ent = { font: font, fkf: fkf, noSpace: !__has(fkf, 32) };
                            }
                            catch (_e) {
                                ent = null;
                            }
                        }
                        ctx.cache.set(key, ent);
                    }
                    if (ent)
                        return __covers(ent.fkf, text) ? ent : null;
                }
            return null;
        }
        function __emit(ops, seg, x, y, size) {
            const parts = seg.noSpace ? seg.t.split(" ") : [seg.t];
            parts.forEach((p, i) => { if (i > 0)
                x += size * .27; if (p) {
                ops.push({ t: p, x: x, y: y, font: seg.font });
                x += seg.font.widthOfTextAtSize(p, size);
            } });
            return x;
        }
        async function __planEditedText(ctx, item, stdFont) {
            const text = String(item.newText).replace(/\r/g, ""), size = item.fontSize, f = __pdfFontOf(m[item.pageNum - 1], item.fontName);
            const real = __cleanFontName(f), famId = (__FAM_ALIAS[__famId(real)] || __famId(real)), isStd = !real || __STD_RE.test(real), st = __styleOf(real, f);
            const list = await __embeddedList(ctx, item, f), lines = text.split("\n"), ops = [], useEmb = list.length > 0 && __splitByEnt(list, text.replace(/\n/g, " ")) !== null;
            for (let li = 0; li < lines.length; li++) {
                const line = lines[li];
                if (!line)
                    continue;
                const y = item.pdfY - li * size * (item.lineGap || 1.2);
                let x = item.pdfX;
                if (useEmb) {
                    for (const sg of __splitByEnt(list, line)) {
                        const u = await __useEnt(ctx, sg.ent);
                        x = __emit(ops, { t: sg.t, font: u.font, noSpace: u.noSpace }, x, y, size);
                    }
                    continue;
                }
                const runs = [];
                let mm;
                __BN_RE.lastIndex = 0;
                while ((mm = __BN_RE.exec(line)))
                    runs.push({ bn: !!mm[1], t: mm[0] });
                for (const run of runs) {
                    let seg = null;
                    if (run.bn) {
                        const bn = await __remoteEmbed(ctx, "noto-sans-bengali", "bengali", st.w >= 600 ? 700 : 400, false, run.t);
                        if (bn)
                            seg = { t: run.t, font: bn.font, noSpace: bn.noSpace };
                    }
                    else if (!isStd && famId) {
                        const r = await __remoteEmbed(ctx, famId, "latin", st.w, st.it, run.t);
                        if (r)
                            seg = { t: run.t, font: r.font, noSpace: r.noSpace };
                    }
                    if (!seg) {
                        const safe = __stdSafe(stdFont, run.t);
                        if (safe !== run.t)
                            ctx.lossy = true;
                        if (!isStd && run.t.trim())
                            ctx.notes.add(real.split(/[-,]/)[0] || "original font");
                        seg = { t: safe, font: stdFont, noSpace: false };
                    }
                    x = __emit(ops, seg, x, y, size);
                }
            }
            return ops;
        }
        async function __drawEditedText(ctx, page, item, stdFont, rgb) {
            const ops = await __planEditedText(ctx, item, stdFont);
            for (const op of ops)
                page.drawText(op.t, { x: op.x, y: op.y, size: item.fontSize, font: op.font, color: rgb(0, 0, 0) });
            return true;
        }
        /* ===== ImamuddinPro PREMIUM: Add Text Box keeps the PDF's own font, size, colour, wrapping ===== */
        const __FAM_ALIAS = { calibri: "carlito", cambria: "caladea", georgia: "gelasio", "comic-sans": "comic-neue", "comic-sans-ms": "comic-neue", garamond: "eb-garamond" };
        function __inkOf(page, r, ob) {
            try {
                const cv = page.canvas;
                if (!cv || !page.rendered || !page.cssW)
                    return null;
                const k = cv.width / page.cssW;
                let x = Math.max(0, Math.floor((r.left - ob.left) * k)), y = Math.max(0, Math.floor((r.top - ob.top) * k));
                const w = Math.min(cv.width - x, Math.ceil(r.width * k)), h = Math.min(cv.height - y, Math.ceil(r.height * k));
                if (w < 2 || h < 2)
                    return null;
                const d = cv.getContext("2d").getImageData(x, y, w, h).data, px = [];
                for (let i = 0; i < d.length; i += 4) {
                    if (d[i + 3] < 200)
                        continue;
                    px.push([.299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2], d[i], d[i + 1], d[i + 2]]);
                }
                if (px.length < 6)
                    return null;
                px.sort((a, b) => a[0] - b[0]);
                const bg = px[px.length >> 1][0], dark = bg < 110, n = Math.max(3, Math.floor(px.length * .08));
                if (Math.abs(bg - px[dark ? px.length - 1 : 0][0]) < 40)
                    return null;
                let R = 0, G = 0, B = 0;
                for (let i = 0; i < n; i++) {
                    const p = px[dark ? px.length - 1 - i : i];
                    R += p[1];
                    G += p[2];
                    B += p[3];
                }
                return "#" + [R / n, G / n, B / n].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
            }
            catch (_e) {
                return null;
            }
        }
        function __inheritFont(page, item, ev) {
            const list = page.textLayer ? Array.from(page.textLayer.querySelectorAll(".pdf-editable-text")) : [];
            if (!list.length || !page.overlay)
                return;
            const ob = page.overlay.getBoundingClientRect(), cx = ev.clientX, cy = ev.clientY, cnt = new Map;
            let best = null, bd = 1e9;
            for (const el of list) {
                if (!el.__pf)
                    continue;
                const r = el.getBoundingClientRect();
                if (!r.width || !r.height)
                    continue;
                cnt.set(el.__pf, (cnt.get(el.__pf) || 0) + (el.textContent || "").length);
                const dx = cx < r.left ? r.left - cx : cx > r.right ? cx - r.right : 0, dy = cy < r.top ? r.top - cy : cy > r.bottom ? cy - r.bottom : 0, d = Math.hypot(dx, dy * 1.5);
                if (d < bd) {
                    bd = d;
                    best = el;
                }
            }
            let src = bd <= 80 ? best : null;
            if (!src) {
                let top = null, tn = -1;
                cnt.forEach((v, k) => { if (v > tn) {
                    tn = v;
                    top = k;
                } });
                src = list.find(el => el.__pf === top && el.getBoundingClientRect().width > 0) || null;
            }
            if (!src)
                return;
            item.pdfFontId = src.__pf;
            const ink = __inkOf(page, src.getBoundingClientRect(), ob);
            if (ink)
                item.color = ink;
        }
        function __paintInherited(editor, page, item) {
            if (!item || !item.pdfFontId || !editor)
                return;
            const run = () => { __applyPdfFont(editor, page, item.pdfFontId); if (editor.style.fontFamily)
                item.fontFamily = editor.style.fontFamily; };
            run();
            editor.addEventListener("input", run);
        }
        function __wrapText(text, maxW, meas) {
            const out = [];
            for (const para of text.split("\n")) {
                if (para === "") {
                    out.push("");
                    continue;
                }
                let line = "";
                for (const t of (para.match(/\s+|\S+/g) || [])) {
                    if (/^\s+$/.test(t)) {
                        line += t;
                        continue;
                    }
                    if (meas(line + t) <= maxW) {
                        line += t;
                        continue;
                    }
                    if (line.trim()) {
                        out.push(line.replace(/\s+$/, ""));
                        line = "";
                    }
                    if (meas(t) <= maxW) {
                        line = t;
                        continue;
                    }
                    let cur = "";
                    for (const ch of t) {
                        if (cur && meas(cur + ch) > maxW) {
                            out.push(cur);
                            cur = ch;
                        }
                        else
                            cur += ch;
                    }
                    line = cur;
                }
                out.push(line.replace(/\s+$/, ""));
            }
            return out;
        }
        async function __drawTextBox(ctx, page, state, item, viewport, scale, rgb) {
            const text = String(item.text || "").replace(/\r/g, "");
            if (!text.trim())
                return false;
            const fs = item.fontSize || 16, pg = m[state.pageIndex], f = __pdfFontOf(pg, item.pdfFontId), real = __cleanFontName(f), sname = Ve(real, ctx.SF);
            let std = ctx.cache.get("std:" + sname);
            if (!std) {
                std = await ctx.pdf.embedFont(sname);
                ctx.cache.set("std:" + sname, std);
            }
            const ed = state.overlay && state.overlay.querySelector('.el[data-id="' + item.id + '"] .el-text-content');
            let padL = 9, padT = 7, lh = fs * 1.35, boxW = Math.max(20, (item.w || 180) - 18), fam = "", fst = "normal", fw = "400", bl = 0, bt = 0;
            if (ed) {
                const cs = getComputedStyle(ed), pc = ed.parentElement ? getComputedStyle(ed.parentElement) : null, pR = parseFloat(cs.paddingRight) || 0;
                padL = parseFloat(cs.paddingLeft) || 0;
                padT = parseFloat(cs.paddingTop) || 0;
                lh = parseFloat(cs.lineHeight);
                if (!(lh > 0))
                    lh = fs * 1.35;
                if (ed.clientWidth > 0)
                    boxW = ed.clientWidth - padL - pR;
                fam = cs.fontFamily;
                fst = cs.fontStyle;
                fw = cs.fontWeight;
                if (pc) {
                    bl = parseFloat(pc.borderLeftWidth) || 0;
                    bt = parseFloat(pc.borderTopWidth) || 0;
                }
            }
            let lines = text.split("\n");
            if (__cvx && boxW > 0) {
                __cvx.font = fst + " " + fw + " " + fs + "px " + (fam || "Arial,sans-serif");
                lines = __wrapText(text, boxW, s => __cvx.measureText(s).width);
            }
            const pp = viewport.convertToPdfPoint(item.x + bl + padL, item.y + bt + padT + (lh - fs) / 2 + fs * __baseFrac(fam));
            const pseudo = { newText: lines.join("\n"), originalText: "", fontSize: fs / scale, fontName: item.pdfFontId, pageNum: state.pageIndex + 1, pdfX: pp[0], pdfY: pp[1], lineGap: lh / fs };
            const ops = await __planEditedText(ctx, pseudo, std);
            const hex = /^#[0-9a-f]{6}$/i.test(item.color || "") ? item.color : "#000000", cr = parseInt(hex.slice(1, 3), 16) / 255, cg = parseInt(hex.slice(3, 5), 16) / 255, cb = parseInt(hex.slice(5, 7), 16) / 255;
            for (const op of ops)
                page.drawText(op.t, { x: op.x, y: op.y, size: pseudo.fontSize, font: op.font, color: rgb(cr, cg, cb) });
            return true;
        }
        /* ===== ImamuddinPro PREMIUM: hands-free mouse drag for text boxes ===== */
        function __dragEnhance(element, editor, page, item) {
            if (!element || !editor || element.__dragReady)
                return;
            element.__dragReady = true;
            const mk = cls => { const d = document.createElement("div"); d.className = cls; d.setAttribute("aria-hidden", "true"); element.appendChild(d); return d; };
            const clearSel = () => { try {
                const sel = window.getSelection && window.getSelection();
                if (sel)
                    sel.removeAllRanges();
            }
            catch (_e) { } };
            /* 1) grab zones: the whole border ring + a grip pill. Dragging works even while typing. */
            const grab = el => el.addEventListener("pointerdown", ev => {
                if (ev.button !== 0)
                    return;
                const sx = ev.clientX, sy = ev.clientY;
                let moved = !1;
                element.classList.add("pe-dragging");
                const mv = e => { if (Math.hypot(e.clientX - sx, e.clientY - sy) > 3)
                    moved = !0; };
                const up = () => {
                    window.removeEventListener("pointermove", mv);
                    window.removeEventListener("pointerup", up);
                    window.removeEventListener("pointercancel", up);
                    element.classList.remove("pe-dragging");
                    if (!moved) {
                        try {
                            editor.focus();
                            const r = document.createRange();
                            r.selectNodeContents(editor);
                            r.collapse(!1);
                            const s = window.getSelection();
                            if (s) {
                                s.removeAllRanges();
                                s.addRange(r);
                            }
                        }
                        catch (_e) { }
                    }
                };
                window.addEventListener("pointermove", mv, { passive: !0 });
                window.addEventListener("pointerup", up);
                window.addEventListener("pointercancel", up);
            });
            ["pe-drag-edge pe-drag-t", "pe-drag-edge pe-drag-r", "pe-drag-edge pe-drag-b", "pe-drag-edge pe-drag-l", "pe-drag-grip"].forEach(c => { const d = mk(c); if (c === "pe-drag-grip")
                d.title = "Drag to move"; grab(d); });
            /* 2) press-and-drag on the text itself moves the box when it is not being edited yet.
                  A simple click still places the caret exactly as before. */
            editor.addEventListener("pointerdown", ev => {
                if (ev.button !== 0 || document.activeElement === editor)
                    return;
                const sx = ev.clientX, sy = ev.clientY, ox = item.x, oy = item.y;
                let on = !1;
                const mv = e => {
                    if (!on) {
                        if (Math.hypot(e.clientX - sx, e.clientY - sy) < 5)
                            return;
                        on = !0;
                        element.classList.add("pe-dragging");
                        try {
                            editor.blur();
                        }
                        catch (_e) { }
                        ge(page.pageIndex, item.id);
                    }
                    clearSel();
                    item.x = Math.max(0, Math.min(Math.max(0, page.cssW - item.w), ox + e.clientX - sx));
                    item.y = Math.max(0, Math.min(Math.max(0, page.cssH - item.h), oy + e.clientY - sy));
                    element.style.left = item.x + "px";
                    element.style.top = item.y + "px";
                };
                const up = () => {
                    window.removeEventListener("pointermove", mv);
                    window.removeEventListener("pointerup", up);
                    window.removeEventListener("pointercancel", up);
                    if (on) {
                        element.classList.remove("pe-dragging");
                        clearSel();
                    }
                };
                window.addEventListener("pointermove", mv);
                window.addEventListener("pointerup", up);
                window.addEventListener("pointercancel", up);
            });
        }
        ["dragenter", "dragover", "dragleave", "drop"].forEach(e => { k.addEventListener(e, t => { t.preventDefault(), t.stopPropagation(); }, !1); }), k.addEventListener("drop", e => { const t = e.dataTransfer.files; t && t.length > 0 && (t[0].type === "application/pdf" || /\.pdf$/i.test(t[0].name || "") ? Pe(t[0]) : y("Invalid file format. Please upload a PDF.")); }), document.addEventListener("pointerdown", e => { const t = e.target instanceof Element ? e.target : null; if (!t)
            return; const n = t.closest(".el"), o = t.closest(".pdf-editable-text"), i = t.closest(".pe-header") || t.closest("#pe-rail-right"); !n && !o && !i && (ee(), document.activeElement && typeof document.activeElement.blur == "function" && document.activeElement.blur()); }), Oe.addEventListener("click", () => ce.click()), wte.addEventListener("click", () => { if (!q) {
            y("Upload a PDF before using Whiteout.");
            return;
        } D = null, V = !1, W.style.display = "none", Q.style.display = "none", Wm = !Wm, wte.classList.toggle("active", Wm), wte.setAttribute("aria-pressed", String(Wm)), he(Wm), y(Wm ? "Drag over a page to create a Whiteout rectangle." : "Whiteout tool closed."); }), ce.addEventListener("change", e => { const t = e.target.files[0]; t && (t.type === "application/pdf" || /\.pdf$/i.test(t.name || "") ? Pe(t) : y("Invalid file format. Only PDF files allowed.")), e.target.value = ""; }), window.addEventListener("keydown", e => { if ((e.key === "Delete" || e.key === "Backspace") && M) {
            const t = document.activeElement;
            if (t && (t.isContentEditable || t.tagName === "INPUT") && (t.tagName === "INPUT" || t.textContent.length > 0))
                return;
            Ce();
        } });
        function Ce() { if (!M)
            return; const { pageIndex: e, id: t } = M, n = m[e]; if (n) {
            const o = n.overlay.querySelector('[data-id="' + t + '"]');
            o && o.remove(), n.els = n.els.filter(i => i.id !== t), y("Element deleted");
        } ee(); }
        function Je() { I++, ie++, $(), ee(), m.forEach(n => { if (n.renderTask)
            try {
                n.renderTask.cancel();
            }
            catch { } me(n.canvas); }), F.querySelectorAll("canvas").forEach(me), C && (C.disconnect(), C = null), P && (P.disconnect(), P = null); const e = j, t = b; j = null, b = null, q = null, H(e), t && t !== e && H(t), je(), Y = null, O = "document.pdf", m = [], M = null, ne = 1, _.clear(), h = 0, L = 1, re.replaceChildren(se), se.style.display = "block", F.replaceChildren(), ve.style.display = "none", K.style.display = "none", K.disabled = !0, G.disabled = !0, de.disabled = !0, ue.disabled = !0, wte.disabled = !0, wte.classList.remove("active"), wte.setAttribute("aria-pressed", "false"), rotL.disabled = !0, rotR.disabled = !0, Wm = !1, Ee.textContent = "", k.scrollTop = 0, w.value = "1", Le.textContent = "/ 1", le.classList.add("collapsed"), ye.innerHTML = '<path d="M9 5l7 7-7 7"/>'; }
        async function Pe(e) { if (!e)
            return; if (e.type !== "application/pdf" && !/\.pdf$/i.test(e.name || "")) {
            y("Please select a valid PDF document.");
            return;
        } const t = ++I; b && H(b), b = null, pe("Loading PDF document..."); try {
            const [n, o] = await Promise.all([window.__pdfToolsLoadPDFjs(), e.arrayBuffer()]);
            if (t !== I)
                return;
            const i = new Uint8Array(o), a = n.getDocument({ data: i.slice(0), fontExtraProperties: !0 });
            b = a;
            let r;
            try {
                r = await a.promise;
            }
            catch (p) {
                throw H(a), b === a && (b = null), p;
            }
            if (t !== I) {
                H(a), b === a && (b = null);
                return;
            }
            b === a && (b = null);
            const d = j;
            if (m.forEach(p => { if (p.renderTask)
                try {
                    p.renderTask.cancel();
                }
                catch { } me(p.canvas); }), C && C.disconnect(), P && P.disconnect(), F.replaceChildren(), j = a, q = r, Y = i, O = e.name || "document.pdf", m = [], h = 0, k.scrollTop = 0, _.clear(), H(d), await ke(), t !== I)
                return;
            Qe(), se.style.display = "none", ve.style.display = "flex", K.style.display = "inline-flex", K.disabled = !1, G.disabled = !1, de.disabled = !1, ue.disabled = !1, wte.disabled = !1, rotL.disabled = !1, rotR.disabled = !1, Ee.textContent = O, z(), window.__pdfSuiteSyncHeader && window.__pdfSuiteSyncHeader();
        }
        catch (n) {
            console.error("PDF Tools Pro: unable to load PDF.", n), t === I && y("Unable to open this PDF. It may be damaged or password-protected.");
        }
        finally {
            t === I && fe();
        } }
        async function ke() { const e = ++ie, t = q, n = await Promise.all(Array.from({ length: t.numPages }, (a, r) => t.getPage(r + 1))); if (e !== ie || t !== q)
            return; const o = m.map(a => ({ els: a.els, cssW: a.cssW, viewport: a.viewport, rotation: a.rotation })); m.forEach(a => { if (a.renderTask)
            try {
                a.renderTask.cancel();
            }
            catch { } a.canvas && (a.canvas.width = 0, a.canvas.height = 0); }), re.innerHTML = "", m = [], M = null, C && (C.disconnect(), C = null), ae = k.clientWidth; const i = Math.max(220, ae - 28); C = window.__pdfToolsCreateObserver(a => { a.forEach(r => { if (r.isIntersecting) {
            const d = parseInt(r.target.dataset.pageIndex, 10);
            h = d, z(), Ke(m[d]);
        } }); }, { root: k, rootMargin: "120px 0px" }); for (let a = 1; a <= n.length; a++) {
            const r = n[a - 1], g = o[a - 1], rot = g && Number.isFinite(g.rotation) ? g.rotation : (Number(r.rotate) || 0), d = r.getViewport({ scale: 1, rotation: rot }), p = i / d.width * L, s = r.getViewport({ scale: p, rotation: rot }), f = document.createElement("div");
            f.className = "page-wrap", f.dataset.pageIndex = a - 1, f.style.width = s.width + "px", f.style.height = s.height + "px";
            const v = document.createElement("canvas");
            v.className = "page-canvas";
            const S = document.createElement("div");
            S.className = "pdf-text-layer";
            const T = document.createElement("div");
            T.className = "page-overlay";
            const u = document.createElement("div");
            u.className = "page-num", u.textContent = "Page " + a + " of " + q.numPages, f.appendChild(v), f.appendChild(S), f.appendChild(T), f.appendChild(u), re.appendChild(f);
            const x = { pageIndex: a - 1, pdfPage: r, wrapper: f, textLayer: S, overlay: T, canvas: v, cssW: s.width, cssH: s.height, pdfW: d.width, pdfH: d.height, viewport: s, rotation: rot, rendered: !1, renderTask: null, els: [] };
            m.push(x);
            if (g && g.els.length) {
                const ov = g.viewport, scaleRatio = ov ? s.scale / ov.scale : s.width / g.cssW, delta = ov ? ((rot - (ov.rotation || 0)) % 360 + 360) % 360 : 0;
                g.els.forEach(E => { if (ov && typeof ov.convertToPdfPoint === "function") {
                    const p1 = ov.convertToPdfPoint(E.x, E.y), p2 = ov.convertToPdfPoint(E.x + E.w, E.y + E.h), v1 = s.convertToViewportPoint(p1[0], p1[1]), v2 = s.convertToViewportPoint(p2[0], p2[1]);
                    E.x = Math.min(v1[0], v2[0]), E.y = Math.min(v1[1], v2[1]), E.w = Math.max(1, Math.abs(v2[0] - v1[0])), E.h = Math.max(1, Math.abs(v2[1] - v1[1]));
                }
                else
                    E.x *= scaleRatio, E.y *= scaleRatio, E.w *= scaleRatio, E.h *= scaleRatio; E.type === "text" && (E.fontSize *= scaleRatio), E.viewRotation = (((E.viewRotation || 0) + delta) % 360 + 360) % 360, x.els.push(E), T.appendChild(E.type === "text" ? De(x, E) : E.type === "whiteout" ? Wo(x, E) : Ne(x, E)); });
            }
            T.addEventListener("pointerdown", c => { if (D && c.target === T) {
                et(x, c);
                return;
            } if (V && c.target === T) {
                tt(x, c);
                return;
            } if (Wm && c.target === T) {
                wt(x, c);
                return;
            } }), C.observe(f);
        } }
        async function Ke(e) { if (!e || e.rendered || e.renderTask)
            return; const t = Math.min(window.devicePixelRatio || 1, 2); e.canvas.width = Math.floor(e.cssW * t), e.canvas.height = Math.floor(e.cssH * t); const n = e.pdfPage.render({ canvas: e.canvas, viewport: e.viewport, transform: t > 1 ? [t, 0, 0, t, 0, 0] : null }); e.renderTask = n; try {
            await n.promise, e.rendered = !0;
            const o = await e.pdfPage.getTextContent();
            Ze(e, o);
        }
        catch (o) {
            o && o.name !== "RenderingCancelledException" && console.warn("PDF page render warning:", o);
        }
        finally {
            e.renderTask === n && (e.renderTask = null);
        } }
        function Ge(e, t) { return [e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1], e[0] * t[2] + e[2] * t[3], e[1] * t[2] + e[3] * t[3], e[0] * t[4] + e[2] * t[5] + e[4], e[1] * t[4] + e[3] * t[5] + e[5]]; }
        function Ze(e, t) { e.textLayer.innerHTML = ""; const n = e.viewport, o = e.pageIndex + 1, i = document.createDocumentFragment(); t.items.forEach((a, r) => { if (!a || typeof a.str != "string" || !a.str.trim())
            return; const d = Ge(n.transform, a.transform), p = Math.sqrt(d[2] * d[2] + d[3] * d[3]), s = document.createElement("div"); s.className = "pdf-editable-text", s.contentEditable = "true", s.spellcheck = !1; __regFont(e, a.fontName); __applyPdfFont(s, e, a.fontName); s.__pf = a.fontName; s.__ps = p; const f = `${o}_${r}`, v = _.get(f); v ? (s.innerText = v.newText, s.setAttribute("data-modified", "true")) : s.innerText = a.str; const S = d[5] - p * __baseFrac(s.style.fontFamily); if (s.style.left = `${d[4]}px`, s.style.top = `${S}px`, s.style.fontSize = `${p}px`, a.width) {
            const c = a.width * n.scale;
            s.style.minWidth = `${c}px`;
        } const T = a.transform[4], u = a.transform[5], x = Math.sqrt(a.transform[0] * a.transform[0] + a.transform[1] * a.transform[1]), g = () => { const c = s.innerText; c !== a.str ? (s.setAttribute("data-modified", "true"), _.set(f, { pageNum: o, id: r, originalText: a.str, newText: c, pdfX: T, pdfY: u, fontSize: x, fontName: a.fontName, width: a.width || a.str.length * x * .5, height: a.height || x })) : (s.removeAttribute("data-modified"), _.delete(f)); }; s.addEventListener("input", g), s.addEventListener("blur", g); {
            const __geo = { left: d[4], top: S, base: d[5], size: p, width: a.width ? a.width * n.scale : 0 }, __run = () => { const t0 = __geo.top; __applyPdfFont(s, e, a.fontName, __geo); if (__geo.top !== t0)
                s.__rl = 0; __screenRules(s, e, __geo); };
            s.addEventListener("input", __run), s.addEventListener("blur", __run);
            v && __run();
        } i.appendChild(s); }), e.textLayer.appendChild(i); }
        function Qe() { F.innerHTML = "", P && P.disconnect(), P = window.__pdfToolsCreateObserver((e, t) => { e.forEach(n => { if (!n.isIntersecting)
            return; t.unobserve(n.target); const o = n.target.querySelector("canvas"); o && o._draw && (o._draw(), o._draw = null); }); }, { root: le, rootMargin: "200px 0px" }), m.forEach((e, t) => { const n = document.createElement("div"); n.className = "pe-thumb-item" + (t === h ? " active" : ""), n.dataset.index = t; const o = document.createElement("canvas"); o.className = "pe-thumb-canvas"; const i = e.pdfPage.getViewport({ scale: .25, rotation: e.rotation }); o.width = i.width, o.height = i.height; const a = document.createElement("span"); a.className = "pe-thumb-label", a.textContent = "Page " + (t + 1), n.appendChild(o), n.appendChild(a), n.addEventListener("click", () => { h = t, X(t), z(); }), F.appendChild(n), o._draw = async () => { try {
            await e.pdfPage.render({ canvas: o, viewport: i }).promise;
        }
        catch (r) {
            r && r.name !== "RenderingCancelledException" && console.warn("PDF thumbnail render warning:", r);
        } }, P.observe(n); }); }
        function X(e, t = !0) { const n = m[e]; n && k.scrollTo({ top: Math.max(0, n.wrapper.offsetTop - 16), behavior: t ? "smooth" : "auto" }); }
        function z() { document.activeElement !== w && (w.value = String(h + 1)), Le.textContent = `/ ${m.length}`, w.style.width = Math.max(44, 20 + String(m.length).length * 10) + "px", be.disabled = h <= 0, Te.disabled = h >= m.length - 1, F.querySelectorAll(".pe-thumb-item").forEach((t, n) => { n === h ? t.classList.add("active") : t.classList.remove("active"); }); }
        function Re() { if (!m.length)
            return; const e = parseInt(w.value, 10); if (Number.isNaN(e)) {
            w.value = String(h + 1);
            return;
        } h = Math.min(m.length, Math.max(1, e)) - 1, w.value = String(h + 1), X(h), z(); }
        w.addEventListener("input", () => { w.value = w.value.replace(/\D/g, ""); }), w.addEventListener("focus", () => w.select()), w.addEventListener("keydown", e => { e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), Re(), w.select()) : e.key === "Escape" && (w.value = String(h + 1), w.blur()); }), w.addEventListener("blur", () => { w.value = String(h + 1); }), be.addEventListener("click", () => { h > 0 && (h--, X(h), z()); }), Te.addEventListener("click", () => { h < m.length - 1 && (h++, X(h), z()); }), Xe.addEventListener("click", () => { L < 2 && (L = Math.min(2, L + .25), R()); }), Ue.addEventListener("click", () => { L > .5 && (L = Math.max(.5, L - .25), R()); });
        async function R(e) { if (!q)
            return; const t = h; e || pe("Scaling..."); try {
            await ke();
        }
        finally {
            fe();
        } X(Math.min(t, m.length - 1), !1), z(); }
        async function rotateActivePage(delta) { if (!q || !m[h])
            return; const page = m[h]; page.rotation = (((page.rotation || 0) + delta) % 360 + 360) % 360; rotL.disabled = rotR.disabled = !0; try {
            await R(!0);
            y(`Page ${h + 1} rotated ${delta < 0 ? "left" : "right"}. Rotation will be included in the downloaded PDF.`);
        }
        catch (err) {
            console.error("PDF page rotation failed:", err), y("Unable to rotate this page. Please try again.");
        }
        finally {
            rotL.disabled = rotR.disabled = !1;
        } }
        rotL.addEventListener("click", () => rotateActivePage(-90)), rotR.addEventListener("click", () => rotateActivePage(90));
        let qe;
        const Ie = () => { clearTimeout(qe), qe = window.setTimeout(() => { const e = k.clientWidth; q && e > 0 && e !== ae && R(!0); }, 180); }, Me = "ResizeObserver" in window ? new window.ResizeObserver(Ie) : null;
        Me ? Me.observe(k) : window.addEventListener("resize", Ie, { passive: !0 }), window.addEventListener("pointermove", e => { !D && !V || (D ? (W.style.left = `${e.clientX}px`, W.style.top = `${e.clientY}px`) : (Q.style.left = `${e.clientX}px`, Q.style.top = `${e.clientY}px`)); }, { passive: !0 }), ue.addEventListener("click", () => { $(), xe.click(); }), xe.addEventListener("change", e => { const t = e.target.files[0]; if (e.target.value = "", !t)
            return; if (!["image/png", "image/jpeg", "image/webp"].includes(t.type)) {
            y("Please select a PNG, JPEG, or WebP image.");
            return;
        } const n = new FileReader; n.onerror = () => y("The selected image could not be read."), n.onload = () => { const o = new Image; o.onerror = () => y("The selected image could not be decoded."), o.onload = () => { let i = n.result; if (t.type === "image/webp") {
            const a = document.createElement("canvas");
            a.width = o.naturalWidth, a.height = o.naturalHeight;
            const r = a.getContext("2d");
            if (!r) {
                y("This image could not be converted.");
                return;
            }
            try {
                r.drawImage(o, 0, 0), i = a.toDataURL("image/png");
            }
            catch {
                y("This WebP image could not be converted.");
                return;
            }
            finally {
                a.width = 0, a.height = 0;
            }
        } D = i, oe = { w: o.naturalWidth, h: o.naturalHeight }, W.src = D, W.style.width = Math.min(150, o.naturalWidth) + "px", W.style.display = "block", he(!0), y("Click page to place image"); }, o.src = n.result; }, n.readAsDataURL(t); });
        function et(e, t) { const n = e.overlay.getBoundingClientRect(); let o = oe.w, i = oe.h; o > 150 && (i = i * (150 / o), o = 150); const a = { id: "el_" + ne++, type: "image", x: t.clientX - n.left - o / 2, y: t.clientY - n.top - i / 2, w: o, h: i, src: D, viewRotation: ((e.rotation % 360) + 360) % 360 }; e.els.push(a), e.overlay.appendChild(Ne(e, a)), ge(e.pageIndex, a.id), $(); }
        de.addEventListener("click", () => { m.length && ($(), V = !0, Q.style.display = "block", he(!0), y("Click page to place text")); });
        function tt(page, event) {
            event.stopPropagation();
            const bounds = page.overlay.getBoundingClientRect();
            const width = Math.min(240, Math.max(180, page.cssW - 24));
            const height = 48;
            const clamp = (value, max) => Math.max(0, Math.min(Math.max(0, max), value));
            const item = { id: "el_" + ne++, type: "text", x: clamp(event.clientX - bounds.left, page.cssW - width), y: clamp(event.clientY - bounds.top, page.cssH - height), w: width, h: height, text: "", fontSize: 12, color: "#0f172a", fontFamily: "Arial, sans-serif", viewRotation: 0 };
            try {
                __inheritFont(page, item, event);
            }
            catch (_e) { }
            page.els.push(item);
            const element = De(page, item);
            page.overlay.appendChild(element);
            ge(page.pageIndex, item.id);
            $();
            const editor = element.querySelector(".el-text-content");
            if (editor) {
                requestAnimationFrame(() => { editor.focus(); const selection = window.getSelection(); if (selection) {
                    const range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } });
            }
        }
        function $() { D = null, V = !1, Wm = !1, wte.classList.remove("active"), wte.setAttribute("aria-pressed", "false"), W.style.display = "none", Q.style.display = "none", he(!1); }
        function he(e) { l.querySelectorAll(".page-overlay").forEach(t => e ? t.classList.add("placement-active") : t.classList.remove("placement-active")); }
        function De(page, item) {
            const element = document.createElement("div");
            element.className = "el el-text-box";
            element.dataset.id = item.id;
            const editor = document.createElement("div");
            editor.className = "el-text-content";
            editor.contentEditable = "true";
            editor.spellcheck = false;
            editor.setAttribute("role", "textbox");
            editor.setAttribute("aria-label", "PDF text box");
            editor.setAttribute("aria-multiline", "true");
            editor.setAttribute("data-placeholder", "Type your text here");
            editor.textContent = item.text || "";
            editor.style.fontSize = (item.fontSize || 16) + "px";
            editor.style.color = item.color || "#0f172a";
            editor.style.fontFamily = item.fontFamily || "Arial, sans-serif";
            editor.addEventListener("pointerdown", event => {
                event.stopPropagation();
                ge(page.pageIndex, item.id);
            });
            editor.addEventListener("focus", () => ge(page.pageIndex, item.id));
            editor.addEventListener("input", () => {
                item.text = editor.innerText.replace(/\r/g, "");
                const requiredHeight = Math.max(44, editor.scrollHeight + 2);
                if (requiredHeight > item.h) {
                    item.h = requiredHeight;
                    element.style.height = requiredHeight + "px";
                }
            });
            editor.addEventListener("blur", () => { item.text = editor.innerText.replace(/\r/g, ""); });
            editor.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    editor.blur();
                    event.preventDefault();
                }
                event.stopPropagation();
            });
            element.appendChild(editor);
            ze(element, item);
            applyObjectViewRotation(editor, item);
            _e(element, page, item, true);
            Fe(element, page, item);
            We(element, page, item);
            try {
                __paintInherited(editor, page, item);
            }
            catch (_e) { }
            try {
                __dragEnhance(element, editor, page, item);
            }
            catch (_e) { }
            return element;
        }
        function Ne(e, t) { const n = document.createElement("div"); n.className = "el", n.dataset.id = t.id; const o = document.createElement("img"); return o.className = "el-image", o.src = t.src, n.appendChild(o), ze(n, t), applyObjectViewRotation(o, t), _e(n, e, t, !1), Fe(n, e, t), We(n, e, t), n; }
        function wt(page, event) { event.preventDefault(); const bounds = page.overlay.getBoundingClientRect(), clamp = (v, max) => Math.max(0, Math.min(max, v)), sx = clamp(event.clientX - bounds.left, page.cssW), sy = clamp(event.clientY - bounds.top, page.cssH), draft = document.createElement("div"); draft.className = "pe-whiteout-draft"; draft.style.backgroundColor = whiteoutColor; draft.style.left = sx + "px"; draft.style.top = sy + "px"; page.overlay.appendChild(draft); let frame = 0; const move = ev => { if (ev.pointerId !== event.pointerId)
            return; if (frame)
            cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const x = clamp(ev.clientX - bounds.left, page.cssW), y = clamp(ev.clientY - bounds.top, page.cssH); draft.style.left = Math.min(sx, x) + "px"; draft.style.top = Math.min(sy, y) + "px"; draft.style.width = Math.abs(x - sx) + "px"; draft.style.height = Math.abs(y - sy) + "px"; }); }; const finish = ev => { if (ev && ev.pointerId !== event.pointerId)
            return; if (frame)
            cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", finish); window.removeEventListener("pointercancel", finish); const xPos = parseFloat(draft.style.left) || 0, yPos = parseFloat(draft.style.top) || 0, w = parseFloat(draft.style.width) || 0, h = parseFloat(draft.style.height) || 0; draft.remove(); if (w < 8 || h < 8) {
            y("Draw a slightly larger Whiteout area.");
            return;
        } const item = { id: "el_" + ne++, type: "whiteout", x: xPos, y: yPos, w, h, color: whiteoutColor, viewRotation: 0 }; page.els.push(item); page.overlay.appendChild(Wo(page, item)); ge(page.pageIndex, item.id); yToastWhiteout(); }; window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("pointerup", finish, { once: true }); window.addEventListener("pointercancel", finish, { once: true }); }
        function yToastWhiteout() { y("Whiteout area added. Select it to change its colour, duplicate, resize, or delete it."); }
        function applyObjectViewRotation(content, item) { const angle = ((item.viewRotation || 0) % 360 + 360) % 360; content.style.transformOrigin = "center center"; content.style.transform = angle ? `rotate(${angle}deg)` : "none"; if (angle === 90 || angle === 270) {
            content.style.position = "absolute";
            content.style.width = item.h + "px";
            content.style.height = item.w + "px";
            content.style.left = (item.w - item.h) / 2 + "px";
            content.style.top = (item.h - item.w) / 2 + "px";
        }
        else {
            content.style.position = "absolute";
            content.style.width = "100%";
            content.style.height = "100%";
            content.style.left = "0";
            content.style.top = "0";
        } }
        function Wo(page, item) { const el = document.createElement("div"); el.className = "el el-whiteout"; el.dataset.id = item.id; el.style.backgroundColor = item.color || "#FFFFFF"; ze(el, item); _e(el, page, item, false); Fe(el, page, item); We(el, page, item); return el; }
        function ze(e, t) { e.style.left = t.x + "px", e.style.top = t.y + "px", e.style.width = t.w + "px", e.style.height = t.h + "px"; }
        function _e(element, page, item, isText) {
            const toolbar = document.createElement("div");
            toolbar.className = "floating-tools";
            toolbar.setAttribute("role", "toolbar");
            toolbar.setAttribute("aria-label", item.type === "whiteout" ? "Whiteout controls" : item.type === "text" ? "Text box controls" : "Image controls");
            const icons = {
                fontPlus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19 9 5h2l5 14M6 14h8M19 8v8M15 12h8"/></svg>',
                fontMinus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19 9 5h2l5 14M6 14h8M15 12h8"/></svg>',
                duplicate: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 5V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h1"/></svg>',
                delete: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-11 0 1 14h12l1-14M10 10v6m4-6v6"/></svg>',
                palette: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.8 1.8 0 0 1 1.3-3.1H18a3 3 0 0 0 3-3c0-4.7-4-8.5-9-8.5Z"/><path d="M7.5 10h.01M10 7.5h.01M14 7.5h.01M17 10h.01"/></svg>'
            };
            function makeButton(label, icon, handler, extraClass = "") {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "ft-btn" + (extraClass ? " " + extraClass : "");
                button.innerHTML = icon;
                button.title = label;
                button.setAttribute("aria-label", label);
                button.setAttribute("data-tooltip", label);
                button.addEventListener("pointerdown", event => event.stopPropagation());
                button.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); handler(event); });
                toolbar.appendChild(button);
                return button;
            }
            function duplicateSelected() {
                const copy = { ...item, id: "el_" + ne++, x: Math.min(Math.max(0, page.cssW - item.w), item.x + 18), y: Math.min(Math.max(0, page.cssH - item.h), item.y + 18) };
                page.els.push(copy);
                const clone = copy.type === "whiteout" ? Wo(page, copy) : copy.type === "image" ? Ne(page, copy) : De(page, copy);
                page.overlay.appendChild(clone);
                ge(page.pageIndex, copy.id);
                if (copy.type === "text") {
                    const editor = clone.querySelector(".el-text-content");
                    if (editor) {
                        editor.focus();
                        const selection = window.getSelection();
                        if (selection) {
                            const range = document.createRange();
                            range.selectNodeContents(editor);
                            range.collapse(false);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }
                }
                y("Element duplicated.");
            }
            if (isText) {
                makeButton("Increase font size", icons.fontPlus, () => { item.fontSize = Math.min(72, (item.fontSize || 16) + 2); const editor = element.querySelector(".el-text-content"); if (editor)
                    editor.style.fontSize = item.fontSize + "px"; });
                makeButton("Decrease font size", icons.fontMinus, () => { item.fontSize = Math.max(8, (item.fontSize || 16) - 2); const editor = element.querySelector(".el-text-content"); if (editor)
                    editor.style.fontSize = item.fontSize + "px"; });
            }
            if (item.type === "whiteout") {
                const colorButton = makeButton("Choose background colour", icons.palette, () => palette.classList.toggle("show"), "pe-whiteout-color-btn");
                const palette = document.createElement("div");
                palette.className = "pe-color-palette";
                palette.setAttribute("role", "group");
                palette.setAttribute("aria-label", "Whiteout colours");
                const colors = ["#FFFFFF", "#F8FAFC", "#E5E7EB", "#CBD5E1", "#94A3B8", "#000000", "#FEE2E2", "#FCA5A5", "#FDE68A", "#FEF08A", "#DCFCE7", "#86EFAC", "#DBEAFE", "#93C5FD", "#EDE9FE", "#C4B5FD"];
                colors.forEach(color => {
                    const swatch = document.createElement("button");
                    swatch.type = "button";
                    swatch.className = "pe-color-swatch";
                    swatch.style.backgroundColor = color;
                    swatch.title = color;
                    swatch.setAttribute("aria-label", color);
                    swatch.addEventListener("pointerdown", event => event.stopPropagation());
                    swatch.addEventListener("click", event => { event.stopPropagation(); item.color = color; element.style.backgroundColor = color; palette.classList.remove("show"); y("Whiteout colour updated."); });
                    palette.appendChild(swatch);
                });
                const custom = document.createElement("input");
                custom.type = "color";
                custom.className = "pe-custom-color";
                custom.value = item.color || "#FFFFFF";
                custom.title = "Custom colour";
                custom.setAttribute("aria-label", "Custom Whiteout colour");
                custom.addEventListener("pointerdown", event => event.stopPropagation());
                custom.addEventListener("input", event => { item.color = event.target.value; element.style.backgroundColor = item.color; });
                palette.appendChild(custom);
                toolbar.appendChild(palette);
                makeButton("Duplicate Whiteout area", icons.duplicate, duplicateSelected);
            }
            else {
                makeButton("Duplicate element", icons.duplicate, duplicateSelected);
            }
            makeButton("Delete", icons.delete, () => Ce(), "del");
            element.appendChild(toolbar);
        }
        function Fe(e, t, n) { const handles = [{ cls: "handle-br", x: 1, y: 1 }, { cls: "handle-bl", x: -1, y: 1 }, { cls: "handle-tr", x: 1, y: -1 }, { cls: "handle-tl", x: -1, y: -1 }]; handles.forEach(spec => { const handle = document.createElement("div"); handle.className = "handle " + spec.cls; e.appendChild(handle); handle.addEventListener("pointerdown", ev => { ev.stopPropagation(), ev.preventDefault(); const sx = ev.clientX, sy = ev.clientY, ox = n.x, oy = n.y, ow = n.w, oh = n.h; let frame = 0; const move = event => { if (frame)
            cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const dx = event.clientX - sx, dy = event.clientY - sy; let x = ox, y = oy, w = ow, h = oh; if (spec.x > 0)
            w = Math.max(24, ow + dx);
        else {
            x = ox + dx;
            w = Math.max(24, ow - dx);
            x = ox + ow - w;
        } if (spec.y > 0)
            h = Math.max(18, oh + dy);
        else {
            y = oy + dy;
            h = Math.max(18, oh - dy);
            y = oy + oh - h;
        } n.x = x, n.y = y, n.w = w, n.h = h; e.style.left = x + "px", e.style.top = y + "px", e.style.width = w + "px", e.style.height = h + "px"; }); }; const finish = () => { if (frame)
            cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", finish); window.removeEventListener("pointercancel", finish); }; window.addEventListener("pointermove", move, { passive: true }), window.addEventListener("pointerup", finish, { once: true }), window.addEventListener("pointercancel", finish, { once: true }); }); }); }
        function We(element, page, item) {
            element.addEventListener("pointerdown", event => {
                if (event.target.closest(".handle") || event.target.closest(".floating-tools") || event.target.closest(".pe-color-palette") || event.target.classList.contains("pe-custom-color"))
                    return;
                if (item.type === "text" && event.target.closest(".el-text-content")) {
                    ge(page.pageIndex, item.id);
                    return;
                }
                ge(page.pageIndex, item.id);
                const startX = event.clientX - item.x, startY = event.clientY - item.y;
                let frame = 0;
                function move(ev) {
                    if (frame)
                        cancelAnimationFrame(frame);
                    frame = requestAnimationFrame(() => {
                        const maxX = Math.max(0, page.cssW - item.w), maxY = Math.max(0, page.cssH - item.h);
                        item.x = Math.max(0, Math.min(maxX, ev.clientX - startX));
                        item.y = Math.max(0, Math.min(maxY, ev.clientY - startY));
                        element.style.left = item.x + "px";
                        element.style.top = item.y + "px";
                    });
                }
                function finish() {
                    if (frame)
                        cancelAnimationFrame(frame);
                    window.removeEventListener("pointermove", move);
                    window.removeEventListener("pointerup", finish);
                    window.removeEventListener("pointercancel", finish);
                }
                window.addEventListener("pointermove", move, { passive: true });
                window.addEventListener("pointerup", finish, { once: true });
                window.addEventListener("pointercancel", finish, { once: true });
            });
        }
        function ge(e, t) { ee(), M = { pageIndex: e, id: t }; const n = m[e].overlay.querySelector('[data-id="' + t + '"]'); n && n.classList.add("selected"); }
        function ee() { l.querySelectorAll(".el.selected").forEach(e => e.classList.remove("selected")), M = null; }
        G.addEventListener("click", async () => { if (!Y || G.disabled)
            return; pe("Exporting Document..."); try {
            const lib = await window.__pdfToolsLoadPDFLib(), { PDFDocument, rgb, StandardFonts, degrees } = lib, pdf = await PDFDocument.load(Y), pages = pdf.getPages(), fontCache = new Map, imageCache = new Map;
            let defaultFont = null;
            for (const pageState of m) {
                const page = pages[pageState.pageIndex];
                if (page && Number.isFinite(pageState.rotation))
                    page.setRotation(degrees(pageState.rotation));
            }
            const __fx = __newFontCtx(pdf, StandardFonts);
            for (const item of _.values()) {
                const page = pages[item.pageNum - 1];
                if (!page)
                    continue;
                const fontName = Ve(__realFontName(item), StandardFonts);
                let font = fontCache.get(fontName);
                if (!font) {
                    font = await pdf.embedFont(fontName);
                    fontCache.set(fontName, font);
                }
                const rectH = Math.max(item.fontSize * 1.25, item.height || 0), rectW = Math.max(item.width * 1.15, item.originalText.length * item.fontSize * .65), rectY = item.pdfY - item.fontSize * .25;
                page.drawRectangle({ x: item.pdfX - 1, y: rectY, width: rectW, height: rectH, color: rgb(1, 1, 1) });
                try {
                    await __restoreRules(__fx, page, item, { x: item.pdfX - 1, y: rectY, w: rectW, h: rectH }, rgb);
                }
                catch (__e) {
                    console.warn("Rule restore skipped:", __e);
                }
                if (item.newText && item.newText.trim()) {
                    let __done = !1;
                    try {
                        __done = await __drawEditedText(__fx, page, item, font, rgb);
                    }
                    catch (__err) {
                        console.warn("Original-font export fallback:", __err);
                    }
                    __done || page.drawText(__stdSafe(font, item.newText), { x: item.pdfX, y: item.pdfY, size: item.fontSize, font, color: rgb(0, 0, 0) });
                }
            }
            for (const state of m) {
                const page = pages[state.pageIndex];
                if (!page || !state.els.length)
                    continue;
                const viewport = state.viewport, scale = viewport && viewport.scale ? viewport.scale : (state.cssW / state.pdfW);
                for (const item of state.els) {
                    const p1 = viewport.convertToPdfPoint(item.x, item.y), p2 = viewport.convertToPdfPoint(item.x + item.w, item.y + item.h), x = Math.min(p1[0], p2[0]), y = Math.min(p1[1], p2[1]), width = Math.max(.1, Math.abs(p2[0] - p1[0])), height = Math.max(.1, Math.abs(p2[1] - p1[1]));
                    if (item.type === "whiteout") {
                        const hex = /^#[0-9a-f]{6}$/i.test(item.color || "") ? item.color : "#FFFFFF", r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
                        page.drawRectangle({ x, y, width, height, color: rgb(r, g, b), opacity: 1 });
                        continue;
                    }
                    if (item.type === "text" && item.text && item.text.trim()) {
                        let __ok = !1;
                        try {
                            __ok = await __drawTextBox(__fx, page, state, item, viewport, scale, rgb);
                        }
                        catch (__e) {
                            console.warn("Text box original-font export fallback:", __e);
                        }
                        if (__ok)
                            continue;
                        const baseline = viewport.convertToPdfPoint(item.x + 9, item.y + (item.fontSize || 16) + 7);
                        if (!defaultFont)
                            defaultFont = await pdf.embedFont(StandardFonts.Helvetica);
                        page.drawText(item.text.replace(/\r/g, ""), { x: baseline[0], y: baseline[1], size: (item.fontSize || 16) / scale, font: defaultFont, lineHeight: ((item.fontSize || 16) / scale) * 1.3, color: rgb(0, 0, 0) });
                        continue;
                    }
                    if (item.type === "image") {
                        let image = imageCache.get(item.src);
                        if (!image) {
                            const bytes = nt(item.src);
                            image = item.src.startsWith("data:image/jpeg") || item.src.startsWith("data:image/jpg") ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes);
                            imageCache.set(item.src, image);
                        }
                        page.drawImage(image, { x, y, width, height });
                    }
                }
            }
            __freeRaster(__fx);
            const bytes = await pdf.save(), blob = new Blob([bytes], { type: "application/pdf" });
            let base = O.trim(), fileName = base.toLowerCase().endsWith(".pdf") ? base.slice(0, -4) + "_signed.pdf" : base + "_signed.pdf";
            const url = window.__pdfToolsTriggerDownload(blob, fileName);
            U.push(url);
            window.setTimeout(() => { URL.revokeObjectURL(url); const index = U.indexOf(url); if (index !== -1)
                U.splice(index, 1); }, 3e5);
            Ae("Your edited PDF is ready." + __noteText(__fx), url, fileName);
        }
        catch (error) {
            console.error("PDF export failed:", error);
            y("Unable to export this PDF. Please review the document and try again.");
        }
        finally {
            fe();
        } });
        function nt(e) { const t = e.split(",")[1], n = atob(t), o = new Uint8Array(n.length); for (let i = 0; i < n.length; i++)
            o[i] = n.charCodeAt(i); return o; }
        window.__pdfEditorAPI = { hasFile: () => !!Y, fileName: () => O, reset: () => Je(), notify: e => y(e), getPageCount: () => m.length, getCurrentPage: () => h + 1 };
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", we, { once: !0 }) : we();
})();
(function () {
    const P = () => {
        const E = document.getElementById("pdf-editor-root");
        if (!E || E.__pdfSplitSuiteReady)
            return;
        E.__pdfSplitSuiteReady = !0;
        const e = { modeEditBtn: document.getElementById("modeEditBtn"), modeSplitBtn: document.getElementById("modeSplitBtn"), modeJoinBtn: document.getElementById("modeJoinBtn"), splitRoot: document.getElementById("pdfSplitWorkspace"), joinRoot: document.getElementById("pdfJoinWorkspace"), editRoot: document.getElementById("pe-body"), resetBtn: document.getElementById("resetBtn"), downloadBtn: document.getElementById("downloadBtn"), headerControls: document.getElementById("headerControls"), filenameTag: document.getElementById("filenameTag"), input: document.getElementById("psFileInput"), choose: document.getElementById("psChooseBtn"), dropzone: document.getElementById("psDropzone"), workspace: document.getElementById("psWorkspace"), fileName: document.getElementById("psFileName"), fileInfo: document.getElementById("psFileInfo"), pageGrid: document.getElementById("psPageGrid"), empty: document.getElementById("psEmpty"), selectedBadge: document.getElementById("psSelectedBadge"), pageCountText: document.getElementById("psPageCountText"), selectAll: document.getElementById("psSelectAll"), clearAll: document.getElementById("psClearAll"), invert: document.getElementById("psInvert"), newFile: document.getElementById("psNewFile"), bottom: document.getElementById("psBottom"), summary: document.getElementById("psSummary"), splitBtn: document.getElementById("psSplitBtn"), combineBtn: document.getElementById("psCombineBtn"), progressWrap: document.getElementById("psProgressWrap"), progressBar: document.getElementById("psProgressBar"), progressText: document.getElementById("psProgressText"), progressPercent: document.getElementById("psProgressPercent"), notice: document.getElementById("psNotice") }, n = { file: null, bytes: null, pdfJsDoc: null, pdfLoadingTask: null, pageCount: 0, selected: new Set, anchor: 0, busy: !1, objectUrls: [] };
        let f = null, m = 0;
        function k() { return window.__pdfToolsLoadJSZip(); }
        function D(t) { return String(t || "").replace(/\.pdf$/i, "").replace(/[\\/:*?"<>|]/g, "-").trim() || "split-pdf"; }
        function T(t) { if (!Number.isFinite(t) || t < 0)
            return "0 B"; const s = ["B", "KB", "MB", "GB"], i = Math.min(Math.floor(Math.log(t) / Math.log(1024)), s.length - 1); return `${(t / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${s[i]}`; }
        function L(t, s = "info") { e.notice.textContent = t, e.notice.className = `ps-notice show ${s}`; }
        function C() { e.notice.className = "ps-notice", e.notice.replaceChildren(); }
        function _(t, s, i) { e.notice.replaceChildren(); const r = document.createTextNode(`${t} `), o = document.createElement("a"); o.href = s, o.download = i, o.rel = "noopener", o.className = "ps-download-fallback", o.textContent = "Tap here if download did not start", e.notice.append(r, o), e.notice.className = "ps-notice show success"; }
        function $() { n.objectUrls.forEach(t => URL.revokeObjectURL(t)), n.objectUrls.length = 0; }
        function y(t) { const s = n.selected.size; e.selectedBadge.textContent = `${s} selected`, e.pageCountText.textContent = `${n.pageCount} ${n.pageCount === 1 ? "page" : "pages"}`, e.summary.innerHTML = s ? `<strong>${s}</strong> ${s === 1 ? "page will be created as 1 PDF file." : "pages can be saved as separate PDF files (ZIP) or combined into 1 PDF."}` : "Select at least one page to split.", e.splitBtn.disabled = s === 0 || n.busy, e.combineBtn && (e.combineBtn.disabled = s === 0 || n.busy), e.bottom.classList.toggle("active", n.pageCount > 0), e.empty.classList.toggle("ps-hidden", s !== 0 || n.pageCount === 0), (t || e.pageGrid.querySelectorAll(".ps-page-card")).forEach(r => { if (!r)
            return; const o = Number(r.dataset.page), p = n.selected.has(o); r.classList.toggle("selected", p), r.setAttribute("aria-pressed", String(p)); const c = r.querySelector(".ps-page-status"); c && (c.textContent = p ? "Selected" : "Skipped"); }), b(); }
        function S() { m++, $(), e.pageGrid.querySelectorAll("canvas").forEach(s => { s.width = 0, s.height = 0; }); const t = n.pdfLoadingTask; if (n.pdfLoadingTask = null, n.pdfJsDoc = null, t)
            try {
                const s = t.destroy();
                s && s.catch && s.catch(() => { });
            }
            catch (s) {
                console.warn("PDF splitter cleanup warning:", s);
            } n.file = null, n.bytes = null, n.pageCount = 0, n.selected.clear(), n.anchor = 0, n.busy = !1, f && (f.disconnect(), f = null), e.pageGrid.innerHTML = "", e.workspace.classList.remove("active"), e.dropzone.classList.remove("ps-hidden"), e.progressWrap.classList.remove("active"), C(), b(); }
        function b() { const t = window.__pdfEditorAPI, s = !!(t && t.hasFile()), i = n.pageCount > 0, j = !!(window.__pdfJoinAPI && window.__pdfJoinAPI.hasFiles()), r = s || i || j, a = window.__pdfSuiteMode || "edit"; e.resetBtn.style.display = r ? "inline-flex" : "none", e.resetBtn.disabled = !r, (a === "split" || a === "join") ? (e.headerControls.style.display = "none", e.downloadBtn.style.display = "none", e.filenameTag.textContent = a === "split" && n.file ? n.file.name : "") : (e.headerControls.style.display = s ? "flex" : "none", e.downloadBtn.style.display = "inline-flex", e.filenameTag.textContent = s ? t.fileName() : ""); }
        window.__pdfSuiteSyncHeader = b;
        function I(t) { window.__pdfSuiteMode = t; const s = t === "split", j = t === "join", a = !s && !j; e.modeSplitBtn.classList.toggle("active", s), e.modeSplitBtn.setAttribute("aria-selected", String(s)), e.modeJoinBtn.classList.toggle("active", j), e.modeJoinBtn.setAttribute("aria-selected", String(j)), e.modeEditBtn.classList.toggle("active", a), e.modeEditBtn.setAttribute("aria-selected", String(a)), e.splitRoot.classList.toggle("active", s), e.joinRoot.classList.toggle("active", j), e.editRoot.classList.toggle("ps-hidden", !a), b(); }
        e.modeEditBtn.addEventListener("click", () => I("edit")), e.modeSplitBtn.addEventListener("click", () => I("split")), e.modeJoinBtn.addEventListener("click", () => I("join"));
        async function x(t) {
            if (!t)
                return;
            if (t.type !== "application/pdf" && !/\.pdf$/i.test(t.name || "")) {
                L("Please select a valid PDF document.", "error");
                return;
            }
            const s = m;
            n.file = t, C(), e.dropzone.classList.add("ps-hidden"), e.workspace.classList.add("active"), e.fileName.textContent = t.name, e.fileInfo.textContent = `Reading... (${T(t.size)})`, e.pageGrid.innerHTML = "";
            try {
                const [i, r] = await Promise.all([window.__pdfToolsLoadPDFjs(), t.arrayBuffer()]);
                if (s !== m)
                    return;
                n.bytes = new Uint8Array(r);
                const o = i.getDocument({ data: n.bytes.slice(0) });
                let p;
                try {
                    p = await o.promise;
                }
                catch (a) {
                    try {
                        o.destroy();
                    }
                    catch { }
                    throw a;
                }
                if (s !== m) {
                    try {
                        o.destroy();
                    }
                    catch { }
                    return;
                }
                n.pdfLoadingTask = o, n.pdfJsDoc = p, n.pageCount = n.pdfJsDoc.numPages, n.selected.clear();
                for (let a = 1; a <= n.pageCount; a++)
                    n.selected.add(a);
                e.fileInfo.textContent = `${n.pageCount} ${n.pageCount === 1 ? "page" : "pages"} \u2022 ${T(t.size)}`;
                const c = document.createDocumentFragment();
                for (let a = 1; a <= n.pageCount; a++) {
                    const d = document.createElement("div");
                    d.className = "ps-page-card selected", d.dataset.page = String(a), d.setAttribute("role", "button"), d.setAttribute("tabindex", "0"), d.setAttribute("aria-pressed", "true"), d.innerHTML = `
<div class="ps-check">
<div class="ps-check-mark" aria-hidden="true"></div>
</div>
<div class="ps-page-number">${a}</div>
<div class="ps-page-thumb loading">
<canvas style="display:none;" aria-label="Page ${a} thumbnail"></canvas>
</div>
<div class="ps-page-meta">
<span class="ps-page-label">Page ${a}</span>
<span class="ps-page-status">Selected</span>
</div>
`, d.addEventListener("click", h => { const B = []; if (h.shiftKey && n.anchor) {
                        const [v, l] = [n.anchor, a].sort((u, w) => u - w), g = n.selected.has(n.anchor);
                        for (let u = v; u <= l; u++)
                            g ? n.selected.add(u) : n.selected.delete(u), B.push(e.pageGrid.children[u - 1]);
                    }
                    else
                        n.selected.has(a) ? n.selected.delete(a) : n.selected.add(a), n.anchor = a, B.push(d); y(B); }), d.addEventListener("keydown", h => { (h.key === "Enter" || h.key === " ") && (h.preventDefault(), d.click()); }), c.appendChild(d);
                }
                e.pageGrid.appendChild(c), y(), A();
            }
            catch (i) {
                console.error(i), L("Failed to parse PDF document for splitting.", "error"), S();
            }
        }
        async function F(t, s) { if (n.pdfJsDoc !== t)
            return; const i = s.querySelector(".ps-page-thumb"), r = s.querySelector("canvas"); try {
            const o = await t.getPage(Number(s.dataset.page)), p = o.getViewport({ scale: 1 }), c = o.getViewport({ scale: 260 / p.width });
            r.width = c.width, r.height = c.height, await o.render({ canvas: r, viewport: c }).promise, r.style.display = "block", o.cleanup();
        }
        catch { } i.classList.remove("loading"); }
        function A() { f && f.disconnect(); const t = n.pdfJsDoc; let s = Promise.resolve(); f = window.__pdfToolsCreateObserver((i, r) => { i.forEach(o => { o.isIntersecting && (r.unobserve(o.target), s = s.then(() => F(t, o.target))); }); }, { root: E.querySelector(".ps-app"), rootMargin: "500px 0px" }), e.pageGrid.querySelectorAll(".ps-page-card").forEach(i => f.observe(i)); }
        e.choose.addEventListener("click", () => e.input.click()), e.input.addEventListener("change", t => { const s = t.target.files && t.target.files[0]; s && x(s), t.target.value = ""; }), e.dropzone.addEventListener("dragover", t => { t.preventDefault(), e.dropzone.classList.add("dragover"); }), e.dropzone.addEventListener("dragleave", () => e.dropzone.classList.remove("dragover")), e.dropzone.addEventListener("drop", t => { t.preventDefault(), e.dropzone.classList.remove("dragover"); const s = t.dataTransfer && t.dataTransfer.files && t.dataTransfer.files[0]; s && x(s); }), e.newFile.addEventListener("click", () => S()), e.selectAll.addEventListener("click", () => { for (let t = 1; t <= n.pageCount; t++)
            n.selected.add(t); y(); }), e.clearAll.addEventListener("click", () => { n.selected.clear(), y(); }), e.invert.addEventListener("click", () => { for (let t = 1; t <= n.pageCount; t++)
            n.selected.has(t) ? n.selected.delete(t) : n.selected.add(t); y(); }), e.resetBtn.addEventListener("click", () => { const t = window.__pdfEditorAPI; t && t.reset(), S(), window.__pdfJoinAPI && window.__pdfJoinAPI.reset(), t && t.notify("All PDF tools cleared"); }), e.splitBtn.addEventListener("click", async () => { if (n.selected.size === 0 || n.busy || !n.bytes)
            return; const t = m; n.busy = !0, y(), e.progressWrap.classList.add("active"), e.progressBar.style.width = "0%", e.progressPercent.textContent = "0%", e.progressText.textContent = "Initializing PDF splitter...", C(); try {
            const [s, i] = await Promise.all([window.__pdfToolsLoadPDFLib(), k()]);
            if (t !== m)
                return;
            const { PDFDocument: r } = s, o = await r.load(n.bytes);
            if (t !== m)
                return;
            const p = new i, c = Array.from(n.selected).sort((l, g) => l - g), a = c.length, d = D(n.file ? n.file.name : "document");
            for (let l = 0; l < a; l++) {
                if (t !== m)
                    return;
                const g = c[l];
                e.progressText.textContent = `Extracting page ${g} (${l + 1} of ${a})...`;
                const u = Math.round((l + 1) / a * 90);
                e.progressBar.style.width = `${u}%`, e.progressPercent.textContent = `${u}%`;
                const w = await r.create(), [N] = await w.copyPages(o, [g - 1]);
                w.addPage(N);
                const M = await w.save();
                p.file(`${d}_page_${g}.pdf`, M);
            }
            e.progressText.textContent = "Generating ZIP archive...", e.progressBar.style.width = "95%", e.progressPercent.textContent = "95%";
            const h = await p.generateAsync({ type: "blob", compression: "STORE" }, l => { const g = 90 + Math.round((l.percent || 0) * .1); e.progressBar.style.width = `${Math.min(100, g)}%`, e.progressPercent.textContent = `${Math.min(100, g)}%`; });
            if (t !== m)
                return;
            const B = `${d}_split_pages.zip`, v = window.__pdfToolsTriggerDownload(h, B);
            n.objectUrls.push(v), window.setTimeout(() => { URL.revokeObjectURL(v); const l = n.objectUrls.indexOf(v); l !== -1 && n.objectUrls.splice(l, 1); }, 3e5), e.progressBar.style.width = "100%", e.progressPercent.textContent = "100%", _(`Created a ZIP archive containing ${a} individual page PDFs.`, v, B);
        }
        catch (s) {
            console.error(s), L("An error occurred while splitting the PDF. Please try again.", "error");
        }
        finally {
            n.busy = !1, y(), setTimeout(() => { e.progressWrap.classList.remove("active"); }, 1200);
        } }), e.combineBtn && e.combineBtn.addEventListener("click", async () => { if (n.selected.size === 0 || n.busy || !n.bytes)
            return; const t = m; n.busy = !0, y(), e.progressWrap.classList.add("active"), e.progressBar.style.width = "0%", e.progressPercent.textContent = "0%", e.progressText.textContent = "Initializing PDF combiner...", C(); try {
            const s = await window.__pdfToolsLoadPDFLib();
            if (t !== m)
                return;
            const { PDFDocument: r } = s, o = await r.load(n.bytes);
            if (t !== m)
                return;
            const c = Array.from(n.selected).sort((l, g) => l - g), a = c.length, d = D(n.file ? n.file.name : "document"), p = await r.create();
            for (let l = 0; l < a; l++) {
                if (t !== m)
                    return;
                const g = c[l];
                e.progressText.textContent = `Adding page ${g} (${l + 1} of ${a})...`;
                const u = Math.round((l + 1) / a * 85);
                e.progressBar.style.width = `${u}%`, e.progressPercent.textContent = `${u}%`;
                const [w] = await p.copyPages(o, [g - 1]);
                p.addPage(w);
            }
            e.progressText.textContent = "Generating combined PDF...", e.progressBar.style.width = "95%", e.progressPercent.textContent = "95%";
            const h = await p.save();
            if (t !== m)
                return;
            const B = new Blob([h], { type: "application/pdf" }), N = `${d}_combined_${a}_${a === 1 ? "page" : "pages"}.pdf`, v = window.__pdfToolsTriggerDownload(B, N);
            n.objectUrls.push(v), window.setTimeout(() => { URL.revokeObjectURL(v); const l = n.objectUrls.indexOf(v); l !== -1 && n.objectUrls.splice(l, 1); }, 3e5), e.progressBar.style.width = "100%", e.progressPercent.textContent = "100%", _(`Combined ${a} ${a === 1 ? "page" : "pages"} into 1 PDF file.`, v, N);
        }
        catch (s) {
            console.error(s), L("An error occurred while combining the PDF. Please try again.", "error");
        }
        finally {
            n.busy = !1, y(), setTimeout(() => { e.progressWrap.classList.remove("active"); }, 1200);
        } }), I("edit");
    };
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", P, { once: !0 }) : P();
})();
(function () {
    "use strict";
    const init = () => {
        const root = document.getElementById("pdf-editor-root");
        if (!root || root.__pdfJoinReady)
            return;
        root.__pdfJoinReady = true;
        const e = {
            modeEdit: document.getElementById("modeEditBtn"),
            modeSplit: document.getElementById("modeSplitBtn"),
            modeJoin: document.getElementById("modeJoinBtn"),
            editRoot: document.getElementById("pe-body"),
            splitRoot: document.getElementById("pdfSplitWorkspace"),
            joinRoot: document.getElementById("pdfJoinWorkspace"),
            dropzone: document.getElementById("pjDropzone"),
            input: document.getElementById("pjFileInput"),
            choose: document.getElementById("pjChooseBtn"),
            workspace: document.getElementById("pjWorkspace"),
            fileName: document.getElementById("pjFileName"),
            fileInfo: document.getElementById("pjFileInfo"),
            add: document.getElementById("pjAddFiles"),
            badge: document.getElementById("pjFileBadge"),
            pageCount: document.getElementById("pjPageCount"),
            summary: document.getElementById("pjSummary"),
            merge: document.getElementById("pjMergeBtn"),
            notice: document.getElementById("pjNotice"),
            grid: document.getElementById("pjFileGrid"),
            empty: document.getElementById("pjEmpty"),
            progressWrap: document.getElementById("pjProgressWrap"),
            progressBar: document.getElementById("pjProgressBar"),
            progressText: document.getElementById("pjProgressText"),
            progressPercent: document.getElementById("pjProgressPercent")
        };
        if (Object.values(e).some(node => !node)) {
            console.error("Join PDF could not initialize: a required interface element is missing.");
            return;
        }
        const state = { sources: [], pages: [], sequence: 0, generation: 0, loading: false, busy: false, objectUrls: [], drag: null, nativeDrag: null, dragOrigin: null };
        const formatBytes = value => {
            if (!Number.isFinite(value) || value < 0)
                return "0 B";
            const units = ["B", "KB", "MB", "GB"];
            const index = Math.min(Math.floor(Math.log(Math.max(value, 1)) / Math.log(1024)), units.length - 1);
            return `${(value / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
        };
        const baseName = name => String(name || "document.pdf").replace(/\.pdf$/i, "").replace(/[\\/:*?"<>|]/g, "-").trim() || "document";
        const setNotice = (message, type = "info") => {
            e.notice.textContent = message;
            e.notice.className = `ps-notice pj-notice show ${type}`;
        };
        const clearNotice = () => {
            e.notice.replaceChildren();
            e.notice.className = "ps-notice pj-notice";
        };
        const showDownload = (message, url, fileName) => {
            e.notice.replaceChildren();
            e.notice.append(document.createTextNode(`${message} `));
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            link.rel = "noopener";
            link.className = "ps-download-fallback";
            link.textContent = "Tap here if the download did not start";
            e.notice.append(link);
            e.notice.className = "ps-notice pj-notice show success";
        };
        const setProgress = (percent, message) => {
            const value = Math.max(0, Math.min(100, Math.round(percent)));
            e.progressBar.style.width = `${value}%`;
            e.progressPercent.textContent = `${value}%`;
            e.progressText.textContent = message;
        };
        const pageSourceCount = () => new Set(state.pages.map(page => page.source.id)).size;
        const updateCardPositions = () => {
            const cards = Array.from(e.grid.querySelectorAll(".pj-page-card"));
            cards.forEach((card, index) => {
                const order = card.querySelector(".pj-page-order");
                const first = card.querySelector('[data-action="first"]');
                const up = card.querySelector('[data-action="up"]');
                const down = card.querySelector('[data-action="down"]');
                const last = card.querySelector('[data-action="last"]');
                if (order)
                    order.textContent = String(index + 1);
                if (first)
                    first.disabled = index === 0 || state.busy || state.loading;
                if (up)
                    up.disabled = index === 0 || state.busy || state.loading;
                if (down)
                    down.disabled = index === cards.length - 1 || state.busy || state.loading;
                if (last)
                    last.disabled = index === cards.length - 1 || state.busy || state.loading;
                card.setAttribute("aria-label", `Final position ${index + 1}`);
            });
        };
        const update = () => {
            const files = pageSourceCount();
            const pages = state.pages.length;
            const size = state.sources.reduce((sum, item) => sum + item.file.size, 0);
            e.badge.textContent = `${files} ${files === 1 ? "PDF" : "PDFs"}`;
            e.pageCount.textContent = `${pages} ${pages === 1 ? "page" : "pages"}`;
            e.fileName.textContent = pages ? `${files} source ${files === 1 ? "PDF" : "PDFs"} \u00b7 ${pages} pages ready to arrange` : "PDF pages ready to arrange";
            e.fileInfo.textContent = pages ? `${pages} individual page thumbnails \u00b7 ${formatBytes(size)} \u00b7 Browser-based processing` : "Add at least two PDF files";
            e.workspace.classList.toggle("active", pages > 0);
            e.dropzone.classList.toggle("ps-hidden", pages > 0);
            e.empty.classList.toggle("ps-hidden", pages > 0);
            e.merge.disabled = files < 2 || pages === 0 || state.busy || state.loading;
            e.add.disabled = state.busy || state.loading;
            e.summary.textContent = files < 2 ? "Add at least two PDF files. Every page from each file will appear as an individual thumbnail." : `${files} PDF files and ${pages} pages are ready. Drag any page or use its four position buttons to arrange the exact final sequence.`;
            if (state.loading)
                e.summary.textContent = "Reading PDF files and creating individual page thumbnails\u2026";
            if (state.busy)
                e.summary.textContent = "Building the combined PDF in the exact page order shown. Keep this tab open until the download is ready.";
            updateCardPositions();
            if (window.__pdfSuiteSyncHeader)
                window.__pdfSuiteSyncHeader();
        };
        const iconSvg = (path) => `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
        const makeFallback = () => {
            const holder = document.createElement("div");
            holder.className = "pj-thumb-fallback";
            holder.innerHTML = "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 4h9l7 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z'></path><path d='M13 4v6h6'></path></svg><span>Preview unavailable</span>";
            return holder;
        };
        const renderCards = () => {
            const fragment = document.createDocumentFragment();
            state.pages.forEach((page, index) => {
                const card = document.createElement("article");
                card.className = "pj-page-card";
                card.dataset.pageId = page.id;
                card.draggable = true;
                card.setAttribute("role", "listitem");
                card.setAttribute("aria-roledescription", "draggable PDF page");
                card.setAttribute("aria-grabbed", "false");
                card.innerHTML = `
          <div class="pj-page-top">
            <div class="pj-page-ident"><span class="pj-page-order"></span><span class="pj-source-badge"></span></div>
            <div class="pj-page-top-actions">
              <button class="pj-page-action pj-drag-handle" type="button" title="Drag this page to reorder" aria-label="Drag page to reorder">${iconSvg('<path d="M12 3v18M3 12h18M12 3l-3 3m3-3 3 3M12 21l-3-3m3 3 3-3M3 12l3-3m-3 3 3 3M21 12l-3-3m3 3-3 3"/>')}</button>
              <button class="pj-page-action pj-remove" type="button" data-action="remove" title="Remove this page" aria-label="Remove this page">${iconSvg('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3"/>')}</button>
            </div>
          </div>
          <div class="pj-page-thumb"></div>
          <div class="pj-page-details"><div class="pj-page-file"></div><div class="pj-page-original"></div></div>
          <div class="pj-page-moves" role="group" aria-label="Move this page">
            <button class="pj-page-action" type="button" data-action="first" title="Move to first page" aria-label="Move page to first position">${iconSvg('<path d="M4 4h16M12 18V8m-5 5 5-5 5 5"/>')}</button>
            <button class="pj-page-action" type="button" data-action="up" title="Move one page up" aria-label="Move page one position earlier">${iconSvg('<path d="m6 14 6-6 6 6"/>')}</button>
            <button class="pj-page-action" type="button" data-action="down" title="Move one page down" aria-label="Move page one position later">${iconSvg('<path d="m6 10 6 6 6-6"/>')}</button>
            <button class="pj-page-action" type="button" data-action="last" title="Move to last page" aria-label="Move page to last position">${iconSvg('<path d="M4 20h16M12 6v10m-5-5 5 5 5-5"/>')}</button>
          </div>`;
                card.querySelector(".pj-page-order").textContent = String(index + 1);
                const badge = card.querySelector(".pj-source-badge");
                badge.textContent = `PDF ${page.source.order}`;
                badge.classList.add(`pj-source-tone-${((page.source.order - 1) % 6) + 1}`);
                const fileName = card.querySelector(".pj-page-file");
                fileName.textContent = page.source.file.name;
                fileName.title = page.source.file.name;
                card.querySelector(".pj-page-original").textContent = `Original page ${page.pageNumber} of ${page.source.pageCount}`;
                const thumb = card.querySelector(".pj-page-thumb");
                if (page.canvas)
                    thumb.append(page.canvas);
                else
                    thumb.append(makeFallback());
                fragment.append(card);
            });
            e.grid.replaceChildren(fragment);
            updateCardPositions();
        };
        const syncOrderFromGrid = () => {
            const byId = new Map(state.pages.map(page => [page.id, page]));
            const ordered = Array.from(e.grid.querySelectorAll(".pj-page-card"))
                .map(card => byId.get(card.dataset.pageId)).filter(Boolean);
            if (ordered.length === state.pages.length)
                state.pages = ordered;
            update();
        };
        const cleanupUrls = () => {
            state.objectUrls.forEach(url => URL.revokeObjectURL(url));
            state.objectUrls.length = 0;
        };
        const clearCanvas = page => {
            if (page && page.canvas) {
                page.canvas.width = 0;
                page.canvas.height = 0;
                page.canvas = null;
            }
        };
        const reset = () => {
            state.generation++;
            state.pages.forEach(clearCanvas);
            state.pages = [];
            state.sources = [];
            state.sequence = 0;
            state.loading = false;
            state.busy = false;
            state.drag = null;
            state.nativeDrag = null;
            state.dragOrigin = null;
            cleanupUrls();
            e.grid.replaceChildren();
            e.progressWrap.classList.remove("active");
            setProgress(0, "Preparing PDF pages...");
            clearNotice();
            update();
        };
        const makePagePreviews = async (bytes, pdfjs, isCurrent) => {
            let task = null;
            const previews = [];
            let pageCount = 0;
            try {
                task = pdfjs.getDocument({ data: bytes.slice() });
                const doc = await task.promise;
                pageCount = doc.numPages;
                for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
                    if (!isCurrent())
                        return { cancelled: true, pageCount, previews };
                    let canvas = null;
                    try {
                        const page = await doc.getPage(pageNumber);
                        const original = page.getViewport({ scale: 1 });
                        const scale = Math.min(.62, 190 / Math.max(1, original.width), 250 / Math.max(1, original.height));
                        const viewport = page.getViewport({ scale: Math.max(.08, scale) });
                        canvas = document.createElement("canvas");
                        canvas.width = Math.max(1, Math.ceil(viewport.width));
                        canvas.height = Math.max(1, Math.ceil(viewport.height));
                        await page.render({ canvas, viewport }).promise;
                        page.cleanup();
                    }
                    catch (previewError) {
                        console.warn(`PDF page ${pageNumber} preview could not be rendered:`, previewError);
                        if (canvas) {
                            canvas.width = 0;
                            canvas.height = 0;
                        }
                        canvas = null;
                    }
                    previews.push({ pageNumber, canvas });
                    if (pageNumber % 4 === 0)
                        await new Promise(resolve => window.setTimeout(resolve, 0));
                }
                return { cancelled: false, pageCount, previews };
            }
            finally {
                if (task) {
                    try {
                        await task.destroy();
                    }
                    catch (cleanupError) {
                        console.warn("PDF preview cleanup:", cleanupError);
                    }
                }
            }
        };
        const addFiles = async (fileList) => {
            if (state.loading || state.busy) {
                setNotice("Please wait until the current PDF operation is finished.", "info");
                return;
            }
            const picked = Array.from(fileList || []);
            if (!picked.length)
                return;
            const valid = picked.filter(file => file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""));
            const rejected = picked.length - valid.length;
            if (!valid.length) {
                setNotice("Please choose valid PDF documents only.", "error");
                return;
            }
            const generation = state.generation;
            let addedFiles = 0, failedFiles = [];
            state.loading = true;
            clearNotice();
            update();
            try {
                const pdfjs = await window.__pdfToolsLoadPDFjs();
                for (let index = 0; index < valid.length; index++) {
                    if (generation !== state.generation)
                        return;
                    const file = valid[index];
                    e.fileInfo.textContent = `Reading PDF ${index + 1} of ${valid.length}: ${file.name}`;
                    try {
                        const bytes = new Uint8Array(await file.arrayBuffer());
                        if (generation !== state.generation)
                            return;
                        const preview = await makePagePreviews(bytes, pdfjs, () => generation === state.generation);
                        if (generation !== state.generation) {
                            preview.previews.forEach(item => { if (item.canvas) {
                                item.canvas.width = 0;
                                item.canvas.height = 0;
                            } });
                            return;
                        }
                        if (preview.cancelled)
                            return;
                        if (!preview.pageCount)
                            throw new Error("The PDF contains no pages.");
                        state.sequence++;
                        const source = { id: `source-${state.sequence}`, order: state.sequence, file, bytes, pageCount: preview.pageCount };
                        state.sources.push(source);
                        preview.previews.forEach(item => {
                            state.pages.push({ id: `${source.id}-page-${item.pageNumber}`, source, pageNumber: item.pageNumber, canvas: item.canvas });
                        });
                        addedFiles++;
                        renderCards();
                        update();
                    }
                    catch (fileError) {
                        console.error("Unable to read PDF file:", file.name, fileError);
                        failedFiles.push(file.name);
                    }
                }
                if (generation !== state.generation)
                    return;
                const messages = [];
                if (addedFiles)
                    messages.push(`Added ${addedFiles} PDF ${addedFiles === 1 ? "file" : "files"} and created ${state.pages.length} individual page thumbnails.`);
                if (failedFiles.length)
                    messages.push(`Could not read: ${failedFiles.join(", ")}.`);
                if (rejected)
                    messages.push(`${rejected} non-PDF ${rejected === 1 ? "file was" : "files were"} skipped.`);
                if (messages.length)
                    setNotice(messages.join(" "), failedFiles.length || rejected ? "info" : "success");
                if (!state.sources.length)
                    setNotice("No readable PDF files were added. Check that your files are valid and not password-protected.", "error");
            }
            catch (error) {
                console.error("PDF loading failed:", error);
                setNotice("The PDF preview library could not be loaded. Check your internet connection and try again.", "error");
            }
            finally {
                if (generation === state.generation) {
                    state.loading = false;
                    update();
                }
            }
        };
        const movePage = (id, position) => {
            if (state.busy || state.loading)
                return;
            const index = state.pages.findIndex(page => page.id === id);
            if (index < 0 || state.pages.length < 2)
                return;
            const [page] = state.pages.splice(index, 1);
            const destination = Math.max(0, Math.min(state.pages.length, position));
            state.pages.splice(destination, 0, page);
            renderCards();
            update();
            clearNotice();
        };
        const onGridClick = event => {
            const button = event.target.closest("button[data-action]");
            if (!button || state.busy || state.loading)
                return;
            const card = button.closest(".pj-page-card");
            if (!card)
                return;
            const id = card.dataset.pageId;
            const index = state.pages.findIndex(page => page.id === id);
            if (index < 0)
                return;
            const action = button.dataset.action;
            if (action === "first")
                movePage(id, 0);
            else if (action === "up")
                movePage(id, index - 1);
            else if (action === "down")
                movePage(id, index + 1);
            else if (action === "last")
                movePage(id, state.pages.length - 1);
            else if (action === "remove") {
                const [removed] = state.pages.splice(index, 1);
                clearCanvas(removed);
                const stillUsed = state.pages.some(page => page.source.id === removed.source.id);
                if (!stillUsed)
                    state.sources = state.sources.filter(source => source.id !== removed.source.id);
                renderCards();
                update();
                clearNotice();
            }
        };
        const finishDrag = () => {
            if (!state.drag)
                return;
            state.drag.card.classList.remove("dragging");
            state.drag.handle.removeAttribute("aria-grabbed");
            state.drag = null;
            syncOrderFromGrid();
        };
        const finishNativeDrag = commit => {
            const drag = state.nativeDrag;
            if (!drag)
                return;
            drag.card.classList.remove("dragging");
            drag.card.setAttribute("aria-grabbed", "false");
            state.nativeDrag = null;
            state.dragOrigin = null;
            if (commit) {
                syncOrderFromGrid();
            }
            else {
                state.pages = drag.originalOrder;
                renderCards();
                update();
            }
        };
        const placeDraggedCard = (event, card) => {
            const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".pj-page-card");
            if (!target || target === card || target.parentElement !== e.grid)
                return;
            const rect = target.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;
            const before = event.clientY < middleY - rect.height * .18 || (Math.abs(event.clientY - middleY) <= rect.height * .18 && event.clientX < rect.left + rect.width / 2);
            e.grid.insertBefore(card, before ? target : target.nextSibling);
        };
        e.grid.addEventListener("click", onGridClick);
        e.grid.addEventListener("pointerdown", event => {
            if (event.pointerType === "mouse") {
                state.dragOrigin = event.target;
                return;
            }
            const handle = event.target.closest(".pj-drag-handle");
            if (!handle || state.busy || state.loading)
                return;
            const card = handle.closest(".pj-page-card");
            if (!card)
                return;
            state.drag = { card, handle, pointerId: event.pointerId };
            card.classList.add("dragging");
            handle.setAttribute("aria-grabbed", "true");
            try {
                handle.setPointerCapture(event.pointerId);
            }
            catch { }
            event.preventDefault();
        });
        e.grid.addEventListener("pointermove", event => {
            if (!state.drag || event.pointerId !== state.drag.pointerId)
                return;
            placeDraggedCard(event, state.drag.card);
            const app = e.joinRoot.querySelector(".pj-app");
            if (app) {
                const appRect = app.getBoundingClientRect();
                if (event.clientY < appRect.top + 42)
                    app.scrollTop -= 18;
                else if (event.clientY > appRect.bottom - 42)
                    app.scrollTop += 18;
            }
        });
        e.grid.addEventListener("pointerup", event => {
            if (state.drag)
                finishDrag();
            if (event.pointerType === "mouse" && !state.nativeDrag)
                state.dragOrigin = null;
        });
        e.grid.addEventListener("pointercancel", () => {
            if (state.drag)
                finishDrag();
            state.dragOrigin = null;
        });
        e.grid.addEventListener("lostpointercapture", finishDrag);
        // Native HTML drag-and-drop enables mouse users to move whole page cards.
        // Touch and pen continue to use the pointer-based handler above.
        e.grid.addEventListener("dragstart", event => {
            const card = event.target.closest(".pj-page-card");
            if (!card || state.busy || state.loading) {
                event.preventDefault();
                return;
            }
            const origin = state.dragOrigin;
            if (origin && origin.closest("button") && !origin.closest(".pj-drag-handle")) {
                event.preventDefault();
                state.dragOrigin = null;
                return;
            }
            state.nativeDrag = { card, originalOrder: state.pages.slice(), dropped: false };
            card.classList.add("dragging");
            card.setAttribute("aria-grabbed", "true");
            state.dragOrigin = null;
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", card.dataset.pageId);
            }
        });
        e.grid.addEventListener("dragover", event => {
            if (!state.nativeDrag)
                return;
            event.preventDefault();
            if (event.dataTransfer)
                event.dataTransfer.dropEffect = "move";
            placeDraggedCard(event, state.nativeDrag.card);
        });
        e.grid.addEventListener("drop", event => {
            if (!state.nativeDrag)
                return;
            event.preventDefault();
            state.nativeDrag.dropped = true;
            finishNativeDrag(true);
        });
        e.grid.addEventListener("dragend", () => {
            if (state.nativeDrag)
                finishNativeDrag(state.nativeDrag.dropped);
        });
        const openPicker = () => { if (!state.busy && !state.loading)
            e.input.click(); };
        e.choose.addEventListener("click", openPicker);
        e.add.addEventListener("click", openPicker);
        e.input.addEventListener("change", event => {
            const files = event.target.files;
            if (files && files.length)
                addFiles(files);
            event.target.value = "";
        });
        const acceptDrop = event => {
            event.preventDefault();
            e.dropzone.classList.add("dragover");
        };
        const leaveDrop = () => e.dropzone.classList.remove("dragover");
        e.dropzone.addEventListener("dragover", acceptDrop);
        e.dropzone.addEventListener("dragleave", leaveDrop);
        e.dropzone.addEventListener("drop", event => {
            event.preventDefault();
            leaveDrop();
            if (event.dataTransfer?.files?.length)
                addFiles(event.dataTransfer.files);
        });
        e.workspace.addEventListener("dragover", event => {
            if (event.dataTransfer?.types?.includes("Files"))
                event.preventDefault();
        });
        e.workspace.addEventListener("drop", event => {
            if (!event.dataTransfer?.files?.length)
                return;
            event.preventDefault();
            addFiles(event.dataTransfer.files);
        });
        e.merge.addEventListener("click", async () => {
            if (pageSourceCount() < 2 || !state.pages.length || state.busy || state.loading)
                return;
            const generation = state.generation;
            const orderedPages = state.pages.slice();
            const totalPages = orderedPages.length;
            state.busy = true;
            clearNotice();
            e.progressWrap.classList.add("active");
            setProgress(0, "Loading the PDF merge engine...");
            update();
            try {
                const { PDFDocument } = await window.__pdfToolsLoadPDFLib();
                if (generation !== state.generation)
                    return;
                const merged = await PDFDocument.create();
                const loadedSources = new Map();
                for (let index = 0; index < orderedPages.length; index++) {
                    if (generation !== state.generation)
                        return;
                    const pageItem = orderedPages[index];
                    let sourceDocument = loadedSources.get(pageItem.source.id);
                    if (!sourceDocument) {
                        e.summary.textContent = `Opening ${pageItem.source.file.name}\u2026`;
                        sourceDocument = await PDFDocument.load(pageItem.source.bytes.slice());
                        loadedSources.set(pageItem.source.id, sourceDocument);
                    }
                    const [copiedPage] = await merged.copyPages(sourceDocument, [pageItem.pageNumber - 1]);
                    merged.addPage(copiedPage);
                    const percent = Math.min(94, ((index + 1) / totalPages) * 94);
                    setProgress(percent, `Adding arranged page ${index + 1} of ${totalPages}\u2026`);
                }
                setProgress(97, "Creating your single combined PDF file...");
                const output = await merged.save();
                if (generation !== state.generation)
                    return;
                const blob = new Blob([output], { type: "application/pdf" });
                const firstSource = orderedPages[0].source;
                const fileName = `${baseName(firstSource.file.name)}_joined.pdf`;
                const url = window.__pdfToolsTriggerDownload(blob, fileName);
                state.objectUrls.push(url);
                window.setTimeout(() => {
                    URL.revokeObjectURL(url);
                    const index = state.objectUrls.indexOf(url);
                    if (index !== -1)
                        state.objectUrls.splice(index, 1);
                }, 300000);
                setProgress(100, "Your arranged PDF is ready.");
                showDownload(`Successfully joined ${pageSourceCount()} PDF files and ${totalPages} individually arranged pages into one PDF.`, url, fileName);
            }
            catch (error) {
                console.error("PDF joining failed:", error);
                const message = /encrypt|password/i.test(String(error?.message || error))
                    ? "One of the PDFs may be password-protected or encrypted. Remove its protection with permission, then try again."
                    : "Unable to join these PDF pages. Check that each source PDF is valid and unprotected, then try again.";
                setNotice(message, "error");
            }
            finally {
                if (generation === state.generation) {
                    state.busy = false;
                    update();
                    window.setTimeout(() => e.progressWrap.classList.remove("active"), 1600);
                }
            }
        });
        const activateMode = mode => {
            window.__pdfSuiteMode = mode;
            const isEdit = mode === "edit", isSplit = mode === "split", isJoin = mode === "join";
            e.modeEdit.classList.toggle("active", isEdit);
            e.modeEdit.setAttribute("aria-selected", String(isEdit));
            e.modeSplit.classList.toggle("active", isSplit);
            e.modeSplit.setAttribute("aria-selected", String(isSplit));
            e.modeJoin.classList.toggle("active", isJoin);
            e.modeJoin.setAttribute("aria-selected", String(isJoin));
            e.editRoot.classList.toggle("ps-hidden", !isEdit);
            e.splitRoot.classList.toggle("active", isSplit);
            e.joinRoot.classList.toggle("active", isJoin);
            if (window.__pdfSuiteSyncHeader)
                window.__pdfSuiteSyncHeader();
        };
        e.modeJoin.addEventListener("click", () => activateMode("join"));
        e.modeEdit.addEventListener("click", () => activateMode("edit"));
        e.modeSplit.addEventListener("click", () => activateMode("split"));
        window.__pdfJoinAPI = { reset, hasFiles: () => state.pages.length > 0, getFileCount: pageSourceCount, getPageCount: () => state.pages.length };
        update();
    };
    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init, { once: true });
    else
        init();
})();
