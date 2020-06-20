(function (win,doc) {

  function $(selector) {
    var arr = [];
    var i = 0;

    if (selector) {
      // String
      if (typeof selector === "string") {
        var els;
        var tempParent;
        var html = selector.trim();

        if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
          var toCreate = "div";

          if (html.indexOf("<li") === 0) {
            toCreate = "ul";
          }

          if (html.indexOf("<tr") === 0) {
            toCreate = "tbody";
          }

          if (html.indexOf("<td") === 0 || html.indexOf("<th") === 0) {
            toCreate = "tr";
          }

          if (html.indexOf("<tbody") === 0) {
            toCreate = "table";
          }

          if (html.indexOf("<option") === 0) {
            toCreate = "select";
          }

          tempParent = doc.createElement(toCreate);
          tempParent.innerHTML = html;

          for (i = 0; i < tempParent.childNodes.length; i += 1) {
            arr.push(tempParent.childNodes[i]);
          }
        } else {
          if (selector[0] === "#" && !selector.match(/[ .<>:~]/)) {
            // Pure ID selector
            els = [doc.getElementById(selector.trim().split("#")[1])];
          } else {
            // Other selectors
            els = doc.querySelectorAll(selector.trim());
          }

          for (i = 0; i < els.length; i += 1) {
            if (els[i]) {
              arr.push(els[i]);
            }
          }
        }
      } else if (selector.nodeType || selector === win || selector === doc) {
        // Node/element
        arr.push(selector);
      } else if (selector.length > 0 && selector[0].nodeType) {
        // Array of elements or instance of Dom
        for (i = 0; i < selector.length; i += 1) {
          arr.push(selector[i]);
        }
      }
    }

    return arr;
  }

  $.fn = Object.create(null)

  function hasClass(obj, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + obj.className + ' ');
  }

  function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) {
      obj.className = obj.className.trim() + " " + cls;
    }
    return this;
  }

  function removeClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      obj.className = obj.className.replace(reg, " ");
    }

    return this;
  }

  var Methods = {
    hasClass,
    addClass,
    removeClass
  }

  Object.keys(Methods).forEach(function (methodName) {
    $.fn[methodName] = $.fn[methodName] || Methods[methodName];
  })

  var Utils = {
    // 对象判断
    isObject: function isObject(o) {
      return typeof o === "object" && o !== null && o.constructor && o.constructor === Object;
    },
    // 扩展
    extend: function extend() {
      var args = [],
        len$1 = arguments.length;

      while (len$1--) args[len$1] = arguments[len$1];

      var to = Object(args[0]);

      for (var i = 1; i < args.length; i += 1) {
        var nextSource = args[i];

        if (nextSource !== undefined && nextSource !== null) {
          var keysArray = Object.keys(Object(nextSource));

          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
              if (Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else if (!Utils.isObject(to[nextKey]) && Utils.isObject(nextSource[nextKey])) {
                to[nextKey] = {};
                Utils.extend(to[nextKey], nextSource[nextKey]);
              } else {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
      }

      return to;
    },
    // 节流
    throttle: function (func, wait) {
      var timeout, context, args;
      var previous = 0;

      var later = function () {
        previous = +new Date();
        timeout = null;
        func.apply(context, args);
      };

      var throttled = function () {
        var now = +new Date(); //下次触发 func 剩余的时间

        var remaining = wait - (now - previous);
        context = this;
        args = arguments; // 如果没有剩余的时间了或者你改了系统时间

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          previous = now;
          func.apply(context, args);
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
      };

      return throttled;
    }
    
  }

  var Event = {
    listener: function (elName, cb) {
      var _this = this;
      if (Array.isArray(_this[elName]) === true) {
        _this[elName].push(cb);
      } else {
        _this[elName] = [cb];
      }
    }
  }

  var emit = function (params) {
    if (Array.isArray(Event[params])) {
      
      var len = Event[params].length,
          i = 0;

      for (; i < len; i++) {
        if (typeof Event[params][i] === "function") {
          Event[params][i]();
        }
      }
    } else {
      Event[params]();
    }
    
  }

  function magicMode(e) {
    var _this = this,
        target = _this.target

    if (target.getAttribute("date-state") === "static") {
      return;
    }

    var obj = {
      target,
      disY: e.pageY - target.offsetTop,
      disX: e.pageX - target.offsetLeft
    }

    var start = Utils.throttle(handlers.magicMoveHandlering.bind(_this, obj), 18);
    var end = handlers.MoveHandlerEnd.bind(_this,target);

    return {
      start,
      end
    }
  }

  function scaleMode() {

    var _this = this;
    var target = _this.target;
    var parentEl = target.parentNode;

    if (parentEl.getAttribute("date-state") === "static") {
      return;
    }

    var obj = {
      parentEl,
      viewWidth: doc.body.clientWidth,
      disX: parentEl.offsetLeft,
      disY: parentEl.offsetTop
    };

    var start = Utils.throttle(handlers.scaleModeHandlering.bind(_this, obj), 18);
    var end = handlers.MoveHandlerEnd.bind(_this, parentEl)
    return {
      start,
      end
    };
  }

  function magicMoveHandlering(obj, e) {
    obj.target.style.left = e.pageX - obj.disX + "px";
    obj.target.style.top = e.pageY - obj.disY + "px";
  }

  function MoveHandlerEnd(target) {
    var storage = window.localStorage
    var key = target.getAttribute('date-key')
    var info = JSON.parse(storage.getItem('Drag-MagicInformation'))
    
    if(Utils.isObject(info)){
      info[key] = {
        top: target.offsetTop,
        left: target.offsetLeft,
        width: target.offsetWidth,
        height: target.offsetHeight
      }
      storage.setItem('Drag-MagicInformation', JSON.stringify(info))
    }else{
      info = {
        [key]: {
          top: target.offsetTop,
          left: target.offsetLeft,
          width: target.offsetWidth,
          height: target.offsetHeight
        }
      }
      storage.setItem('Drag-MagicInformation', JSON.stringify(info))
    }
  }

  function scaleModeHandlering(obj, e) {
    if (e.pageX >= obj.viewWidth) return;

    obj.parentEl.style.width = e.pageX - obj.disX + "px";
    obj.parentEl.style.height = e.pageY - obj.disY + "px";
  }

  var handlers = {
    magicMode,
    scaleMode,
    magicMoveHandlering,
    scaleModeHandlering,
    MoveHandlerEnd,
  }

  var DragClass = function (){  }

  DragClass.prototype.downProxy = function (e) {
    var _this = this,
        upFn = null,
        target = e.target,
        attr = target.getAttribute("date-mode"); // 事件源date-mode属性

    _this.target = target; 
    // 当鼠标在$DragEl中按下之后
    // 事件会传递到子元素上  target
    // 根据 target 上的 data-mode ，即它是属于哪一种处理模式
    if (typeof handlers[attr] !== 'function') return ;
    var ObjFn = handlers[attr].call(_this, e);

    upFn = function (e) {
      doc.removeEventListener("mouseup", upFn);
      doc.removeEventListener("mousemove", ObjFn.start);

      if (typeof ObjFn.end === "function") {
        ObjFn.end.call(_this, e);
      }
    };

    doc.addEventListener("mousemove", ObjFn.start);
    doc.addEventListener("mouseup", upFn);
  }

  DragClass.prototype.uqdateBtn = function () {
    var Drag = this;
    var btn = Drag.params.button;
    var storage = win.localStorage;
    Drag.$.fn.addClass(btn, "binZindex");
    btn.addEventListener("click", function () {
      // 点击会开启幕布 barrier
      if (!Drag.is) {
        Drag.is = true;
        if(Drag.params.curtain){
          emit("openCurtain");
        }
        if (!storage.getItem('Drag-MagicInformation')){
          Drag.uqdateCache();
        }
        emit("downing");
      } else {
        Drag.is = false;
        if (Drag.params.curtain) {
          emit("closeCurtain");
        }
        emit("downed");
      }
    });
  }

  DragClass.prototype.uqdateCurtion = function () {
    var Drag = this,
        params = Drag.params,
        curtain = params.curtain,
        magic = params.magic,
        scaleIcon = params.scaleIcon;
        
    Event.listener("openCurtain", function () {
      
      Drag.$.fn.addClass(curtain, "openCurtain");

      for (let i = 0; i < magic.length; i++) {
        Drag.$.fn.addClass(magic[i].el, "drag-child-dashed");
      }
      for (let i = 0; i < scaleIcon.length; i++) {   
        if(scaleIcon[i]){
          scaleIcon[i].style.display = "block";
        }
      }

    }.bind(Drag));

    Event.listener("closeCurtain", function () {

      Drag.$.fn.removeClass(curtain, "openCurtain");

      for (let i = 0; i < magic.length; i++) {
        Drag.$.fn.removeClass(magic[i].el, "drag-child-dashed");
      }

      for (let i = 0; i < scaleIcon.length; i++) {
        if (scaleIcon[i]) {
          scaleIcon[i].style.display = "none";
        }
      }

    }.bind(Drag));
  }

  DragClass.prototype.updateMagic = function () {
    var Drag = this,
        params = Drag.params,
        len = params.magic.length,
        i = 0,
        scaleIcon,
        currentMagic;

    for (; i < len; i++) {
      currentMagic = params.magic[i].el;
      Drag.$.fn.addClass(currentMagic, 'drag-child');

      if (params.magic[i].scale) {
        scaleIcon = doc.createElement("span");
        scaleIcon.setAttribute("date-mode", "scaleMode");
        scaleIcon.className = "scaleIcon";
        scaleIcon.style.display = "none";
        params.scaleIcon[i] = scaleIcon;
        currentMagic.appendChild(scaleIcon);
      }
    }

    var EventFn = Drag.downProxy.bind(Drag);

    if (Drag.params.button) {

      Event.listener("downing", function () {
        Drag.$DragEl.addEventListener("mousedown", EventFn);
      }.bind(Drag));

      Event.listener("downed", function () {
        Drag.$DragEl.removeEventListener("mousedown", EventFn);
      });

    } else {
      Drag.$DragEl.addEventListener("mousedown", EventFn);
    }
  }

  DragClass.prototype.uqdateCache = function(){
    var Drag = this;
    var magicArr = Drag.params.magic
    var len = magicArr.length
    let key;
    var storage = window.localStorage;
    var info = JSON.parse(storage.getItem('Drag-MagicInformation'))
    if (!info || !('origin' in info)) {
      info = {
        origin: {}
      }
      for (let i = 0; i < len; i++) {
        key = magicArr[i].el.getAttribute('date-key')
        info['origin'][key] = {};
        info['origin'][key].width = magicArr[i].el.offsetWidth + 'px'
        info['origin'][key].height = magicArr[i].el.offsetHeight + 'px'
        info['origin'][key].top = magicArr[i].el.offsetTop + 'px'
        info['origin'][key].left = magicArr[i].el.offsetLeft + 'px'
      }
      Drag.params.Magdefaults = info;
      storage.setItem('Drag-MagicInformation', JSON.stringify(info))

    }

    if (Utils.isObject(info)) {
      for (let i = 0; i < len; i++) {
        key = magicArr[i].el.getAttribute('date-key')
        if (key in info) {
          magicArr[i].el.style.width = info[key].width + 'px'
          magicArr[i].el.style.height = info[key].height + 'px'
          magicArr[i].el.style.top = info[key].top + 'px'
          magicArr[i].el.style.left = info[key].left + 'px'
        }
      }
    }

  }

  DragClass.prototype.uqdateRecovery = function(){
    var Drag = this;
    var btn = Drag.params.recovery;
    var mag = Drag.params.magic;
    var len = mag.length
    
    var defaults
    
    btn.addEventListener('click', function () {
      defaults = JSON.parse(win.localStorage.getItem('Drag-MagicInformation'))
      
      defaults = defaults ? defaults.origin : Drag.params.Magdefaults.origin;

      for (var i = 0; i < len; i++) {
        var key = mag[i].el.getAttribute('date-key')
        if(key in defaults){
          mag[i].el.style.width = defaults[key].width
          mag[i].el.style.height = defaults[key].height
          mag[i].el.style.top = defaults[key].top
          mag[i].el.style.left = defaults[key].left
        }      
      }
      win.localStorage.removeItem('Drag-MagicInformation')
    })
  }

  var Drag = function () {

    function Drag() {
      var $el = arguments[0],
          userParam = arguments[1];
      var Drag = this;
      Drag.$ = $;
      Drag.$DragEl = $el;
      Drag.target = null;
      Drag.uqdateDragParams(Drag.$DragEl, "$DragEl"); // 默认参数

      var defaults = {
        button: false,
        recovery: false,
        magic: [],
        curtain: false,
        scaleIcon: [],
        restrict: false,
        storage: false,
        Magdefaults: {}
      }; 

      Drag.params = Utils.extend({}, defaults, userParam); // 初始化

      Drag.init();
      return Drag;
    }

    if (DragClass) Drag.__proto__ = DragClass;
    Drag.prototype = Object.create(DragClass && DragClass.prototype);
    Drag.prototype.constructor = Drag;

    Drag.prototype.init = function () {
      var self = this; 

      if (self.params.button) {
        self.uqdateDragParams(self.params.button, "button");
        self.uqdateBtn();
      } 

      if (self.params.recovery) {
        self.uqdateDragParams(self.params.recovery, "recovery");
        self.uqdateRecovery()
      }

      if (self.params.curtain) {
        self.uqdateDragParams(self.params.curtain,'curtain')
        self.uqdateCurtion();
      }

      if (self.params.magic) {
        self.uqdateDragParams(self.params.magic, "magic");
        self.updateMagic();
      } 

      if (self.params.storage) {
        self.uqdateCache();
      } 
    }

    Drag.prototype.uqdateDragParams = function () {
      var params = arguments[0];
      var proxyName = arguments[1];
      this.uqdateDragParamsProxy[proxyName].call(this, params);
    }

    Drag.prototype.uqdateDragParamsProxy = {
      $DragEl: function () {
        var params = arguments[0],
          _this = this;

        _this.$DragEl = _this.$(params)[0];
      },
      button: function () {
        var params = arguments[0],
          _this = this;

        _this.params.button = _this.$(params)[0];
      },
      magic: function () {
        var params = arguments[0],
          _this = this,
          i = 0,
          len = params.length;

        for (; i < len; i++) {
          _this.params.magic[i].el = _this.$(params[i].el)[0];

          _this.params.magic[i].el.setAttribute("date-mode", "magicMode");

          if (_this.params.magic[i].static) {
            _this.params.magic[i].el.setAttribute("date-state", "static");
          }
          if (_this.params.magic[i].key) {
            _this.params.magic[i].el.setAttribute("date-key", _this.params.magic[i].key);
          }

        }
      },
      curtain: function () {
        var params = arguments[0],
            _this = this;
        _this.params.curtain = _this.$(params)[0]
      },
      recovery: function(){
        var params = arguments[0],
            _this = this;

        _this.params.recovery = _this.$(params)[0]
      }
    }

    return Drag

  }()

  win.Drag = Drag

})(window || {},document || {})