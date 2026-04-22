'use client';

import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* --- Logo Strip --- */}
      <div className="logo-strip">
        <a href="https://www.digitalindia.gov.in/" target="_blank" rel="noopener noreferrer">
          <img src="https://cdnbbsr.s3waas.gov.in/s3dcf6070a4ab7f3afbfd2809173e0824b/uploads/2024/12/202412061445137587.svg" alt="Digital India" />
        </a>
        <a href="https://goidirectory.gov.in/" target="_blank" rel="noopener noreferrer">
          <img src="https://th.bing.com/th/id/R.9b2391bcd287c57b5b50c8873f16694a?rik=Px%2f%2boknQL6xqWA&riu=http%3a%2f%2fwww.civilaviation.gov.in%2fsites%2fdefault%2ffiles%2f2023-01%2flogo-%25283%2529_0.png&ehk=Jm%2b2MB%2fUe09RQ0Nadd6jBZh%2bvs7teCuIun8ZRVmyb%2b0%3d&risl=&pid=ImgRaw&r=0" alt="GOI Directory" />
        </a>
        <a href="https://pmnrf.gov.in/" target="_blank" rel="noopener noreferrer">
          <img src="https://www.mofpi.gov.in/sites/default/files/styles/banner_200_200/public/pmnrf.png?itok=Lav8Hyak" alt="PMNRF" />
        </a>
        <a href="https://www.incredibleindia.org/" target="_blank" rel="noopener noreferrer">
          <img src="https://www.discoverindia.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FIncredibleIndia.659f2f55.png&w=750&q=75" alt="Incredible India" />
        </a>
        <a href="https://www.mygov.in/" target="_blank" rel="noopener noreferrer">
          <img src="https://th.bing.com/th/id/R.7683fca94d1350c027354d1cc7b63bb2?rik=ERSmiz%2f0Lxw78w&riu=http%3a%2f%2fwww.wcso.in%2fContent%2fImages%2fLogos%2fMeriSarkar.png&ehk=UJYwz%2bKJeF6DilnuWoFmlve07EApUFzHh%2f4K7ZthnHg%3d&risl=&pid=ImgRaw&r=0" alt="My Gov" />
        </a>
      </div>

      {/* --- Bottom Section --- */}
      <div className="bottom">
        <div className="links">
          <a href="#">Website Policies</a>
          <a href="#">Help</a>
          <a href="#">Contact Us</a>
          <a href="#">FAQ</a>
          <a href="#">Terms & Conditions</a>
        </div>
        <p className="copyright-text">
          Website content owned & provided by Ministry of Home Affairs, Govt. of India.  
          Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong> ©2026
        </p>
      </div>
    </footer>
  );
}
