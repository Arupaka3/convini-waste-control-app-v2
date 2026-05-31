import type { Receipt } from '../types';

// 今日の日付を 2026-05-31 とする
// 動的な行動フィードバックを表示するため、過去3週間分のレシートを構成する

export const initialReceipts: Receipt[] = [
  // --- 今週 (5/25 - 5/31): 利用頻度が下がり、改善傾向にある期間 ---
  {
    id: 'w1-1',
    amount: 1250,
    date: '2026-05-29T23:15', // 深夜利用、高額
    storeName: 'セブンイレブン 習志野店',
    isImpulse: true,
    impulseReasons: ['深夜利用', '高額支出'],
    items: ['とんこつラーメン大盛', 'ポテトチップス', 'モンスターエナジー']
  },
  {
    id: 'w1-2',
    amount: 320,
    date: '2026-05-27T12:30', // 普通の買い物
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: false,
    impulseReasons: [],
    items: ['鮭おにぎり', '緑茶 500ml']
  },
  {
    id: 'w1-3',
    amount: 580,
    date: '2026-05-25T08:15', // 朝の利用
    storeName: 'ローソン 津田沼駅前店',
    isImpulse: false,
    impulseReasons: [],
    items: ['サンドイッチミックス', 'ブレンドコーヒーL']
  },

  // --- 先週 (5/18 - 5/24): コンビニ利用が多く、衝動買いが頻発していた期間 ---
  {
    id: 'w2-1',
    amount: 480,
    date: '2026-05-24T23:45', // 深夜利用、衝動買い
    storeName: 'ローソン 津田沼駅前店',
    isImpulse: true,
    impulseReasons: ['深夜利用', 'ついで買い'],
    items: ['からあげクン レッド', 'チョコモナカジャンボ']
  },
  {
    id: 'w2-2',
    amount: 890,
    date: '2026-05-23T22:30', // 深夜利用、高額、衝動買い
    storeName: 'セブンイレブン 習志野店',
    isImpulse: true,
    impulseReasons: ['深夜利用', '高額支出'],
    items: ['カップそば', 'ストロングゼロ 500ml', 'チキン南蛮弁当']
  },
  {
    id: 'w2-3',
    amount: 350,
    date: '2026-05-22T16:15', // ついで買い、衝動買い
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: true,
    impulseReasons: ['ついで買い'],
    items: ['生カヌレケーキ', 'カフェラテM']
  },
  {
    id: 'w2-4',
    amount: 620,
    date: '2026-05-21T19:00', // 夜の利用
    storeName: 'セブンイレブン 習志野店',
    isImpulse: false,
    impulseReasons: [],
    items: ['肉じゃが弁当', 'お茶']
  },
  {
    id: 'w2-5',
    amount: 450,
    date: '2026-05-20T12:30', // 1日2回利用の1回目
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: false,
    impulseReasons: [],
    items: ['ツナマヨおにぎり', 'サラダチキン']
  },
  {
    id: 'w2-6',
    amount: 380,
    date: '2026-05-20T17:45', // 1日2回利用の2回目（ついで買い・衝動買い）
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: true,
    impulseReasons: ['1日複数回', 'ついで買い'],
    items: ['ファミチキ', 'レッドブル']
  },
  {
    id: 'w2-7',
    amount: 210,
    date: '2026-05-18T08:10', // 朝のコーヒー
    storeName: 'セブンイレブン 習志野店',
    isImpulse: false,
    impulseReasons: [],
    items: ['セブンカフェ ホットL']
  },

  // --- 先々週 (5/11 - 5/17): 依存度が高く、荒れた利用状況の期間 ---
  {
    id: 'w3-1',
    amount: 1100,
    date: '2026-05-17T01:15', // 深夜利用、高額、衝動買い
    storeName: 'セブンイレブン 習志野店',
    isImpulse: true,
    impulseReasons: ['深夜利用', '高額支出'],
    items: ['蒙古タンメン中本カップ麺', 'ポテトチップス', 'モンスターエナジー', 'フライドチキン']
  },
  {
    id: 'w3-2',
    amount: 520,
    date: '2026-05-16T23:30', // 深夜利用、衝動買い
    storeName: 'ローソン 津田沼駅前店',
    isImpulse: true,
    impulseReasons: ['深夜利用', 'ついで買い'],
    items: ['どらもっち', 'ゼロコーラ 500ml']
  },
  {
    id: 'w3-3',
    amount: 720,
    date: '2026-05-15T12:00', // ランチ
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: false,
    impulseReasons: [],
    items: ['カルボナーラパスタ', '烏龍茶']
  },
  {
    id: 'w3-4',
    amount: 300,
    date: '2026-05-14T15:30', // ついで買い、衝動買い
    storeName: 'セブンイレブン 習志野店',
    isImpulse: true,
    impulseReasons: ['ついで買い'],
    items: ['シュークリーム', 'コーヒー']
  },
  {
    id: 'w3-5',
    amount: 980,
    date: '2026-05-13T22:15', // 深夜利用、高額、衝動買い
    storeName: 'ローソン 津田沼駅前店',
    isImpulse: true,
    impulseReasons: ['深夜利用', '高額支出'],
    items: ['ハンバーグ弁当', 'プレミアムロールケーキ', 'お茶']
  },
  {
    id: 'w3-6',
    amount: 420,
    date: '2026-05-12T12:15', // 1日2回利用の1回目
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: false,
    impulseReasons: [],
    items: ['海老マヨおにぎり', 'カップ味噌汁']
  },
  {
    id: 'w3-7',
    amount: 350,
    date: '2026-05-12T18:00', // 1日2回利用の2回目（衝動買い）
    storeName: 'ファミリーマート 千葉大前店',
    isImpulse: true,
    impulseReasons: ['1日複数回', 'ついで買い'],
    items: ['ファミチキ', 'カフェラテ']
  },
  {
    id: 'w3-8',
    amount: 550,
    date: '2026-05-11T08:00', // 朝食
    storeName: 'セブンイレブン 習志野店',
    isImpulse: false,
    impulseReasons: [],
    items: ['たまごサンド', '野菜生活']
  }
];
