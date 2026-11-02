import React, { useRef, useState } from 'react';
import { Link2, Upload } from 'lucide-react';
import { uploadMediaFileApi } from '../../../services/api';
import { storeImageFromLink } from '../../../services/courseApi';
import { courseImage, showDefaultImage } from '../../../utils/courseImage';
import { INPUT_STYLE, SECONDARY_BUTTON } from './fields';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Upload an image file or paste an https image link
 * value: { url, publicId, sourceUrl }
 */
export default function ImageField({ label, hint, value, onChange }) {
  const fileInput = useRef(null);
  const [link, setLink] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const showMessage = (text, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      showMessage('Please choose a JPG, PNG or WebP image.', true);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      showMessage('This image is larger than 5 MB. Please choose a smaller one.', true);
      return;
    }

    setIsBusy(true);
    setProgress(0);
    showMessage('');
    try {
      const result = await uploadMediaFileApi(file, setProgress);
      onChange({ url: result.data.url, publicId: result.data.public_id || '', sourceUrl: '' });
      showMessage('Image uploaded.');
    } catch (error) {
      showMessage(error.message || 'The upload failed. Please try again.', true);
    } finally {
      setIsBusy(false);
    }
  };

  const handleLink = async () => {
    if (!link.trim()) return;

    setIsBusy(true);
    showMessage('');
    try {
      const stored = await storeImageFromLink(link.trim());
      onChange({ url: stored.url, publicId: stored.publicId, sourceUrl: stored.sourceUrl });
      setLink('');
      showMessage(stored.stored ? 'Image stored.' : 'Saved as a link. Image storage is not set up on this server.');
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div>
      <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">{label}</span>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-32 h-32 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0">
          {value?.url ? (
            <img
              src={courseImage(value.url, 320)}
              alt="Selected"
              onError={showDefaultImage}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="h-full flex items-center justify-center text-[11px] text-slate-400">No image</span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <input
            ref={fileInput}
            type="file"
            data-testid="image-file-input"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => fileInput.current?.click()}
              className={SECONDARY_BUTTON}
            >
              <Upload size={14} />
              <span>{isBusy && progress > 0 ? `Uploading ${progress}%` : 'Upload Image'}</span>
            </button>
            {value?.url && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onChange({ url: '', publicId: '', sourceUrl: '' })}
                className={SECONDARY_BUTTON}
              >
                Remove
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Or paste an https image link"
              className={INPUT_STYLE}
            />
            <button
              type="button"
              disabled={isBusy || !link.trim()}
              onClick={handleLink}
              className={`${SECONDARY_BUTTON} shrink-0`}
            >
              <Link2 size={14} />
              <span>Use Link</span>
            </button>
          </div>

          {hint && <p className="text-[11px] text-slate-500 dark:text-slate-400">{hint}</p>}
          {message && (
            <p
              role={isError ? 'alert' : 'status'}
              className={`text-[11px] font-semibold ${
                isError ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
