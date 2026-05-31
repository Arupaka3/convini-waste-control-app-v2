import React from 'react';
import { Clock, Lightbulb, ShieldAlert, TrendingUp } from 'lucide-react';
import type { Receipt } from '../types';

interface AnalyticsViewProps {
  receipts: Receipt[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ receipts }) => {
  const totalCount = receipts.length;
  const impulseCount = receipts.filter(r => r.isImpulse).length;

  // 1. 時間帯別の利用回数集計
  let morning = 0; // 5-11
  let lunch = 0;   // 11-17
  let evening = 0; // 17-22
  let night = 0;   // 22-5

  receipts.forEach(r => {
    const hour = new Date(r.date).getHours();
    if (hour >= 5 && hour < 11) morning++;
    else if (hour >= 11 && hour < 17) lunch++;
    else if (hour >= 17 && hour < 22) evening++;
    else night++;
  });

  const getPercentage = (count: number) => {
    return totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  };

  // 2. 衝動買いの主な理由集計
  const reasonCounts: { [key: string]: number } = {};
  receipts.forEach(r => {
    if (r.isImpulse && r.impulseReasons) {
      r.impulseReasons.forEach(reason => {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      });
    }
  });

  const sortedReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // 3. コンビニ依存度診断の計算
  // 依存度スコア(0~100) = (深夜利用率 * 40) + (衝動買い率 * 40) + (利用回数ペナルティ最大20点)
  let dependencyScore = 0;
  const nightRatio = totalCount > 0 ? night / totalCount : 0;
  const impulseRatio = totalCount > 0 ? impulseCount / totalCount : 0;
  // 月の利用回数ペナルティ (目標10回として、15回以上で満点20点)
  const countPenalty = totalCount > 0 ? Math.min((totalCount / 15) * 20, 20) : 0;

  if (totalCount > 0) {
    dependencyScore = Math.min(Math.round((nightRatio * 40) + (impulseRatio * 40) + countPenalty), 100);
  }

  // 依存タイプ判定
  let dependencyType = 'バランス型 🔰';
  let dependencyDesc = '';
  let dependencyFeatures: string[] = [];
  let dependencyAdvises: string[] = [];
  let themeColor = 'var(--ios-primary)';
  let themeBg = 'var(--ios-primary-light)';

  if (totalCount === 0) {
    dependencyType = 'データ未登録 ℹ️';
    dependencyDesc = 'レシートを登録すると、あなたのコンビニ依存度と浪費タイプが診断されます。';
  } else if (dependencyScore < 35) {
    dependencyType = 'スマートセーバー型 🥇';
    dependencyDesc = 'コンビニの利用を必要最小限に抑え、しっかりと自己コントロールができています。';
    themeColor = 'var(--ios-primary)';
    themeBg = 'var(--ios-primary-light)';
    dependencyFeatures = ['衝動買いが極めて少ない', '深夜の利用がほとんどない', '必要なものだけピンポイントで購入'];
    dependencyAdvises = [
      '素晴らしい自制心です！コンビニの無駄な利用を完璧に排除できています。',
      '浮いたお金を「未来予測」タブに登録した欲しいものの貯金へ回すと、さらにモチベーションが高まります！'
    ];
  } else if (nightRatio >= 0.35) {
    dependencyType = '疲労回復型 🌙';
    dependencyDesc = '深夜の利用が多く、ストレスや疲れをコンビニの食べ物・飲み物で癒やそうとする傾向があります。';
    themeColor = 'var(--ios-accent)';
    themeBg = 'var(--ios-accent-light)';
    dependencyFeatures = ['22時以降の深夜利用が多い', 'エナジードリンクや夜食・アイスの購入が多い', '平日の利用が多め'];
    dependencyAdvises = [
      '🌙 深夜のカップ麺やアイスは1回で500円以上になりがち。夜食はドラッグストアやスーパーで安く買い置きしておくと、支出を半分以下に抑えられます！',
      '🔋 カフェイン飲料や糖分への依存度を抑え、まずは十分な睡眠をとることを優先して、コンビニに頼らない疲れの癒やし方を見つけましょう。'
    ];
  } else if (impulseRatio >= 0.50) {
    dependencyType = 'ストレス発散型 🛍️';
    dependencyDesc = '「ご褒美」やついで買いなど、衝動的な買い物が多く、レジ横のホットスナックや新作スイーツに惹かれやすい傾向です。';
    themeColor = 'var(--ios-red)';
    themeBg = 'var(--ios-red-light)';
    dependencyFeatures = ['衝動買いフラグが50%以上', 'スイーツやレジ横スナックをよく買う', '金曜や週末に集中'];
    dependencyAdvises = [
      '💸 勉強やバイトのストレスをコンビニでの買い物で手軽に解消していませんか？「目的の商品以外は視界に入れない」ルールを意識しましょう。',
      '🍩 毎日の「ご褒美」を週1〜2回に限定し、ご褒美デー以外はコンビニに立ち寄らないよう心がけるだけで、大幅に節約できます！'
    ];
  } else {
    dependencyType = '無意識寄り道型 ⚡';
    dependencyDesc = '特に目的がないのになんとなくコンビニに立ち寄ってしまい、少額の買い物を繰り返すタイプです。';
    themeColor = 'var(--ios-orange)';
    themeBg = 'var(--ios-orange-light)';
    dependencyFeatures = ['1日複数回行くことがある', '1回あたりの購入額は少なめ', 'ついで買いが多い'];
    dependencyAdvises = [
      '🚶‍♂️ 朝のコーヒー、昼のパン、放課後のグミなど、無意識にコンビニへ引き寄せられるルートになっていませんか？寄り道ルートを変えてみましょう。',
      '🥤 「マイボトル（水筒）を持ち歩く」「コンビニに行くのは1日1回まで」とマイルールを設定すると効果的です。'
    ];
  }

  // 円形プログレスリングの計算
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (dependencyScore / 100) * circumference;

  return (
    <div>
      <div className="view-title">
        <span>習慣分析</span>
      </div>

      {/* コンビニ依存度診断カード */}
      <div className="ios-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: `1px solid ${themeColor}20` }}>
        <span style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={18} color={themeColor} />
          コンビニ依存度診断
        </span>

        {totalCount === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ios-text-secondary)', padding: '20px 0', fontSize: '13px' }}>
            データ不足のため、診断できません。レシートを追加してください。
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px', backgroundColor: '#FAFAFC', padding: '14px', borderRadius: '16px' }}>
              {/* 円形プログレスリング */}
              <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                <svg height="80" width="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    stroke="var(--ios-gray-light)"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx="40"
                    cy="40"
                  />
                  <circle
                    stroke={themeColor}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    r={normalizedRadius}
                    cx="40"
                    cy="40"
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '16px',
                  fontWeight: '800',
                  fontFamily: 'Outfit',
                  color: themeColor
                }}>
                  {dependencyScore}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: 'var(--ios-text-secondary)', fontWeight: 600 }}>あなたの浪費タイプ</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: themeColor, margin: '2px 0 4px 0' }}>
                  {dependencyType}
                </div>
                <div className="ios-badge" style={{ backgroundColor: themeBg, color: themeColor, fontSize: '10px', padding: '3px 8px' }}>
                  依存度: {dependencyScore >= 70 ? '深刻' : dependencyScore >= 40 ? '中度' : '軽度'}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--ios-text-main)', lineHeight: '1.5', margin: '0 0 14px 0', fontWeight: '500' }}>
              {dependencyDesc}
            </p>

            {/* 特徴リスト */}
            {dependencyFeatures.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ios-text-secondary)', fontWeight: '700', marginBottom: '6px' }}>主な特徴</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {dependencyFeatures.map((feat, i) => (
                    <div key={i} style={{ fontSize: '12px', color: 'var(--ios-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: themeColor }}></span>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 利用時間帯分析 */}
      <div className="ios-card">
        <span style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <Clock size={18} color="var(--ios-primary)" />
          利用時間帯の割合
        </span>

        {totalCount === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ios-text-secondary)', padding: '20px 0', fontSize: '13px' }}>
            履歴がありません。
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 朝 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>朝 (5:00 - 11:00)</span>
                <span style={{ fontWeight: '700', color: 'var(--ios-text-secondary)' }}>{morning}回 ({getPercentage(morning)}%)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getPercentage(morning)}%`, height: '100%', backgroundColor: '#FFD60A', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* 昼 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>昼 (11:00 - 17:00)</span>
                <span style={{ fontWeight: '700', color: 'var(--ios-text-secondary)' }}>{lunch}回 ({getPercentage(lunch)}%)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getPercentage(lunch)}%`, height: '100%', backgroundColor: 'var(--ios-primary)', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* 夜 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>夜 (17:00 - 22:00)</span>
                <span style={{ fontWeight: '700', color: 'var(--ios-text-secondary)' }}>{evening}回 ({getPercentage(evening)}%)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getPercentage(evening)}%`, height: '100%', backgroundColor: 'var(--ios-orange)', borderRadius: '4px' }}></div>
              </div>
            </div>

            {/* 深夜 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--ios-red)' }}>深夜 (22:00 - 5:00) ⚠️</span>
                <span style={{ fontWeight: '700', color: 'var(--ios-red)' }}>{night}回 ({getPercentage(night)}%)</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${getPercentage(night)}%`, height: '100%', backgroundColor: 'var(--ios-red)', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 衝動買いの主因 */}
      {totalCount > 0 && sortedReasons.length > 0 && (
        <div className="ios-card">
          <span style={{ fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <TrendingUp size={18} color="var(--ios-red)" />
            衝動買いの引き金 (上位)
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sortedReasons.map(([reason, count], idx) => (
              <div key={reason} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: idx === 0 ? 'var(--ios-red-light)' : 'var(--ios-gray-light)',
                    color: idx === 0 ? 'var(--ios-red)' : 'var(--ios-text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{reason}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ios-text-secondary)', fontFamily: 'Outfit' }}>
                  {count} 回発生
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 改善アドバイスカード */}
      {totalCount > 0 && dependencyAdvises.length > 0 && (
        <div className="ios-card" style={{ backgroundColor: 'var(--ios-primary-light)', borderColor: 'rgba(52, 199, 89, 0.15)' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ios-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Lightbulb size={18} />
            習慣改善アドバイス
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dependencyAdvises.map((advise, idx) => (
              <div 
                key={idx} 
                style={{ 
                  fontSize: '13px', 
                  color: '#1B9A5E', 
                  lineHeight: '1.5',
                  paddingLeft: '10px',
                  borderLeft: '2.5px solid var(--ios-primary)',
                  fontWeight: '500'
                }}
              >
                {advise}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
