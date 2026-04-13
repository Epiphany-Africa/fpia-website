import { getTrustBadgeMeta } from '@/lib/certification/getTrustBadgeMeta'
import { getEmbeddableTrustBadgeRecord } from '@/lib/certification/getEmbeddableTrustBadgeRecord'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const record = await getEmbeddableTrustBadgeRecord(id)
  const meta = getTrustBadgeMeta(record.trustState)
  const badgeMarkup = `
    <a
      href="${escapeHtml(record.verificationUrl)}"
      target="_blank"
      rel="noreferrer"
      aria-label="FPIA ${escapeHtml(meta.label)} badge. Opens the official verification record."
      style="
        display:inline-flex;
        flex-direction:column;
        gap:8px;
        width:100%;
        min-width:280px;
        max-width:320px;
        padding:14px 16px;
        border-radius:8px;
        border:1px solid rgba(11,31,51,0.12);
        background-color:#ffffff;
        color:#0B1F33;
        text-decoration:none;
        font-family:'DM Sans', Arial, sans-serif;
        box-sizing:border-box;
      "
    >
      <span style="font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#6C7077;">
        Official FPIA Record
      </span>
      <div style="display:inline-flex;align-items:center;gap:8px;">
        <span
          aria-hidden="true"
          style="width:10px;height:10px;border-radius:999px;flex-shrink:0;background-color:${escapeHtml(
            meta.accentColor
          )};"
        ></span>
        <span style="font-size:14px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:${escapeHtml(
          meta.textColor
        )};">
          ${escapeHtml(meta.label)}
        </span>
      </div>
      <p style="margin:0;font-size:13px;color:#475467;line-height:1.45;">
        ${escapeHtml(meta.descriptor)}
      </p>
      <p style="margin:0;font-size:12px;color:#0B1F33;font-family:'DM Mono', monospace;line-height:1.4;word-break:break-all;">
        ${escapeHtml(record.verificationReference)}
      </p>
      <span style="margin-top:2px;font-size:12px;font-weight:700;color:#0B1F33;text-decoration:underline;">
        Verify record
      </span>
    </a>
  `

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FPIA Verification Badge</title>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: transparent;
      }

      body {
        display: flex;
        align-items: stretch;
        justify-content: stretch;
      }

      .badge-wrap {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div class="badge-wrap">${badgeMarkup}</div>
  </body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
