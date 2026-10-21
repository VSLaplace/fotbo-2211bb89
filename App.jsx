import React, { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div style={{ backgroundColor: '#0b0f17', color: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: '20px', boxSizing: 'border-box' }}>
      {/* Шапка сайту */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '20px', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <span style={{ fontSize: '14px', letterSpacing: '2px', color: '#9ca3af' }}>VIII КОНГРЕС · 2026</span>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: '500' }}>НТАГЕТ України</h2>
        </div>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCurrentPage('home')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'home' ? '#fff' : '#9ca3af', cursor: 'pointer', fontSize: '16px' }}
          >
            Головна
          </button>
          <button 
            onClick={() => setCurrentPage('photo')} 
            style={{ background: 'none', border: 'none', color: currentPage === 'photo' ? '#fff' : '#9ca3af', cursor: 'pointer', fontSize: '16px' }}
          >
            Фото
          </button>
          <a 
            href="https://drive.google.com/drive/folders/1CN5B5Vmqiwe_BmaMUEbf_OJqZ7tc0blW?usp=drive_link" 
            target="_blank" 
            rel="noreferrer" 
            style={{ textDecoration: 'none', color: '#fff', fontSize: '16px', padding: '8px 16px', background: '#1f2937', borderRadius: '6px', border: '1px solid #374151' }}
          >
            Сертифікати
          </a>
        </nav>
      </header>

      {/* Головна сторінка */}
      {currentPage === 'home' && (
        <main style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
          <h1 style={{ fontSize: '32px', lineHeight: '1.4', marginBottom: '40px', fontWeight: 'normal' }}>
            VIII Конгрес Наукового товариства анатомів, гістологів, ембріологів та топографоанатомів України
          </h1>
          <div style={{ display: 'inline-block', border: '1px solid #374151', padding: '20px 40px', borderRadius: '8px', backgroundColor: '#111827' }}>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px', letterSpacing: '1px' }}>ДАТИ ПРОВЕДЕННЯ</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '22px', fontWeight: 'bold' }}>14–17 жовтня 2026 року</p>
          </div>
        </main>
      )}

      {/* Сторінка з фото */}
      {currentPage === 'photo' && (
        <main style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '0 20px' }}>
          <h2 style={{ marginBottom: '20px', fontWeight: 'normal', fontSize: '20px' }}>Офіційні матеріали конгресу</h2>
          <div style={{ border: '1px solid #374151', padding: '12px', backgroundColor: '#111827', borderRadius: '8px' }}>
            <img 
              src="/uploads/photo_2026-10-14_20-27-25-fdb3c7cc.jpg" 
              alt="Офіційний плакат VIII Конгресу НТАГЕТ" 
              style={{ width: '100%', height: 'auto', borderRadius: '4px', display: 'block' }} 
            />
            <p style={{ margin: '12px 0 4px 0', color: '#9ca3af', fontSize: '14px' }}>FIG. 01 — Офіційний плакат VIII Конгресу НТАГЕТ України</p>
          </div>
        </main>
      )}

      {/* Підвал */}
      <footer style={{ textAlign: 'center', marginTop: '100px', color: '#4b5563', fontSize: '14px', borderTop: '1px solid #1f2937', paddingTop: '20px' }}>
        Львів · 2026
      </footer>
    </div>
  );
}
