import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadData, uploadImage, API_BASE } from '../services/api';

function FileUpload({ onUploadSuccess }) {
    const [status, setStatus] = useState(null); // { type, message }
    const [uploading, setUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const onDrop = useCallback(
        async (acceptedFiles) => {
            if (acceptedFiles.length === 0) return;

            setUploading(true);
            setStatus(null);

            try {
                for (const file of acceptedFiles) {
                    const ext = file.name.split('.').pop().toLowerCase();
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);

                    if (isImage) {
                        const { data } = await uploadImage(file);
                        setUploadedImages((prev) => [...prev, data.imageUrl]);
                        setStatus({
                            type: 'success',
                            message: `✅ Image "${file.name}" uploaded successfully`,
                        });
                    } else if (['csv', 'json'].includes(ext)) {
                        const { data } = await uploadData(file);
                        setStatus({
                            type: 'success',
                            message: `✅ ${data.message}`,
                        });
                        if (data.markers) {
                            onUploadSuccess(data.markers);
                        } else {
                            onUploadSuccess(null);
                        }
                    } else {
                        setStatus({
                            type: 'error',
                            message: `❌ Unsupported file type: .${ext}`,
                        });
                    }
                }
            } catch (err) {
                setStatus({
                    type: 'error',
                    message: `❌ Upload failed: ${err.response?.data?.error || err.message}`,
                });
            } finally {
                setUploading(false);
            }
        },
        [onUploadSuccess]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/json': ['.json'],
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
        },
        multiple: true,
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}
            >
                <input {...getInputProps()} />
                <span className="dropzone__icon">
                    {uploading ? '⏳' : isDragActive ? '📥' : '📂'}
                </span>
                <div className="dropzone__text">
                    {uploading ? (
                        <span>Uploading...</span>
                    ) : isDragActive ? (
                        <strong>Drop files here</strong>
                    ) : (
                        <>
                            <strong>Drag & drop</strong> files here, or click to browse
                        </>
                    )}
                </div>
                <div className="dropzone__hint">
                    Supports CSV, JSON, and image files (JPG, PNG, GIF, WebP)
                </div>
            </div>

            {status && (
                <div className={`upload-status upload-status--${status.type}`}>
                    {status.message}
                </div>
            )}

            {uploadedImages.length > 0 && (
                <div className="image-upload-section">
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Uploaded Images (use URLs in your CSV/JSON data):
                    </div>
                    <div className="uploaded-images">
                        {uploadedImages.map((url, i) => (
                            <img
                                key={i}
                                src={url.startsWith('http') ? url : `${API_BASE}${url}`}
                                alt={`Upload ${i + 1}`}
                                className="uploaded-image-thumb"
                                title={url}
                                onClick={() => navigator.clipboard.writeText(url)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUpload;
