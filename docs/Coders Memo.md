# 作者のメモ

## 開発環境
``YOMAN``でセットアップしました
[参考:Qiita](https://qiita.com/HelloRusk/items/073b58c1605de224e67e)

```npm:terminal
npm install -g yo generator-code
yo code
```

## 資料
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
  - 拡張機能には、ディレクトリルートにマニフェストファイル`package.json`が必要です。

## 配布のメモ

### パッケージ化
```npx:terminal
npx vsce package 
```

### 配布
- 公開するための準備
  - [](https://aex.dev.azure.com/me?mkt=ja-JP)にアクセス
  - 必要ならばアカウントを作成
  - 新規にプロジェクトを作成する場合
    - 新しいプロジェクトを押下

    - Azure DevOps組織 > プロジェクト にアクセス

    - Browse marketplace を押下
    Publish extensions を押下(右上のメニュー)
    Owner の箇所をhoverして、Publisher ID を控える

![Manage Publishers & Extensions](.\images\2024-03-20_11h50_46.png)

- [vscodeの拡張機能(Extension)を公開するまで](https://qiita.com/tkts_knr/items/92a15a9fe7475418b333)



```
vsce login {publisher name}
```

#### 配布コマンド
```
vsce publish
```

## 配布場所
https://marketplace.visualstudio.com/items?itemName=JuneYAMAMOTO.paperback-writer
https://marketplace.visualstudio.com/manage/publishers/JuneYAMAMOTO/extensions/paperback-writer/hub