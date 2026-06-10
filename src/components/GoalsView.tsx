import React, { useState } from 'react';
import { Target, TrendingUp, PiggyBank, Plus, Trash2, Sliders, ChevronDown } from 'lucide-react';
import type { Receipt, SavingsGoal, SpendingGoal } from '../types';

interface GoalsViewProps {
  receipts: Receipt[];
  spendingGoal: SpendingGoal;
  savingsGoals: SavingsGoal[];
  monthlyBaseSavings: number;
  onUpdateSpendingGoal: (goal: SpendingGoal) => void;
  onAddSavingsGoal: (name: string, price: number) => void;
  onDeleteSavingsGoal: (id: string) => void;
  onUpdateBaseSavings: (amount: number) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({
  receipts,
  spendingGoal,
  savingsGoals,
  monthlyBaseSavings,
  onUpdateSpendingGoal,
  onAddSavingsGoal,
  onDeleteSavingsGoal,
  onUpdateBaseSavings
}) => {
  // 今月の支出合計と利用回数の算出 (5月中)
  const thisMonthReceipts = receipts.filter(r => r.date.startsWith('2026-05'));
  const currentAmount = thisMonthReceipts.reduce((sum, r) => sum + r.amount, 0);
  const currentCount = thisMonthReceipts.length;

  // 削減率スライダー (未来予測用、デフォルト50%)
  const [reductionRate, setReductionRate] = useState<number>(50);

  // 欲しいもの追加用フォーム
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);

  // 目標設定フォーム
  const [editAmountLimit, setEditAmountLimit] = useState(spendingGoal.monthlyAmountLimit);
  const [editCountLimit, setEditCountLimit] = useState(spendingGoal.monthlyCountLimit);
  const [isEditingSpending, setIsEditingSpending] = useState(false);

  // 基本貯蓄額設定用
  const [editBaseSavings, setEditBaseSavings] = useState(monthlyBaseSavings);
  const [isEditingBaseSavings, setIsEditingBaseSavings] = useState(false);

  // 達成率計算
  const amountProgress = Math.min((currentAmount / spendingGoal.monthlyAmountLimit) * 100, 100);
  const countProgress = Math.min((currentCount / spendingGoal.monthlyCountLimit) * 100, 100);

