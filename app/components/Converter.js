'use client';

import { useState, useRef } from 'react';
import '../styles/converter.css';

const TOOLS = [
  { id: 'pdf2img', label: 'PDF → Image', icon: '📄' },
  { id: 'img2pdf', label: 'Image → PDF', icon: '🖼️' },
  { id: 'imgcompress', label: 'Compress Image', icon: '⚡' },
  { id: 'pdfcompress', label: 'Compress PDF', icon: '📦' },
  { id: 'imgformat', label: 'Convert Format', icon: '🔄' },
];

// File validation config
const FILE_LIMITS = {
  pdf2img: { size: 100 * 1024 * 1024, types: ['.pdf'] },
  img2pdf: { size: 100 * 1024 * 1024, types: ['.jpg', '.jpeg', '.png'] },
  imgcompress: { size: 100 * 1024 * 1024, types: ['.jpg', '.jpeg', '.png'] },
  pdfcompress: { size: 100 * 1024 * 1024, types: ['.pdf'] },
  imgformat: { size: 100 * 1024 * 1024, types: ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'] },
};

export default function Converter() {
  const [activeTab, setActiveTab] = useState('pdf2img');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    format: 'PNG',
    quality: 80,
    webpQuality: 80,
    dpi: 150,
  });
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const config = FILE_LIMITS[activeTab];
    if (!config) return 'Invalid tool';

    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!config.types.includes(fileExt)) {
      return `Invalid file type. Accepted: ${config.types.join(', ')}`;
    }

    if (file.size > config.size) {
      return `File too large. Maximum size: ${(config.size / (1024 * 1024)).toFixed(0)}MB`;
    }

    return null;
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('dragover');
  };

  const handleDragLeave = () => {
    dropZoneRef.current?.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('dragover');
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const validationError = validateFile(droppedFile);
      if (validationError) {
        setError(validationError);
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Validate DPI range
    if (![72, 150, 300].includes(Number(settings.dpi))) {
      setError('DPI must be 72, 150, or 300');
      return;
    }

    // Validate quality ranges
    if ((activeTab === 'imgcompress' || activeTab === 'pdfcompress') && (settings.quality < 10 || settings.quality > 90)) {
      setError('Compression quality must be between 10% and 90%');
      return;
    }

    if (settings.format === 'WEBP' && (settings.webpQuality < 50 || settings.webpQuality > 100)) {
      setError('WebP quality must be between 50% and 100%');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();

      if (activeTab === 'pdf2img') {
        formData.append('pdf', file);
        formData.append('format', settings.format);
        formData.append('dpi', settings.dpi);
        formData.append('pages', 'all');
        if (settings.format === 'WEBP') {
          formData.append('webp_quality', settings.webpQuality);
        }
      } else if (activeTab === 'img2pdf') {
        formData.append('images', file);
      } else if (activeTab === 'imgcompress') {
        formData.append('image', file);
        formData.append('target_percent', settings.quality);
      } else if (activeTab === 'pdfcompress') {
        formData.append('pdf', file);
        formData.append('target_percent', settings.quality);
      } else if (activeTab === 'imgformat') {
        formData.append('image', file);
        formData.append('target_format', settings.format);
        formData.append('dpi', settings.dpi);
        if (settings.format === 'WEBP') {
          formData.append('webp_quality', settings.webpQuality);
        }
      }

      const endpoints = {
        pdf2img: '/api/convert',
        img2pdf: '/api/img2pdf',
        imgcompress: '/api/compress-image',
        pdfcompress: '/api/compress-pdf',
        imgformat: '/api/img-convert',
      };

      const endpoint = endpoints[activeTab];

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Conversion failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data) {
        throw new Error('Empty response from server');
      }
      setResult(data);
      setFile(null);
    } catch (err) {
      const errorMsg = err.message || 'Conversion failed. Please try again.';
      setError(errorMsg);
      console.error('Conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;

    // Determine download URL and filename from API response
    let downloadUrl = null;
    let fileName = null;

    // Check for single file responses with URL paths
    if (result.zip) {
      downloadUrl = result.zip;
      // Extract filename from URL path (format: /api/download/sessionId/filename)
      const zipMatch = result.zip.match(/\/([^/]+)$/);
      fileName = zipMatch ? decodeURIComponent(zipMatch[1]) : 'converted-images.zip';
    } else if (result.pdf) {
      downloadUrl = result.pdf;
      const pdfMatch = result.pdf.match(/\/([^/]+)$/);
      fileName = pdfMatch ? decodeURIComponent(pdfMatch[1]) : 'converted.pdf';
    } else if (result.image) {
      downloadUrl = result.image;
      const imgMatch = result.image.match(/\/([^/]+)$/);
      fileName = imgMatch ? decodeURIComponent(imgMatch[1]) : 'converted-image';
    } else if (Array.isArray(result.images) && result.images.length > 0) {
      downloadUrl = result.images[0];
      const imgMatch = result.images[0].match(/\/([^/]+)$/);
      fileName = imgMatch ? decodeURIComponent(imgMatch[1]) : 'converted-image';
    }

    if (downloadUrl && fileName) {
      try {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        // Add error handler for download failures
        a.onerror = () => {
          setError(`Download failed: Could not download ${fileName}`);
          document.body.removeChild(a);
        };
        
        a.click();
        
        // Clean up after a delay to allow download to start
        setTimeout(() => {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
        }, 100);
      } catch (err) {
        setError(`Download error: ${err.message}`);
      }
    } else {
      setError('No download URL available in response');
    }
  };

  const getAcceptedFiles = () => {
    const config = FILE_LIMITS[activeTab];
    return config?.types.join(',') || '';
  };

  return (
    <section className="converter-section">
      <div className="container">
        <h2>Fast & Secure File Conversion</h2>
        <p className="converter-subtitle">Upload files, convert instantly. No account needed. No watermarks.</p>

        <div className="converter-container">
          {/* Tabs */}
          <div className="tabs">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`tab-btn ${activeTab === tool.id ? 'active' : ''}`}
              >
                <span className="tab-icon">{tool.icon}</span>
                <span className="tab-label">{tool.label}</span>
              </button>
            ))}
          </div>

          {/* Converter Panel */}
          <div className="converter-panel">
            {/* File Upload */}
            <div className="upload-section">
              <div
                ref={dropZoneRef}
                className="drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="file-input"
                  accept={getAcceptedFiles()}
                />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                  <rect x="3" y="16" width="18" height="5" rx="1.5" />
                </svg>
                <p className="drop-text">Drag & drop or click to select</p>
                {file && <p className="file-name">{file.name}</p>}
              </div>
            </div>

            {/* Settings */}
            <div className="settings-section">
              {activeTab === 'pdf2img' && (
                <>
                  <div className="setting-group">
                    <label>Output Format</label>
                    <div className="radio-group">
                      {['PNG', 'JPEG', 'WEBP', 'TIFF'].map((fmt) => (
                        <label key={fmt} className="radio-label">
                          <input
                            type="radio"
                            value={fmt}
                            checked={settings.format === fmt}
                            onChange={(e) => setSettings({ ...settings, format: e.target.value })}
                          />
                          {fmt}
                        </label>
                      ))}
                    </div>
                  </div>
                  {settings.format === 'WEBP' && (
                    <div className="setting-group">
                      <label htmlFor="pdf-webp-quality">WebP Quality: {settings.webpQuality}%</label>
                      <input
                        id="pdf-webp-quality"
                        type="range"
                        min="50"
                        max="100"
                        value={settings.webpQuality}
                        onChange={(e) => setSettings({ ...settings, webpQuality: Number(e.target.value) })}
                        className="slider"
                      />
                    </div>
                  )}
                  <div className="setting-group">
                    <label>Resolution (DPI)</label>
                    <div className="button-group">
                      {[72, 150, 300].map((dpi) => (
                        <button
                          key={dpi}
                          onClick={() => setSettings({ ...settings, dpi })}
                          className={`btn-dpi ${settings.dpi === dpi ? 'active' : ''}`}
                        >
                          {dpi}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {(activeTab === 'imgcompress' || activeTab === 'pdfcompress') && (
                <div className="setting-group">
                  <label htmlFor="quality">Compression: {settings.quality}%</label>
                  <input
                    id="quality"
                    type="range"
                    min="10"
                    max="90"
                    value={settings.quality}
                    onChange={(e) => setSettings({ ...settings, quality: Number(e.target.value) })}
                    className="slider"
                  />
                </div>
              )}

              {activeTab === 'imgformat' && (
                <>
                  <div className="setting-group">
                    <label>Target Format</label>
                    <div className="radio-group">
                      {['PNG', 'JPEG', 'WEBP', 'TIFF'].map((fmt) => (
                        <label key={fmt} className="radio-label">
                          <input
                            type="radio"
                            value={fmt}
                            checked={settings.format === fmt}
                            onChange={(e) => setSettings({ ...settings, format: e.target.value })}
                          />
                          {fmt}
                        </label>
                      ))}
                    </div>
                  </div>
                  {settings.format === 'WEBP' && (
                    <div className="setting-group">
                      <label htmlFor="webp-quality">WebP Quality: {settings.webpQuality}%</label>
                      <input
                        id="webp-quality"
                        type="range"
                        min="50"
                        max="100"
                        value={settings.webpQuality}
                        onChange={(e) => setSettings({ ...settings, webpQuality: Number(e.target.value) })}
                        className="slider"
                      />
                    </div>
                  )}
                  <div className="setting-group">
                    <label>Resolution (DPI)</label>
                    <div className="button-group">
                      {[72, 150, 300].map((dpi) => (
                        <button
                          key={dpi}
                          onClick={() => setSettings({ ...settings, dpi })}
                          className={`btn-dpi ${settings.dpi === dpi ? 'active' : ''}`}
                        >
                          {dpi}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Results */}
            {result && (
              <div className="result-section">
                <p className="result-title">✅ Conversion Successful!</p>
                {result.reduction_percent && (
                  <p className="result-info">Reduced by {result.reduction_percent}%</p>
                )}
                <button onClick={downloadResult} className="btn btn-primary">
                  Download File
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleConvert}
                disabled={!file || loading}
                className="btn btn-primary"
              >
                {loading ? 'Converting...' : 'Convert Now'}
              </button>
              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
