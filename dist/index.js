import je, { useState as I, useRef as Z, useMemo as fe, useEffect as de, useCallback as _e } from "react";
const ae = (a, m) => a === 2 ? Oe(m) ? 29 : 28 : [4, 6, 9, 11].includes(a) ? 30 : 31, Oe = (a) => a % 4 === 0 && a % 100 !== 0 || a % 400 === 0, Ye = (a, m, b) => {
  if (a < 100)
    return !1;
  const R = new Date(a, m - 1, b);
  return R.getFullYear() === a && R.getMonth() === m - 1 && R.getDate() === b;
}, Ce = (a, m) => a === null ? "_".repeat(m) : String(a).padStart(m, "0");
function Ne({
  value: a,
  onChange: m,
  format: b = "MM/DD/YYYY"
}) {
  const [R, y] = I(
    a ? a.getMonth() + 1 : null
  ), [S, M] = I(a ? a.getDate() : null), [P, V] = I(
    a ? a.getFullYear() : null
  ), [h, j] = I(0), [k, w] = I(""), A = Z(null), O = Z({
    month: a ? a.getMonth() + 1 : null,
    day: a ? a.getDate() : null,
    year: a ? a.getFullYear() : null
  }), F = Z(""), Y = Z(!1), te = fe(() => {
    var i;
    const n = ((i = b.match(/[^A-Za-z]/)) == null ? void 0 : i[0]) || "/", o = b.split(/[^A-Za-z]/).map((u) => u.startsWith("M") ? "month" : u.startsWith("D") ? "day" : u.startsWith("Y") ? "year" : "month");
    return { separator: n, segmentOrder: o };
  }, [b]), { separator: L, segmentOrder: _ } = te, x = fe(() => {
    const n = [];
    let s = 0;
    return _.forEach((o, i) => {
      const u = o === "year" ? 4 : 2;
      n.push({
        start: s,
        end: s + u
      }), i < _.length - 1 ? s += u + L.length : s += u;
    }), n;
  }, [_, L]), ue = fe(
    () => _.map((n) => n === "year" ? 4 : 2),
    [_]
  );
  de(() => {
    if (Y.current) return;
    Y.current = !0;
    const n = a ? a.getMonth() + 1 : null, s = a ? a.getDate() : null, o = a ? a.getFullYear() : null;
    O.current = {
      month: n,
      day: s,
      year: o
    }, y(n), M(s), V(o), Y.current = !1;
  }, [a]);
  const B = _e(
    (n, s, o) => {
      if (Y.current) return;
      const i = n;
      let u = s;
      const g = o;
      if (i !== null && g !== null && u !== null) {
        const f = ae(i, g);
        u = Math.min(u, f);
      }
      O.current = {
        month: i,
        day: u,
        year: g
      }, y(i), M(u), V(g), i !== null && u !== null && g !== null ? g >= 1e3 && Ye(g, i, u) && (m == null || m(new Date(g, i - 1, u))) : m == null || m(void 0);
    },
    [m]
  ), T = _e(
    (n, s) => {
      if (Y.current) return;
      const {
        month: o,
        day: i,
        year: u
      } = O.current;
      let g = o, f = i, E = u;
      n === "month" ? g = s : n === "day" ? f = s : E = s, B(g, f, E);
    },
    [B]
  ), re = (n) => n === "month" ? R : n === "day" ? S : P, ne = (n) => {
    const s = _[n], o = s === "year" ? 4 : 2;
    return h === n && k !== "" ? k.padEnd(o, "_") : Ce(re(s), o);
  }, q = _.map((n, s) => ne(s)).join(L);
  de(() => {
    if (A.current) {
      const n = x[h];
      k !== "" ? A.current.setSelectionRange(
        n.start,
        n.start + k.length
      ) : A.current.setSelectionRange(n.start, n.end);
    }
  }, [h, q, k, x]);
  const J = (n) => {
    if (A.current) {
      const s = A.current.selectionStart;
      if (s !== null)
        for (let o = 0; o < x.length; o++) {
          const { start: i, end: u } = x[o];
          if (s >= i && s <= u) {
            n.preventDefault(), h === o || (j(o), w("")), A.current.setSelectionRange(i, u);
            break;
          }
        }
    }
  }, C = Z(!1), G = (n) => {
    const s = n.key;
    if (s === "Tab") {
      if (C.current = !0, n.shiftKey && h > 0) {
        n.preventDefault(), w(""), j((o) => o - 1);
        return;
      } else if (!n.shiftKey && h < x.length - 1) {
        n.preventDefault(), w(""), j((o) => o + 1);
        return;
      }
      w("");
      return;
    }
    if (s === "ArrowLeft") {
      n.preventDefault(), w(""), j((o) => o > 0 ? o - 1 : 0);
      return;
    }
    if (s === "ArrowRight") {
      n.preventDefault(), w(""), j(
        (o) => o < x.length - 1 ? o + 1 : x.length - 1
      );
      return;
    }
    if (s === "ArrowUp" || s === "ArrowDown") {
      n.preventDefault(), w("");
      const {
        month: o,
        day: i,
        year: u
      } = O.current, g = _[h];
      if (g === "month") {
        const f = o ?? 0, E = s === "ArrowUp" ? Math.min(f + 1, 12) : Math.max(f - 1, 1);
        E !== f && T("month", E);
      } else if (g === "day") {
        const f = i ?? 0, E = o !== null && u !== null ? ae(o, u) : 31, W = s === "ArrowUp" ? Math.min(f + 1, E) : Math.max(f - 1, 1);
        W !== f && T("day", W);
      } else if (g === "year") {
        const f = u ?? 0, E = s === "ArrowUp" ? Math.min(f + 1, 9999) : Math.max(f - 1, 1e3);
        E !== f && T("year", E);
      }
      return;
    }
    if (/^\d$/.test(s)) {
      n.preventDefault();
      const o = _[h], i = ue[h], u = k + s;
      if (u.length <= i) {
        w(u);
        const g = parseInt(u, 10), { month: f, year: E } = O.current;
        if (o === "month")
          T("month", Math.min(g, 12));
        else if (o === "day") {
          const W = f !== null && E !== null ? ae(f, E) : 31;
          T("day", Math.min(g, W));
        } else o === "year" && (u.length < 4 ? (F.current = u, T("year", g)) : (F.current = "", T("year", Math.min(Math.max(g, 1e3), 9999))));
        u.length === i && (w(""), h < x.length - 1 && j(h + 1));
      }
      return;
    }
  }, H = (n) => {
    n.preventDefault();
  }, K = () => {
    if (C.current) {
      C.current = !1, j(0), w("");
      const { start: n, end: s } = x[0];
      setTimeout(() => {
        var o;
        (o = A.current) == null || o.setSelectionRange(n, s);
      }, 0);
    }
  };
  return de(() => {
    const n = (s) => {
      s.key === "Tab" && (C.current = !0, setTimeout(() => {
        C.current = !1;
      }, 100));
    };
    return document.addEventListener("keydown", n), () => {
      document.removeEventListener("keydown", n);
    };
  }, []), {
    inputProps: {
      ref: A,
      type: "text",
      value: q,
      onChange: H,
      onKeyDown: G,
      onMouseUp: J,
      onBlur: () => {
        if (k) {
          const n = _[h], s = parseInt(k, 10);
          if (n === "month")
            T("month", Math.min(s, 12));
          else if (n === "day") {
            const { month: o, year: i } = O.current, u = o !== null && i !== null ? ae(o, i) : 31;
            T("day", Math.min(s, u));
          } else n === "year" && T("year", s);
          w("");
        }
      },
      onFocus: K
    }
  };
}
var se = { exports: {} }, Q = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Se;
function De() {
  if (Se) return Q;
  Se = 1;
  var a = Symbol.for("react.transitional.element"), m = Symbol.for("react.fragment");
  function b(R, y, S) {
    var M = null;
    if (S !== void 0 && (M = "" + S), y.key !== void 0 && (M = "" + y.key), "key" in y) {
      S = {};
      for (var P in y)
        P !== "key" && (S[P] = y[P]);
    } else S = y;
    return y = S.ref, {
      $$typeof: a,
      type: R,
      key: M,
      ref: y !== void 0 ? y : null,
      props: S
    };
  }
  return Q.Fragment = m, Q.jsx = b, Q.jsxs = b, Q;
}
var ee = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Me;
function Pe() {
  return Me || (Me = 1, process.env.NODE_ENV !== "production" && function() {
    function a(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === s ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case B:
          return "Fragment";
        case ue:
          return "Portal";
        case re:
          return "Profiler";
        case T:
          return "StrictMode";
        case C:
          return "Suspense";
        case G:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case q:
            return (e.displayName || "Context") + ".Provider";
          case ne:
            return (e._context.displayName || "Context") + ".Consumer";
          case J:
            var t = e.render;
            return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case H:
            return t = e.displayName || null, t !== null ? t : a(e.type) || "Memo";
          case K:
            t = e._payload, e = e._init;
            try {
              return a(e(t));
            } catch {
            }
        }
      return null;
    }
    function m(e) {
      return "" + e;
    }
    function b(e) {
      try {
        m(e);
        var t = !1;
      } catch {
        t = !0;
      }
      if (t) {
        t = console;
        var r = t.error, c = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return r.call(
          t,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          c
        ), m(e);
      }
    }
    function R() {
    }
    function y() {
      if (E === 0) {
        W = console.log, ge = console.info, Ee = console.warn, ye = console.error, he = console.group, ve = console.groupCollapsed, pe = console.groupEnd;
        var e = {
          configurable: !0,
          enumerable: !0,
          value: R,
          writable: !0
        };
        Object.defineProperties(console, {
          info: e,
          log: e,
          warn: e,
          error: e,
          group: e,
          groupCollapsed: e,
          groupEnd: e
        });
      }
      E++;
    }
    function S() {
      if (E--, E === 0) {
        var e = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: u({}, e, { value: W }),
          info: u({}, e, { value: ge }),
          warn: u({}, e, { value: Ee }),
          error: u({}, e, { value: ye }),
          group: u({}, e, { value: he }),
          groupCollapsed: u({}, e, { value: ve }),
          groupEnd: u({}, e, { value: pe })
        });
      }
      0 > E && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function M(e) {
      if (le === void 0)
        try {
          throw Error();
        } catch (r) {
          var t = r.stack.trim().match(/\n( *(at )?)/);
          le = t && t[1] || "", be = -1 < r.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < r.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + le + e + be;
    }
    function P(e, t) {
      if (!e || ce) return "";
      var r = ie.get(e);
      if (r !== void 0) return r;
      ce = !0, r = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var c = null;
      c = o.H, o.H = null, y();
      try {
        var v = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var U = function() {
                  throw Error();
                };
                if (Object.defineProperty(U.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(U, []);
                  } catch (D) {
                    var oe = D;
                  }
                  Reflect.construct(e, [], U);
                } else {
                  try {
                    U.call();
                  } catch (D) {
                    oe = D;
                  }
                  e.call(U.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (D) {
                  oe = D;
                }
                (U = e()) && typeof U.catch == "function" && U.catch(function() {
                });
              }
            } catch (D) {
              if (D && oe && typeof D.stack == "string")
                return [D.stack, oe.stack];
            }
            return [null, null];
          }
        };
        v.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var d = Object.getOwnPropertyDescriptor(
          v.DetermineComponentFrameRoot,
          "name"
        );
        d && d.configurable && Object.defineProperty(
          v.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var l = v.DetermineComponentFrameRoot(), N = l[0], z = l[1];
        if (N && z) {
          var p = N.split(`
`), $ = z.split(`
`);
          for (l = d = 0; d < p.length && !p[d].includes(
            "DetermineComponentFrameRoot"
          ); )
            d++;
          for (; l < $.length && !$[l].includes(
            "DetermineComponentFrameRoot"
          ); )
            l++;
          if (d === p.length || l === $.length)
            for (d = p.length - 1, l = $.length - 1; 1 <= d && 0 <= l && p[d] !== $[l]; )
              l--;
          for (; 1 <= d && 0 <= l; d--, l--)
            if (p[d] !== $[l]) {
              if (d !== 1 || l !== 1)
                do
                  if (d--, l--, 0 > l || p[d] !== $[l]) {
                    var X = `
` + p[d].replace(
                      " at new ",
                      " at "
                    );
                    return e.displayName && X.includes("<anonymous>") && (X = X.replace("<anonymous>", e.displayName)), typeof e == "function" && ie.set(e, X), X;
                  }
                while (1 <= d && 0 <= l);
              break;
            }
        }
      } finally {
        ce = !1, o.H = c, S(), Error.prepareStackTrace = r;
      }
      return p = (p = e ? e.displayName || e.name : "") ? M(p) : "", typeof e == "function" && ie.set(e, p), p;
    }
    function V(e) {
      if (e == null) return "";
      if (typeof e == "function") {
        var t = e.prototype;
        return P(
          e,
          !(!t || !t.isReactComponent)
        );
      }
      if (typeof e == "string") return M(e);
      switch (e) {
        case C:
          return M("Suspense");
        case G:
          return M("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case J:
            return e = P(e.render, !1), e;
          case H:
            return V(e.type);
          case K:
            t = e._payload, e = e._init;
            try {
              return V(e(t));
            } catch {
            }
        }
      return "";
    }
    function h() {
      var e = o.A;
      return e === null ? null : e.getOwner();
    }
    function j(e) {
      if (i.call(e, "key")) {
        var t = Object.getOwnPropertyDescriptor(e, "key").get;
        if (t && t.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function k(e, t) {
      function r() {
        we || (we = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          t
        ));
      }
      r.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: r,
        configurable: !0
      });
    }
    function w() {
      var e = a(this.type);
      return xe[e] || (xe[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function A(e, t, r, c, v, d) {
      return r = d.ref, e = {
        $$typeof: x,
        type: e,
        key: t,
        props: d,
        _owner: v
      }, (r !== void 0 ? r : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: w
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function O(e, t, r, c, v, d) {
      if (typeof e == "string" || typeof e == "function" || e === B || e === re || e === T || e === C || e === G || e === me || typeof e == "object" && e !== null && (e.$$typeof === K || e.$$typeof === H || e.$$typeof === q || e.$$typeof === ne || e.$$typeof === J || e.$$typeof === g || e.getModuleId !== void 0)) {
        var l = t.children;
        if (l !== void 0)
          if (c)
            if (f(l)) {
              for (c = 0; c < l.length; c++)
                F(l[c], e);
              Object.freeze && Object.freeze(l);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else F(l, e);
      } else
        l = "", (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (l += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? c = "null" : f(e) ? c = "array" : e !== void 0 && e.$$typeof === x ? (c = "<" + (a(e.type) || "Unknown") + " />", l = " Did you accidentally export a JSX literal instead of a component?") : c = typeof e, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          c,
          l
        );
      if (i.call(t, "key")) {
        l = a(e);
        var N = Object.keys(t).filter(function(p) {
          return p !== "key";
        });
        c = 0 < N.length ? "{key: someKey, " + N.join(": ..., ") + ": ...}" : "{key: someKey}", Te[l + c] || (N = 0 < N.length ? "{" + N.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          c,
          l,
          N,
          l
        ), Te[l + c] = !0);
      }
      if (l = null, r !== void 0 && (b(r), l = "" + r), j(t) && (b(t.key), l = "" + t.key), "key" in t) {
        r = {};
        for (var z in t)
          z !== "key" && (r[z] = t[z]);
      } else r = t;
      return l && k(
        r,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), A(e, l, d, v, h(), r);
    }
    function F(e, t) {
      if (typeof e == "object" && e && e.$$typeof !== ke) {
        if (f(e))
          for (var r = 0; r < e.length; r++) {
            var c = e[r];
            Y(c) && te(c, t);
          }
        else if (Y(e))
          e._store && (e._store.validated = 1);
        else if (e === null || typeof e != "object" ? r = null : (r = n && e[n] || e["@@iterator"], r = typeof r == "function" ? r : null), typeof r == "function" && r !== e.entries && (r = r.call(e), r !== e))
          for (; !(e = r.next()).done; )
            Y(e.value) && te(e.value, t);
      }
    }
    function Y(e) {
      return typeof e == "object" && e !== null && e.$$typeof === x;
    }
    function te(e, t) {
      if (e._store && !e._store.validated && e.key == null && (e._store.validated = 1, t = L(t), !Re[t])) {
        Re[t] = !0;
        var r = "";
        e && e._owner != null && e._owner !== h() && (r = null, typeof e._owner.tag == "number" ? r = a(e._owner.type) : typeof e._owner.name == "string" && (r = e._owner.name), r = " It was passed a child from " + r + ".");
        var c = o.getCurrentStack;
        o.getCurrentStack = function() {
          var v = V(e.type);
          return c && (v += c() || ""), v;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          t,
          r
        ), o.getCurrentStack = c;
      }
    }
    function L(e) {
      var t = "", r = h();
      return r && (r = a(r.type)) && (t = `

Check the render method of \`` + r + "`."), t || (e = a(e)) && (t = `

Check the top-level render call using <` + e + ">."), t;
    }
    var _ = je, x = Symbol.for("react.transitional.element"), ue = Symbol.for("react.portal"), B = Symbol.for("react.fragment"), T = Symbol.for("react.strict_mode"), re = Symbol.for("react.profiler"), ne = Symbol.for("react.consumer"), q = Symbol.for("react.context"), J = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), G = Symbol.for("react.suspense_list"), H = Symbol.for("react.memo"), K = Symbol.for("react.lazy"), me = Symbol.for("react.offscreen"), n = Symbol.iterator, s = Symbol.for("react.client.reference"), o = _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, i = Object.prototype.hasOwnProperty, u = Object.assign, g = Symbol.for("react.client.reference"), f = Array.isArray, E = 0, W, ge, Ee, ye, he, ve, pe;
    R.__reactDisabledLog = !0;
    var le, be, ce = !1, ie = new (typeof WeakMap == "function" ? WeakMap : Map)(), ke = Symbol.for("react.client.reference"), we, xe = {}, Te = {}, Re = {};
    ee.Fragment = B, ee.jsx = function(e, t, r, c, v) {
      return O(e, t, r, !1, c, v);
    }, ee.jsxs = function(e, t, r, c, v) {
      return O(e, t, r, !0, c, v);
    };
  }()), ee;
}
var Ae;
function Ue() {
  return Ae || (Ae = 1, process.env.NODE_ENV === "production" ? se.exports = De() : se.exports = Pe()), se.exports;
}
var We = Ue();
function Ve({
  value: a,
  onChange: m,
  className: b,
  ...R
}) {
  const { inputProps: y } = Ne({
    value: a,
    onChange: m
  });
  return /* @__PURE__ */ We.jsx("input", { className: b, ...y, ...R });
}
export {
  Ve as TypedDateInput,
  Ne as useTypedDate
};
