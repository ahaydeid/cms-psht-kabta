<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $organizationProfile['name'] }}</title>
        <style>
            :root {
                --bg: #f8fafc;
                --surface: #ffffff;
                --text: #111827;
                --muted: #4b5563;
                --border: #e5e7eb;
                --brand: #7f1d1d;
                --accent: #d4a017;
            }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                background:
                    radial-gradient(circle at top left, rgba(212, 160, 23, 0.14), transparent 28%),
                    radial-gradient(circle at top right, rgba(127, 29, 29, 0.12), transparent 26%),
                    var(--bg);
                color: var(--text);
            }
            a { color: inherit; text-decoration: none; }
            .shell { max-width: 1120px; margin: 0 auto; padding: 24px; }
            .topbar { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 16px 0 28px; }
            .brand { display: flex; gap: 14px; align-items: center; }
            .mark { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, var(--brand), #3f0f0f); color: #fff; display: grid; place-items: center; font-weight: 800; }
            .brand h1 { margin: 0; font-size: 20px; line-height: 1.1; }
            .brand p { margin: 4px 0 0; color: var(--muted); font-size: 14px; }
            .hero { display: grid; gap: 24px; grid-template-columns: 1.2fr 0.8fr; align-items: stretch; }
            .hero-main, .panel, .card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
            .hero-main { padding: 34px; min-height: 340px; background: linear-gradient(135deg, rgba(127, 29, 29, 0.08), rgba(255,255,255,0.94)); }
            .eyebrow { text-transform: uppercase; letter-spacing: .18em; font-size: 11px; color: var(--brand); font-weight: 800; }
            .hero h2 { margin: 12px 0 14px; font-size: clamp(36px, 5vw, 62px); line-height: .98; }
            .hero p { max-width: 62ch; color: var(--muted); font-size: 16px; line-height: 1.8; }
            .cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
            .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 999px; font-weight: 700; font-size: 14px; border: 1px solid transparent; }
            .btn.primary { background: var(--brand); color: #fff; }
            .btn.secondary { background: #fff; border-color: #d1d5db; color: var(--text); }
            .side { display: grid; gap: 16px; }
            .panel { padding: 22px; }
            .panel h3 { margin: 0 0 8px; font-size: 18px; }
            .panel p { margin: 0; color: var(--muted); line-height: 1.7; font-size: 14px; }
            .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin: 24px 0; }
            .stat { background: rgba(255,255,255,.82); border: 1px solid var(--border); border-radius: 16px; padding: 18px; text-align: center; }
            .stat strong { display: block; font-size: 28px; line-height: 1; margin-bottom: 8px; }
            .stat span { color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
            .section { margin-top: 28px; }
            .section-header { display: flex; justify-content: space-between; gap: 16px; align-items: end; margin-bottom: 16px; }
            .section-header h3 { margin: 0; font-size: 26px; }
            .section-header p { margin: 0; color: var(--muted); max-width: 60ch; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
            .card { padding: 18px; }
            .meta { color: var(--brand); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }
            .card h4 { margin: 10px 0 8px; font-size: 18px; }
            .card p { margin: 0; color: var(--muted); line-height: 1.7; font-size: 14px; }
            .schedule-list { display: grid; gap: 12px; }
            .schedule-item { display: flex; justify-content: space-between; gap: 12px; padding: 16px 18px; border: 1px solid var(--border); border-radius: 14px; background: #fff; }
            .schedule-item strong { display: block; }
            .footer { margin-top: 28px; padding: 20px 0 8px; color: var(--muted); display: flex; justify-content: space-between; gap: 14px; flex-wrap: wrap; font-size: 13px; }
            @media (max-width: 900px) {
                .hero, .grid-3, .stats { grid-template-columns: 1fr; }
                .section-header { flex-direction: column; align-items: start; }
                .topbar { flex-direction: column; align-items: start; }
            }
        </style>
    </head>
    <body>
        <div class="shell">
            <header class="topbar">
                <div class="brand">
                    <div class="mark">PSHT</div>
                    <div>
                        <h1>{{ $organizationProfile['name'] }}</h1>
                        <p>{{ $organizationProfile['address'] }}</p>
                    </div>
                </div>
                <a class="btn secondary" href="/admin/login">Masuk Admin</a>
            </header>

            <section class="hero">
                <div class="hero-main">
                    <div class="eyebrow">{{ $organizationProfile['eyebrow'] }}</div>
                    <h2>{{ $organizationProfile['headline'] }}</h2>
                    <p>{{ $organizationProfile['description'] }}</p>
                    <div class="cta-row">
                        <a class="btn primary" href="#berita">Lihat Berita</a>
                        <a class="btn secondary" href="#kontak">Kontak</a>
                    </div>
                </div>
                <div class="side">
                    <div class="panel">
                        <h3>Profil Singkat</h3>
                        <p>Halaman public ini masih memakai data dummy. Nanti isinya akan diganti dari API backend.</p>
                    </div>
                    <div class="panel">
                        <h3>Kontak</h3>
                        <p>{{ $organizationProfile['email'] }}</p>
                        <p>{{ $organizationProfile['phone'] }}</p>
                    </div>
                </div>
            </section>

            <section class="stats">
                @foreach ($stats as $item)
                    <div class="stat">
                        <strong>{{ $item['value'] }}</strong>
                        <span>{{ $item['label'] }}</span>
                    </div>
                @endforeach
            </section>

            <section class="section" id="berita">
                <div class="section-header">
                    <div>
                        <div class="eyebrow">Berita Dummy</div>
                        <h3>Update Kegiatan Terbaru</h3>
                    </div>
                    <p>Daftar ini masih data contoh agar halaman public tetap bisa dibuka sebelum backend API siap.</p>
                </div>
                <div class="grid-3">
                    @foreach ($news as $article)
                        <article class="card">
                            <div class="meta">{{ $article['category'] }} · {{ $article['date'] }}</div>
                            <h4>{{ $article['title'] }}</h4>
                            <p>{{ $article['excerpt'] }}</p>
                        </article>
                    @endforeach
                </div>
            </section>

            <section class="section">
                <div class="section-header">
                    <div>
                        <div class="eyebrow">Jadwal Latihan</div>
                        <h3>Agenda Mingguan</h3>
                    </div>
                </div>
                <div class="schedule-list">
                    @foreach ($schedules as $schedule)
                        <div class="schedule-item">
                            <div>
                                <strong>{{ $schedule['day'] }}</strong>
                                <div>{{ $schedule['place'] }}</div>
                            </div>
                            <div>{{ $schedule['time'] }}</div>
                        </div>
                    @endforeach
                </div>
            </section>

            <section class="section">
                <div class="section-header">
                    <div>
                        <div class="eyebrow">Galeri Dummy</div>
                        <h3>Dokumentasi Kegiatan</h3>
                    </div>
                </div>
                <div class="grid-3">
                    @foreach ($gallery as $item)
                        <article class="card">
                            <div class="meta">Foto</div>
                            <h4>{{ $item }}</h4>
                            <p>Slot gambar nanti akan diisi dari API galeri backend.</p>
                        </article>
                    @endforeach
                </div>
            </section>

            <section class="section" id="kontak">
                <div class="section-header">
                    <div>
                        <div class="eyebrow">Kontak</div>
                        <h3>Hubungi Organisasi</h3>
                    </div>
                </div>
                <div class="grid-3">
                    <div class="card"><div class="meta">Alamat</div><h4>{{ $organizationProfile['address'] }}</h4></div>
                    <div class="card"><div class="meta">Email</div><h4>{{ $organizationProfile['email'] }}</h4></div>
                    <div class="card"><div class="meta">Telepon</div><h4>{{ $organizationProfile['phone'] }}</h4></div>
                </div>
            </section>

            <footer class="footer">
                <div>PSHT Cabang Kabupaten Tangerang, Banten.</div>
                <div>Dummy public site untuk tahap awal setup.</div>
            </footer>
        </div>
    </body>
</html>
