# INTERN CAT Setup

This file is for developers or reviewers who want to run INTERN CAT locally.

For the project concept and hackathon overview, see `README.md`.

## Requirements

- Node.js
- npm
- A browser wallet such as MetaMask for wallet and mint testing
- Mantle Sepolia MNT for testnet transactions

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev -- -p 3002
```

Open:

```text
http://localhost:3002
```

## Environment Variables

Create `.env.local` in the project root when needed.

```bash
NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS=your_contract_address
NEXT_PUBLIC_MANTLE_CHAIN=sepolia
NANSEN_API_KEY=your_nansen_api_key
```

## Notes

- `NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS` is required for live Passport NFT minting.
- `NEXT_PUBLIC_MANTLE_CHAIN=sepolia` uses Mantle Sepolia.
- `NEXT_PUBLIC_MANTLE_CHAIN=mainnet` is reserved for future Mantle Mainnet use.
- `NANSEN_API_KEY` is used by the local API route for Nansen-assisted research.
- Do not commit real API keys.

## Set Nansen API Key

The project includes a helper script:

```bash
npm run set:nansen-key
```

Paste the API key when prompted. The script writes it to `.env.local`.

Restart the development server after changing `.env.local`.

## Smart Contract

The ERC-721 Passport contract is located at:

```text
contracts/InternCatPassport.sol
```

It is designed for Mantle Sepolia first, with a configuration path for Mantle Mainnet later.

## Build Check

```bash
npm run build
```

---

# INTERN CAT セットアップ

このファイルは、INTERN CATをローカルで動かしたい開発者・審査員向けです。

プロジェクト概要やハッカソン向け説明は`README.md`を見てください。

## 必要なもの

- Node.js
- npm
- MetaMaskなどのブラウザウォレット
- テストネット取引用のMantle Sepolia MNT

## インストール

```bash
npm install
```

## ローカル起動

```bash
npm run dev -- -p 3002
```

ブラウザで開きます:

```text
http://localhost:3002
```

## 環境変数

必要に応じて、プロジェクト直下に`.env.local`を作成します。

```bash
NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS=your_contract_address
NEXT_PUBLIC_MANTLE_CHAIN=sepolia
NANSEN_API_KEY=your_nansen_api_key
```

## 注意

- Passport NFTのMintには`NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS`が必要です。
- `NEXT_PUBLIC_MANTLE_CHAIN=sepolia`でMantle Sepoliaを使います。
- `NEXT_PUBLIC_MANTLE_CHAIN=mainnet`は将来的なMantle Mainnet用です。
- `NANSEN_API_KEY`はNansen連携リサーチ用のローカルAPIルートで使います。
- 本物のAPIキーは公開しないでください。

## Nansen APIキーの設定

ヘルパースクリプトがあります。

```bash
npm run set:nansen-key
```

表示に従ってAPIキーを貼り付けると、`.env.local`に保存されます。

`.env.local`を変更した後は、開発サーバーを再起動してください。

## スマートコントラクト

ERC-721 Passportコントラクトはこちらです。

```text
contracts/InternCatPassport.sol
```

まずはMantle Sepolia向けに利用し、将来的にMantle Mainnetへ切り替えられる構成です。

## ビルド確認

```bash
npm run build
```
