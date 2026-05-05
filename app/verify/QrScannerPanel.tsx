'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { useRouter } from 'next/navigation'
import {
  resolveScannedVerificationTarget,
  type ScanFailureReason,
  type ScanResolution,
} from './resolveScannedVerificationTarget'

type ScannerStatus =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'blocked'
  | 'unavailable'
  | 'unsupported'
  | 'invalid'
  | 'warning'
  | 'error'

const supportedMessageByReason: Record<ScanFailureReason, string> = {
  empty: 'No QR content was detected.',
  'invalid-qr': 'The image does not contain a readable QR code.',
  'invalid-security-data':
    'The QR code security data failed validation and was not opened.',
  'external-url':
    'This QR code points outside the official FPIA public verification domain, so it was not opened.',
  'unsupported-url':
    'This QR code uses an FPIA web address, but not a recognised public verification path.',
  'unsupported-content':
    'This QR code does not contain a recognised FPIA certificate link or certificate identifier.',
}

export default function QrScannerPanel() {
  const router = useRouter()
  const fileInputId = useId()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRequestRef = useRef<number | null>(null)
  const scanningRef = useRef(false)
  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [statusMessage, setStatusMessage] = useState(
    'Use your phone camera to scan the official FPIA certificate QR code.'
  )
  const [statusTone, setStatusTone] = useState<'neutral' | 'danger' | 'warning'>('neutral')
  const [uploadBusy, setUploadBusy] = useState(false)

  const isLive = status === 'starting' || status === 'scanning'

  const verifyQRCode = useCallback((qrData: string) => {
    const resolution = resolveScannedVerificationTarget(qrData)

    if (!resolution.ok && resolution.reason === 'invalid-security-data') {
      throw new Error('Invalid QR Code detected.')
    }

    return resolution
  }, [])

  const statusBadge = useMemo(() => {
    if (status === 'scanning') return 'Live camera'
    if (status === 'starting') return 'Requesting permission'
    if (status === 'blocked') return 'Camera blocked'
    if (status === 'unavailable') return 'No camera found'
    if (status === 'unsupported') return 'Camera unsupported'
    if (status === 'invalid') return 'Invalid QR'
    if (status === 'warning') return 'QR not recognised'
    if (status === 'error') return 'Scanner error'
    return 'Ready to scan'
  }, [status])

  const stopScanner = useCallback(() => {
    scanningRef.current = false

    if (frameRequestRef.current !== null) {
      window.cancelAnimationFrame(frameRequestRef.current)
      frameRequestRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const handleResolvedTarget = useCallback(
    (resolution: ScanResolution) => {
      if (!resolution.ok) {
        setStatus(resolution.reason === 'invalid-qr' ? 'invalid' : 'warning')
        setStatusTone(resolution.reason === 'invalid-qr' ? 'danger' : 'warning')
        setStatusMessage(supportedMessageByReason[resolution.reason])
        return
      }

      stopScanner()
      setStatus('scanning')
      setStatusTone('neutral')
      setStatusMessage(`FPIA certificate detected. Opening verification record ${resolution.certificateId}.`)
      router.push(resolution.href)
    },
    [router, stopScanner]
  )

  const scanFrame = useCallback(() => {
    if (!scanningRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      frameRequestRef.current = window.requestAnimationFrame(scanFrame)
      return
    }

    const width = video.videoWidth
    const height = video.videoHeight

    if (!width || !height) {
      frameRequestRef.current = window.requestAnimationFrame(scanFrame)
      return
    }

    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) {
      setStatus('error')
      setStatusTone('danger')
      setStatusMessage('The browser camera opened, but the scanner could not read video frames.')
      stopScanner()
      return
    }

    context.drawImage(video, 0, 0, width, height)
    const imageData = context.getImageData(0, 0, width, height)
    const qr = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    })

    if (qr?.data) {
      try {
        handleResolvedTarget(verifyQRCode(qr.data))
      } catch {
        setStatus('invalid')
        setStatusTone('danger')
        setStatusMessage('Invalid QR Code detected.')
      }
      return
    }

    frameRequestRef.current = window.requestAnimationFrame(scanFrame)
  }, [handleResolvedTarget, stopScanner, verifyQRCode])

  const startScanner = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      setStatusTone('warning')
      setStatusMessage(
        'This browser does not support in-page camera scanning. You can still enter the certificate number manually or upload a QR image.'
      )
      return
    }

    setStatus('starting')
    setStatusTone('neutral')
    setStatusMessage('Requesting camera access. Point your phone at the FPIA QR code once access is granted.')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
        },
        audio: false,
      })

      const videoTrack = stream.getVideoTracks()[0]
      if (!videoTrack) {
        stream.getTracks().forEach((track) => track.stop())
        setStatus('unavailable')
        setStatusTone('warning')
        setStatusMessage('No usable camera was found on this device.')
        return
      }

      streamRef.current = stream

      if (!videoRef.current) {
        setStatus('error')
        setStatusTone('danger')
        setStatusMessage('The scanner could not initialise the camera preview.')
        stopScanner()
        return
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()

      scanningRef.current = true
      setStatus('scanning')
      setStatusTone('neutral')
      setStatusMessage('Camera is live. Hold the FPIA QR code inside the frame.')
      frameRequestRef.current = window.requestAnimationFrame(scanFrame)
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'Camera access was blocked. Allow camera access in your browser settings, or use manual entry or image upload below.'
          : error instanceof DOMException && (error.name === 'NotFoundError' || error.name === 'OverconstrainedError')
            ? 'No camera is available on this device. You can still verify by entering the certificate number or uploading a QR image.'
            : 'The camera could not be started. You can still continue with manual entry or QR image upload.'

      setStatus(
        error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'blocked'
          : error instanceof DOMException && (error.name === 'NotFoundError' || error.name === 'OverconstrainedError')
            ? 'unavailable'
            : 'error'
      )
      setStatusTone(
        error instanceof DOMException && error.name === 'NotAllowedError' ? 'warning' : 'danger'
      )
      setStatusMessage(message)
      stopScanner()
    }
  }, [scanFrame, stopScanner])

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''

      if (!file) return

      stopScanner()
      setUploadBusy(true)
      setStatusTone('neutral')
      setStatusMessage('Reading QR image…')

      try {
        const image = await loadImageFromFile(file)
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d', { willReadFrequently: true })

        if (!context) {
          setStatus('error')
          setStatusTone('danger')
          setStatusMessage('The uploaded image could not be analysed.')
          return
        }

        context.drawImage(image, 0, 0)
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const qr = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        })

        if (!qr?.data) {
          handleResolvedTarget({ ok: false, reason: 'invalid-qr' })
          return
        }

        try {
          handleResolvedTarget(verifyQRCode(qr.data))
        } catch {
          setStatus('invalid')
          setStatusTone('danger')
          setStatusMessage('Invalid QR Code detected.')
        }
      } catch {
        setStatus('error')
        setStatusTone('danger')
        setStatusMessage('The QR image could not be processed. Please try another image or enter the certificate number manually.')
      } finally {
        setUploadBusy(false)
      }
    },
    [handleResolvedTarget, stopScanner, verifyQRCode]
  )

  useEffect(() => stopScanner, [stopScanner])

  return (
    <div
      style={{
        border: '2px dashed rgba(201,161,77,0.4)',
        backgroundColor: 'var(--off-white)',
        padding: '22px',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <p
            style={{
              margin: '0 0 6px 0',
              color: 'var(--navy)',
              fontSize: '18px',
              fontFamily: "'DM Serif Display', serif",
            }}
          >
            Scan an FPIA certificate
          </p>
          <p style={{ margin: 0, color: '#6C7077', fontSize: '13px', lineHeight: 1.6 }}>
            Use your browser camera to open the matching FPIA verification record directly.
          </p>
        </div>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '30px',
            padding: '0 10px',
            borderRadius: '999px',
            border: '1px solid rgba(201,161,77,0.28)',
            backgroundColor: '#ffffff',
            color: 'var(--navy)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {statusBadge}
        </span>
      </div>

      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '264px',
          border: '1px solid rgba(11,31,51,0.12)',
          background:
            isLive
              ? 'linear-gradient(180deg, rgba(11,31,51,0.78) 0%, rgba(11,31,51,0.52) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(247,243,235,1) 100%)',
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            display: isLive ? 'block' : 'none',
            width: '100%',
            height: '100%',
            minHeight: '264px',
            objectFit: 'cover',
          }}
        />

        {!isLive ? (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              minHeight: '264px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="24" height="24" rx="2" stroke="#C9A14D" strokeWidth="2" />
                <rect x="10" y="10" width="12" height="12" fill="#C9A14D" />
                <rect x="36" y="4" width="24" height="24" rx="2" stroke="#C9A14D" strokeWidth="2" />
                <rect x="42" y="10" width="12" height="12" fill="#C9A14D" />
                <rect x="4" y="36" width="24" height="24" rx="2" stroke="#C9A14D" strokeWidth="2" />
                <rect x="10" y="42" width="12" height="12" fill="#C9A14D" />
                <rect x="36" y="36" width="4" height="4" fill="#C9A14D" />
                <rect x="44" y="36" width="4" height="4" fill="#C9A14D" />
                <rect x="52" y="36" width="8" height="4" fill="#C9A14D" />
                <rect x="36" y="44" width="8" height="4" fill="#C9A14D" />
                <rect x="48" y="44" width="4" height="4" fill="#C9A14D" />
                <rect x="36" y="52" width="4" height="8" fill="#C9A14D" />
                <rect x="44" y="52" width="8" height="4" fill="#C9A14D" />
                <rect x="56" y="50" width="4" height="10" fill="#C9A14D" />
              </svg>
              <p style={{ color: '#6C7077', fontSize: '13px', textAlign: 'center', lineHeight: 1.6, margin: '16px 0 0 0' }}>
                Point your phone camera at the QR code on the property show board or certificate.
              </p>
            </div>
          </div>
        ) : (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: 'min(72vw, 240px)',
                height: 'min(72vw, 240px)',
                border: '2px solid rgba(201,161,77,0.92)',
                boxShadow: '0 0 0 999px rgba(11,31,51,0.22)',
              }}
            />
          </div>
        )}
      </div>

      <p
        style={{
          margin: '14px 0 0 0',
          fontSize: '13px',
          lineHeight: 1.65,
          color:
            statusTone === 'danger' ? '#B42318' : statusTone === 'warning' ? '#9A6700' : '#44505d',
        }}
      >
        {statusMessage}
      </p>

      <div className="fpia-qr-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '18px' }}>
        <button
          type="button"
          onClick={isLive ? stopScanner : startScanner}
          style={{
            ...actionStyle,
            backgroundColor: isLive ? '#ffffff' : 'var(--gold)',
            color: isLive ? 'var(--navy)' : 'var(--navy)',
            border: isLive ? '1px solid rgba(11,31,51,0.14)' : 'none',
          }}
        >
          {isLive ? 'Stop camera' : 'Use camera'}
        </button>

        <label htmlFor={fileInputId} style={{ ...actionStyle, cursor: uploadBusy ? 'wait' : 'pointer' }}>
          {uploadBusy ? 'Reading image…' : 'Upload QR image'}
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      <p style={{ margin: '12px 0 0 0', fontSize: '12px', lineHeight: 1.6, color: '#6C7077' }}>
        For security, only official FPIA public verification links or direct certificate identifiers are opened automatically.
      </p>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style jsx>{`
        @media (max-width: 640px) {
          .fpia-qr-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

const actionStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '46px',
  padding: '0 16px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--navy)',
  textDecoration: 'none',
  backgroundColor: '#ffffff',
  border: '1px solid rgba(11,31,51,0.14)',
}

async function loadImageFromFile(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file)
  }

  const dataUrl = await fileToDataUrl(file)
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('image-load-failed'))
    image.src = dataUrl
  })
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('file-read-failed'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('file-read-failed'))
    reader.readAsDataURL(file)
  })
}
