import { useState, useEffect } from 'react';
import type { ActiveTab, Receipt, SpendingGoal, SavingsGoal } from './types';
import { initialReceipts } from './data/sampleData';
import TabBar from './components/TabBar';
import HomeView from './components/HomeView';
import ScanView from './components/ScanView';
import AnalyticsView from './components/AnalyticsView';
import GoalsView from './components/GoalsView';
import BadgesView from './components/BadgesView';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [islandActive, setIslandActive] = useState(false);
  const [islandMessage, setIslandMessage] = useState('');

  // v2追加のステート
  const [spendingGoal, setSpendingGoal] = useState<SpendingGoal>({
    monthlyAmountLimit: 10000,
    monthlyCountLimit: 12
  });
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([
    { id: 'g1', name: 'Nintendo Switch 2', price: 50000, createdAt: '2026-05-15' },
    { id: 'g2', name: 'AirPods Pro', price: 35000, createdAt: '2026-05-20' }
  ]);
  const [linkedPayments, setLinkedPayments] = useState<string[]>([]);

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    // 1. レシート
    const savedReceipts = localStorage.getItem('cobaco_receipts');
    if (savedReceipts) {
      try {
        setReceipts(JSON.parse(savedReceipts));
      } catch (e) {
        console.error('Failed to parse saved receipts', e);
        setReceipts(initialReceipts);
      }
    } else {
      setReceipts(initialReceipts);
      localStorage.setItem('cobaco_receipts', JSON.stringify(initialReceipts));
    }

    // 2. 節約目標
    const savedSpending = localStorage.getItem('cobaco_spending_goal');
    if (savedSpending) {
      try {
        setSpendingGoal(JSON.parse(savedSpending));
      } catch (e) {
        console.error('Failed to parse spending goal', e);
      }
    }

    // 3. 欲しいもの貯金目標
    const savedSavings = localStorage.getItem('cobaco_savings_goals');
    if (savedSavings) {
      try {
        setSavingsGoals(JSON.parse(savedSavings));
      } catch (e) {
        console.error('Failed to parse savings goals', e);
      }
    }

    // 4. 電子決済連携
    const savedPayments = localStorage.getItem('cobaco_linked_payments');
    if (savedPayments) {
      try {
        setLinkedPayments(JSON.parse(savedPayments));
      } catch (e) {
        console.error('Failed to parse linked payments', e);
      }
    }
  }, []);

  // データを保存する
  const saveReceipts = (updated: Receipt[]) => {
    setReceipts(updated);
    localStorage.setItem('cobaco_receipts', JSON.stringify(updated));
  };

  // ダイナミックアイランド通知をトリガーする
  const triggerNotification = (message: string) => {
    setIslandMessage(message);
    setIslandActive(true);
    setTimeout(() => {
      setIslandActive(false);
    }, 3000);
  };

  // レシートの追加
  const handleAddReceipt = (newReceipt: Omit<Receipt, 'id'>) => {
    const receiptWithId: Receipt = {
      ...newReceipt,
      id: Date.now().toString()
    };
    const updated = [receiptWithId, ...receipts];
    saveReceipts(updated);
    triggerNotification('レシートを保存しました 💾');
    setActiveTab('home');
  };

  // レシートの削除
  const handleDeleteReceipt = (id: string) => {
    const updated = receipts.filter(r => r.id !== id);
    saveReceipts(updated);
    triggerNotification('履歴を削除しました 🗑️');
  };

  // 節約目標の更新
  const handleUpdateSpendingGoal = (newGoal: SpendingGoal) => {
    setSpendingGoal(newGoal);
    localStorage.setItem('cobaco_spending_goal', JSON.stringify(newGoal));
    triggerNotification('節約目標を更新しました 🎯');
  };

  // 欲しいものの追加
  const handleAddSavingsGoal = (name: string, price: number) => {
    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name,
      price,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...savingsGoals, newGoal];
    setSavingsGoals(updated);
    localStorage.setItem('cobaco_savings_goals', JSON.stringify(updated));
    triggerNotification('欲しいものを追加しました 🛍️');
  };

  // 欲しいものの削除
  const handleDeleteSavingsGoal = (id: string) => {
    const updated = savingsGoals.filter(g => g.id !== id);
    setSavingsGoals(updated);
    localStorage.setItem('cobaco_savings_goals', JSON.stringify(updated));
    triggerNotification('欲しいものを削除しました 🗑️');
  };

  // 電子決済の自動連携とモックデータ追加
  const handleLinkPayment = (provider: string) => {
    if (linkedPayments.includes(provider)) return;

    const updatedPayments = [...linkedPayments, provider];
    setLinkedPayments(updatedPayments);
    localStorage.setItem('cobaco_linked_payments', JSON.stringify(updatedPayments));

    // 自動連携シミュレーション：3件の利用履歴を自動登録
    const offset = new Date().getTimezoneOffset() * 60000;
    const nowStr = (new Date(new Date().getTime() - offset)).toISOString().slice(0, 16);

    const mockLinkedReceipts: Receipt[] = [
      {
        id: `mock-pay-1-${Date.now()}`,
        amount: 350,
        date: nowStr,
        storeName: 'ファミリーマート 千葉大前店',
        isImpulse: false,
        impulseReasons: [],
        items: ['鮭おにぎり', '生カヌレケーキ']
      },
      {
        id: `mock-pay-2-${Date.now()}`,
        amount: 620,
        date: nowStr,
        storeName: 'セブンイレブン 習志野店',
        isImpulse: false,
        impulseReasons: [],
        items: ['サラダチキン', 'サンドイッチミックス']
      },
      {
        id: `mock-pay-3-${Date.now()}`,
        amount: 280,
        date: nowStr,
        storeName: 'ローソン 津田沼駅前店',
        isImpulse: false,
        impulseReasons: [],
        items: ['Lチキ レギュラー']
      }
    ];

    const updatedReceipts = [...mockLinkedReceipts, ...receipts];
    saveReceipts(updatedReceipts);

    triggerNotification(`${provider}連携完了！3件の履歴を取得しました 📱`);
  };

  // 時間を取得してステータスバーに表示
  const [currentTime, setCurrentTime] = useState('20:23');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="phone-frame">
      {/* ステータスバー */}
      <div className="phone-status-bar">
        <span>{currentTime}</span>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* ダイナミックアイランド (通知機能付き) */}
      <div className={`phone-island ${islandActive ? 'active' : ''}`}>
        {islandActive && (
          <div style={{
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: '600',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            {islandMessage}
          </div>
        )}
      </div>

      {/* メインビューエリア */}
      <main className="scrollable">
        {activeTab === 'home' && (
          <HomeView
            receipts={receipts}
            onNavigate={setActiveTab}
            onDeleteReceipt={handleDeleteReceipt}
          />
        )}
        {activeTab === 'scan' && (
          <ScanView
            onAddReceipt={handleAddReceipt}
            linkedPayments={linkedPayments}
            onLinkPayment={handleLinkPayment}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsView
            receipts={receipts}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsView
            receipts={receipts}
            spendingGoal={spendingGoal}
            savingsGoals={savingsGoals}
            onUpdateSpendingGoal={handleUpdateSpendingGoal}
            onAddSavingsGoal={handleAddSavingsGoal}
            onDeleteSavingsGoal={handleDeleteSavingsGoal}
          />
        )}
        {activeTab === 'badges' && (
          <BadgesView
            receipts={receipts}
            spendingGoal={spendingGoal}
            linkedPayments={linkedPayments}
          />
        )}
      </main>

      {/* ナビゲーションバー */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ホームインジケータ */}
      <div className="phone-home-indicator"></div>
    </div>
  );
}

export default App;
