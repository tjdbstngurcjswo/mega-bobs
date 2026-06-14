import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import type { NoticeBodyProps } from './NoticeBody.types';
import {
  blockquoteClass,
  codeClass,
  h1Class,
  h2Class,
  h3Class,
  hrClass,
  liClass,
  linkClass,
  olClass,
  pClass,
  preClass,
  ulClass,
  wrapperClass,
} from './NoticeBody.styles';

const NoticeBody = ({ body }: NoticeBodyProps) => (
  <div className={wrapperClass}>
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => <h1 className={h1Class}>{children}</h1>,
        h2: ({ children }) => <h2 className={h2Class}>{children}</h2>,
        h3: ({ children }) => <h3 className={h3Class}>{children}</h3>,
        p: ({ children, node }) => {
          const hasImage = node?.children?.some(
            (child) => child.type === 'element' && child.tagName === 'img'
          );
          if (hasImage) return <>{children}</>;
          return <p className={pClass}>{children}</p>;
        },
        img: ({ src, alt }) =>
          src ? (
            <figure className="mx-auto my-4 w-4/5">
              <Image
                src={src as string}
                alt={alt ?? ''}
                width={0}
                height={0}
                sizes="80vw"
                className="border-line block h-auto w-full rounded-lg border"
              />
              {alt && (
                <figcaption className="text-muted mt-1.5 text-[11px]">
                  {alt}
                </figcaption>
              )}
            </figure>
          ) : null,
        a: ({ href, children }) => {
          const isExternal = href?.startsWith('http');
          return (
            <a
              href={href}
              className={linkClass}
              {...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
            >
              {children}
            </a>
          );
        },
        ul: ({ children }) => <ul className={ulClass}>{children}</ul>,
        ol: ({ children }) => <ol className={olClass}>{children}</ol>,
        li: ({ children }) => <li className={liClass}>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className={blockquoteClass}>{children}</blockquote>
        ),
        hr: () => <hr className={hrClass} />,
        code: ({ children }) => <code className={codeClass}>{children}</code>,
        pre: ({ children }) => <pre className={preClass}>{children}</pre>,
      }}
    >
      {body}
    </ReactMarkdown>
  </div>
);

export default NoticeBody;
