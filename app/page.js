"use client";

import { useState } from "react";

const projects = [
  {
    title: "Cloud Full-Stack Deploy",
    desc: "App Next.js dikemas Docker, di-deploy ke Cloud Run via GitHub Actions dengan autoscaling & monitoring.",
    tags: ["Next.js", "Docker", "Cloud Run", "CI/CD"],
  },
  {
    title: "Realtime Dashboard",
    desc: "Dashboard metrik dengan streaming data dan visualisasi yang ringan serta responsif.",
    tags: ["React", "WebSocket", "Charts"],
  },
  {
    title: "API Gateway Service",
    desc: "Layanan backend dengan rate limiting, structured logging, dan health checks.",
    tags: ["Node.js", "REST", "Observability"],
  },
];

export default function Home() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit() {
    setSending(true);
    setStatus(null);
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({ type: "ok", text: data.message });
        setForm({ name: "", email: "", message: "" });
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus({ type: "err", text: "Periksa kembali isian form." });
      } else {
        setStatus({ type: "err", text: data.error || "Terjadi kesalahan." });
      }
    } catch {
      setStatus({ type: "err", text: "Gagal mengirim. Coba lagi." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="wrap">
      <nav>
        <div className="brand">
          Nama<span>.</span>Kamu
        </div>
        <div className="links">
          <a href="#work">Work</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header className="hero">
        <div className="eyebrow">Full-Stack Developer · DevOps</div>
        <h1>
          Membangun &amp; <em>men-deploy</em>
          <br />
          produk ke cloud.
        </h1>
        <p>
          Saya merancang aplikasi full-stack dan membawanya sampai production —
          lengkap dengan CI/CD, monitoring, dan strategi scaling.
        </p>
        <div className="cta">
          <a className="btn solid" href="#contact">
            Hubungi Saya
          </a>
          <a className="btn ghost" href="#work">
            Lihat Karya
          </a>
        </div>
      </header>

      <section id="work">
        <h2 className="section-title">Selected Work</h2>
        <p className="lead">
          Beberapa proyek yang menggabungkan engineering dan praktik DevOps.
        </p>
        <div className="grid">
          {projects.map((p) => (
            <article className="card" key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="stack">
        <h2 className="section-title">Tech Stack</h2>
        <p className="lead">
          Next.js &amp; React di frontend, Node.js di backend, dikemas dengan
          Docker, dijalankan di Google Cloud Run, dengan pipeline GitHub Actions
          dan observability via Google Cloud Monitoring.
        </p>
        <div className="tags" style={{ marginTop: 20 }}>
          {[
            "Next.js",
            "React",
            "Node.js",
            "Docker",
            "Google Cloud Run",
            "GitHub Actions",
            "Cloud Monitoring",
          ].map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </section>

      <section id="contact">
        <h2 className="section-title">Get In Touch</h2>
        <p className="lead">
          Punya proyek atau peluang? Kirim pesan lewat form di bawah.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div>
            <label htmlFor="name">Nama</label>
            <input
              id="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Nama lengkap"
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="kamu@email.com"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div>
            <label htmlFor="message">Pesan</label>
            <textarea
              id="message"
              value={form.message}
              onChange={update("message")}
              placeholder="Tulis pesanmu di sini..."
            />
            {errors.message && (
              <div className="field-error">{errors.message}</div>
            )}
          </div>

          {status && (
            <div className={`form-status ${status.type}`}>{status.text}</div>
          )}

          <button className="btn solid" type="submit" disabled={sending}>
            {sending ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Nama Kamu. All rights reserved.</span>
        <span>Deployed on Google Cloud Run ☁️</span>
      </footer>
    </div>
  );
}
