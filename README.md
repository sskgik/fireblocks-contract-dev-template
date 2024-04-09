# Contract-Develop-template

スマートコントラクトの開発リポジトリ 

スマートコントラクトのDeployに関してのルールは以下の通り

## Deployルール 

①Native Token , ERC20が絡むスマートコントラクトはメインネットデプロイ前に最低1人以上のコントラクトレビュー後

デプロイ行為を行うこととする

*エスクロー取引,マッチング取引等は特に重要チェックとする

②ERC721のNFTに関しては
サービスの求める仕様と合致しているかの確認を行い仕様書と実装の動作差分がないと判断できればデプロイとする

## これは一回のみ
- `nvm` をインストールする(nodeバージョン管理用) [Link](https://github.com/nvm-sh/nvm)
- `nvm use` でプロジェクトで設定したnodeバージョンを利用する
- `npm install --global yarn` で`yarn`を利用する

## 本プロジェクトをコピーペーストした後は
- `yarn` で依存modulesをインストールする
- `NewProject/contracts/` に新規スマートコントラクトを書く
- `NewProject/test/` ここにテストコードを書く

## コマンド一覧
|コマンド|説明|
|-|-|
|`yarn run clean`|`deploy`関係のファイルを削除する|
|`yarn run lint`|lintルールを守っているかチェック|
|`yarn run lint:fix`|自動でlint修正|
|`yarn run coverage`|テストコード書いてない範囲をチェック|
|`yarn run test`|テストを実行する|
|`yarn run gas-report`|ガス代計算|
|`yarn run prepare`|`deploy`前の準備|
|`yarn run deploy`|:boom:|

## 一般的
- [Contract・Struct・Event・関数・変数・などの命名規則](https://github.com/0xcert/solidity-style-guide)

## 開発環境設定ファイル
- [.env](https://drive.google.com/file/d/1WdAYVfVRAQFti2WHsYIBN_o6gUfC4FIa/view?usp=sharing)
- [.env.example](https://drive.google.com/file/d/1CF2Jdu5YP-iK2ydXz5M8_diOpDY7WAek/view?usp=sharing)
ダウンロード後は、「.env.txt」 -> 「.env」に変更する必要

## Fireblocks Environment vlue setting
- `FIREBLCOKS_API_KEY` Fireblocks Console API Co-signerのAPI key をセットしてください
- `FIREBLOCKS_API_PRIVATE_KEY_PATH` Fireblocks API Co-signer API secret Fileの保管先Pathをセットしてください
- `FIREBLOCKS_VAULT_ACCOUNT_IDS` デプロイを行うFireblocksのVaultIDを指定してください

## チェックリスト
- アドレスがEOAかコントラクトかのチェック

