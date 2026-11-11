import type { PremiumCourse } from "@/data/premiumCourses";
import { getSubjectMeta } from "@/data/premiumCourses";

export interface PremiumCertificateData {
  course: PremiumCourse;
  studentName: string;
  completedAt: string; // ISO
}

/** Genera el certificado premium en una ventana imprimible (Guardar como PDF). */
export function exportPremiumCertificate(course: PremiumCourse, studentName: string): void {
  const meta = getSubjectMeta(course.subject);
  const name = studentName.trim() || "Estudiante";
  const date = new Date().toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const courseId = course.id.toUpperCase().replace(/[^A-Z0-9]+/g, "-");
  const certId = `KAIRO-IB-${courseId}-${Date.now().toString(36).toUpperCase()}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Certificado — ${course.title}</title>
<style>
  @page { size: landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #fff; color: #1c1917; }
  .cert { width: 100vw; min-height: 100vh; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #ffedd5 100%); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .frame { width: 100%; max-width: 960px; border: 3px solid #d97706; outline: 1px solid #f59e0b; outline-offset: 6px; padding: 48px 56px; text-align: center; position: relative; }
  .brand { font-family: system-ui, sans-serif; font-size: 28px; font-weight: 800; color: #b45309; letter-spacing: 6px; }
  .sub { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: 3px; color: #92400e; text-transform: uppercase; margin-top: 4px; }
  .title { font-size: 40px; color: #78350f; margin: 28px 0 8px; }
  .rule { width: 120px; height: 2px; background: linear-gradient(90deg, #f59e0b, #d97706); margin: 16px auto; }
  .body-text { font-size: 16px; color: #57534e; line-height: 1.8; }
  .student { font-size: 34px; color: #1c1917; margin: 20px 0 8px; font-weight: bold; }
  .course-name { font-size: 22px; color: #92400e; font-style: italic; }
  .meta { font-family: system-ui, sans-serif; font-size: 12px; color: #78716c; margin-top: 24px; }
  .badges { display: flex; justify-content: center; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
  .badge { font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 6px 16px; border-radius: 999px; }
  .badge-gold { background: linear-gradient(90deg, #f59e0b, #d97706); color: #fffbeb; }
  .badge-outline { border: 1px solid #d97706; color: #92400e; }
  .sign { font-family: system-ui, sans-serif; margin-top: 36px; font-size: 12px; color: #78716c; }
  .cert-id { font-family: monospace; font-size: 10px; color: #a8a29e; margin-top: 8px; }
  @media print { .cert { padding: 0; } }
</style>
</head>
<body>
<div class="cert">
  <div class="frame">
    <div class="brand">KAIRO</div>
    <div class="sub">Plataforma Educativa · Programa del Diploma IB</div>
    <h1 class="title">Certificado de Finalización</h1>
    <div class="rule"></div>
    <p class="body-text">Se certifica que</p>
    <p class="student">${escapeHtml(name)}</p>
    <p class="body-text">ha completado satisfactoriamente el curso premium</p>
    <p class="course-name">"${escapeHtml(course.title)}"</p>
    <p class="body-text">${meta.label} · Nivel ${course.level} · ${course.durationMin} minutos de estudio</p>
    <div class="badges">
      <span class="badge badge-gold">★ PREMIUM IB</span>
      <span class="badge badge-outline">${meta.label.toUpperCase()}</span>
      <span class="badge badge-outline">${course.level}</span>
    </div>
    <p class="meta">Fecha de emisión: ${date}</p>
    <p class="sign">Generado con IA · KAIRO Premium — Escuela de la era digital</p>
    <p class="cert-id">${certId}</p>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank", "width=1000,height=700");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
