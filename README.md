# portfolio-cloud

Portfolio site sederhana yang saya pakai buat belajar deploy ke Google Cloud Run. App-nya Next.js (halaman portfolio + form kontak), di-deploy otomatis tiap push ke main lewat GitHub Actions.

Live: https://portfolio-cloud-i4ctcspxza-et.a.run.app

## Stack

- Next.js 14 (App Router) + React
- Dua API route: `/api/health` buat health check, `/api/contact` buat form
- Docker (multi-stage, jalan sebagai user non-root)
- Cloud Run di region Jakarta (`asia-southeast2`)
- GitHub Actions buat CI/CD

## Jalanin di lokal

Butuh Node 20+.

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Test:
```bash
npm test
```

Mau coba lewat Docker:
```bash
docker build -t portfolio-cloud .
docker run -p 8080:8080 portfolio-cloud
```

## Struktur

```
app/
  layout.js, page.js, globals.css
  api/health/route.js
  api/contact/route.js
lib/
  validate.js   # validasi form (di-test)
  logger.js     # structured JSON log
test/
  validate.test.js
.github/workflows/deploy.yml
monitoring/dashboard.json
Dockerfile
service.yaml
```

## CI/CD

File: `.github/workflows/deploy.yml`. Tiap push ke `main`:

1. Job `build-test` — install deps, jalanin unit test, build Next.
2. Job `deploy` — auth ke GCP pakai service account key dari GitHub Secrets, lalu `gcloud run deploy --source .` (Cloud Build yang build Dockerfile-nya).

Pull request cuma jalanin test, nggak deploy.

## Setup GCP (sekali aja)

Yang dibutuhin di project GCP:

1. Enable API: `run`, `cloudbuild`, `artifactregistry`, `monitoring`, `logging`.
2. Bikin service account `github-deployer`, kasih role:
   - `roles/run.admin`
   - `roles/cloudbuild.builds.editor`
   - `roles/artifactregistry.admin`
   - `roles/iam.serviceAccountUser`
   - `roles/storage.admin`
3. Generate key JSON-nya.
4. Tambahin 2 GitHub Secrets di repo:
   - `GCP_PROJECT_ID` — ID project GCP
   - `GCP_SA_KEY` — isi file key JSON

Setelah itu tinggal push ke main, deploy jalan sendiri.

## Scaling

Cloud Run autoscaling. Flag yang dipakai di workflow:
- `--min-instances 0` (scale-to-zero pas idle, hemat)
- `--max-instances 10`
- `--concurrency 80` (request bareng per instance sebelum scale out)

Mau ubah tanpa redeploy penuh:
```bash
gcloud run services update portfolio-cloud --region=asia-southeast2 --max-instances=20
```

`service.yaml` juga ada kalau mau pakai pendekatan declarative.

## Monitoring

Logging: app nulis JSON ke stdout (`lib/logger.js`), Cloud Run otomatis kirim ke Cloud Logging. Field `severity` di-parse jadi log level beneran.

Liat log:
```bash
gcloud run services logs read portfolio-cloud --region=asia-southeast2 --limit=50
```

Dashboard custom ada di `monitoring/dashboard.json`. Import:
```bash
gcloud monitoring dashboards create --config-from-file=monitoring/dashboard.json
```

Sebenernya Cloud Run udah ngasih dashboard bawaan yang udah cukup oke ("Cloud Run Monitoring" di Cloud Monitoring console).

## Catatan keamanan

- Secret GCP disimpen di GitHub Secrets, bukan di kode.
- Container jalan sebagai user non-root (uid 1001) — liat Dockerfile.
- Service account-nya least-privilege, cuma role yang dibutuhin buat deploy.
- `poweredByHeader: false` di `next.config.mjs`.

## Endpoints

| Path | Method | Buat apa |
|---|---|---|
| `/` | GET | Halaman portfolio |
| `/api/health` | GET | Health check, return JSON `{status, uptime_seconds, timestamp}` |
| `/api/contact` | POST | Terima `{name, email, message}`, validasi, log |

## TODO

- [ ] Custom domain
- [ ] Workload Identity Federation (gantiin service account key, biar lebih aman)
- [ ] Uptime check + alerting policy ke email
