import { Brief } from '../lib/supabase'

export const exportToPDF = async (briefs: Brief[]) => {
  // Create a simple HTML structure for PDF generation
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>IntelliBrief Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .brief { margin-bottom: 30px; page-break-inside: avoid; }
        .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .section { margin-bottom: 15px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
        .tech-stack { display: flex; flex-wrap: wrap; gap: 5px; }
        .tech-item { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>IntelliBrief Export</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      ${briefs.map(brief => `
        <div class="brief">
          <div class="company-name">${brief.companyName}</div>
          ${brief.website ? `<p><strong>Website:</strong> ${brief.website}</p>` : ''}
          
          <div class="section">
            <div class="section-title">Summary</div>
            <p>${brief.summary}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Pitch Angle</div>
            <p>${brief.pitchAngle}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Subject Line</div>
            <p>"${brief.subjectLine}"</p>
          </div>
          
          ${brief.techStack && brief.techStack.length > 0 ? `
            <div class="section">
              <div class="section-title">Tech Stack</div>
              <div class="tech-stack">
                ${brief.techStack.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="section">
            <div class="section-title">What NOT to Pitch</div>
            <p>${brief.whatNotToPitch}</p>
          </div>
          
          <p><small>Created: ${new Date(brief.createdAt).toLocaleDateString()}</small></p>
        </div>
      `).join('')}
    </body>
    </html>
  `

  // Create a blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `intellibrief-export-${new Date().toISOString().split('T')[0]}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const exportToCSV = (briefs: Brief[]) => {
  const headers = [
    'Company Name',
    'Website',
    'Summary',
    'Pitch Angle',
    'Subject Line',
    'Signal Tag',
    'Tech Stack',
    'Created At'
  ]

  const csvContent = [
    headers.join(','),
    ...briefs.map(brief => [
      `"${brief.companyName}"`,
      `"${brief.website || ''}"`,
      `"${brief.summary.replace(/"/g, '""')}"`,
      `"${brief.pitchAngle.replace(/"/g, '""')}"`,
      `"${brief.subjectLine.replace(/"/g, '""')}"`,
      `"${brief.signalTag}"`,
      `"${brief.techStack?.join('; ') || ''}"`,
      `"${new Date(brief.createdAt).toLocaleDateString()}"`
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `intellibrief-export-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}