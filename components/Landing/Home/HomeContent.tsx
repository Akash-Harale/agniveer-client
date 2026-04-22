'use client';

import { useState, useEffect } from "react";
import "./HomeContent.css";

export default function HomeContent() {
  const [gallery] = useState([
    "/mg1.jpg",
    "/mg2.webp",
    "/mg3.png",
    "/mg4.jpg",
    "/mg5.webp",
    "/mg6.webp",
  ]);

  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [showAllNews, setShowAllNews] = useState(false);

  // 🔹 Simulate API fetch (temporary PDF data)
  useEffect(() => {
    const data = [
      {
        title: "Vacancy announcement for Community Policing Adviser (P-4), 2025, UNMISS",
        size: "605.65 KB",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        link: "https://www.mha.gov.in/",
        date: "2025-10-28",
      },
      {
        title: "Vacancy for Deputy Police Commissioner, DI in UNMISS",
        size: "1.76 MB",
        pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
        link: "https://police.gov.in/",
        date: "2025-10-27",
      },
      {
        title: "Display of the United Nations Flag on UN Day",
        size: "205.51 KB",
        pdfUrl: "https://file-examples.com/storage/fe13e7d7f168cbb78f76e6a/2017/10/file-example_PDF_1MB.pdf",
        link: "https://un.org/",
        date: "2025-10-29",
      },
      {
        title: "Senior Police Adviser (PS) in UNFICYP",
        size: "730.21 KB",
        pdfUrl: "https://www.clickdimensions.com/links/TestPDFfile.pdf",
        link: "https://cypruspolice.gov.cy/",
        date: "2025-10-25",
      },
      {
        title: "Gender Parity Workshop, Viet Nam",
        size: "1.39 MB",
        pdfUrl: "https://file-examples.com/storage/fe13e7d7f168cbb78f76e6a/2017/10/file-example_PDF_500_kB.pdf",
        link: "https://vietnam.gov.vn/",
        date: "2025-10-26",
      },
      {
        title: "United Nations Police Day, 9 November 2025",
        size: "194.88 KB",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        link: "https://www.unpol.org/",
        date: "2025-10-24",
      },
    ];

    const sortedData = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setNewsItems(sortedData);
  }, []);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = title.replace(/\s+/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayedNews = showAllNews ? newsItems : newsItems.slice(0, 5);

  return (
    <div className="home-content-container">

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="section-container welcome-flex">
          <div className="welcome-text">
            <h2 className="welcome-heading">Welcome to the Ministry of Home Affairs</h2>
            <p className="welcome-paragraph">
              The Ministry of Home Affairs (MHA) discharges multifarious responsibilities, the important among them being - internal security, border management, Centre-State relations, administration of Union Territories, management of Central Armed Police Forces, disaster management, etc.
            </p>
          </div>
          <div className="welcome-image">
            <img src="https://www.mha.gov.in/sites/default/files/IMG_0476.JPG" alt="Ministry of Home Affairs" />
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="whats-new-section">
        <div className="section-container">
          <h2 className="whats-new-heading">What's New</h2>
          <div className="news-container">
            <table className="news-table">
              <thead>
                <tr>
                  <th>SR. No</th>
                  <th>Title</th>
                  <th>Download</th>
                  <th>Link</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {displayedNews.map((news, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{news.title}</td>
                    <td>
                      <button className="news-download" onClick={() => handleDownload(news.pdfUrl, news.title)}>
                        ⬇️ Download ({news.size})
                      </button>
                    </td>
                    <td>
                      <a href={news.link} target="_blank" rel="noopener noreferrer" className="news-link">🔗 Visit</a>
                    </td>
                    <td>{new Date(news.date).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {newsItems.length > 5 && (
              <div className="view-more-container">
                <button 
                  className="view-more-button"
                  onClick={() => setShowAllNews(!showAllNews)}
                >
                  {showAllNews ? "Show Less ↑" : "View More Announcements ↓"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="section-container">
          <h2 className="gallery-heading">Our Gallery</h2>
          <div className="gallery-container">
            {gallery.map((img, index) => (
              <div key={index} className="gallery-item" data-index={index + 1}>
                <img src={img} alt={`Gallery Image ${index + 1}`} className="gallery-image" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Government Websites Section */}
      <div className="section">
        <h3 className="title">OTHER GOVERNMENT WEBSITES</h3>
        <div className="columns">
          <div className="col">
            <h4>ALLIED ORGANISATION</h4>
            <ul>
              <li><a href="https://www.youtube.com/channel/UCN2fiHd5IFWtNyu-vpAkeEA/videos" target="_blank" rel="noopener noreferrer">Police aur Seva</a></li>
              <li><a href="https://nidm.gov.in/default.asp" target="_blank" rel="noopener noreferrer">National Institute of Disaster Management</a></li>
              <li><a href="https://ndma.gov.in/" target="_blank" rel="noopener noreferrer">National Disaster Management Authority</a></li>
            </ul>
          </div>
          <div className="col">
            <h4>ATTACHED / SUBORDINATE OFFICES</h4>
            <ul>
              <li><a href="https://www.myev.org.in/" target="_blank" rel="noopener noreferrer">National Civil Defence College, Nagpur</a></li>
              <li><a href="https://rajbhasha.gov.in/" target="_blank" rel="noopener noreferrer">Committee of Parliament on Official Language</a></li>
              <li><a href="https://ndrf.gov.in/" target="_blank" rel="noopener noreferrer">National Disaster Response Force</a></li>
            </ul>
          </div>
          <div className="col">
            <h4>OTHER ORGANISATIONS</h4>
            <ul>
              <li><a href="https://egazette.gov.in/" target="_blank" rel="noopener noreferrer">E-Gazette</a></li>
              <li><a href="https://kpkb.mha.gov.in/" target="_blank" rel="noopener noreferrer">Kendriya Police Kalyan Bhandar</a></li>
              <li><a href="https://data.gov.in/" target="_blank" rel="noopener noreferrer">Open Government Data</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
