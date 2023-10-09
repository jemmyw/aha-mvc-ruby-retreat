import { Highlight, themes } from "prism-react-renderer";

export const Highlighter: React.FC<{ code: string; numbers?: boolean; }> = ({
  code, numbers,
}) => (
  <Highlight theme={themes.nightOwl} code={code} language="tsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre style={style}>
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
