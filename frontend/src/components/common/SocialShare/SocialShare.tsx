import { useMemo } from 'react';
import { getSocialShareUrls } from '../../../constants/socialMedia';
import { useSiteInfo } from '../../../hooks/useContent';
import './SocialShare.css';

// Fallback values when API is not available
const FALLBACK_TITLE = 'AtYourDoorStep - Premium Natural Products';
const FALLBACK_DESCRIPTION =
  'Authentic Ratnagiri Alphonso mangoes, pure cold-pressed oils, and organic jaggery delivered to your doorstep';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  showLabels?: boolean;
}

export const SocialShare = ({
  url = window.location.href,
  title,
  description,
  className = '',
  showLabels = false,
}: SocialShareProps) => {
  // Fetch dynamic site info from ContentService
  const { data: siteInfoResponse } = useSiteInfo();

  // Get title and description from props, API, or fallback
  const shareTitle = useMemo(() => {
    if (title) return title;
    if (siteInfoResponse?.data) {
      const { companyName, tagLine } = siteInfoResponse.data;
      if (companyName) return `${companyName}${tagLine ? ` - ${tagLine}` : ''}`;
    }
    return FALLBACK_TITLE;
  }, [title, siteInfoResponse]);

  const shareDescription = useMemo(() => {
    if (description) return description;
    // Site info doesn't have description, use fallback
    return FALLBACK_DESCRIPTION;
  }, [description]);

  const shareText = `${shareTitle} - ${shareDescription}`;
  const shareUrls = getSocialShareUrls(url, shareText);

  const handleShare = (_platform: string, shareUrl: string) => {
    window.open(
      shareUrl,
      '_blank',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <div className={`social-share ${className}`}>
      {showLabels && <span className="share-label">Share:</span>}

      <button
        onClick={() => handleShare('facebook', shareUrls.facebook)}
        className="share-btn facebook"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.77 7.46H15.5v-1.9c0-.9.6-1.1 1-1.1h2.2v-3.4l-3-.01C13.24 1 12.2 2.1 12.2 4v3.46h-2.3v3.5h2.3V19h3.3v-8.04h2.8l.47-3.5z"
            fill="currentColor"
          />
        </svg>
        {showLabels && <span>Facebook</span>}
      </button>

      <button
        onClick={() => handleShare('twitter', shareUrls.twitter)}
        className="share-btn twitter"
        aria-label="Share on X (Twitter)"
        title="Share on X (Twitter)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.95718 14.8821 3.28445C14.0247 3.61173 13.2884 4.19445 12.773 4.95371C12.2575 5.71297 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39624C5.36074 6.60667 4.01032 5.43666 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z"
            fill="currentColor"
          />
        </svg>
        {showLabels && <span>X</span>}
      </button>

      <button
        onClick={() => handleShare('linkedin', shareUrls.linkedin)}
        className="share-btn linkedin"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 8C18.5 8 20.5 10 20.5 12.5V21H17V12.5C17 11.5 16 10.5 15 10.5S13 11.5 13 12.5V21H9.5V8H13V9.5C13.5 8.5 14.5 8 16 8Z"
            fill="currentColor"
          />
          <path
            d="M2 9H5.5V21H2V9ZM3.75 2C4.99264 2 6 3.00736 6 4.25C6 5.49264 4.99264 6.5 3.75 6.5C2.50736 6.5 1.5 5.49264 1.5 4.25C1.5 3.00736 2.50736 2 3.75 2Z"
            fill="currentColor"
          />
        </svg>
        {showLabels && <span>LinkedIn</span>}
      </button>

      <button
        onClick={() => handleShare('whatsapp', shareUrls.whatsapp)}
        className="share-btn whatsapp"
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.531 3.488"
            fill="currentColor"
          />
        </svg>
        {showLabels && <span>WhatsApp</span>}
      </button>
    </div>
  );
};
