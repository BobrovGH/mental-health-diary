import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProcessRendererProps {
  content: string;
}

const ProcessRenderer: React.FC<ProcessRendererProps> = ({ content }) => {
  return (
    <div className="prose max-w-none prose-headings:mt-6 prose-headings:font-bold prose-headings:text-gray-900 prose-ul:pl-4 prose-li:ml-4 prose-li:leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ children }) => <h5 className="text-m font-bold">{children}</h5>,
          ul: ({ children }) => <ul className="list-disc ml-2">{children}</ul>,
          li: ({ children }) => <li className="ml-4">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ProcessRenderer;