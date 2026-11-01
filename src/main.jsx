import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  Wifi,
  ShieldCheck,
  Users,
  Network,
  LogOut,
  RefreshCw,
  Activity,
  CreditCard,
  ScrollText,
  Search,
} from "lucide-react";
import { api } from "./api";
import "./style.css";
const amount = (n) => Number(n || 0).toLocaleString("ar-YE");
function Login({ onLogin }) {
  const [phone, P] = useState(""),
    [password, W] = useState(""),
    [busy, B] = useState(false),
    [error, E] = useState("");
  async function submit(e) {
    e.preventDefault();
    B(true);
    E("");
    try {
      const { data } = await api.post("/auth/login", { phone, password });
      if (data.user.role !== "superadmin")
        throw Error("هذه اللوحة للمدير المركزي فقط");
      sessionStorage.setItem("karty_token", data.token);
      onLogin(data.token);
    } catch (e) {
      E(e.response?.data?.message || e.message);
    } finally {
      B(false);
    }
  }
  return (
    <div className="login">
      <div className="intro">
        <div className="brand">
          <img className="brand-logo" src="/brand/karty-logo.png" alt="كرتي Karty" />
          <b>كرتي</b>
        </div>
        <h1>
          كروتك جاهزة.
          <br />
          وأعمالك تحت السيطرة.
        </h1>
        <p>منظومة إدارة الشبكات ونقاط البيع</p>
        <span className="pill">
          <ShieldCheck size={18} />
          محافظ مستقلة · تدقيق كامل · مخزون مشفر
        </span>
      </div>
      <form onSubmit={submit}>
        <span className="eyebrow">SUPER ADMIN</span>
        <h2>أهلاً بعودتك</h2>
        <p>سجل الدخول إلى الإدارة المركزية</p>
        <label>
          رقم الهاتف
          <input
            required
            inputMode="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => P(e.target.value)}
          />
        </label>
        <label>
          كلمة المرور
          <input
            required
            type="password"
            value={password}
            onChange={(e) => W(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button disabled={busy}>
          {busy ? "جارٍ الاتصال…" : "تسجيل الدخول الآمن"}
        </button>
        <small>حساب المدير ينشأ بسكربت seed. لا كلمة مرور افتراضية.</small>
      </form>
    </div>
  );
}
function App() {
  const [token, T] = useState(sessionStorage.getItem("karty_token")),
    [tab, S] = useState("overview"),
    [data, D] = useState(null),
    [busy, B] = useState(false),
    [error, E] = useState(""),
    [search, Q] = useState("");
  const serial = useRef(0);
  function logout() {
    ++serial.current;
    sessionStorage.removeItem("karty_token");
    T(null);
    D(null);
  }
  useEffect(() => {
    window.addEventListener("session-expired", logout);
    return () => window.removeEventListener("session-expired", logout);
  }, []);
  async function load() {
    const id = ++serial.current;
    B(true);
    E("");
    try {
      const r = await api.get("/admin/" + tab);
      if (id === serial.current) D(r.data);
    } catch (e) {
      if (id === serial.current)
        E(
          e.response?.data?.message ||
            "الاتصال ضعيف أو الخادم يستيقظ — أعد المحاولة",
        );
    } finally {
      if (id === serial.current) B(false);
    }
  }
  useEffect(() => {
    if (token) load();
  }, [token, tab]);
  async function change(path, body) {
    B(true);
    try {
      await api.patch(path, body);
      await load();
    } catch (e) {
      E(e.response?.data?.message || "تعذر الحفظ");
    } finally {
      B(false);
    }
  }
  if (!token) return <Login onLogin={T} />;
  const tabs = [
    ["overview", "نظرة عامة", Activity],
    ["networks", "الشبكات والاشتراكات", Network],
    ["users", "حسابات المنظومة", Users],
    ["audit", "سجل التدقيق", ScrollText],
    ["settings", "إعدادات المنظومة", ShieldCheck],
  ];
  const items = data
    ? tab === "networks"
      ? data.networks
      : tab === "users"
        ? data.users
        : tab === "audit"
          ? data.entries
          : []
    : [];
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <img className="brand-logo small" src="/brand/karty-logo.png" alt="كرتي Karty" />
          <div>
            <b>كرتي</b>
            <small>الإدارة المركزية · V2</small>
          </div>
        </div>
        <small>مساحة الإدارة</small>
        {tabs.map(([key, label, Icon]) => (
          <button
            key={key}
            className={tab === key ? "selected" : ""}
            onClick={() => {
              ++serial.current;
              D(null);
              Q("");
              S(key);
            }}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
        <div className="safe">
          <ShieldCheck />
          <p>
            لا تظهر أسرار الكروت في اللوحة
            <small>عزل شبكات وصلاحيات محددة</small>
          </p>
        </div>
        <button onClick={logout}>
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </aside>
      <main>
        <header>
          <div>
            <span className="eyebrow">KARTY / CONTROL CENTER</span>
            <h1>{tabs.find((t) => t[0] === tab)[1]}</h1>
            <p>متابعة التشغيل والشبكات والحسابات من مكان واحد</p>
          </div>
          <button className="outline" onClick={load} disabled={busy}>
            <RefreshCw size={17} />
            تحديث
          </button>
        </header>
        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}
        {busy && !data ? (
          <div className="skeleton" />
        ) : (
          data && (
            <>
              {tab === "overview" && (
                <>
                  <div className="metrics">
                    {[
                      [Network, "الشبكات", data.networks],
                      [Users, "الحسابات", data.users],
                      [CreditCard, "كروت المخزون", data.cards],
                      [Activity, "الكروت المباعة", data.sold],
                    ].map(([I, t, n]) => (
                      <article key={t}>
                        <I />
                        <p>{t}</p>
                        <strong>{amount(n)}</strong>
                        <small>بيانات الخادم الفعلية</small>
                      </article>
                    ))}
                  </div>
                  <div className="panels">
                    <article className="hero">
                      <span>حجم مبيعات الكروت المتزامنة</span>
                      <h2>
                        {amount(data.total)} <small>ر.ي</small>
                      </h2>
                      <p>لا يشمل العمليات التي ما زالت أوفلاين.</p>
                    </article>
                    <article>
                      <h3>مراقبة عملية الخادم</h3>
                      <p>
                        الذاكرة الحالية: <b>{data.process.memoryMB} MB</b>
                      </p>
                      <p>
                        مدة تشغيل العملية:{" "}
                        <b>{amount(data.process.uptimeSeconds)} ثانية</b>
                      </p>
                      <small>
                        لا تمثل هذه القيم حصة Render أو Cloudinary. تراجع الحصص
                        من لوحات المزودين.
                      </small>
                    </article>
                  </div>
                  <div className="notice">
                    الشبكة الجديدة تحتاج تفعيل المدير، والبقالة تحتاج موافقة
                    المالك قبل الوصول للمخزون.
                  </div>
                </>
              )}
              {tab === "settings" && (
                <section className="table-panel" style={{ padding: 25 }}>
                  <h3>سياسات التشغيل العامة</h3>
                  <p>الأسرار توضع في بيئة الخادم لا في المتصفح.</p>
                  <label>
                    <input
                      type="checkbox"
                      checked={data.settings.registrationOpen}
                      onChange={(e) =>
                        D({
                          ...data,
                          settings: {
                            ...data.settings,
                            registrationOpen: e.target.checked,
                          },
                        })
                      }
                    />
                    السماح بتسجيل حسابات جديدة
                  </label>
                  <p>
                    أقصى حزمة أوفلاين{" "}
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={data.settings.maxOfflineBatch}
                      onChange={(e) =>
                        D({
                          ...data,
                          settings: {
                            ...data.settings,
                            maxOfflineBatch: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </p>
                  <p>
                    هاتف الدعم{" "}
                    <input
                      value={data.settings.supportPhone}
                      onChange={(e) =>
                        D({
                          ...data,
                          settings: {
                            ...data.settings,
                            supportPhone: e.target.value,
                          },
                        })
                      }
                    />
                  </p>
                  <button
                    disabled={busy}
                    onClick={() =>
                      change("/admin/settings", {
                        registrationOpen: data.settings.registrationOpen,
                        maxOfflineBatch: data.settings.maxOfflineBatch,
                        supportPhone: data.settings.supportPhone,
                      })
                    }
                  >
                    حفظ السياسات
                  </button>
                </section>
              )}
              {["networks", "users", "audit"].includes(tab) && (
                <div className="table-panel">
                  <div className="tools">
                    <h3>{tabs.find((t) => t[0] === tab)[1]}</h3>
                    <label>
                      <Search size={16} />
                      <input
                        placeholder="بحث في القائمة المحملة"
                        value={search}
                        onChange={(e) => Q(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          {(tab === "networks"
                            ? [
                                "الشبكة والمالك",
                                "الخطة والانتهاء",
                                "الحالة",
                                "الإجراء",
                              ]
                            : tab === "users"
                              ? ["الاسم والهاتف", "الدور", "الحالة", "الإجراء"]
                              : ["العملية", "المستخدم", "الكيان", "التاريخ"]
                          ).map((t) => (
                            <th key={t}>{t}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {items
                          .filter((x) =>
                            JSON.stringify(x)
                              .toLowerCase()
                              .includes(search.toLowerCase()),
                          )
                          .map((x) => (
                            <tr key={x._id}>
                              {tab === "networks" ? (
                                <>
                                  <td>
                                    <b>{x.name}</b>
                                    <small>
                                      {x.ownerId?.name} · {x.ownerId?.phone}
                                    </small>
                                    <code>{x._id}</code>
                                  </td>
                                  <td>
                                    <select
                                      aria-label="خطة الاشتراك"
                                      value={x.plan}
                                      disabled={busy}
                                      onChange={(e) =>
                                        change("/admin/networks/" + x._id, {
                                          plan: e.target.value,
                                        })
                                      }
                                    >
                                      {["trial", "basic", "pro"].map((t) => (
                                        <option key={t}>{t}</option>
                                      ))}
                                    </select>
                                    <input
                                      aria-label="انتهاء الاشتراك"
                                      type="date"
                                      disabled={busy}
                                      value={
                                        x.subscriptionUntil?.slice(0, 10) || ""
                                      }
                                      onChange={(e) =>
                                        change("/admin/networks/" + x._id, {
                                          subscriptionUntil: e.target.value
                                            ? new Date(
                                                e.target.value + "T23:59:59Z",
                                              ).toISOString()
                                            : null,
                                        })
                                      }
                                    />
                                  </td>
                                  <td>
                                    <span
                                      className={
                                        "badge " + (x.active ? "ok" : "pending")
                                      }
                                    >
                                      {x.active ? "فعالة" : "غير فعالة"}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      disabled={busy}
                                      onClick={() =>
                                        change("/admin/networks/" + x._id, {
                                          active: !x.active,
                                        })
                                      }
                                    >
                                      {x.active ? "تعطيل" : "تفعيل الشبكة"}
                                    </button>
                                  </td>
                                </>
                              ) : tab === "users" ? (
                                <>
                                  <td>
                                    <b>{x.name}</b>
                                    <small dir="ltr">{x.phone}</small>
                                  </td>
                                  <td>
                                    {
                                      {
                                        superadmin: "مدير مركزي",
                                        owner: "صاحب شبكة",
                                        retailer: "بقالة",
                                      }[x.role]
                                    }
                                  </td>
                                  <td>{x.active ? "فعال" : "معطل"}</td>
                                  <td>
                                    <button
                                      disabled={busy || x.role === "superadmin"}
                                      onClick={() =>
                                        change("/admin/users/" + x._id, {
                                          active: !x.active,
                                        })
                                      }
                                    >
                                      {x.active ? "تعطيل" : "تفعيل"}
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{x.action}</td>
                                  <td>
                                    <code>{x.actorId}</code>
                                  </td>
                                  <td>
                                    <code>{x.entity}</code>
                                  </td>
                                  <td>
                                    {new Date(x.createdAt).toLocaleString(
                                      "ar-YE",
                                    )}
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {!items.length && (
                      <div className="empty">
                        <Network size={40} />
                        <h3>لا توجد سجلات بعد</h3>
                        <p>ستظهر البيانات هنا عند بدء استخدام المنظومة.</p>
                      </div>
                    )}
                  </div>
                  <small className="limit">
                    حد العرض: 200 حساب/شبكة أو آخر 100 حدث.
                  </small>
                </div>
              )}
            </>
          )
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
