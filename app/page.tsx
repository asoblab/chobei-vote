"use client";

import { useState, useEffect } from "react";

/* ─── おにぎりデータ ─── */
const ONIGIRI = [
  { id:"shio",      name:"塩にぎり",     ruby:"しおにぎり",     desc:"長米自慢の厳選塩と新潟産コシヒカリだけ。\n米の甘みと塩の旨みが一体となった究極のシンプル。",  color:"#f5f0e8" },
  { id:"ume",       name:"梅",           ruby:"うめ",           desc:"紀州産南高梅の果肉をたっぷり。\n爽やかな酸味と香りが食欲をそそる定番の一粒。",       color:"#fdf0f0" },
  { id:"sake",      name:"焼き鮭",       ruby:"やきさけ",       desc:"国産銀鮭をじっくり焼き上げ手でほぐした。\nふんわりと塩気のある風味が米と溶け合う。",       color:"#fff3ed" },
  { id:"tuna",      name:"ツナマヨ",     ruby:"つなまよ",       desc:"特製マヨネーズで和えたツナはクリーミーで濃厚。\n老若男女に愛され続ける不動の人気者。",        color:"#f8f8f0" },
  { id:"kombu",     name:"昆布",         ruby:"こんぶ",         desc:"北海道産真昆布を丁寧に炊き上げた佃煮。\n深い旨みと上品な甘みが口いっぱいに広がる。",      color:"#f0f4f0" },
  { id:"tarako",    name:"たらこ",       ruby:"たらこ",         desc:"肉厚で粒立ちのよい明太子を贅沢に包んだ。\nほどよい塩加減とぷちぷちした食感が堪らない。",   color:"#fdf0f4" },
  { id:"okaka",     name:"おかか",       ruby:"おかか",         desc:"厳選した鰹節を醤油でしっとりまとめた。\n素朴ながらも奥深い、和の旨みの真髄。",           color:"#f5f2ec" },
  { id:"natto",     name:"納豆",         ruby:"なっとう",       desc:"北海道産大豆の国産納豆に特製たれを絡めた。\n糸を引く個性と旨みが好きな人にはたまらない。",  color:"#f8f5e8" },
  { id:"mentai",    name:"明太子",       ruby:"めんたいこ",     desc:"博多直送の辛子明太子をそのままどっさり。\n辛みと旨みのバランスが絶妙な大人の一粒。",      color:"#fdf0f0" },
  { id:"karaage",   name:"唐揚げ",       ruby:"からあげ",       desc:"醤油ベースのたれで下味をつけたジューシーな鶏。\nボリューム満点で食べ応えも充実。",         color:"#fdf5ec" },
];

/* ─── おにぎりSVG ─── */
function OnigiriSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 120, height: "auto" }}>
      <defs>
        <radialGradient id={`rg-${color.replace("#","")}`} cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
        </radialGradient>
      </defs>
      {/* 海苔 */}
      <path d="M 20 88 Q 20 98 60 100 Q 100 98 100 88 L 100 78 Q 60 82 20 78 Z"
        fill="#2d3b2a"/>
      {/* 本体 */}
      <path d="M 60 8 Q 20 30 18 70 Q 18 88 60 90 Q 102 88 102 70 Q 100 30 60 8 Z"
        fill={`url(#rg-${color.replace("#","")})`}/>
      <path d="M 60 8 Q 20 30 18 70 Q 18 88 60 90 Q 102 88 102 70 Q 100 30 60 8 Z"
        fill={color} opacity="0.6"/>
      {/* ハイライト */}
      <ellipse cx="46" cy="35" rx="14" ry="20" fill="white" opacity="0.25" transform="rotate(-15 46 35)"/>
      {/* アウトライン */}
      <path d="M 60 8 Q 20 30 18 70 Q 18 88 60 90 Q 102 88 102 70 Q 100 30 60 8 Z"
        fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
    </svg>
  );
}

/* ─── 投票バー ─── */
function VoteBar({ pct, rank }: { pct: number; rank: number }) {
  const barColor = rank === 1 ? "#c8a060" : rank === 2 ? "#a8a8a8" : rank === 3 ? "#b87040" : "#d8d0c4";
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        height: 4, borderRadius: 2,
        background: "var(--line)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 2,
          width: `${pct}%`,
          background: barColor,
          transition: "width 0.8s cubic-bezier(.22,.68,0,1.2)",
        }}/>
      </div>
    </div>
  );
}

