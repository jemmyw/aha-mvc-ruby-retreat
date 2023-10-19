import { Highlight, themes } from "prism-react-renderer";

export const Highlighter: React.FC<{
  code: string;
  numbers?: boolean;
  className?: string;
}> = ({ code, numbers, className }) => (
  <Highlight theme={themes.nightOwl} code={code} language="tsx">
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre style={style} className={className}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {numbers && <span>{i + 1}</span>}
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
