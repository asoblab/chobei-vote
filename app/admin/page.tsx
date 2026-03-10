"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD = "chobei2024";

const ONIGIRI_NAMES: Record<string, string> = {
  shio:"塩おにぎり", zakkoku:"雑穀米もち麦", shiso:"しそ昆布",
  okaka:"おかか", ume:"梅", takana:"高菜巻き", gyushigure:"牛しぐれ",
  sake:"鮭", ika:"イカの塩辛", mentai:"からし明太子", uni:"うにくらげ",
  tuna:"ツナマヨ", maze:"季節の混ぜご飯", karasumi:"生からすみ",
  saba:"焼きサバ", kakuni:"角煮", anago:"穴子みりん干し", toncha:"上対馬とんちゃん",
};

type Period = { start: string; end: string } | null;

function fmt(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", { timeZone:"Asia/Tokyo",
    year:"numeric", month:"2-digit", day:"2-digit",
    hour:"2-digit", minute:"2-digit" });
}

function toLocalInput(iso: string) {
  // datetime-local input requires "YYYY-MM-DDTHH:mm"
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [votes, setVotes] = useState<Record<string, number>>({});
  const [period, setPeriod] = useState<Period>(null);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    if (!authed) return;
    try {
      const v = localStorage.getItem("chobei_votes_v2");
      if (v) setVotes(JSON.parse(v));
      const p = localStorage.getItem("chobei_period");
      if (p) {
        const parsed: Period = JSON.parse(p);
        setPeriod(parsed);
        if (parsed) {
          setStartInput(toLocalInput(parsed.start));
          setEndInput(toLocalInput(parsed.end));
        }
      }
    } catch {}
  }, [authed]);

  function login() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  function savePeriod() {
    if (!startInput || !endInput) return;
    const p: Period = {
      start: new Date(startInput).toISOString(),
      end: new Date(endInput).toISOString(),
    };
    localStorage.setItem("chobei_period", JSON.stringify(p));
    setPeriod(p);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearPeriod() {
    localStorage.removeItem("chobei_period");
    setPeriod(null);
    setStartInput("");
    setEndInput("");
  }

  function resetVotes() {
    if (!confirm("本当に投票データをリセットしますか？この操作は取り消せません。")) return;
    localStorage.removeItem("chobei_votes_v2");
    setVotes({});
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  }

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(votes)
    .map(([id, count]) => ({ id, name: ONIGIRI_NAMES[id] ?? id, count }))
    .sort((a, b) => b.count - a.count);

  const now = new Date();
  const isActive = period
    ? new Date(period.start) <= now && now <= new Date(period.end)
    : true;

  /* ── ログイン画面 ── */
  if (!authed) {
    return (
      <div style={{
        minHeight:"100vh", background:"#faf9f6",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:'"Hiragino Kaku Gothic ProN", sans-serif',
      }}>
        <div style={{
          background:"white", border:"1px solid #e8e2d8",
          borderRadius:4, padding:"48px 40px", width:320, textAlign:"center",
        }}>
          <div style={{ fontSize:"1.1rem", letterSpacing:"0.25em", color:"#1c1c1c", marginBottom:6 }}>長米</div>
          <div style={{ fontSize:"0.65rem", color:"#6b6560", letterSpacing:"0.15em", marginBottom:32 }}>管理画面</div>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={e => { if (e.key === "Enter") login(); }}
            placeholder="パスワード"
            style={{
              width:"100%", padding:"10px 14px",
              border: pwError ? "1px solid #e05050" : "1px solid #e8e2d8",
              borderRadius:2, fontSize:"0.9rem",
              outline:"none", marginBottom:8,
              fontFamily:"inherit",
            }}
          />
          {pwError && <p style={{ fontSize:"0.72rem", color:"#e05050", marginBottom:8 }}>パスワードが違います</p>}
          <button onClick={login} style={{
            width:"100%", padding:"10px 0",
            background:"#8b5e3c", color:"white", border:"none",
            borderRadius:2, fontSize:"0.82rem", letterSpacing:"0.12em",
            cursor:"pointer", fontFamily:"inherit",
          }}>ログイン</button>
        </div>
      </div>
    );
  }

  /* ── 管理画面 ── */
  const S = {
    card: {
      background:"white", border:"1px solid #e8e2d8",
      borderRadius:4, padding:"28px 28px 24px", marginBottom:20,
    } as React.CSSProperties,
    h2: {
      fontSize:"0.75rem", letterSpacing:"0.2em", color:"#8b5e3c",
      marginBottom:20, paddingBottom:12,
      borderBottom:"1px solid #e8e2d8",
    } as React.CSSProperties,
    label: {
      fontSize:"0.72rem", color:"#6b6560", letterSpacing:"0.08em",
      display:"block", marginBottom:6,
    } as React.CSSProperties,
    input: {
      padding:"9px 12px", border:"1px solid #e8e2d8", borderRadius:2,
      fontSize:"0.82rem", fontFamily:"inherit", outline:"none",
      width:"100%",
    } as React.CSSProperties,
    btn: (color: string) => ({
      padding:"9px 24px", background:color, color:"white",
      border:"none", borderRadius:2, fontSize:"0.78rem",
      letterSpacing:"0.1em", cursor:"pointer", fontFamily:"inherit",
    } as React.CSSProperties),
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#faf9f6",
      fontFamily:'"Hiragino Kaku Gothic ProN", sans-serif',
    }}>
      {/* ヘッダー */}
      <header style={{ background:"white", borderBottom:"1px solid #e8e2d8", padding:"0 24px", height:56,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <span style={{ fontSize:"1rem", letterSpacing:"0.2em", color:"#1c1c1c" }}>長米</span>
          <span style={{ fontSize:"0.65rem", color:"#6b6560", marginLeft:12, letterSpacing:"0.1em" }}>管理画面</span>
        </div>
        <button onClick={() => setAuthed(false)} style={{
          background:"transparent", border:"1px solid #e8e2d8", borderRadius:2,
          padding:"6px 16px", fontSize:"0.72rem", color:"#6b6560", cursor:"pointer",
          fontFamily:"inherit",
        }}>ログアウト</button>
      </header>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"32px 24px 80px" }}>

        {/* ステータスバナー */}
        <div style={{
          background: isActive ? "#f0fff4" : "#fff8ee",
          border: `1px solid ${isActive ? "#68d391" : "#c8a060"}`,
          borderRadius:4, padding:"12px 20px", marginBottom:20,
          display:"flex", alignItems:"center", gap:10,
        }}>
          <span style={{ fontSize:"0.7rem", color: isActive ? "#276749" : "#8b5e3c" }}>
            {period
              ? isActive
                ? `投票受付中 ── ${fmt(period.start)} 〜 ${fmt(period.end)}`
                : now < new Date(period.start)
                  ? `投票開始前 ── 開始: ${fmt(period.start)}`
                  : `投票終了 ── 終了: ${fmt(period.end)}`
              : "投票期間: 設定なし（常時受付）"}
          </span>
        </div>

        {/* 投票期間設定 */}
        <div style={S.card}>
          <div style={S.h2}>投票期間の設定</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <div>
              <label style={S.label}>開始日時</label>
              <input type="datetime-local" value={startInput}
                onChange={e => setStartInput(e.target.value)} style={S.input}/>
            </div>
            <div>
              <label style={S.label}>終了日時</label>
              <input type="datetime-local" value={endInput}
                onChange={e => setEndInput(e.target.value)} style={S.input}/>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={savePeriod} style={S.btn("#8b5e3c")}>保存</button>
            {period && (
              <button onClick={clearPeriod} style={S.btn("#a0a0a0")}>期間を削除（常時受付に戻す）</button>
            )}
            {saved && <span style={{ fontSize:"0.72rem", color:"#48bb78" }}>保存しました ✓</span>}
          </div>
        </div>

        {/* 集計 */}
        <div style={S.card}>
          <div style={{ ...S.h2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span>現在の投票集計</span>
            <span style={{ fontSize:"0.7rem", color:"#6b6560", fontWeight:400 }}>
              総投票数 <strong style={{ color:"#1c1c1c" }}>{totalVotes.toLocaleString()}</strong> 票
            </span>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.82rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign:"left", padding:"8px 4px", borderBottom:"1px solid #e8e2d8",
                  fontSize:"0.68rem", color:"#6b6560", letterSpacing:"0.08em", fontWeight:400 }}>順位</th>
                <th style={{ textAlign:"left", padding:"8px 4px", borderBottom:"1px solid #e8e2d8",
                  fontSize:"0.68rem", color:"#6b6560", letterSpacing:"0.08em", fontWeight:400 }}>商品名</th>
                <th style={{ textAlign:"right", padding:"8px 4px", borderBottom:"1px solid #e8e2d8",
                  fontSize:"0.68rem", color:"#6b6560", letterSpacing:"0.08em", fontWeight:400 }}>票数</th>
                <th style={{ textAlign:"right", padding:"8px 4px", borderBottom:"1px solid #e8e2d8",
                  fontSize:"0.68rem", color:"#6b6560", letterSpacing:"0.08em", fontWeight:400 }}>割合</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item, i) => {
                const pct = totalVotes > 0 ? (item.count / totalVotes * 100).toFixed(1) : "0.0";
                const barW = totalVotes > 0 ? item.count / totalVotes * 100 : 0;
                return (
                  <tr key={item.id}>
                    <td style={{ padding:"10px 4px", borderBottom:"1px solid #f0ece6", color:"#6b6560", width:32 }}>
                      {i + 1}
                    </td>
                    <td style={{ padding:"10px 4px", borderBottom:"1px solid #f0ece6", color:"#1c1c1c" }}>
                      <div>{item.name}</div>
                      <div style={{ height:3, borderRadius:2, background:"#f0ece6", marginTop:4, overflow:"hidden" }}>
                        <div style={{
                          height:"100%", borderRadius:2,
                          width:`${barW}%`,
                          background: i === 0 ? "#c8a060" : i === 1 ? "#a8a8a8" : i === 2 ? "#b87040" : "#d8d0c4",
                        }}/>
                      </div>
                    </td>
                    <td style={{ padding:"10px 4px", borderBottom:"1px solid #f0ece6", textAlign:"right",
                      fontFamily:"monospace", color:"#1c1c1c" }}>{item.count.toLocaleString()}</td>
                    <td style={{ padding:"10px 4px", borderBottom:"1px solid #f0ece6", textAlign:"right",
                      fontFamily:"monospace", color:"#6b6560" }}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* リセット */}
        <div style={{ ...S.card, borderColor:"#fde8e8" }}>
          <div style={{ ...S.h2, color:"#c53030" }}>危険操作</div>
          <p style={{ fontSize:"0.78rem", color:"#6b6560", marginBottom:16, lineHeight:1.7 }}>
            投票データを完全にリセットします。この操作は取り消せません。
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={resetVotes} style={S.btn("#e05050")}>投票データをリセット</button>
            {resetDone && <span style={{ fontSize:"0.72rem", color:"#48bb78" }}>リセット完了 ✓</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
