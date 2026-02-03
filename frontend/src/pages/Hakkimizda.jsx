import React, { useState, useEffect } from 'react';
import styles from './Hakkimizda.module.css';
import logoImage from '../assets/logo.png';


const mockApiData = {
  title: "Hakkımızda",
  
  content: `
    <h2>Misyonumuz</h2>
    <p>Kobal Gayrimenkul olarak, gayrimenkul sektöründe güvenilir ve yenilikçi çözümler sunarak müşterilerimizin hayallerindeki mülklere kavuşmalarını sağlamayı misyon edindik. Teknoloji ve insan odaklı yaklaşımımızla, alım, satım ve kiralama süreçlerini herkes için kolay, şeffaf ve erişilebilir hale getiriyoruz.</p>
    
    <h2>Vizyonumuz</h2>
    <p>Türkiye'de gayrimenkul danışmanlığı denildiğinde akla gelen ilk ve en güvenilir marka olmak; dijital dönüşüme öncülük ederek sektöre yön veren bir kurum haline gelmektir.</p>
    
    <h3>Neden Biz?</h3>
    <ul>
      <li><strong>Güven:</strong> Tüm süreçlerimizde şeffaflığı esas alırız.</li>
      <li><strong>Teknoloji:</strong> Portföy yönetiminden kira takibine, en güncel teknolojileri kullanırız.</li>
      <li><strong>Uzman Ekip:</strong> Alanında deneyimli ve dinamik bir kadro ile çalışırız.</li>
    </ul>
  `
};

function HakkimizdaPage() {
 
  const [pageContent, setPageContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    setIsLoading(true);
    
  
    const fetchContent = () => {
      setTimeout(() => {
        setPageContent(mockApiData);
        setIsLoading(false);
      }, 500); 
    };

    fetchContent();
  }, []); 

  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  
  return (
    <div className={styles.pageContainer}>
      {pageContent && (
        <>
          <h1 className={styles.pageTitle}>{pageContent.title}</h1>
          <img 
            src={logoImage} 
            alt="Kolaybak Emlak Logo" 
            className={styles.pageLogo} 
          />
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
          />
        </>
      )}
    </div>
  );
}

export default HakkimizdaPage;