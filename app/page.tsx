"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const BASE = "https://chobei-onigiri.jp/wp/wp-content/themes/chobei/assets/img";

const ONIGIRI = [
  { id:"shio",     name:"塩おにぎり",       ruby:"しおにぎり",       desc:"厳選塩と新潟産コシヒカリだけ。米の甘みと塩の旨みが一体となった究極のシンプル。",  img:`${BASE}/lineup-01.jpg` },
  { id:"zakkoku",  name:"雑穀米もち麦",     ruby:"ざっこくまいもちむぎ", desc:"食物繊維たっぷりの雑穀米ともち麦。噛むほどに広がる豊かな味わい。",             img:`${BASE}/lineup-02.jpg` },
  { id:"shiso",    name:"しそ昆布",         ruby:"しそこんぶ",       desc:"さわやかなしそと北海道産真昆布の佃煮。上品な旨みが口いっぱいに。",              img:`${BASE}/lineup-03.jpg` },
  { id:"okaka",    name:"おかか",           ruby:"おかか",           desc:"厳選した鰹節を醤油でしっとりまとめた。素朴ながらも奥深い和の旨み。",             img:`${BASE}/lineup-04.jpg` },
  { id:"ume",      name:"梅",               ruby:"うめ",             desc:"紀州産南高梅の果肉をたっぷり。爽やかな酸味と香りが食欲をそそる定番。",           img:`${BASE}/lineup-05.jpg` },
  { id:"takana",   name:"高菜巻き",         ruby:"たかなまき",       desc:"風味豊かな高菜で包んだ一品。ピリッとした辛みと米の甘さが絶妙。",                img:`${BASE}/lineup-06.jpg` },
  { id:"gyushigure",name:"牛しぐれ",        ruby:"ぎゅうしぐれ",     desc:"甘辛く炊いた牛しぐれ煮をたっぷり包んだ贅沢な一粒。",                           img:`${BASE}/lineup-07.jpg` },
  { id:"sake",     name:"鮭",               ruby:"さけ",             desc:"国産銀鮭をじっくり焼き上げ手でほぐした。ふんわりとした塩気と風味が米と溶け合う。",  img:`${BASE}/lineup-08.jpg` },
  { id:"ika",      name:"イカの塩辛",       ruby:"いかのしおから",   desc:"肉厚なイカを熟成させた塩辛。濃厚な旨みとほどよい塩加減が癖になる一品。",         img:`${BASE}/lineup-09.jpg` },
  { id:"mentai",   name:"からし明太子",     ruby:"からしめんたいこ", desc:"博多直送の辛子明太子をそのままどっさり。辛みと旨みのバランスが絶妙。",            img:`${BASE}/lineup-10.jpg` },
  { id:"uni",      name:"うにくらげ",       ruby:"うにくらげ",       desc:"濃厚なうにとくらげを合わせた贅沢な組み合わせ。磯の香りが広がる高級感。",          img:`${BASE}/lineup-11.jpg` },
  { id:"tuna",     name:"ツナマヨ",         ruby:"つなまよ",         desc:"特製マヨネーズで和えたツナはクリーミーで濃厚。老若男女に愛される不動の人気者。",   img:`${BASE}/lineup-12.jpg` },
  { id:"maze",     name:"季節の混ぜご飯",   ruby:"きせつのまぜごはん",desc:"旬の食材をふんだんに使った季節限定の一品。長米ならではの季節感をお楽しみください。",img:`${BASE}/lineup-13.jpg` },
  { id:"karasumi", name:"生からすみ",       ruby:"なまからすみ",     desc:"希少な生からすみを贅沢に使用。濃厚な旨みと塩気が米に溶け込む極上の一粒。",        img:`${BASE}/lineup-14.jpg` },
  { id:"saba",     name:"焼きサバ",         ruby:"やきさば",         desc:"脂の乗った国産サバをじっくり焼き上げた。香ばしさと旨みが食欲を刺激する。",        img:`${BASE}/lineup-15.jpg` },
  { id:"kakuni",   name:"角煮",             ruby:"かくに",           desc:"醤油ベースでじっくり煮込んだ豚の角煮。とろけるような食感と深い旨み。",             img:`${BASE}/lineup-16.jpg` },
  { id:"anago",    name:"穴子みりん干し",   ruby:"あなごみりんぼし", desc:"みりんで干した穴子の甘辛い風味。上品な甘みと香ばしさが後を引く。",               img:`${BASE}/lineup-17.jpg` },
  { id:"toncha",   name:"上対馬とんちゃん", ruby:"かみつしまとんちゃん",desc:"対馬から直送した希少な豚肉の一品。島の風土が育んだ独特の旨みを閉じ込めた。",  img:`${BASE}/lineup-18.jpg` },
];

