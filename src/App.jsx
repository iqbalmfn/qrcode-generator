import React, { useState, useRef } from 'react'
import QRCode from 'qrcode'
import './App.css'

function App() {
  const [inputText, setInputText] = useState('')
  const canvasRef = useRef(null)  // Referensi untuk elemen canvas
  const [canvasSize, setCanvasSize] = useState(512)  // Resolusi canvas, default 512px

  // Fungsi untuk men-download QR code sebagai gambar PNG
  const handleDownload = () => {
    const canvas = canvasRef.current
    const imageUrl = canvas.toDataURL('image/png')  // Mengonversi canvas ke URL gambar PNG
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'qrcode.png'  // Nama file yang diunduh
    link.click()
  }

  // Fungsi untuk menghasilkan QR code menggunakan canvas
  const generateQRCode = () => {
    if (inputText) {
      QRCode.toCanvas(canvasRef.current, inputText, { width: canvasSize }, (error) => {
        if (error) console.error(error)
      })
    }
  }

  return (
    <div>
      <h1>QR Code Generator</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Enter text for QR code"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div>
          {inputText && (
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
            />
          )}
        </div>
        <div>
          <label>Adjust QR Code Size: </label>
          <input
            type="range"
            min="128"
            max="1024"
            step="64"
            value={canvasSize}
            onChange={(e) => setCanvasSize(Number(e.target.value))}
          />
          <span> {canvasSize} px</span>
        </div>
        <button onClick={generateQRCode} disabled={!inputText}>
          Generate QR Code
        </button>
        <button onClick={handleDownload} disabled={!inputText}>
          Download QR Code as Image
        </button>
      </div>
    </div>
  )
}

export default App
