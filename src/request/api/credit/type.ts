export interface ICreditPackage {
  id: number;
  title: string;
  originalPrice: string;
  discountPrice: string;
  credits: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface ICreditRecord {
  id: number;
  userId: string;
  usd: string;
  emc: string;
  balance: number;
  transactions: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

export interface RechargeCreditsReq {
  from: string;
  to: string;
  transactionHash: string;
  usd: string;
  emc: string;
  credits: string;
}

// 0:充值 1:在线生图 2:下载模型花费 3.下载模型收入 4. 购买模型花费 5. 购买模型收入 6. 赏金支付 7. 赏金收入 8.打赏支出，9. 打赏收入
export type CreditType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
