'use strict';
function getStyle(oElm, css3Prop, onlyNum) {
	var strValue = "";

	if(window.getComputedStyle) {
		strValue = getComputedStyle(oElm).getPropertyValue(css3Prop);
	}
	//IE
	else if (oElm.currentStyle){
		try {
			strValue = oElm.currentStyle[css3Prop];
		} catch (e) {}
	}
	if (onlyNum) {
		var nums = strValue.match(/[0-9]+/);
		if (nums && nums.constructor == Array) {
			return parseInt(nums.pop());
		}
	}
	return strValue;
}

var animationCallback = {
	normal: function(rate) {
		return rate;
	},
	fastToSlow: function(rate) {
		return -((rate-1)*(rate-1))+1;
	},
	slowToFast: function(rate) {
	return rate*rate;
	},
	fastSlowFast: function(rate) {
		if (rate <= 0.5) {
			return animationCallback.fastToSlow(rate*2)/2;
		} else {
			return (animationCallback.slowToFast((rate-0.5)*2)/2)+0.5;
		}
	},
	slowFastSlow: function(rate) {
		if (rate <= 0.5) {
			return animationCallback.slowToFast(rate*2)/2;
		} else {
			return (animationCallback.fastToSlow((rate-0.5)*2)/2)+0.5;
		}
	}
};

// 애니메이션 클래스 (각 애니메이션의 단위가 됨)
function Animation(options) {
	if (!options.callback || options.callback.constructor != Function) {
		throw Error('Callback function error');
		return;
	}
	this.callback = options.callback;
	this.duration = options.duration || 500;
	this.animationCallbackFunc = options.animationCallbackFunc || animationCallback.normal;
	this.fps = options.fps || 30;
	this.frameInterval = 1000/this.fps;
	this.rateOrigin = 0;
}
Animation.prototype = (function() {
	var getNowPercent = function (startTime, duration, animationCallback) {
		// 현재 시간 비중 (현재 지나간 시간/전체 소요시간)
		this.rateOrigin = (Date.now()-startTime)/duration;
		// 가중치계산
		var rate = this.rateOrigin;
		if (typeof animationCallback !== 'undefined' && animationCallback.constructor == Function) {
			rate = animationCallback.call(window, this.rateOrigin);
		}
		//console.log((Date.now()-startTime) + ' / ' + duration +' = '+this.rateOrigin + ' => ' + rate);
		return rate;
	};
	return {
		run: function() {
			this.startTime = Date.now();
			this.animateOneFrame();
			return this;
		},
		animateOneFrame: function() {
			// 현재위치 계산
			var rate = getNowPercent.call(this, this.startTime, this.duration, this.animationCallbackFunc);
			// 콜백 한번 수행
			this.callback.call(window, Math.min(rate, 1.0));
			// 끝나지 않았을 경우 다음 실행값 세팅
			if (this.rateOrigin >= 0 && this.rateOrigin < 1.0) {
				if (this.timeoutObject) {
					this.timeoutObject = null;
					clearInterval(this.timeoutObject);
				}
				var that = this;
				this.timeoutObject = setTimeout(function(){
					that.animateOneFrame();
				}, this.frameInterval);
			} else {
				this.callback.call(window, 1);
			}
		}
	};
})();