/* ─── メダル ─── */
function Medal({ rank }: { rank: number }) {
  if (rank > 3) return <span style={{ fontSize:"0.7rem", color:"var(--mid)", fontFamily:"monospace", minWidth:20 }}>{rank}</span>;
  const medals = ["🥇","🥈","🥉"];
  return <span style={{ fontSize:"1rem", lineHeight:1 }}>{medals[rank-1]}</span>;
}

/* ─── スクロール表示 ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ══════════════════════════
   PAGE
══════════════════════════ */
export default function Page() {
  useReveal();

  const [votes, setVotes] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return Object.fromEntries(ONIGIRI.map(o => [o.id, 0]));
    try {
      const saved = localStorage.getItem("chobei_votes");
      return saved ? JSON.parse(saved) : Object.fromEntries(ONIGIRI.map(o => [o.id, Math.floor(Math.random() * 80 + 10)]));
    } catch { return Object.fromEntries(ONIGIRI.map(o => [o.id, Math.floor(Math.random() * 80 + 10)])); }
  });

  const [myVote, setMyVote] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("chobei_my_vote");
  });

  const [popped, setPopped] = useState<string | null>(null);
  const [tab, setTab] = useState<"vote" | "ranking">("vote");

  useEffect(() => {
    localStorage.setItem("chobei_votes", JSON.stringify(votes));
  }, [votes]);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const ranked = [...ONIGIRI]
    .map(o => ({ ...o, count: votes[o.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .map((o, i) => ({ ...o, rank: i + 1 }));

  function handleVote(id: string) {
    if (myVote) return;
    setVotes(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setMyVote(id);
    localStorage.setItem("chobei_my_vote", id);
    setPopped(id);
    setTimeout(() => setPopped(null), 500);
    // 少し待ってランキングタブへ
    setTimeout(() => setTab("ranking"), 1200);
  }

  const votedItem = ONIGIRI.find(o => o.id === myVote);

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh" }}>

      {/* ══ ヘッダー ══ */}
      <header style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"0 24px",
          height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:"1.2rem", fontWeight:400, letterSpacing:"0.2em", color:"var(--ink)", lineHeight:1 }}>長米</div>
            <div className="sans" style={{ fontSize:"0.6rem", color:"var(--mid)", letterSpacing:"0.2em", marginTop:3 }}>
              米問屋のおにぎり屋
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="sans" style={{ fontSize:"0.7rem", color:"var(--gold)", letterSpacing:"0.15em" }}>
              人気おにぎり投票
            </div>
            <div className="sans" style={{ fontSize:"0.62rem", color:"var(--mid)", marginTop:2 }}>
              総投票数 <strong style={{ color:"var(--ink)" }}>{totalVotes.toLocaleString()}</strong> 票
            </div>
          </div>
        </div>
      </header>

      {/* ══ HERO ══ */}
      <section style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--line)",
        padding: "52px 24px 48px",
        textAlign: "center",
        animation: "fadeUp 0.8s ease both",
      }}>
        <p className="sans" style={{
          fontSize:"0.65rem", letterSpacing:"0.4em", color:"var(--gold)",
          marginBottom:20, textTransform:"uppercase",
        }}>Popularity Vote 2024</p>

        <h1 style={{
          fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:400,
          letterSpacing:"0.15em", lineHeight:1.4, color:"var(--ink)",
          marginBottom:16,
        }}>
          あなたの推しおにぎりに<br/>票を入れてください。
        </h1>

        <p className="sans" style={{
          fontSize:"0.88rem", color:"var(--mid)", lineHeight:1.85,
          maxWidth:480, margin:"0 auto 28px",
        }}>
          米問屋が手がける長米のおにぎり。<br/>
          1人1票、あなたのいちばんを教えてください。
        </p>

        {myVote && (
          <div style={{
            display:"inline-block",
            padding:"10px 28px",
            background:"var(--bg)",
            border:"1px solid var(--gold)",
            borderRadius:2,
          }}>
            <span className="sans" style={{ fontSize:"0.78rem", color:"var(--accent)" }}>
              「{votedItem?.name}」に投票しました　✓
            </span>
          </div>
        )}
      </section>

      {/* ══ タブ ══ */}
      <div style={{
        background:"var(--white)",
        borderBottom:"1px solid var(--line)",
        display:"flex",
        maxWidth:800, margin:"0 auto",
      }}>
        {([["vote","投票する"],["ranking","ランキング"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className="sans" style={{
            flex:1, padding:"14px 0",
            fontSize:"0.82rem", letterSpacing:"0.1em",
            color: tab === key ? "var(--accent)" : "var(--mid)",
            background:"transparent", border:"none",
            borderBottom: tab === key ? "2px solid var(--accent)" : "2px solid transparent",
            cursor:"pointer", transition:"all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 24px 80px" }}>

        {/* ══ 投票タブ ══ */}
        {tab === "vote" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
            {ONIGIRI.map((o, i) => {
              const voted = myVote === o.id;
              const disabled = !!myVote && !voted;
              return (
                <div key={o.id} className={`reveal ${popped === o.id ? "voted-pop" : ""}`}
                  style={{ transitionDelay:`${i * 50}ms` }}>
                  <button onClick={() => handleVote(o.id)} style={{
                    width:"100%", textAlign:"left",
                    background: voted ? "#fff8ee" : "var(--white)",
                    border: voted ? "1.5px solid var(--gold)" : "1px solid var(--line)",
                    borderRadius:4,
                    padding:"24px 20px",
                    cursor: disabled ? "default" : "pointer",
                    opacity: disabled ? 0.45 : 1,
                    transition:"all 0.2s, border 0.15s",
                    boxShadow: voted ? "0 2px 16px rgba(200,160,96,0.15)" : "none",
                    display:"flex", flexDirection:"column", gap:8,
                  }}
                    onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                  >
                    {/* おにぎりイラスト */}
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}>
                      <OnigiriSVG color={o.color}/>
                    </div>

                    {/* 名前 */}
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:"0.62rem", color:"var(--mid)", letterSpacing:"0.2em", marginBottom:4 }}
                        className="sans">{o.ruby}</div>
                      <div style={{ fontSize:"1.1rem", fontWeight:400, letterSpacing:"0.1em", color:"var(--ink)" }}>
                        {o.name}
                      </div>
                    </div>

                    {/* 説明 */}
                    <p className="sans" style={{
                      fontSize:"0.72rem", color:"var(--mid)",
                      lineHeight:1.7, textAlign:"left", marginTop:4,
                      whiteSpace:"pre-line",
                    }}>{o.desc}</p>

                    {/* 投票済みバッジ */}
                    {voted && (
                      <div style={{ textAlign:"center", marginTop:4 }}>
                        <span className="sans" style={{
                          fontSize:"0.68rem", color:"var(--gold)",
                          letterSpacing:"0.15em",
                        }}>✓ 投票済み</span>
                      </div>
                    )}

                    {/* 未投票：ボタン表示 */}
                    {!myVote && (
                      <div style={{
                        marginTop:8, padding:"8px 0",
                        background:"var(--bg)", borderRadius:2,
                        textAlign:"center",
                      }}>
                        <span className="sans" style={{ fontSize:"0.72rem", color:"var(--accent)", letterSpacing:"0.12em" }}>
                          投票する
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ ランキングタブ ══ */}
        {tab === "ranking" && (
          <div>
            <div style={{ textAlign:"center", marginBottom:40, animation:"fadeUp 0.6s ease both" }}>
              <p style={{ fontSize:"1.1rem", letterSpacing:"0.15em", color:"var(--ink)", marginBottom:8 }}>
                現在の人気ランキング
              </p>
              <p className="sans" style={{ fontSize:"0.75rem", color:"var(--mid)" }}>
                総投票数 {totalVotes.toLocaleString()} 票
              </p>
            </div>

            {/* Top3 podium */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:40 }}>
              {ranked.slice(0,3).map((o, i) => {
                const pct = totalVotes > 0 ? Math.round(o.count / totalVotes * 100) : 0;
                const heights = [120, 90, 72];
                const podiumColors = ["#c8a060","#a8a8a8","#b87040"];
                // 表示順: 2位・1位・3位
                const displayOrder = [1, 0, 2];
                const item = ranked[displayOrder[i]];
                const itemPct = totalVotes > 0 ? Math.round(item.count / totalVotes * 100) : 0;
                return (
                  <div key={item.id} className="reveal" style={{
                    transitionDelay:`${i*100}ms`,
                    display:"flex", flexDirection:"column", alignItems:"center",
                    gap:8,
                  }}>
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <OnigiriSVG color={item.color}/>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <Medal rank={item.rank}/>
                      <div style={{ fontSize:"0.95rem", letterSpacing:"0.1em", marginTop:4 }}>{item.name}</div>
                      <div className="sans" style={{ fontSize:"0.72rem", color:"var(--gold)", fontWeight:600, marginTop:2 }}>
                        {item.count.toLocaleString()} 票 ({itemPct}%)
                      </div>
                    </div>
                    <div style={{
                      width:"100%", background:"var(--line)", borderRadius:2,
                      overflow:"hidden", height:heights[displayOrder[i]],
                      display:"flex", alignItems:"flex-end",
                    }}>
                      <div style={{
                        width:"100%", borderRadius:2,
                        height:`${itemPct}%`,
                        background:podiumColors[displayOrder[i]],
                        transition:"height 1s cubic-bezier(.22,.68,0,1.2)",
                        minHeight:4,
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 全ランキングリスト */}
            <div style={{ borderTop:"1px solid var(--line)" }}>
              {ranked.map((o, i) => {
                const pct = totalVotes > 0 ? Math.round(o.count / totalVotes * 100) : 0;
                const isMe = myVote === o.id;
                return (
                  <div key={o.id} className="reveal" style={{
                    transitionDelay:`${i * 40}ms`,
                    display:"grid", gridTemplateColumns:"36px 64px 1fr auto",
                    gap:16, alignItems:"center",
                    padding:"16px 4px",
                    borderBottom:"1px solid var(--line)",
                    background: isMe ? "#fff8ee" : "transparent",
                    transition:"background 0.2s",
                  }}>
                    <div style={{ textAlign:"center" }}>
                      <Medal rank={o.rank}/>
                    </div>
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <OnigiriSVG color={o.color}/>
                    </div>
                    <div>
                      <div style={{ fontSize:"0.95rem", letterSpacing:"0.08em", marginBottom:4 }}>
                        {o.name}
                        {isMe && <span className="sans" style={{ fontSize:"0.62rem", color:"var(--gold)", marginLeft:8 }}>あなたの票</span>}
                      </div>
                      <VoteBar pct={pct} rank={o.rank}/>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div className="sans" style={{ fontSize:"0.88rem", fontWeight:600, color:"var(--ink)" }}>
                        {o.count.toLocaleString()}
                      </div>
                      <div className="sans" style={{ fontSize:"0.65rem", color:"var(--mid)", marginTop:2 }}>
                        {pct}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 再投票説明 */}
            {!myVote && (
              <div style={{ textAlign:"center", marginTop:40 }}>
                <button onClick={() => setTab("vote")} className="sans" style={{
                  padding:"12px 40px",
                  border:"1px solid var(--accent)",
                  background:"transparent",
                  color:"var(--accent)",
                  fontSize:"0.8rem", letterSpacing:"0.12em",
                  cursor:"pointer", borderRadius:2,
                  transition:"all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background="var(--accent)"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.color="var(--accent)"; }}
                >投票する →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ フッター ══ */}
      <footer style={{
        borderTop:"1px solid var(--line)",
        background:"var(--white)",
        padding:"36px 24px",
        textAlign:"center",
      }}>
        <div style={{ fontSize:"1.1rem", letterSpacing:"0.25em", color:"var(--ink)", marginBottom:8 }}>長米</div>
        <p className="sans" style={{ fontSize:"0.65rem", color:"var(--mid)", letterSpacing:"0.1em", lineHeight:2 }}>
          米問屋のおにぎり屋 長米<br/>
          <a href="https://chobei-onigiri.jp/" target="_blank" rel="noopener"
            style={{ color:"var(--mid)", textDecoration:"underline" }}>chobei-onigiri.jp</a>
        </p>
        <p className="sans" style={{ fontSize:"0.6rem", color:"#bbb", marginTop:16 }}>
          ※ この投票サイトはファンが制作した非公式サイトです
        </p>
      </footer>

    </div>
  );
}
