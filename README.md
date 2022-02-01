# YouTube Chat Ticker Throttling

YouTube のチャット欄に表示される Ticker の更新頻度を制限します。

## Summary

YouTube で視聴者がスーパーチャットを行うとチャット欄に Ticker が表示されます。

Ticker には表示時間が設定されており、時間経過によって少しずつバーが減少し、ゼロになるとチャット欄から取り除かれる仕組みです。

ところが YouTube は Ticker の更新を 60 FPS で行おうとするため、多数の Ticker が表示されていると Ticker の更新だけで CPU を使い切ってしまい、ライブ配信の視聴に支障をきたすようになります。

この UserJS は Ticker の更新頻度を 0.5 FPS（2秒に1回）に抑え、CPU 使用率を大幅に削減し、ライブ配信を快適に視聴できるようサポートします。

## Install

[dist/youtube-chat-ticker-throttling.user.js](https://github.com/sigsignv/userjs-youtube-chat-ticker-throttling/raw/main/dist/youtube-chat-ticker-throttling.user.js)

## Author

Sigsign <<sig@signote.cc>>

## License

Apache-2.0
