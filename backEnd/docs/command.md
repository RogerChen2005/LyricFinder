# Lyric Finder中的命令

Lyric Finder通过Websocket进行前后端的消息传输，

那么命令的格式便是必不可少的一环，

本文档将详细阐述Lyric Finder中的消息命令

## 格式

消息主体为JSON对象

·target (string) 

    消息的目标函数，后端将通过eval直接运行

·data （JSON）[optional]

    数据主体，将被作为args传入函数中

