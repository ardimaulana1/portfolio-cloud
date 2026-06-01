import "./globals.css";

export const metadata = {
  title: "Nama Kamu — Full-Stack Developer",
  description:
    "Portofolio full-stack developer. Dibangun dengan Next.js, dikemas dengan Docker, dan di-deploy ke Google Cloud Run lewat CI/CD.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
