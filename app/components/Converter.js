'use client';

import { useState, useRef, useEffect } from 'react';
import '../styles/converter.css';

const TOOLS = [
  { id: 'pdf2img', label: 'PDF → Image', icon: '📄' },
  { id: 'img2pdf', label: 'Image → PDF', icon: '🖼️' },
  { id: 'imgcompress', label: 'Compress Image', icon: '⚡' },
  { id: 'pdfcompress', label: 'Compress PDF', icon: '📦' },
  { id: 'imgformat', label: 'Convert Format', icon: '🔄' },
  { id: 'editpdf', label: 'Edit PDF', icon: '✏️' },
];

// File validation config (optimized for Vercel free tier)
// Smaller limits for compression/merge operations due to increased memory usage
const FILE_LIMITS = {
  pdf2img: { size: 30 * 1024 * 1024, types: ['.pdf'], label: 'PDF to Image (30MB max)' },
  img2pdf: { size: 20 * 1024 * 1024, types: ['.jpg', '.jpeg', '.png'], label: 'Image to PDF (20MB max)' },
  imgcompress: { size: 15 * 1024 * 1024, types: ['.jpg', '.jpeg', '.png'], label: 'Compress Image (15MB max)' },
  pdfcompress: { size: 15 * 1024 * 1024, types: ['.pdf'], label: 'Compress PDF (15MB max)' },
  imgformat: { size: 20 * 1024 * 1024, types: ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'], label: 'Convert Format (20MB max)' },
  editpdf: { size: 30 * 1024 * 1024, types: ['.pdf'], label: 'Edit PDF (30MB per file)' },
};

export default function Converter() {
  const [activeTab, setActiveTab] = useState('pdf2img');
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editpdfOperation, setEditpdfOperation] = useState('merge');
  const [pdfPages, setPdfPages] = useState([]); // For visual_edit - page order and rotation
  const [draggedIndex, setDraggedIndex] = useState(null); // For drag-and-drop reordering
  const [generatingPreviews, setGeneratingPreviews] = useState(false); // Loading state for preview generation
  const [settings, setSettings] = useState({
    format: 'PNG',
    quality: 80,
    webpQuality: 80,
    dpi: 150,
  });
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Clear UI state when switching tabs
    setFile(null);
    setFiles([]);
    setResult(null);
    setError(null);
    setPdfPages([]);
  }, [activeTab]);

  const validateFile = (file) => {
    const config = FILE_LIMITS[activeTab];
    if (!config) return 'Invalid tool';

    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!config.types.includes(fileExt)) {
      return `Invalid file type. Accepted: ${config.types.join(', ')}`;
    }

    if (file.size > config.size) {
      const maxSizeMB = (config.size / (1024 * 1024)).toFixed(0);
      return `File too large. Maximum size: ${maxSizeMB}MB (${config.label})`;
    }

    return null;
  };

  const getSizeWarning = () => {
    const config = FILE_LIMITS[activeTab];
    if (!config) return null;
    const maxSizeMB = (config.size / (1024 * 1024)).toFixed(0);
    return `Max file size: ${maxSizeMB}MB`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generatePDFPreviews = async (pdfFile) => {
    setGeneratingPreviews(true);
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      const response = await fetch('/api/generate-pdf-previews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate previews';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Use status text if response isn't JSON
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.previews) {
        setPdfPages(data.previews);
      }
    } catch (err) {
      console.error('Preview generation error:', err);
      setError(`Could not generate previews: ${err.message}`);
    } finally {
      setGeneratingPreviews(false);
    }
  };

  const handleFileSelect = (e) => {
    if (activeTab === 'editpdf') {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length === 0) return;
      
      const validatedFiles = [];
      for (const selectedFile of selectedFiles) {
        const validationError = validateFile(selectedFile);
        if (validationError) {
          setError(validationError);
          return;
        }
        validatedFiles.push(selectedFile);
      }
      
      if (editpdfOperation === 'merge') {
        setFiles([...files, ...validatedFiles]);
      } else if (editpdfOperation === 'visual_edit') {
        // For visual_edit, only allow one file
        const selectedFile = validatedFiles[0];
        setFile(selectedFile);
        // Generate actual page previews from PDF
        generatePDFPreviews(selectedFile);
      }
      setError(null);
    } else {
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
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('dragover');
  };

  const rotatePage = (pageIndex, angle) => {
    const newPages = [...pdfPages];
    newPages[pageIndex].rotation = (newPages[pageIndex].rotation + angle) % 360;
    setPdfPages(newPages);
  };

  const movePage = (pageIndex, direction) => {
    const newPages = [...pdfPages];
    if (direction === 'up' && pageIndex > 0) {
      [newPages[pageIndex], newPages[pageIndex - 1]] = [newPages[pageIndex - 1], newPages[pageIndex]];
      setPdfPages(newPages);
    } else if (direction === 'down' && pageIndex < newPages.length - 1) {
      [newPages[pageIndex], newPages[pageIndex + 1]] = [newPages[pageIndex + 1], newPages[pageIndex]];
      setPdfPages(newPages);
    }
  };

  const removePage = (pageIndex) => {
    setPdfPages(pdfPages.filter((_, idx) => idx !== pageIndex));
  };

  const handleDragStart = (pageIndex) => {
    setDraggedIndex(pageIndex);
  };

  const handlePageDragOver = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    const newPages = [...pdfPages];
    const draggedPage = newPages[draggedIndex];
    newPages.splice(draggedIndex, 1);
    newPages.splice(targetIndex, 0, draggedPage);
    setDraggedIndex(targetIndex);
    setPdfPages(newPages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragLeave = () => {
    dropZoneRef.current?.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('dragover');
    
    if (activeTab === 'editpdf') {
      const droppedFiles = Array.from(e.dataTransfer.files || []);
      if (droppedFiles.length === 0) return;
      
      const validatedFiles = [];
      for (const droppedFile of droppedFiles) {
        const validationError = validateFile(droppedFile);
        if (validationError) {
          setError(validationError);
          return;
        }
        validatedFiles.push(droppedFile);
      }
      
      if (editpdfOperation === 'merge') {
        setFiles([...files, ...validatedFiles]);
      } else if (editpdfOperation === 'visual_edit') {
        // For visual_edit, only allow one file
        const droppedFile = validatedFiles[0];
        setFile(droppedFile);
        // Generate actual page previews from PDF
        generatePDFPreviews(droppedFile);
      }
      setError(null);
    } else {
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
    }
  };

  const handleConvert = async () => {
    if (activeTab === 'editpdf') {
      if (editpdfOperation === 'merge') {
        if (files.length < 2) {
          setError('Please select at least 2 PDF files for merge');
          return;
        }
      } else if (editpdfOperation === 'visual_edit') {
        if (!file) {
          setError('Please select a PDF file to edit');
          return;
        }
        if (pdfPages.length === 0) {
          setError('No pages available to edit');
          return;
        }
      }
    } else if (!file) {
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
      } else if (activeTab === 'editpdf') {
        formData.append('operation', editpdfOperation);
        if (editpdfOperation === 'merge') {
          files.forEach((f) => formData.append('pdfs', f));
        } else if (editpdfOperation === 'visual_edit') {
          formData.append('pdf', file);
          // Create slots JSON with page order and rotation info
          const slots = pdfPages.map((page, idx) => ({
            page: page.index,
            rotation: page.rotation,
            order: idx,
          }));
          formData.append('slots_json', JSON.stringify(slots));
        }
      }

      const endpoints = {
        pdf2img: '/api/convert',
        img2pdf: '/api/img2pdf',
        imgcompress: '/api/compress-image',
        pdfcompress: '/api/compress-pdf',
        imgformat: '/api/img-convert',
        editpdf: '/api/edit-pdf',
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
    if (result.file) {
      downloadUrl = result.file;
      // Extract filename from URL path (format: /api/download/sessionId/filename)
      const fileMatch = result.file.match(/\/([^/]+)$/);
      fileName = fileMatch ? decodeURIComponent(fileMatch[1]) : 'edited.pdf';
    } else if (result.zip) {
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
          {/* Size Limitation Notice */}
          <div className="size-warning">
            <span className="warning-icon">ℹ️</span>
            <span className="warning-text">{getSizeWarning()}</span>
          </div>
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
                  multiple={activeTab === 'editpdf' && editpdfOperation === 'merge'}
                />
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 16V4m0 0L8 8m4-4 4 4" />
                  <rect x="3" y="16" width="18" height="5" rx="1.5" />
                </svg>
                <p className="drop-text">Drag & drop or click to select</p>
                {activeTab === 'editpdf' ? (
                  files.length > 0 && (
                    <div className="file-list">
                      {files.map((f, idx) => (
                        <div key={idx} className="file-item">
                          <span>{f.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFiles(files.filter((_, i) => i !== idx));
                            }}
                            className="btn-remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  file && <p className="file-name">{file.name}</p>
                )}
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

              {activeTab === 'editpdf' && (
                <div className="setting-group">
                  <label>PDF Operation</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="merge"
                        checked={editpdfOperation === 'merge'}
                        onChange={(e) => setEditpdfOperation(e.target.value)}
                      />
                      Merge PDFs
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        value="visual_edit"
                        checked={editpdfOperation === 'visual_edit'}
                        onChange={(e) => setEditpdfOperation(e.target.value)}
                      />
                      Rearrange & Rotate
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'editpdf' && editpdfOperation === 'visual_edit' && (
                <div className="pages-editor">
                  <label>Page Manager - Drag to reorder</label>
                  {generatingPreviews ? (
                    <div className="loading-previews">
                      <span className="spinner">⏳</span> Generating page previews...
                    </div>
                  ) : pdfPages.length > 0 ? (
                    <div className="pages-thumbnails">
                      {pdfPages.map((page, idx) => (
                        <div
                          key={idx}
                          className={`page-thumbnail ${draggedIndex === idx ? 'dragging' : ''}`}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handlePageDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          onDragLeave={(e) => e.preventDefault()}
                        >
                          <div className="thumbnail-preview">
                            {page.image && (
                              <img
                                src={page.image}
                                alt={`Page ${page.index + 1}`}
                                className="page-image"
                              />
                            )}
                            <span
                              className="rotation-badge"
                              style={{
                                transform: `rotate(${page.rotation}deg)`,
                              }}
                            >
                              ↻
                            </span>
                          </div>
                          <div className="thumbnail-controls">
                            <button
                              onClick={() => rotatePage(idx, 90)}
                              className="btn-small"
                              title="Rotate 90°"
                            >
                              🔄
                            </button>
                            <button
                              onClick={() => removePage(idx)}
                              className="btn-small btn-remove"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="thumbnail-info">P{page.index + 1} • {page.rotation}°</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center', color: '#999' }}>Upload a PDF to see page previews</p>
                  )}
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
            {error && (
              <div className="error-message">
                {error}
                {error.includes('File too large') && activeTab === 'editpdf' && (
                  <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                    💡 Tip: For large files, try merging smaller PDFs individually.
                  </p>
                )}
              </div>
            )}

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

            {/* File Size Info */}
            {(file || files.length > 0) && (
              <div className="file-info">
                {file && activeTab === 'editpdf' && editpdfOperation === 'visual_edit' && (
                  <span>File: {formatFileSize(file.size)}</span>
                )}
                {file && activeTab !== 'editpdf' && <span>File size: {formatFileSize(file.size)}</span>}
                {files.length > 0 && (
                  <span>
                    Total files: {files.length} ({formatFileSize(files.reduce((acc, f) => acc + f.size, 0))})
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleConvert}
                disabled={
                  activeTab === 'editpdf'
                    ? editpdfOperation === 'merge'
                      ? files.length < 2
                      : !file || pdfPages.length === 0
                    : !file || loading
                }
                className="btn btn-primary"
              >
                {loading ? 'Processing...' : 'Convert Now'}
              </button>
              {(file || files.length > 0) && (
                <button
                  onClick={() => {
                    setFile(null);
                    setFiles([]);
                    setResult(null);
                    setError(null);
                    setPdfPages([]);
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
