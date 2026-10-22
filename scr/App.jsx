import React, { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div style={{ 
      backgroundColor: '#0c1015', 
      color: '#e5e7eb', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
      margin: 0, 
      padding: '30px 40px', 
      boxSizing: 'border-box' 
    }}>
      {/* Шапка сайту */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #1a2332', 
        paddingBottom: '20px', 
        marginBottom: '60px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ color: '#8b2626', fontSize: '20px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>VIII</span>
          <span style={{ fontSize: '12px', letterSpacing: '3px', color: '#6b7280' }}>КОНГРЕС · 2026</span>
        </div>
        
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('home')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: currentPage === 'home' ? '#ffffff' : '#6b7280', 
              cursor: 'pointer', 
              fontSize: '15px', 
              letterSpacing: '0.5px' 
            }}
          >
            Головна
          </button>
          
          {/* Кнопка Фото веде на Google Диск */}
          <a 
            href="https://drive.google.com/drive/folders/1noFbs7oJRD5eE6SiEApkeAFIFgxHY5aX?usp=drive_link" 
            target="_blank" 
            rel="noreferrer" 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#6b7280', 
              cursor: 'pointer', 
              fontSize: '15px', 
              letterSpacing: '0.5px',
              textDecoration: 'none'
            }}
          >
            Фото ↗
          </a>

          <a 
            href="https://drive.google.com/drive/folders/1CN5B5Vmqiwe_BmaMUEbf_OJqZ7tc0blW?usp=drive_link" 
            target="_blank" 
            rel="noreferrer" 
            style={{ 
              textDecoration: 'none', 
              color: '#d1d5db', 
              fontSize: '14px', 
              padding: '8px 18px', 
              border: '1px solid #263346', 
              borderRadius: '4px', 
              letterSpacing: '0.5px' 
            }}
          >
            Сертифікати
          </a>
        </nav>
      </header>

      {/* Головна сторінка */}
      {currentPage === 'home' && (
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            
            {/* Ліва колонка: Заголовок */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '15px' }}>
                <span style={{ color: '#991b1b', fontSize: '64px', fontWeight: 'bold', fontFamily: 'Georgia, serif', lineHeight: 1 }}>VIII</span>
                <span style={{ fontSize: '13px', letterSpacing: '4px', color: '#6b7280', fontWeight: '500' }}>КОНГРЕС · 2026</span>
              </div>

              <h1 style={{ 
                fontFamily: 'Georgia, serif', 
                fontSize: '40px', 
                fontWeight: '400', 
                lineHeight: '1.25', 
                color: '#eceef2', 
                marginTop: '10px',
                marginBottom: '40px' 
              }}>
                VIII Конгрес Наукового товариства анатомів, гістологів, ембріологів та топографоанатомів України
              </h1>

              <div style={{ marginTop: '40px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#4b5563', textTransform: 'uppercase' }}>ФОРМАТ КОНГРЕСУ</span>
                <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '15px' }}>14–17 жовтня 2026 року · Львів, Україна</p>
                
                {/* Напис під датою проведення */}
                <p style={{ margin: '12px 0 0 0', color: '#6b7280', fontSize: '14px', fontStyle: 'italic' }}>
                  Дякую за відвідування
                </p>
              </div>
            </div>

            {/* Права колонка: Фото та картка матеріалів */}
            <div style={{ 
              border: '1px solid #1e293b', 
              padding: '16px', 
              backgroundColor: '#0f172a'
            }}>
              <div style={{ border: '1px solid #1e2e42', padding: '10px' }}>
                <img 
                  src="/uploads/photo_2026-10-14_20-27-25-fdb3c7cc.jpg" 
                  alt="Офіційний плакат VIII Конгресу НТ АГЕТ" 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              </div>

              <div style={{ marginTop: '20px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                <p style={{ margin: '0 0 10px 0', letterSpacing: '1px', color: '#9ca3af' }}>
                  FIG. 01 — ОФІЦІЙНИЙ ПЛАКАТ VIII КОНГРЕСУ НТ АГЕТ УКРАЇНИ
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '10px', marginTop: '10px' }}>
                  <a 
                    href="https://drive.google.com/drive/folders/1noFbs7oJRD5eE6SiEApkeAFIFgxHY5aX?usp=drive_link" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#9ca3af', 
                      cursor: 'pointer', 
                      fontFamily: 'monospace', 
                      fontSize: '12px', 
                      padding: 0,
                      letterSpacing: '1px',
                      textDecoration: 'none'
                    }}
                  >
                    ПЛАКАТ У ПОВНОМУ РОЗМІРІ ↗
                  </a>
                  <span style={{ color: '#4b5563' }}>ОФІЦІЙНІ МАТЕРІАЛИ ОРГКОМІТЕТУ · JPG 1600×1066</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Підвал */}
      <footer style={{ textAlign: 'center', marginTop: '100px', color: '#374151', fontSize: '13px', borderTop: '1px solid #141c2e', paddingTop: '20px' }}>
        Львів · 2026
      </footer>
    </div>
  );
}
