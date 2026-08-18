import type { StoreState } from "./store";
import { getTotalStats, getExamSummary, getSubjectProgress } from "./store";
import { ALL_COURSES } from "./courseData";
import { getWeeklyMinutes, getWeeklyStudyMinutes } from "./store";

export function exportProgressPDF(state: StoreState): void {
  const stats = getTotalStats(state);
  const satSummary = getExamSummary(state, "sat");
  const toeflSummary = getExamSummary(state, "toefl");
  const weeklyMinutes = getWeeklyMinutes();
  const studyMinutes = getWeeklyStudyMinutes(state);
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const now = new Date();

  const subjectProgress = ALL_COURSES.map((c) => {
    const p = getSubjectProgress(state, c.id);
    return { title: c.title, pct: p.pct, correct: p.correct, total: p.total };
  }).filter((s) => s.total > 0);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1e293b; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 18px; margin-top: 32px; margin-bottom: 12px; border-bottom: 2px solid #6366f1; padding-bottom: 4px; }
  h3 { font-size: 14px; margin-top: 16px; margin-bottom: 8px; color: #64748b; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .logo { font-size: 32px; font-weight: 800; color: #6366f1; }
  .date { color: #94a3b8; font-size: 13px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #f8fafc; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-value { font-size: 28px; font-weight: 700; color: #6366f1; }
  .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }
  .chart-bar { display: flex; align-items: flex-end; gap: 8px; height: 120px; margin: 16px 0; }
  .bar { flex: 1; background: linear-gradient(to top, #6366f1, #a78bfa); border-radius: 4px 4px 0 0; min-height: 4px; position: relative; }
  .bar-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #94a3b8; }
  .bar-value { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 600; color: #6366f1; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
  th { background: #f8fafc; font-weight: 600; color: #64748b; font-size: 11px; text-transform: uppercase; }
  .progress-bar { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; width: 100%; }
  .progress-fill { height: 100%; background: linear-gradient(to right, #6366f1, #a78bfa); border-radius: 4px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { padding: 20px; } .no-print { display: none; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">KAIRO</div>
    <p style="color:#64748b;font-size:13px;">Reporte de Progreso Académico</p>
  </div>
  <div class="date">
    Generado: ${now.toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}<br/>
    Estudiante: ${state.user?.name || "Estudiante"}
  </div>
</div>

<h2>Resumen General</h2>
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value">${stats.totalLessons}</div>
    <div class="stat-label">Lecciones completadas</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${stats.avgScore}%</div>
    <div class="stat-label">Nota promedio</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${stats.hours}h</div>
    <div class="stat-label">Horas estudiadas</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${state.streak}</div>
    <div class="stat-label">Días de racha</div>
  </div>
</div>

<h2>Progreso por Materia</h2>
<table>
  <thead><tr><th>Materia</th><th>Progreso</th><th>Aciertos</th><th>Estado</th></tr></thead>
  <tbody>
    ${subjectProgress.map((s) => `
      <tr>
        <td><strong>${s.title}</strong></td>
        <td>
          <div class="progress-bar"><div class="progress-fill" style="width:${s.pct}%"></div></div>
        </td>
        <td>${s.correct}/${s.total}</td>
        <td>
          ${s.pct >= 80 ? '<span class="badge badge-green">Dominado</span>' : s.pct >= 50 ? '<span class="badge badge-yellow">En progreso</span>' : '<span class="badge badge-red">Necesita refuerzo</span>'}
        </td>
      </tr>
    `).join("")}
  </tbody>
</table>

<h2>Actividad Semanal</h2>
<div class="chart-bar">
  ${weeklyMinutes.map((v, i) => `
    <div class="bar" style="height:${Math.max(4, (v / Math.max(...weeklyMinutes, 1)) * 100)}%">
      <span class="bar-value">${v}min</span>
      <span class="bar-label">${days[i]}</span>
    </div>
  `).join("")}
</div>

<h2>Exámenes Internacionales</h2>
<table>
  <thead><tr><th>Examen</th><th>Intentos</th><th>Mejor puntaje</th><th>Promedio</th></tr></thead>
  <tbody>
    <tr>
      <td>SAT</td>
      <td>${satSummary.attempts}</td>
      <td>${satSummary.best > 0 ? satSummary.best : "—"}</td>
      <td>${satSummary.attempts > 0 ? satSummary.avg + "%" : "—"}</td>
    </tr>
    <tr>
      <td>TOEFL</td>
      <td>${toeflSummary.attempts}</td>
      <td>${toeflSummary.best > 0 ? toeflSummary.best : "—"}</td>
      <td>${toeflSummary.attempts > 0 ? toeflSummary.avg + "%" : "—"}</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  KAIRO — Plataforma Educativa — Reporte generado automáticamente
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank", "width=800,height=600");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}