const MAX_VOTES = 3;

function VoteBar({ pct, rank }: { pct: number; rank: number }) {
  const barColor = rank === 1 ? "#c8a060" : rank === 2 ? "#a8a8a8" : rank === 3 ? "#b87040" : "#d8d0c4";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, borderRadius: 2, background: "var(--line)", overflow: "hidden" }}>
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

function Medal({ rank }: { rank: number }) {
  if (rank > 3) return <span style={{ fontSize:"0.7rem", color:"var(--mid)", fontFamily:"monospace", minWidth:20 }}>{rank}</span>;
  return <span style={{ fontSize:"1rem", lineHeight:1 }}>{["🥇","🥈","🥉"][rank-1]}</span>;
}

export default function Page() {

  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(ONIGIRI.map(o => [o.id, 0]))
  );
  const [periodActive, setPeriodActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // サーバーから票数と投票期間を取得
  useEffect(() => {
    fetch("/api/votes")
      .then(r => r.json())
      .then(({ votes: v, period }) => {
        setVotes(v);
        if (!period) { setPeriodActive(true); return; }
        const now = new Date();
        setPeriodActive(new Date(period.start) <= now && now <= new Date(period.end));
      })
      .catch(() => setPeriodActive(true))
      .finally(() => setLoading(false));
  }, []);

  // 直前に投票したIDリスト（表示用）
  const [myVotes, setMyVotes] = useState<string[]>([]);

  // 選択中（まだ投票前）
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"vote" | "ranking">("vote");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasVoted = submitted;

  // タブ切替時にreveal要素を再監視
  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
        { rootMargin: "0px 0px -40px 0px" }
      );
      document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, 50);
    return () => clearTimeout(timer);
  }, [tab]);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const ranked = [...ONIGIRI]
    .map(o => ({ ...o, count: votes[o.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .map((o, i) => ({ ...o, rank: i + 1 }));

  function toggleSelect(id: string) {
    if (hasVoted || !periodActive) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= MAX_VOTES) return prev;
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0 || submitting) return;
    const ids = [...selected];
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        setSubmitError(error === "outside voting period" ? "投票期間外です" : "投票に失敗しました");
        return;
      }
      // 最新票数を再取得
      const { votes: newVotes } = await fetch("/api/votes").then(r => r.json());
      setVotes(newVotes);
      setMyVotes(ids);
      setSubmitted(true);
      setTimeout(() => setTab("ranking"), 1400);
    } catch {
      setSubmitError("通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  }

  function handleTabChange(t: "vote" | "ranking") {
    if (t === "vote") {
      setSelected(new Set());
      setSubmitted(false);
      setMyVotes([]);
      setSubmitError(null);
      // 最新票数を再取得
      fetch("/api/votes").then(r => r.json()).then(({ votes: v }) => setVotes(v)).catch(() => {});
    }
    setTab(t);
  }

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh" }}>

      {/* ヘッダー */}
      <header style={{ background:"var(--white)", borderBottom:"1px solid var(--line)" }}>
        <div style={{
          maxWidth:900, margin:"0 auto", padding:"0 24px",
          height:64, display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div>
            <div style={{ fontSize:"1.2rem", fontWeight:400, letterSpacing:"0.2em", color:"var(--ink)", lineHeight:1 }}>長米</div>
            <div className="sans" style={{ fontSize:"0.6rem", color:"var(--mid)", letterSpacing:"0.2em", marginTop:3 }}>米問屋のおにぎり屋</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="sans" style={{ fontSize:"0.7rem", color:"var(--gold)", letterSpacing:"0.15em" }}>人気おにぎり投票</div>
            <div className="sans" style={{ fontSize:"0.62rem", color:"var(--mid)", marginTop:2 }}>
              総投票数 <strong style={{ color:"var(--ink)" }}>{totalVotes.toLocaleString()}</strong> 票
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{
        background:"var(--white)", borderBottom:"1px solid var(--line)",
        padding:"52px 24px 48px", textAlign:"center",
        animation:"fadeUp 0.8s ease both",
      }}>
        <p className="sans" style={{ fontSize:"0.65rem", letterSpacing:"0.4em", color:"var(--gold)", marginBottom:20, textTransform:"uppercase" }}>
          Popularity Vote 2024
        </p>
        <h1 style={{ fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:400, letterSpacing:"0.15em", lineHeight:1.4, color:"var(--ink)", marginBottom:16 }}>
          あなたの推しおにぎりに<br/>票を入れてください。
        </h1>
        <p className="sans" style={{ fontSize:"0.88rem", color:"var(--mid)", lineHeight:1.85, maxWidth:480, margin:"0 auto 12px" }}>
          お気に入りのおにぎりを最大3つ選んで、「投票する」ボタンを押してください。
        </p>
        {loading && (
          <p className="sans" style={{ fontSize:"0.75rem", color:"var(--mid)", marginBottom:12 }}>読み込み中…</p>
        )}
        {periodActive === false && (
          <div style={{
            display:"inline-block", padding:"10px 28px", marginBottom:12,
            background:"#fff8ee", border:"1px solid var(--gold)", borderRadius:2,
          }}>
            <span className="sans" style={{ fontSize:"0.8rem", color:"var(--accent)" }}>
              現在は投票期間外です
            </span>
          </div>
        )}
        {periodActive !== false && (
          <p className="sans" style={{ fontSize:"0.75rem", color:"var(--accent)", marginBottom: hasVoted ? 24 : 0 }}>
            1人3票まで投票できます。
          </p>
        )}

        {submitted && (
          <div style={{
            display:"inline-block", padding:"12px 32px", marginTop:8,
            background:"#fff8ee", border:"1px solid var(--gold)", borderRadius:2,
          }}>
            <span className="sans" style={{ fontSize:"0.82rem", color:"var(--accent)" }}>
              {myVotes.map(id => ONIGIRI.find(o => o.id === id)?.name).join("・")}　に投票しました ✓
            </span>
          </div>
        )}
      </section>

      {/* タブ */}
      <div style={{ background:"var(--white)", borderBottom:"1px solid var(--line)", display:"flex", maxWidth:900, margin:"0 auto" }}>
        {([["vote","投票する"],["ranking","ランキング"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => handleTabChange(key)} className="sans" style={{
            flex:1, padding:"14px 0",
            fontSize:"0.82rem", letterSpacing:"0.1em",
            color: tab === key ? "var(--accent)" : "var(--mid)",
            background:"transparent", border:"none",
            borderBottom: tab === key ? "2px solid var(--accent)" : "2px solid transparent",
            cursor:"pointer", transition:"all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"40px 24px 120px" }}>

        {/* ══ 投票タブ ══ */}
        {tab === "vote" && (
          <>
            {!hasVoted && selected.size > 0 && (
              <div className="sans" style={{
                textAlign:"center", marginBottom:24,
                fontSize:"0.8rem", color:"var(--mid)",
              }}>
                {selected.size}/{MAX_VOTES} 票選択中
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
              {ONIGIRI.map((o, i) => {
                const isSelected = selected.has(o.id);
                const isVoted = myVotes.includes(o.id);
                const isDisabled = hasVoted ? !isVoted : (!isSelected && selected.size >= MAX_VOTES);

                return (
                  <div key={o.id} className="reveal" style={{ transitionDelay:`${i * 40}ms` }}>
                    <button
                      onClick={() => toggleSelect(o.id)}
                      disabled={hasVoted}
                      style={{
                        width:"100%", textAlign:"left",
                        background: isSelected || isVoted ? "#fff8ee" : "var(--white)",
                        border: isSelected || isVoted ? "2px solid var(--gold)" : "1px solid var(--line)",
                        borderRadius:4, padding:0,
                        cursor: hasVoted || isDisabled ? "default" : "pointer",
                        opacity: isDisabled ? 0.4 : 1,
                        transition:"all 0.18s",
                        boxShadow: isSelected || isVoted ? "0 2px 16px rgba(200,160,96,0.18)" : "none",
                        overflow:"hidden",
                        display:"flex", flexDirection:"column",
                      }}
                      onMouseEnter={e => { if (!hasVoted && !isDisabled) e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
                    >
                      {/* 写真 */}
                      <div style={{ position:"relative", width:"100%", aspectRatio:"4/3", background:"#f0ece6" }}>
                        <Image
                          src={o.img}
                          alt={o.name}
                          fill
                          style={{ objectFit:"cover" }}
                          sizes="(max-width:600px) 50vw, 200px"
                          unoptimized
                        />
                        {/* 選択チェック */}
                        {(isSelected || isVoted) && (
                          <div style={{
                            position:"absolute", top:8, right:8,
                            width:28, height:28, borderRadius:"50%",
                            background:"var(--gold)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"0.85rem", color:"white", fontWeight:700,
                          }}>✓</div>
                        )}
                      </div>

                      {/* テキスト */}
                      <div style={{ padding:"14px 16px 16px" }}>
                        <div className="sans" style={{ fontSize:"0.6rem", color:"var(--mid)", letterSpacing:"0.2em", marginBottom:4 }}>
                          {o.ruby}
                        </div>
                        <div style={{ fontSize:"1rem", fontWeight:400, letterSpacing:"0.08em", color:"var(--ink)", marginBottom:6 }}>
                          {o.name}
                        </div>
                        <p className="sans" style={{ fontSize:"0.7rem", color:"var(--mid)", lineHeight:1.7 }}>
                          {o.desc}
                        </p>
                        {isVoted && (
                          <div style={{ marginTop:8 }}>
                            <span className="sans" style={{ fontSize:"0.68rem", color:"var(--gold)", letterSpacing:"0.12em" }}>
                              ✓ 投票済み
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══ ランキングタブ ══ */}
        {tab === "ranking" && (
          <div>
            <div style={{ textAlign:"center", marginBottom:40, animation:"fadeUp 0.6s ease both" }}>
              <p style={{ fontSize:"1.1rem", letterSpacing:"0.15em", color:"var(--ink)", marginBottom:8 }}>現在の人気ランキング</p>
              <p className="sans" style={{ fontSize:"0.75rem", color:"var(--mid)" }}>総投票数 {totalVotes.toLocaleString()} 票</p>
            </div>

            {/* Top3 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:40 }}>
              {([1,0,2] as const).map((idx, col) => {
                const item = ranked[idx];
                const pct = totalVotes > 0 ? Math.round(item.count / totalVotes * 100) : 0;
                const heights = [120, 90, 72];
                const podiumColors = ["#c8a060","#a8a8a8","#b87040"];
                return (
                  <div key={item.id} className="reveal" style={{
                    transitionDelay:`${col*100}ms`,
                    display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                  }}>
                    <div style={{ position:"relative", width:80, height:80, borderRadius:"50%", overflow:"hidden", background:"#f0ece6" }}>
                      <Image src={item.img} alt={item.name} fill style={{ objectFit:"cover" }} sizes="80px" unoptimized/>
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <Medal rank={item.rank}/>
                      <div style={{ fontSize:"0.95rem", letterSpacing:"0.08em", marginTop:4 }}>{item.name}</div>
                      <div className="sans" style={{ fontSize:"0.72rem", color:"var(--gold)", fontWeight:600, marginTop:2 }}>
                        {item.count.toLocaleString()} 票 ({pct}%)
                      </div>
                    </div>
                    <div style={{
                      width:"100%", background:"var(--line)", borderRadius:2,
                      overflow:"hidden", height:heights[idx],
                      display:"flex", alignItems:"flex-end",
                    }}>
                      <div style={{
                        width:"100%", borderRadius:2,
                        height:`${pct}%`,
                        background:podiumColors[idx],
                        transition:"height 1s cubic-bezier(.22,.68,0,1.2)",
                        minHeight:4,
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 全リスト */}
            <div style={{ borderTop:"1px solid var(--line)" }}>
              {ranked.map((o, i) => {
                const pct = totalVotes > 0 ? Math.round(o.count / totalVotes * 100) : 0;
                const isMe = myVotes.includes(o.id);
                return (
                  <div key={o.id} className="reveal" style={{
                    transitionDelay:`${i * 30}ms`,
                    display:"grid", gridTemplateColumns:"36px 60px 1fr auto",
                    gap:16, alignItems:"center",
                    padding:"14px 4px",
                    borderBottom:"1px solid var(--line)",
                    background: isMe ? "#fff8ee" : "transparent",
                  }}>
                    <div style={{ textAlign:"center" }}><Medal rank={o.rank}/></div>
                    <div style={{ position:"relative", width:60, height:60, borderRadius:4, overflow:"hidden", background:"#f0ece6" }}>
                      <Image src={o.img} alt={o.name} fill style={{ objectFit:"cover" }} sizes="60px" unoptimized/>
                    </div>
                    <div>
                      <div style={{ fontSize:"0.95rem", letterSpacing:"0.08em", marginBottom:4 }}>
                        {o.name}
                        {isMe && <span className="sans" style={{ fontSize:"0.62rem", color:"var(--gold)", marginLeft:8 }}>あなたの票</span>}
                      </div>
                      <VoteBar pct={pct} rank={o.rank}/>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div className="sans" style={{ fontSize:"0.88rem", fontWeight:600, color:"var(--ink)" }}>{o.count.toLocaleString()}</div>
                      <div className="sans" style={{ fontSize:"0.65rem", color:"var(--mid)", marginTop:2 }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!hasVoted && (
              <div style={{ textAlign:"center", marginTop:40 }}>
                <button onClick={() => handleTabChange("vote")} className="sans" style={{
                  padding:"12px 40px",
                  border:"1px solid var(--accent)", background:"transparent",
                  color:"var(--accent)", fontSize:"0.8rem", letterSpacing:"0.12em",
                  cursor:"pointer", borderRadius:2, transition:"all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background="var(--accent)"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.color="var(--accent)"; }}
                >投票する →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ 固定投票ボタン（投票前・選択中のみ表示） ══ */}
      {tab === "vote" && !hasVoted && periodActive && (
        <div style={{
          position:"fixed", bottom:0, left:0, right:0,
          background:"var(--white)", borderTop:"1px solid var(--line)",
          padding:"16px 24px",
          display:"flex", alignItems:"center", justifyContent:"center", gap:16,
          zIndex:100,
        }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span className="sans" style={{ fontSize:"0.8rem", color:"var(--mid)" }}>
              {selected.size > 0 ? `${selected.size}/${MAX_VOTES} 票選択中` : `最大${MAX_VOTES}つ選んでください`}
            </span>
            {submitError && (
              <span className="sans" style={{ fontSize:"0.72rem", color:"#e05050" }}>{submitError}</span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0 || submitting}
            className="sans"
            style={{
              padding:"12px 48px",
              background: selected.size > 0 && !submitting ? "var(--accent)" : "var(--line)",
              color: selected.size > 0 && !submitting ? "white" : "var(--mid)",
              border:"none", borderRadius:2,
              fontSize:"0.9rem", letterSpacing:"0.15em",
              cursor: selected.size > 0 && !submitting ? "pointer" : "default",
              transition:"all 0.2s",
              fontFamily:"inherit",
            }}
          >
            {submitting ? "送信中…" : "投票する"}
          </button>
        </div>
      )}

      {/* フッター */}
      <footer style={{ borderTop:"1px solid var(--line)", background:"var(--white)", padding:"36px 24px", textAlign:"center" }}>
        <div style={{ fontSize:"1.1rem", letterSpacing:"0.25em", color:"var(--ink)", marginBottom:8 }}>長米</div>
        <p className="sans" style={{ fontSize:"0.65rem", color:"var(--mid)", letterSpacing:"0.1em", lineHeight:2 }}>
          米問屋のおにぎり屋 長米<br/>
          <a href="https://chobei-onigiri.jp/" target="_blank" rel="noopener" style={{ color:"var(--mid)", textDecoration:"underline" }}>
            chobei-onigiri.jp
          </a>
        </p>
        <p className="sans" style={{ fontSize:"0.6rem", color:"#bbb", marginTop:16 }}>
          ※ この投票サイトはファンが制作した非公式サイトです
        </p>
      </footer>
    </div>
  );
}
