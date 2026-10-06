import { useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";

function CodeBlock({ codeValue, language, bIdx, copiedCodeIndex, handleCopy }) {
  const codeRef = useRef(null);

  // highlight.js သုံးပြီး code များကို အရောင်ဆိုးပေးခြင်း
  useEffect(() => {
    if (window.hljs && codeRef.current && codeValue) {
      const result = window.hljs.highlightAuto(codeValue);
      codeRef.current.innerHTML = result.value;
    }
  }, [codeValue]);

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#08090b]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 text-xs text-gray-400 font-mono">
        <span>{language || "C++"}</span>
        <button
          onClick={() => handleCopy(codeValue, bIdx)}
          className="flex items-center gap-1 hover:text-white"
        >
          {copiedCodeIndex === bIdx ? (
            <Check size={12} className="text-emerald-400" />
          ) : (
            <Copy size={12} />
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
        <code ref={codeRef} className="hljs" />
      </pre>
    </div>
  );
}

export default CodeBlock;
