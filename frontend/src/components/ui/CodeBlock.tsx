import React, { useState } from 'react';

interface Props {
  language?: 'bash' | 'json' | string;
  children: string;
}

const langLabel: Record<string, string> = { bash: 'bash', json: 'json' };

const CodeBlock: React.FC<Props> = ({ language = 'bash', children }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1200); } catch {}
  };
  return (
    <div className="code-block font-code">
      <div className="code-block-header">
        <span className="lang-chip">{langLabel[language] || language}</span>
        <button onClick={copy} className="copy-btn">{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className="code-pre whitespace-pre-wrap">{children}</pre>
    </div>
  );
};

export default CodeBlock;
