import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [senderName, setSenderName] = useState("");
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    document.title = "Surat Natal";
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOpen = () => {
    if (!selectedImage) {
      alert("Silakan pilih foto terlebih dahulu!");
      return;
    }
    if (!senderName.trim()) {
      alert("Silakan masukkan nama pembuat pesan!");
      return;
    }
    setIsOpen(true);
    if (audioRef.current) audioRef.current.play();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Surat Natal Keluarga',
      text: `Hai! Lihat surat Natal indah dari ${senderName}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link berhasil disalin ke clipboard!");
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleDownload = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: "#050a14"
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `Natal-${senderName}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div className="container">
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      <div className="snowflakes">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random()
          }}>❄</div>
        ))}
      </div>

      <AnimatePresence>
        {!isOpen ? (
          <motion.div key="intro" exit={{ opacity: 0, scale: 0.9 }} className="intro-screen">
            <h2 className="upload-title">Surat Natal</h2>

            <div className="input-group">
              <input
                type="text"
                placeholder="Masukkan Nama Pembuat..."
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="name-input"
              />
            </div>

            <div className="upload-box" onClick={() => fileInputRef.current.click()}>
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="preview-img" />
              ) : (
                <div className="upload-placeholder">
                  <span>📸</span>
                  <p>Klik & Masukkan Foto Keluarga</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="open-btn"
            >
              Buka Pesan Natal ✉️
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="single-card-container">
            <div className="main-card" ref={cardRef}>
              <div className="card-border-inner"></div>

              <header className="card-header">
                <h1>Merry Christmas</h1>
                <div className="text-body">
                  <p className="salutation">Halo Semuanya,</p>

                  <div className="main-photo-wrapper">
                    <img src={selectedImage} alt="Keluarga" className="main-photo" />
                    <div className="year-tag">2025</div>
                  </div>

                  <p>Selamat Hari Natal untuk kita semua.</p>
                  <p className="highlight">Semoga terang natal menyelimuti hati kita dan menjadi terang bagi keluarga serta sesama</p>

                  <div className="closing-statement">
                    <p>Roma 15 : 13</p>
                    <p>“Semoga Allah, sumber pengharapan, memenuhi kamu dengan segala sukacita dan damai sejahtera dalam iman.”</p>
                    <strong>GOD BLESS US</strong>
                  </div>
                  <span className="signature">Salam Hangat, <br /> {senderName}</span>
                </div>
              </header>
            </div>

            <div className="card-footer-actions">
              <button className="share-btn" onClick={handleShare}>
                Bagikan Link 🔗
              </button>
              <button className="share-btn" style={{background: 'linear-gradient(135deg, var(--gold), var(--gold-light))', color: '#000'}} onClick={handleDownload}>
                Download Gambar 📥
              </button>
              <button className="re-upload" onClick={() => setIsOpen(false)}>
                Ganti Foto / Nama
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

export default App;