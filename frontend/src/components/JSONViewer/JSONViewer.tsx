import { useState } from 'react';
import './JSONViewer.css';

export interface JSONViewerProps {
  data: any;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxHeight?: string;
  className?: string;
  showCopyButton?: boolean;
}

export default function JSONViewer({
  data,
  title,
  collapsible = false,
  defaultExpanded = true,
  maxHeight = '400px',
  className = '',
  showCopyButton = true
}: JSONViewerProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const formattedJSON = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const syntaxHighlight = (json: string) => {
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <div className={`json-viewer-container ${className}`}>
      {(title || collapsible || showCopyButton) && (
        <div className="json-viewer-header">
          <div className="json-viewer-title-section">
            {collapsible && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="json-viewer-toggle"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {title && <h3 className="json-viewer-title">{title}</h3>}
          </div>
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className="json-viewer-copy-btn"
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="json-viewer-content" style={{ maxHeight }}>
          <pre className="json-viewer-pre">
            <code
              className="json-viewer-code"
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(formattedJSON)
              }}
            />
          </pre>
        </div>
      )}
    </div>
  );
}
