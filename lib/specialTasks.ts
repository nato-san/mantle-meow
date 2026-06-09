export type SpecialTaskId =
  | "connect-wallet"
  | "explore-ecosystem"
  | "open-explorer"
  | "hold-one-dollar-mnt"
  | "mint-passport"
  | "open-mantle-dex"
  | "hold-meth"
  | "open-lend-market"
  | "open-bridge";

export type SpecialTaskAction =
  | { type: "wallet-check" }
  | { type: "external"; url: string }
  | { type: "balance-mnt" }
  | { type: "mint-link" }
  | { type: "balance-meth" };

export type SpecialTask = {
  id: SpecialTaskId;
  level: 1 | 2 | 3;
  xp: 50 | 100 | 200;
  action: SpecialTaskAction;
  en: {
    title: string;
    description: string;
    button: string;
  };
  ja: {
    title: string;
    description: string;
    button: string;
  };
};

export const specialTasks: SpecialTask[] = [
  {
    id: "connect-wallet",
    level: 1,
    xp: 50,
    action: { type: "wallet-check" },
    en: {
      title: "Connect Wallet",
      description: "Connect your wallet so your cat can recognize your on-chain identity.",
      button: "Check Wallet",
    },
    ja: {
      title: "ウォレット接続",
      description: "ウォレットを接続して、猫があなたのオンチェーンIDを認識できるようにします。",
      button: "接続をチェック",
    },
  },
  {
    id: "explore-ecosystem",
    level: 1,
    xp: 50,
    action: { type: "external", url: "https://www.mantle.xyz/ecosystem" },
    en: {
      title: "Explore Ecosystem",
      description: "Open the Mantle ecosystem page and find one project you want to watch.",
      button: "Open Ecosystem",
    },
    ja: {
      title: "エコシステム探索",
      description: "Mantleエコシステムを開いて、気になるプロジェクトを1つ見つけます。",
      button: "探索を開く",
    },
  },
  {
    id: "open-explorer",
    level: 1,
    xp: 50,
    action: { type: "external", url: "explorer" },
    en: {
      title: "Open Mantle Explorer",
      description: "Open the block explorer and look at real Mantle activity.",
      button: "Open Explorer",
    },
    ja: {
      title: "Mantle Explorerを見る",
      description: "ブロックエクスプローラーを開いて、Mantle上の実際の動きを見ます。",
      button: "Explorerを開く",
    },
  },
  {
    id: "hold-one-dollar-mnt",
    level: 2,
    xp: 100,
    action: { type: "balance-mnt" },
    en: {
      title: "Hold $1+ MNT",
      description: "Hold at least about $1 worth of MNT in the connected wallet.",
      button: "Check MNT",
    },
    ja: {
      title: "MNTを1ドル以上持とう",
      description: "接続中のウォレットに、約1ドル以上のMNTがあるか確認します。",
      button: "MNTをチェック",
    },
  },
  {
    id: "mint-passport",
    level: 2,
    xp: 100,
    action: { type: "mint-link" },
    en: {
      title: "Mint Cat Passport",
      description: "Mint your Intern Cat Passport NFT on Mantle Sepolia.",
      button: "Go to Passport",
    },
    ja: {
      title: "猫のPassportをMint",
      description: "Mantle SepoliaでIntern Cat Passport NFTをMintします。",
      button: "Passportへ",
    },
  },
  {
    id: "open-mantle-dex",
    level: 2,
    xp: 100,
    action: { type: "external", url: "https://merchantmoe.com/" },
    en: {
      title: "Visit a Mantle DEX",
      description: "Open a Mantle ecosystem DEX and look at real swap/liquidity activity.",
      button: "Open DEX",
    },
    ja: {
      title: "MantleのDEXを見に行く",
      description: "MantleエコシステムのDEXを開いて、実際のスワップや流動性を見ます。",
      button: "DEXを開く",
    },
  },
  {
    id: "hold-meth",
    level: 3,
    xp: 200,
    action: { type: "balance-meth" },
    en: {
      title: "Get mETH",
      description: "Hold any amount of mETH in the connected wallet.",
      button: "Check mETH",
    },
    ja: {
      title: "mETHを手に入れよう",
      description: "接続中のウォレットにmETHが入っているか確認します。",
      button: "mETHをチェック",
    },
  },
  {
    id: "open-lend-market",
    level: 3,
    xp: 200,
    action: { type: "external", url: "https://init.capital/" },
    en: {
      title: "Explore a Lending Market",
      description: "Open a Mantle lending market and check how assets are supplied or borrowed.",
      button: "Open Lending",
    },
    ja: {
      title: "レンディング市場を探索",
      description: "Mantle上のレンディング市場を開いて、資産の供給や借入の流れを見ます。",
      button: "Lendingを開く",
    },
  },
  {
    id: "open-bridge",
    level: 3,
    xp: 200,
    action: { type: "external", url: "https://bridge.mantle.xyz/" },
    en: {
      title: "Open Mantle Bridge",
      description: "Open the Mantle bridge and learn how assets move into the network.",
      button: "Open Bridge",
    },
    ja: {
      title: "Mantle Bridgeを見る",
      description: "Mantle Bridgeを開いて、資産がネットワークへ移動する流れを見ます。",
      button: "Bridgeを開く",
    },
  },
];
