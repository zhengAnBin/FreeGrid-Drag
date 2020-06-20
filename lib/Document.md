```js
new Drag('#drag', {
    button: ".drag-btn",       // 建议有个按钮来开启拖拽操作
    curtain: '.drag-curtain',  // 这是一个幕布，用于拖拽开启时的背景
    magic: [                   // 可拖拽的盒子
        { el: ".drag-child1", key: 'a' },
        { el: ".drag-child2", key: 'b', scale: true}
    ],
})
```

```js
// magic配置属性
el      // 当前可拖拽盒子的选择器
key     // 当你开启本地缓存时，这是必须的，唯一识别
scale   // 盒子可缩放
static  // 禁止拖拽以及缩放，一个很鸡肋的属性
```

```js
storage : true    // 开启本地缓存
// 同时希望你有个按钮可控制，点击可恢复最原始的设置
recovery : '.btn'
```

