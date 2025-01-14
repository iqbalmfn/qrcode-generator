import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [logo, setLogo] = useState(null); // State untuk logo
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

  // Menggunakan useEffect untuk memantau perubahan inputText
  useEffect(() => {
    if (!inputText) {
      setIsGenerated(false);
    }
  }, [inputText]);

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
      if (logo) {
        addLogoToQRCode(); // Menambahkan logo setelah QR code digenerate
      }
      setIsGenerated(true);
    }
  };

  // Fungsi untuk menambahkan logo ke QR code dengan mempertahankan orientasi aslinya
  const addLogoToQRCode = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const logoImg = new Image();

    logoImg.src = URL.createObjectURL(logo);
    logoImg.onload = () => {
      // Menghitung ukuran logo berdasarkan ukuran canvas, dengan mempertahankan rasio aspek
      const maxLogoWidth = canvasSize / 6; // Maksimal lebar logo 1/3 dari lebar canvas
      const maxLogoHeight = canvasSize / 6; // Maksimal tinggi logo 1/3 dari tinggi canvas
      let logoWidth = logoImg.width;
      let logoHeight = logoImg.height;

      // Menyesuaikan logo agar tidak lebih besar dari ukuran maksimal
      if (logoWidth > maxLogoWidth || logoHeight > maxLogoHeight) {
        const ratio = Math.min(maxLogoWidth / logoWidth, maxLogoHeight / logoHeight);
        logoWidth = logoWidth * ratio;
        logoHeight = logoHeight * ratio;
      }

      const xPos = (canvasSize - logoWidth) / 2; // Posisi logo di tengah
      const yPos = (canvasSize - logoHeight) / 2;

      context.drawImage(logoImg, xPos, yPos, logoWidth, logoHeight); // Menggambar logo di atas QR code
    };
  };

  // Fungsi untuk menangani upload logo
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(file); // Menyimpan file logo ke state
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "-15px" }}>QR Code Generator</h1>
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
        <div style={{margin:'auto'}}>
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
        <div style={{margin: isGenerated ? "20px 0 0 0" : "0"}}>
          <label style={{ fontSize: "14px" }}>Logo (optional): </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />
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
        {isGenerated && inputText ? (
          <div>
            <button onClick={handleDownload} disabled={!inputText}>
              Download QR Code
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
