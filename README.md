# simpleAnimation.js
javascript animation을 연구하며 결과물로 만든 프로젝트

## 현재 가능한 코드
1. 기본적인 Animation 클래스 사용 ([jsfiddle](https://jsfiddle.net/widyou/w4u5nhyc))
```javascript
var target = document.getElementById('targetElementId'),
    startTopValue = getStyle(target, 'top', true),
    a1 = new Animation({
        callback: function(rate){ // 매 프레임마다 실행되는 함수 (rate = 0~1 사이의 float)
            var l = startLeftValue + (300 * rate); //
            target.style.left = l + 'px';
        },
        duration: 1000,
        animationMode: AnimationModes.slowFastSlow // 움직이는 형태
    }).run();
```

## 앞으로 가능하게 될 코드
```javascript
$ani(document.getElementById('targetElementId')).css({
    top: 300,
    left: 300
}, {
    duration: 1000,
    animationMode: AnimationModes.slowFastSlow
});
```
```javascript
$ani(document.getElementById('targetElementId')).fly({
    [300, 300],
    duration: 1000,
    movingMode: MovingModes.convexArc
});
```