  // 目標保存処理
  const handleSaveSpendingGoal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSpendingGoal({
      monthlyAmountLimit: editAmountLimit,
      monthlyCountLimit: editCountLimit
    });
    setIsEditingSpending(false);
  };

  // 基本貯蓄額保存処理
  const handleSaveBaseSavings = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBaseSavings < 0) return;
    onUpdateBaseSavings(editBaseSavings);
    setIsEditingBaseSavings(false);
  };

  const handleStartEditBaseSavings = () => {
    setEditBaseSavings(monthlyBaseSavings);
    setIsEditingBaseSavings(true);
  };

  // 欲しいもの追加処理
  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || newItemPrice <= 0) return;
    onAddSavingsGoal(newItemName, newItemPrice);
    setNewItemName('');
    setNewItemPrice(0);
    setShowAddForm(false);
  };

  // 未来予測計算ロジック
  // props の monthlyBaseSavings を基本貯蓄額として使用
  const BASE_MONTHLY_SAVINGS = monthlyBaseSavings;
  // コンビニの1ヶ月の平均支出（現在の月間支出目安とする）
  const monthlySpent = currentAmount > 0 ? currentAmount : 8000; 
  // 削減による浮くお金 (月額)
  const monthlyReductionSavings = Math.round(monthlySpent * (reductionRate / 100));
  // 合計の月間貯蓄見込み額
  const totalMonthlySavings = BASE_MONTHLY_SAVINGS + monthlyReductionSavings;

  // 累積でのコンビニ節約による貯金実績（モック値。これまでにコンビニ節約でいくら貯めたか）
  // ユーザーが節約行動を始めてからの実績を表現（例: 22,000円）
  const accumulatedSavings = 18500;

  return (
    <div>
      <div className="view-title">
        <span>目標・予測</span>
      </div>

      {/* --- Section 1: 節約目標設定機能 --- */}
      <div className="ios-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--ios-primary)" />
            今月の節約目標
          </span>
          <button
            onClick={() => {
              if (!isEditingSpending) {
                setEditAmountLimit(spendingGoal.monthlyAmountLimit);
                setEditCountLimit(spendingGoal.monthlyCountLimit);
              }
              setIsEditingSpending(!isEditingSpending);
            }}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--ios-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isEditingSpending ? 'キャンセル' : '目標を編集'}
          </button>
        </div>

        {isEditingSpending ? (
          <form onSubmit={handleSaveSpendingGoal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="ios-input-group" style={{ marginBottom: '8px' }}>
              <label className="ios-input-label">月の利用金額上限 (円)</label>
              <input
                type="number"
                className="ios-input"
                value={editAmountLimit || ''}
                onChange={e => setEditAmountLimit(Number(e.target.value))}
                min="1000"
                required
              />
            </div>
            <div className="ios-input-group" style={{ marginBottom: '12px' }}>
              <label className="ios-input-label">月の利用回数上限 (回)</label>
              <input
                type="number"
                className="ios-input"
                value={editCountLimit || ''}
                onChange={e => setEditCountLimit(Number(e.target.value))}
                min="1"
                required
              />
            </div>
            <button type="submit" className="ios-btn" style={{ padding: '10px 16px', fontSize: '14px', borderRadius: '10px' }}>
              目標を保存する
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 金額目標進捗 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>利用金額 (上限 ¥{spendingGoal.monthlyAmountLimit.toLocaleString()})</span>
                <span style={{ fontWeight: 700, color: currentAmount > spendingGoal.monthlyAmountLimit ? 'var(--ios-red)' : 'var(--ios-text-main)' }}>
                  ¥{currentAmount.toLocaleString()} ({Math.round((currentAmount / spendingGoal.monthlyAmountLimit) * 100)}%)
                </span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '5px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${amountProgress}%`, 
                    height: '100%', 
                    backgroundColor: currentAmount > spendingGoal.monthlyAmountLimit ? 'var(--ios-red)' : 'var(--ios-primary)',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease-out'
                  }}
                ></div>
              </div>
            </div>

            {/* 回数目標進捗 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600 }}>利用回数 (上限 {spendingGoal.monthlyCountLimit}回)</span>
                <span style={{ fontWeight: 700, color: currentCount > spendingGoal.monthlyCountLimit ? 'var(--ios-red)' : 'var(--ios-text-main)' }}>
                  {currentCount}回 ({Math.round((currentCount / spendingGoal.monthlyCountLimit) * 100)}%)
                </span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '5px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${countProgress}%`, 
                    height: '100%', 
                    backgroundColor: currentCount > spendingGoal.monthlyCountLimit ? 'var(--ios-red)' : 'var(--ios-primary)',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease-out'
                  }}
                ></div>
              </div>
            </div>

            <div style={{ fontSize: '10px', color: 'var(--ios-text-secondary)', textAlign: 'center', backgroundColor: '#FAFAFC', padding: '8px', borderRadius: '10px' }}>
              {currentAmount <= spendingGoal.monthlyAmountLimit && currentCount <= spendingGoal.monthlyCountLimit ? (
                <span>🎉 現在目標達成ペースを維持しています！素晴らしい！</span>
              ) : (
                <span style={{ color: 'var(--ios-red)', fontWeight: '600' }}>⚠️ 予算または利用回数の上限を超過しています。習慣を見直しましょう！</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- Section 1.5: 基本の月間貯蓄額設定機能 --- */}
      <div className="ios-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PiggyBank size={18} color="var(--ios-primary)" />
            基本の月間貯蓄額
          </span>
          <button
            onClick={() => {
              if (isEditingBaseSavings) {
                setIsEditingBaseSavings(false);
              } else {
                handleStartEditBaseSavings();
              }
            }}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--ios-primary)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isEditingBaseSavings ? 'キャンセル' : '変更'}
          </button>
        </div>

        {isEditingBaseSavings ? (
          <form onSubmit={handleSaveBaseSavings} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div className="ios-input-group" style={{ flex: 1, margin: 0 }}>
              <label className="ios-input-label" style={{ fontSize: '11px' }}>月間貯蓄額 (円)</label>
              <input
                type="number"
                className="ios-input"
                value={editBaseSavings || ''}
                onChange={e => setEditBaseSavings(Number(e.target.value))}
                min="0"
                step="1000"
                required
                style={{ padding: '8px 12px', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="ios-btn" style={{ padding: '10px 16px', fontSize: '14px', borderRadius: '10px', width: 'auto', flexShrink: 0 }}>
              保存
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit', color: 'var(--ios-text-main)' }}>
              ¥{monthlyBaseSavings.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--ios-text-secondary)', marginLeft: '6px' }}>
              /月 (コンビニ削減分を含まないベース貯金額)
            </span>
          </div>
        )}
      </div>

      {/* --- Section 2: 未来予測機能 (最重要) --- */}
      <div className="ios-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PiggyBank size={18} color="var(--ios-orange)" />
            未来予測・欲しいもの貯金
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              border: 'none',
              background: 'var(--ios-orange-light)',
              color: 'var(--ios-orange)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {showAddForm ? <ChevronDown size={14} /> : <Plus size={14} />}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddSavings} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', backgroundColor: '#FFFBF5', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 149, 0, 0.15)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 2 }}>
                <label className="ios-input-label" style={{ fontSize: '11px' }}>欲しいもの</label>
                <input
                  type="text"
                  className="ios-input"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder="例: AirPods Pro"
                  required
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
              <div style={{ flex: 1.5 }}>
                <label className="ios-input-label" style={{ fontSize: '11px' }}>価格 (円)</label>
                <input
                  type="number"
                  className="ios-input"
                  value={newItemPrice || ''}
                  onChange={e => setNewItemPrice(Number(e.target.value))}
                  placeholder="金額"
                  min="100"
                  required
                  style={{ padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
            </div>
            <button type="submit" className="ios-btn" style={{ backgroundColor: 'var(--ios-orange)', padding: '8px 12px', fontSize: '13px', borderRadius: '8px' }}>
              欲しいものを追加する
            </button>
          </form>
        )}

        {/* 節約効果シミュレーションスライダー */}
        <div style={{ backgroundColor: '#FAFAFC', padding: '16px', borderRadius: '16px', marginBottom: '16px', border: '1px solid var(--ios-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sliders size={14} color="var(--ios-orange)" />
              コンビニ利用削減シミュレーター
            </span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ios-orange)', fontFamily: 'Outfit' }}>
              {reductionRate}% 削減
            </span>
          </div>

          <p style={{ fontSize: '10px', color: 'var(--ios-text-secondary)', lineHeight: '1.4', margin: '0 0 12px 0' }}>
            コンビニの無駄遣い（今月のコンビニ支出: ¥{monthlySpent.toLocaleString()}）を削減し、貯金に回す割合を設定します。
          </p>

          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={reductionRate}
            onChange={e => setReductionRate(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--ios-orange)',
              cursor: 'pointer',
              marginBottom: '14px'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderTop: '0.5px solid var(--ios-border)', paddingTop: '10px' }}>
            <div>
              <span style={{ color: 'var(--ios-text-secondary)', display: 'block', fontSize: '9px' }}>追加の節約貯金額</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ios-orange)', fontFamily: 'Outfit' }}>
                +¥{monthlyReductionSavings.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: '500' }}>/月</span>
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: 'var(--ios-text-secondary)', display: 'block', fontSize: '9px' }}>月間貯蓄合計（基本 ¥5,000 含）</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ios-text-main)', fontFamily: 'Outfit' }}>
                ¥{totalMonthlySavings.toLocaleString()} <span style={{ fontSize: '10px', fontWeight: '500' }}>/月</span>
              </span>
            </div>
          </div>
        </div>

        {/* 欲しいものリストとシミュレーション結果 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {savingsGoals.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--ios-text-secondary)', padding: '20px 0', fontSize: '12px' }}>
              欲しいものが登録されていません。上の＋ボタンから登録しましょう！
            </div>
          ) : (
            savingsGoals.map(goal => {
              // 欲しいものの進捗率
              const progressPercent = Math.min(Math.round((accumulatedSavings / goal.price) * 100), 100);

              // 削減率を適用した場合の購入までにかかる月数
              // (価格 - 累積貯金) / 月間貯蓄額
              const remainingPrice = Math.max(0, goal.price - accumulatedSavings);
              const monthsNeededWithReduction = remainingPrice > 0 
                ? Math.ceil(remainingPrice / totalMonthlySavings) 
                : 0;

              // 削減率 0% (追加の節約なし) の場合にかかる月数
              const monthsNeededNoReduction = remainingPrice > 0 
                ? Math.ceil(remainingPrice / BASE_MONTHLY_SAVINGS) 
                : 0;

              // 短縮される期間
              const monthsSaved = Math.max(0, monthsNeededNoReduction - monthsNeededWithReduction);

              return (
                <div 
                  key={goal.id} 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '14px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800' }}>{goal.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ios-text-secondary)', fontFamily: 'Outfit', marginTop: '2px' }}>
                        ¥{goal.price.toLocaleString()} <span style={{ fontSize: '10px' }}>(現在実績 ¥{accumulatedSavings.toLocaleString()} 貯金済)</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onDeleteSavingsGoal(goal.id)}
                      style={{
                        border: 'none',
                        background: 'none',
                        color: 'var(--ios-gray-dark)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* 欲しいものの進捗バー */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ height: '8px', backgroundColor: 'var(--ios-gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${progressPercent}%`, 
                          height: '100%', 
                          backgroundColor: 'var(--ios-orange)',
                          borderRadius: '4px',
                          transition: 'width 0.5s ease-out'
                        }}
                      ></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--ios-text-secondary)', marginTop: '4px', fontWeight: 600 }}>
                      <span>貯金達成率: {progressPercent}%</span>
                      <span>残り: ¥{remainingPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* AI予測テキスト */}
                  <div style={{ backgroundColor: 'linear-gradient(135deg, #FFFDF9 0%, #FFF9F0 100%)', borderLeft: '3px solid var(--ios-orange)', padding: '10px 12px', borderRadius: '0 8px 8px 0', fontSize: '11px', lineHeight: '1.5' }}>
                    {remainingPrice === 0 ? (
                      <span style={{ color: 'var(--ios-primary)', fontWeight: '700' }}>
                        🎉 おめでとうございます！目標金額を達成しました！購入可能です。
                      </span>
                    ) : (
                      <>
                        <div style={{ fontWeight: '700', color: 'var(--ios-text-main)' }}>
                          AI分析結果: 今の節約ペースの場合{' '}
                          <span style={{ color: 'var(--ios-orange)', fontSize: '13px' }}>
                            「あと{monthsNeededWithReduction}ヶ月で購入可能」
                          </span>
                        </div>
                        {reductionRate > 0 && monthsSaved > 0 && (
                          <div style={{ color: '#1B9A5E', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <TrendingUp size={12} />
                            コンビニ利用を{reductionRate}%削減すると、{monthsSaved}ヶ月早く購入できます！
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsView;
