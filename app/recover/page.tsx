"use client";

// ⚠️ 이 파일은 app/recover/page.tsx 경로에 넣으세요.
// 배포 후 폰에서 https://<your-domain>/recover 로 접속하면
// 이 기기(브라우저)의 localStorage에 저장된 모든 데이터를
// "읽기만" 하고 화면에 보여주거나 JSON 파일로 다운로드할 수 있습니다.
// 기존 데이터를 수정/삭제하는 코드는 전혀 없습니다.

import React, { useEffect, useState } from "react";

interface StoredEntry {
  key: string;
  value: string;
  sizeKB: string;
  isJson: boolean;
}

export default function RecoverPage() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      const result: StoredEntry[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const value = localStorage.getItem(key) ?? "";
        let isJson = false;
        try {
          JSON.parse(value);
          isJson = true;
        } catch {
          isJson = false;
        }
        result.push({
          key,
          value,
          sizeKB: (new Blob([value]).size / 1024).toFixed(1),
          isJson,
        });
      }
      setEntries(result);
    } catch (err) {
      console.error("localStorage 읽기 실패:", err);
    }
  }, []);

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // 클립보드 API 실패 시 수동 선택 안내
      alert("자동 복사에 실패했어요. 아래 텍스트를 길게 눌러 직접 선택 후 복사해주세요.");
    }
  };

  const handleDownload = (key: string, value: string) => {
    const blob = new Blob([value], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${key}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const bundle: Record<string, string> = {};
    entries.forEach((e) => {
      bundle[e.key] = e.value;
    });
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_all_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
        🔎 이 기기의 저장된 데이터 (읽기 전용)
      </h1>
      <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "16px" }}>
        이 페이지는 아무것도 수정하지 않습니다. 아래 목록이 이 브라우저에
        저장된 전부입니다.
      </p>

      {entries.length === 0 ? (
        <p style={{ color: "#f87171", fontWeight: 700 }}>
          ⚠️ 이 브라우저에는 저장된 localStorage 데이터가 없습니다.
        </p>
      ) : (
        <>
          <button
            onClick={handleDownloadAll}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              fontWeight: 700,
              borderRadius: "8px",
              marginBottom: "16px",
              border: "none",
            }}
          >
            ⬇️ 전체 데이터 한번에 다운로드
          </button>

          {entries.map((entry) => (
            <div
              key={entry.key}
              style={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "13px" }}>
                  {entry.key}
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  {entry.sizeKB} KB {entry.isJson ? "· JSON" : "· 텍스트"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <button
                  onClick={() => handleCopy(entry.key, entry.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#334155",
                    color: "#e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    border: "none",
                  }}
                >
                  {copiedKey === entry.key ? "✅ 복사됨" : "📋 클립보드로 복사"}
                </button>
                <button
                  onClick={() => handleDownload(entry.key, entry.value)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#334155",
                    color: "#e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                    border: "none",
                  }}
                >
                  ⬇️ 파일로 다운로드
                </button>
              </div>

              <textarea
                readOnly
                value={entry.value}
                onFocus={(e) => e.target.select()}
                style={{
                  width: "100%",
                  height: "100px",
                  fontSize: "10px",
                  background: "#0f172a",
                  color: "#cbd5e1",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  padding: "6px",
                }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}