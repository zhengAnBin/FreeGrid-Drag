(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.Swiper = factory());
})(this, function () {
  "use strict";

  if (!window) return;
  var doc = document;
  var win = window; // 选择器

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

  $.fn = Object.create(null);

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
  } // 常用函数


  var Methods = {
    hasClass,
    addClass,
    removeClass
  };
  Object.keys(Methods).forEach(function (methodName) {
    $.fn[methodName] = $.fn[methodName] || Methods[methodName];
  });
  var constant = {
    class2type: {
      "[object Array]": "array",
      "[object Boolean]": "boolean",
      "[object Date]": "date",
      "[object Error]": "error",
      "[object Function]": "function",
      "[object Number]": "number",
      "[object Object]": "object",
      "[object RegExp]": "regexp",
      "[object String]": "string",
      "[object HTMLElement]": "node"
    },
    english: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    random: function () {
      var arr = [];
      var len = constant.english.length;

      for (var i = 0; i < 5; i++) {
        arr.push(constant.english[Math.floor(Math.random() * len)]);
      }

      return arr.join("");
    }
  };
  var Utils = {
    // 类型判断
    type: function (obj) {
      if (obj == null) {
        return obj + "";
      }

      return typeof obj === "object" || typeof obj === "function" ? constant.class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj;
    },
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
  }; 
  // 订阅

  var Event = {
    listener: function (elName, cb) {
      var _this = this;

      if (Utils.type(_this[elName]) === "array") {
        _this[elName].push(cb);
      } else {
        _this[elName] = [cb];
      }
    },
    remove: function () {
      var arg = arguments[0];

      var _this = this;

      if (typeof arg === "string") {
        _this.delete(arg);
      } else {
        var len = arg.length,
            i = 0;

        for (; len > i; i++) {
          _this.delete(arg[i]);
        }
      }
    }
  }; // 发布

  var emit = function (params) {
    var len = Event[params].length,
        i = 0;

    for (; i < len; i++) {
      if (Utils.type(Event[params][i]) === "function") {
        Event[params][i]();
      }
    }
  }; // 存放 ruler 标尺中的一些位置信息


  var rulerLayout = {
    ruler: {},
    remove: function (str) {
      var obj = rulerLayout.ruler;
      if (obj[str]) return delete obj[str];
    },
    clear: function () {
      var obj = rulerLayout.ruler;
      Object.keys(obj).forEach(function (key) {
        obj[key].parentEl.removeChild(obj[key].el);
        delete obj[key];
      });
    }
  };
  var magicLayout = {}; // down事件处理函数

  function magicMode(e) {
    var target = this.target;

    var _this = this;

    if (target.getAttribute("date-state") === "static") {
      return;
    } // 标志为正在运动对象


    var obj = {
      winHeight: _this.winHeight,
      winWidth: _this.winWidth,
      target,
      disY: e.pageY - target.offsetTop,
      disX: e.pageX - target.offsetLeft
    };
    var key = target.getAttribute("date-key");

    if (key) {
      obj['key'] = key;
      magicLayout[key].moving = true;
    }

    var start = Utils.throttle(handlers.magicMoveHandler.bind(_this, obj), 18);
    var end = null;

    if (_this.params.ruler) {
      end = handlers.magicMoveEnd.bind(_this, target);
    }

    return {
      start,
      end
    };
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
    var start = Utils.throttle(handlers.scaleModeHandler.bind(_this, obj), 18);
    return {
      start,
      end: null
    };
  }

  function rulerMode() {
    var _this = this,
        obj;

    var target = _this.target;
    var rulerAttr = target.getAttribute("date-ruler");
    var direction = target.getAttribute("date-direction");
    var node;
    var str; // 在 date-ruler 上有origin标志的是源体
    // 在有在源体上才可以进行克隆，分裂

    if (rulerAttr === "origin") {
      node = target.cloneNode(true), str = constant.random();

      while (rulerLayout.ruler[str]) {
        str = constant.random();
      } // 初始rulerLayout中的值


      rulerLayout.ruler[str] = {};
      node.setAttribute("date-key", str);
      obj = {
        node
      }; // 克隆完将 date-ruler 置为 clone ，即为克隆节点，标志它再次克隆

      node.setAttribute("date-ruler", "clone");
      target.parentNode.appendChild(node);
    } else {
      // 子标尺
      node = target;
      obj = {
        node
      };
    }

    obj[rulerAttr] = rulerAttr;

    if (direction === "top") {
      obj.direction = "Top";
    } else if (direction === "left") {
      obj.direction = "Left";
    }

    var start = Utils.throttle(handlers.rulerMoveHandler.bind(_this, obj), 18);
    var end = handlers.rulerMoveEnd.bind(_this, node, obj);
    return {
      start,
      end
    };
  }

  var onMoveStrategy = {
    magicMode,
    rulerMode,
    scaleMode
  }; // move事件处理函数

  function magicMoveHandler(obj, e) {
    obj.target.style.left = e.pageX - obj.disX + "px";
    obj.target.style.top = e.pageY - obj.disY + "px";

    if (obj.key) {
      var N = obj.target.offsetTop;
      var S = obj.winHeight - (obj.target.offsetTop + obj.target.offsetHeight);
      var W = obj.target.offsetLeft;
      var E = obj.winWidth - (obj.target.offsetLeft + obj.target.offsetWidth);
      var nowData = {
        N,
        S,
        W,
        E
      };
      var before = magicLayout[obj.key]; // 判断当前拖拽元素的运动方向

      if (before.N > nowData.N && before.S < nowData.S) {
        DirectionOfMotion["N"].call(this, nowData, obj);
      }

      if (before.S > nowData.S && before.N < nowData.N) {
        DirectionOfMotion["S"].call(this, nowData, obj);
      }

      if (before.E > nowData.E && before.W < nowData.W) {
        DirectionOfMotion["E"].call(this, nowData, obj);
      }

      if (before.W > nowData.W && before.E < nowData.E) {
        DirectionOfMotion["W"].call(this, nowData, obj);
      } // 更新magic的位置信息


      magicLayout[obj.key].N = N;
      magicLayout[obj.key].S = S;
      magicLayout[obj.key].W = W;
      magicLayout[obj.key].E = E;
    }
  }

  function magicMoveEnd(target) {
    var _this = this;

    var message = rulerLayout.ruler,
        targetY = target.offsetTop,
        targetX = target.offsetLeft,
        height = target.offsetHeight,
        width = target.offsetWidth,
        topValue = 0,
        leftValue = 0,
        topSubVal = null,
        leftSubVal = null,
        topDouble = 0,
        leftDouble = 0; // 循环比较，生产最小值

    if (_this.params.ruler) {
      Object.keys(message).forEach(function (key) {
        if (message[key].mark === "Top") {
          topValue = targetY - message[key].positionY;

          if (topValue <= 15 && topValue >= -8) {
            if (!topDouble) {
              topDouble = topValue;
              topSubVal = message[key].positionY;
            } else {
              if (topDouble > Math.abs(topValue)) {
                topDouble = topValue;
                topSubVal = topDouble;
              }
            }
          }
        }

        if (message[key].mark === "Left") {
          leftValue = targetX - message[key].positionX;

          if (leftValue <= 15 && leftValue >= -8) {
            if (!leftDouble) {
              leftDouble = leftValue;
              leftSubVal = message[key].positionX;
            } else {
              if (leftDouble > Math.abs(leftValue)) {
                leftDouble = leftValue;
                leftSubVal = leftDouble;
              }
            }
          }
        }
      }); // 产生最小值时，触发贴附

      if (topSubVal && !leftSubVal) {
        _this.updateAttach(target, "triggerTop", {
          topSubVal
        });
      }

      if (!topSubVal && leftSubVal) {
        _this.updateAttach(target, "triggerLeft", {
          leftSubVal
        });
      }

      if (topSubVal && leftSubVal) {
        _this.updateAttach(target, "together", {
          topSubVal,
          leftSubVal
        });
      }
    }

    var key = target.getAttribute("date-key");

    if (key) {
      magicLayout[key]["E"] = _this.winWidth - (targetX + height);
      magicLayout[key]["S"] = _this.winHeight - (targetY + width);
      magicLayout[key]["W"] = targetX;
      magicLayout[key]["N"] = targetY;
      magicLayout[key]["moving"] = false;
    }
  }

  function rulerMoveHandler(obj, e) {
    if (obj.direction === "Top") {
      obj.node.style.top = e.pageY + "px";
    }

    if (obj.direction === "Left") {
      obj.node.style.left = e.pageX + "px";
    }
  }

  function rulerMoveEnd(node, obj) {
    var target = node,
        dri = obj.direction,
        attrSub = obj.rulerAttr,
        key = target.getAttribute("date-key"),
        parent = target.parentNode,
        y = target.offsetTop,
        x = target.offsetLeft;

    if (dri === "top" && attrSub === "clone" && y <= 10) {
      parent.removeChild(target);
      rulerLayout.remove(key);
    }

    if (dri === "left" && attrSub === "clone" && x <= 10) {
      parent.removeChild(target);
    }

    if (!rulerLayout.ruler[key]) return; // 更新ruler Layout中的数据

    Utils.extend(rulerLayout.ruler[key], {
      parentEl: parent,
      el: target,
      mark: dri,
      positionY: y,
      positionX: x
    });
  }

  function scaleModeHandler(obj, e) {
    if (e.pageX >= obj.viewWidth) {
      return;
    }

    obj.parentEl.style.width = e.pageX - obj.disX + "px";
    obj.parentEl.style.height = e.pageY - obj.disY + "px";
  }

  var handlers = {
    magicMoveHandler,
    magicMoveEnd,
    rulerMoveHandler,
    rulerMoveEnd,
    scaleModeHandler
  };
  var DirectionOfMotion = {
    N: function (nowData, obj) {
      Object.keys(magicLayout).forEach(function (key) {
        // 触碰到元素的规则
        if (magicLayout[key].moving) return;
        var magic = magicLayout[key];

        if (nowData.N - (magic.N + magic.el.offsetHeight) > -magic.el.offsetHeight && nowData.N - (magic.N + magic.el.offsetHeight) < 4 && nowData.W - (magic.W + magic.el.offsetWidth) <= 0 && nowData.W - (magic.W + magic.el.offsetWidth) > -(magic.el.offsetWidth + obj.target.offsetWidth)) {
          magic.el.style.top = magic.el.offsetTop - 2 + "px";
          magic.N = magic.el.offsetTop;
          magic.S = obj.winHeight - (magic.el.offsetTop + magic.el.offsetHeight);
          magic.W = magic.el.offsetLeft;
          magic.E = obj.winWidth - (magic.el.offsetLeft + magic.el.offsetWidth);
        }
      });
    },
    S: function (nowData, obj) {
      Object.keys(magicLayout).forEach(function (key) {
        // 触碰到元素的规则
        if (magicLayout[key].moving) return;
        var magic = magicLayout[key];

        if (nowData.S - (magic.S + magic.el.offsetHeight) >= -magic.el.offsetHeight && nowData.S - (magic.S + magic.el.offsetHeight) <= 4 && nowData.W - (magic.W + magic.el.offsetWidth) <= 0 && nowData.W - (magic.W + magic.el.offsetWidth) >= -(magic.el.offsetWidth + obj.target.offsetWidth)) {
          magic.el.style.top = obj.target.offsetTop + obj.target.offsetHeight + 2 + "px";
          magic.N = magic.el.offsetTop;
          magic.S = obj.winHeight - (magic.el.offsetTop + magic.el.offsetHeight);
          magic.W = magic.el.offsetLeft;
          magic.E = obj.winWidth - (magic.el.offsetLeft + magic.el.offsetWidth);
        }
      });
    },
    W: function (nowData, obj) {
      Object.keys(magicLayout).forEach(function (key) {
        // 触碰到元素的规则
        if (magicLayout[key].moving) return;
        var magic = magicLayout[key];

        if (nowData.W - (magic.W + magic.el.offsetWidth) < 4 && nowData.W - (magic.W + magic.el.offsetWidth) > -magic.el.offsetWidth && nowData.N - (magic.N + magic.el.offsetHeight) < 0 && nowData.N - (magic.N + magic.el.offsetHeight) > -(obj.target.offsetHeight + magic.el.offsetHeight)) {
          magic.el.style.left = obj.target.offsetLeft - magic.el.offsetWidth - 2 + "px";
          magic.N = magic.el.offsetTop;
          magic.S = obj.winHeight - (magic.el.offsetTop + magic.el.offsetHeight);
          magic.W = magic.el.offsetLeft;
          magic.E = obj.winWidth - (magic.el.offsetLeft + magic.el.offsetWidth);
        }
      });
    },
    E: function (nowData, obj) {
      Object.keys(magicLayout).forEach(function (key) {
        // 触碰到元素的规则
        if (magicLayout[key].moving) return;
        var magic = magicLayout[key];

        if (nowData.E - (magic.E + magic.el.offsetWidth) <= 4 && nowData.E - (magic.E + magic.el.offsetWidth) >= -magic.el.offsetWidth && nowData.N - (magic.N + magic.el.offsetHeight) <= 0 && nowData.N - (magic.N + magic.el.offsetHeight) >= -(magic.el.offsetHeight + obj.target.offsetHeight)) {
          magic.el.style.left = obj.target.offsetLeft + obj.target.offsetWidth + 2 + "px";
          magic.N = magic.el.offsetTop;
          magic.S = obj.winHeight - (magic.el.offsetTop + magic.el.offsetHeight);
          magic.W = magic.el.offsetLeft;
          magic.E = obj.winWidth - (magic.el.offsetLeft + magic.el.offsetWidth);
        }
      });
    }
  }; // 提供外面访问的对象

  var DragClass = function () {
    /** null */
  };

  DragClass.prototype.downProxy = function (e) {
    var _this = this,
        // Drag
    upFn = null,
        target = e.target,
        attr = target.getAttribute("date-mode"); // 事件源date-mode属性


    _this.target = target; // 当鼠标在$DragEl中按下之后
    // 事件会传递到子元素上  target
    // 根据 target 上的 data-mode ，即它是属于哪一种处理模式
    // 处理模式，例如：拖动， 缩放， 标尺。
    // 它对应的事件函数为 dragHandler, scaleHandler, rulerHandler
    // 当事件正在执行时，它身上不应该有 transition CSS类

    _this.$.fn.removeClass(target, "transition");

    if (!onMoveStrategy[attr]) {
      return;
    }

    var ObjFn = onMoveStrategy[attr].call(_this, e);

    upFn = function (e) {
      doc.removeEventListener("mouseup", upFn);
      doc.removeEventListener("mousemove", ObjFn.start);

      if (Utils.type(ObjFn.end) === "function") {
        ObjFn.end.call(_this, e);
      }
    };

    doc.addEventListener("mousemove", ObjFn.start);
    doc.addEventListener("mouseup", upFn);
  }; // 更新button按钮


  DragClass.prototype.uqdateBtn = function () {
    var Drag = this;
    var btn = Drag.params.button;
    Drag.$.fn.addClass(btn, "binZindex");
    btn.addEventListener("click", function () {
      // 点击会开启幕布 barrier
      if (!Drag.is) {
        Drag.is = true;
        emit("openCurtain");
        emit("downing");
      } else {
        Drag.is = false;
        emit("closeCurtain");
        rulerLayout.clear();
        emit("downed");
      }
    });
  }; // 更新神奇的盒子


  DragClass.prototype.updateMagic = function () {
    var Drag = this;
    var params = Drag.params;
    var curtain = params.curtain;
    var len = params.magic.length;
    var i = 0;
    var scaleIcon;
    var top, left;
    var height, width;
    var currentMagic;

    for (; i < len; i++) {
      currentMagic = params.magic[i].el;
      Drag.$.fn.addClass(currentMagic, 'drag-child');

      if (currentMagic.getAttribute('date-collision')) {
        // 初始 magic
        var key = constant.random();

        while (magicLayout[key]) {
          key = constant.random();
        }

        currentMagic.setAttribute("date-key", key);
        top = currentMagic.offsetTop;
        left = currentMagic.offsetLeft;
        height = currentMagic.offsetHeight;
        width = currentMagic.offsetWidth; // 记录每个会发生碰撞的 magic 东，南，西，北

        magicLayout[key] = {};
        magicLayout[key].el = currentMagic;
        magicLayout[key].moving = false;
        magicLayout[key].E = Drag.winWidth - (left + width);
        magicLayout[key].S = Drag.winHeight - (top + height);
        magicLayout[key].W = left;
        magicLayout[key].N = top;
      }

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
      // 打开幕布，即按钮被点击
      Event.listener("openCurtain", function () {
        var _Drag = this;

        var params = _Drag.params;
        var magicLen = params.magic.length;
        var scaleIconLen = params.scaleIcon.length;
        var magic = params.magic;
        var scaleIcon = params.scaleIcon;

        if (curtain) {
          _Drag.$.fn.addClass(curtain, "openCurtain");
        }

        for (let i = 0; i < magicLen; i++) {
          _Drag.$.fn.addClass(magic[i].el, "drag-child-dashed");
        }

        for (let i = 0; i < scaleIconLen; i++) {
          scaleIcon[i].style.display = "block";
        }
      }.bind(Drag)); // 关闭幕布，再次点击按钮

      Event.listener("closeCurtain", function () {
        var _Drag = this;

        var params = _Drag.params;
        var magicLen = params.magic.length;
        var scaleIconLen = params.scaleIcon.length;
        var magic = params.magic;
        var scaleIcon = params.scaleIcon;

        if (curtain) {
          _Drag.$.fn.removeClass(curtain, "openCurtain");
        }

        for (let i = 0; i < magicLen; i++) {
          _Drag.$.fn.removeClass(magic[i].el, "drag-child-dashed");
        }

        for (let i = 0; i < scaleIconLen; i++) {
          scaleIcon[i].style.display = "none";
        }
      }.bind(Drag));
      Event.listener("downing", function () {
        Drag.$DragEl.addEventListener("mousedown", EventFn);
      }.bind(Drag));
      Event.listener("downed", function () {
        Drag.$DragEl.removeEventListener("mousedown", EventFn);
      });
    } else {
      Drag.$DragEl.addEventListener("mousedown", EventFn);
    }
  }; // 更新标尺


  DragClass.prototype.updateRuler = function () {
    var DragClass = this;
    var top, left;

    if (DragClass.params.ruler.top) {
      top = DragClass.params.ruler.top;
    }

    if (DragClass.params.ruler.left) {
      left = DragClass.params.ruler.left;
    }

    if (top) {
      top.setAttribute("date-ruler", "origin");
      top.setAttribute("date-direction", "top");
      Utils.extend(rulerLayout.ruler["originTop"], {
        parentEl: top.parentNode,
        el: top,
        mark: "top",
        positionY: parseInt(win.getComputedStyle(top)["top"]),
        positionX: parseInt(win.getComputedStyle(top)["left"])
      });

      if (DragClass.params.button) {
        top.style.display = "none";
        Event.listener("downing", function () {
          top.style.display = "block";
        });
        Event.listener("downed", function () {
          top.style.display = "none";
        });
      }
    }

    if (left) {
      left.setAttribute("date-ruler", "origin");
      left.setAttribute("date-direction", "left");
      Utils.extend(rulerLayout.ruler["originLeft"], {
        parentEl: left.parentNode,
        el: left,
        mark: "left",
        positionY: parseInt(win.getComputedStyle(left)["top"]),
        positionX: parseInt(win.getComputedStyle(left)["left"])
      });

      if (DragClass.params.button) {
        left.style.display = "none";
        Event.listener("downing", function () {
          left.style.display = "block";
        });
        Event.listener("downed", function () {
          left.style.display = "none";
        });
      }
    }
  }; // 自动贴附


  DragClass.prototype.updateAttach = function () {
    var DragClass = this;
    var currentMagic = arguments[0],
        type = arguments[1],
        topPosition = arguments[2].topSubVal && arguments[2].topSubVal,
        leftPosition = arguments[2].leftSubVal && arguments[2].leftSubVal;
    DragClass.transitionStart(currentMagic, "transition");
    DragClass.transitionEnd(currentMagic, "transition"); // 将策略安装在内部，方便管理

    var fn = {
      triggerTop: function () {
        currentMagic.style.top = topPosition + 2 + "px";
      },
      triggerLeft: function () {
        currentMagic.style.left = leftPosition + 2 + "px";
      },
      together: function () {
        currentMagic.style.top = topPosition + 2 + "px";
        currentMagic.style.left = leftPosition + 2 + "px";
      }
    };

    if (Utils.type(fn[type]) === "function") {
      fn[type]();
    }
  }; // 添加transition过渡


  DragClass.prototype.transitionStart = function (object, className) {
    this.$.fn.addClass(object, className);
  }; // 删除transition过渡


  DragClass.prototype.transitionEnd = function (object, className) {
    var DragClass = this;
    object.addEventListener("transitionend", function () {
      DragClass.$.fn.removeClass(object, className);
    });
  }; // Drag类


  var Drag = function () {
    function Drag() {
      var $el = arguments[0],
          userParam = arguments[1];
      var Drag = this;
      Drag.$ = $;
      Drag.$DragEl = $el;
      Drag.target = null;
      Drag.winHeight = win.innerHeight;
      Drag.winWidth = win.innerWidth;
      Drag.uqdateDragParams(Drag.$DragEl, "$DragEl"); // 默认参数

      var defaults1 = {
        button: false,
        // 按钮
        magic: [],
        // 只有拥有魔法的盒子才可以进行拖拽
        mode: "free",
        // 是否开启网格
        ruler: false,
        // 是否开启标尺（仿ps）
        curtain: false,
        // 幕布 
        scaleIcon: [],
        // 缩放magic盒子的
        restrict: false // 将盒子的活动范围限制在 $DragEl 里

      }; // 在Drag上挂载所有的参数

      Drag.params = Utils.extend({}, defaults1, userParam); // 初始化

      Drag.init();
      return Drag;
    }

    if (DragClass) Drag.__proto__ = DragClass;
    Drag.prototype = Object.create(DragClass && DragClass.prototype);
    Drag.prototype.constructor = Drag;

    Drag.prototype.init = function () {
      var self = this; // btn init

      if (self.params.button) {
        Event.listener("uqdateBtn", function () {
          self.uqdateBtn();
        }.bind(self));
        self.params.button && self.uqdateDragParams(self.params.button, "button");
        self.params.curtain && self.uqdateDragParams(self.params.curtain, "curtain");
      } // magic init 


      if (self.params.magic) {
        self.uqdateDragParams(self.params.magic, "magic");
        self.updateMagic();
      } // ruler init


      if (self.params.ruler) {
        self.uqdateDragParams(self.params.ruler, "ruler");
        self.updateRuler();
      }
    };

    Drag.prototype.uqdateDragParams = function () {
      var params = arguments[0];
      var proxyName = arguments[1];
      this.uqdateDragParamsProxy[proxyName].call(this, params);
    };

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
        emit("uqdateBtn");
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

          if (_this.params.magic[i].collision) {
            _this.params.magic[i].el.setAttribute("date-collision", "collision");
          }
        }
      },
      curtain: function () {
        var params = arguments[0],
            _this = this;

        _this.params.curtain = _this.$(params)[0];

        _this.params.curtain.setAttribute("date-mode", "curtain");
      },
      ruler: function () {
        var params = arguments[0],
            _this = this;

        if (_this.params.ruler.top) {
          _this.params.ruler.top = _this.$(params.top)[0];

          _this.params.ruler.top.setAttribute("date-mode", "rulerMode");
        }

        if (_this.params.ruler.left) {
          _this.params.ruler.left = _this.$(params.left)[0];

          _this.params.ruler.left.setAttribute("date-mode", "rulerMode");
        }
      }
    };
    return Drag;
  }();

  return win.Drag = Drag;
});