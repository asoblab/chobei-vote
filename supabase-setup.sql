-- 1. votes テーブル
create table if not exists votes (
  id    text primary key,
  count integer not null default 0
);

-- 全おにぎりIDを初期登録
insert into votes (id) values
  ('shio'),('zakkoku'),('shiso'),('okaka'),('ume'),('takana'),
  ('gyushigure'),('sake'),('ika'),('mentai'),('uni'),('tuna'),
  ('maze'),('karasumi'),('saba'),('kakuni'),('anago'),('toncha')
on conflict (id) do nothing;

-- 2. period テーブル（1行固定）
create table if not exists period (
  id       integer primary key default 1,
  start_at timestamptz,
  end_at   timestamptz
);
insert into period (id) values (1) on conflict do nothing;

-- 3. 票数をアトミックにインクリメントするRPC関数
create or replace function increment_votes(vote_ids text[])
returns void as $$
begin
  update votes set count = count + 1 where id = any(vote_ids);
end;
$$ language plpgsql;

-- 4. RLSを無効化（サービスロールキーで操作するため不要）
alter table votes disable row level security;
alter table period disable row level security;
