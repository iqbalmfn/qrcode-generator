import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const canvasRef = useRef(null); // Referensi untuk elemen canvas
  const [isGenerated, setIsGenerated] = useState(false);
  const [canvasSize, setCanvasSize] = useState(512); // Resolusi canvas, default 512px

  // Menggunakan useEffect untuk menyesuaikan ukuran canvas sesuai lebar layar saat halaman dimuat
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const maxCanvasSize = screenWidth - 40; // Margin 20px pada kedua sisi
      setCanvasSize(Math.min(maxCanvasSize, 512)); // Maksimal ukuran 512px
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Panggil sekali saat komponen dimuat

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fungsi untuk men-download QR code sebagai gambar PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL("image/png"); // Mengonversi canvas ke URL gambar PNG
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "qrcode.png"; // Nama file yang diunduh
    link.click();
  };

  // Fungsi untuk menghasilkan QR code menggunakan canvas
  const generateQRCode = () => {
    if (inputText) {
      QRCode.toCanvas(
        canvasRef.current,
        inputText,
        { width: canvasSize },
        (error) => {
          if (error) console.error(error);
        }
      );
      setIsGenerated(true);
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <p>
        by <a href="https://iqbalmfn.com">iqbalmfn</a>
      </p>
      <div>
        <input
          type="text"
          placeholder="Enter text for QR code"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "320px", // Membatasi lebar input
            marginBottom: "20px",
          }}
        />
        <div>
          {inputText && (
            <canvas
              ref={canvasRef}
              width={canvasSize}
              height={canvasSize}
              style={{
                display: isGenerated ? "block" : "none",
                maxWidth: "100%", // Pastikan canvas tidak melebar lebih dari lebar layar
                margin: "0 auto", // Memusatkan canvas
              }}
            />
          )}
        </div>
        <div style={{ margin: "20px 0" }}>
          <label>Adjust Size: </label>
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
        <div style={{ margin: "10px 0" }}>
          <button onClick={generateQRCode} disabled={!inputText}>
            Generate QR Code
          </button>
        </div>
        <div>
          <button onClick={handleDownload} disabled={!inputText}>
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
