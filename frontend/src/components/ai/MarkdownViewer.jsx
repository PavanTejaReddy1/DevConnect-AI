import { marked } from 'marked';
import CopyButton from './CopyButton.jsx';

export default function MarkdownViewer({ content, showCopy = true }) {
  const htmlContent = marked(content);

  return (
    <div className="relative">
      {showCopy && (
        <div className="absolute top-0 right-0 z-10">
          <CopyButton text={content} />
        </div>
      )}
      <div
        className="prose prose-sm max-w-none text-text/80"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
