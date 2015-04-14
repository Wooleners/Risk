/****************************************************************
 * 		 Album Components
 * 		 @by   Wooleners
 *       @time 2014-02-13 18:07:55
 *
 *****************************************************************/

	var Album = Album || {};
	//注册模块
	Album.register = function(str) {
		var arr = str.split("."),
			o = Album,
			i;
		for (i = (arr[0] == "Album") ? 1 : 0; i < arr.length; i++) {
			o[arr[i]] = o[arr[i]] || {};
			o = o[arr[i]];
		}
	}
	/**
	 *	工具类（可扩展）
	 *	常用工具方法，CSS3特性嗅探
	 *	@time 2014-2-13
	 */
	Album.register("Util");
	Album.Util.array = (function() {
		//依赖
		var ulang = Album.Util.lang,
			//私有属性
			toString = Object.prototype.toString,
			arrayStr = "[Object Array]";
		//可选的一次性初始化过程
		//...

		//公有 API
		return {

			inArray: function(neddle, haystack) {
				if (haystack[i] === neddle) {
					return true;
				}
			},

			isArray: function(ele) {
				return toString.call(ele) === arrayStr;
			}
			//... 更多的方法和属性
		};
	})();
	/**
	 *	Ajax 模块
	 *	@author hwang
	 *	@time   2014-2-13
	 *  @tips   wait to overwrite
	 */

	Album.Util.ajax = (function() {
		var getData = function(url, callback) {
			J.get({
				url: url,
				async: true,
				cache: false,
				timeout: 150000,
				onSuccess: function(data) {
					callback(data);
				}
			});
		};
		return {
			execute: getData
		};
	}());

	/**
	 * 模拟跳转
	 * 解决iscroll下跳转问题
	 * @author hwang
	 */
	Album.Util.fireJump = function(href, target) {
		if (!href) {
			return;
		}
		var ele = J.create("a", {
			"href": href,
			"target": target || "_blank",
			"style": "display:none"
		}).appendTo(J.g(document.body));
		ele.get(0).click(), ele.remove();
	};
	/**
	 * 替换图片域名
	 *
	 */
	Album.Util.changeImageDomain = function(imgsrc, imgkey) {
		if (imgsrc.indexOf(imgkey) > 0) {
			return imgsrc.replace("http://", "http://" + Album.Util.getImageDomain(imgsrc) + ".");
		} else {
			return imgsrc;
		}
	}

	Album.Util.getImageDomain = function(url) {
		var a = url.split("/");
		var b = c = d = "";
		for (b in a) {
			if (a[b].length == 32 || a[b].length == 34) { //取imageid
				c = String.fromCharCode(parseInt(a[b][0], 16) % 4 + 97); //
			}
		}
		return c;
	}

	Album.Util.lang = (function() {
		var Constr;
		//公有 API --构造函数
		Constr = function(o) {
			this.elements = this.toArray(o);
		}
		//公有 API --原型
		Constr.prototype = {
			constructor: Album.Util.lang,
			version: "2.0",
			toArray: function(obj) {
				return obj;
			}
		}
	})();

	//Use Constr Func
	//var arr = new Album.Util.lang(obj);

	//import window into module

	Album.register("Comm");
	/**
	 * 滑动类
	 * @param  {[type]} app    [应用程序]
	 * @param  {[type]} global [全局对象]
	 * @return {[type]}        [实例对象]
	 * @time   2014-2-21
	 */

	Album.Comm.swipe = (function(app, global) {
		//引用全局对象
		//引用应用程序

	}(Album, this));


	/**
	 * 推荐组件
	 * @version 0.1
	 * @author  hwang
	 * @time    2014-3-3
	 */

	Album.Comm.recommends = (function() {
		var args, count = 0,
			showNum = 3;
		var init = function() {
			args = [].slice.call(arguments),
			url = args.pop();
			getData(url, args);
		};
		var getData = function(url) {
			Album.Util.ajax.execute(url, resolveArgs);
		}
		var buildModul = function(comm_id, comm_data, comm_from, comm_showNum) {
			var posNum = comm_data.length;
			showNum = comm_showNum || showNum; !! comm_data && J.g(comm_id + "_con").html(buildComp(comm_data, comm_from)); !! posNum && J.g(comm_id + "_posPic").html(buildPos(posNum / showNum)); !! J.g(comm_id + "_rolling") && initSwipe(comm_id);
		}
		var buildComp = function(comm_data, comm_from) {
			var compHtml = [],
				data = comm_data,
				from = comm_from,
				count = 1,
				result;
			data.forEach(function(item, index) {
				compHtml.push(buildHtml(item, from, index, count));
				count == showNum ? count = 1 : count++;
			});
			return result = compHtml.join(""), result;
		}
		var buildHtml = function(content, from, index, count) {
			//changeImageDomain记得处理掉
			var warp = [];
			count == 1 && warp.push('<div class="liWarp">');
			warp.push('<li>');
			warp.push('<a href="' + content.LINK + '?from=' + from + '&position=' + (index + 1) + content.SOJ + '">');
			warp.push('<img src="' + Album.Util.changeImageDomain(content.IMAGESRC, ".ajkimg.") + '" width="150" height="115" alt="' + content.TITLE + '"/>');
			warp.push('</a>');
			warp.push('<a href="' + content.LINK + '?from=' + from + '&position=' + (index + 1) + content.SOJ + '">' + content.TITLE + '...</a>');
			warp.push('<div class="v_c_desc">' + content.ROOMNUM + '室' + content.HALLNUM + '厅' + '</div>');
			warp.push('<div class="v_c_desc">' + parseInt(content.AREANUM) + '平米' + '</div>');
			warp.push('<div class="v_c_p"><em>' + parseInt(content.PROPRICE) + '</em>万</div>');
			warp.push('</li>');
			count == showNum && warp.push("</div>");
			return warp.join("");
		}
		var buildPos = function(num) {
			var posHtml = [],
				i;
			for (i = 0; i < num; i++) {
				i == 0 ? posHtml.push('<em class="on">•</em>') : posHtml.push('<em>•</em>');
			}
			return posHtml.join("");
		}
		var initSwipe = function(comm_id) {
			var ele = J.g(comm_id + "_rolling").get();
			var sider = P.Swipe(ele, {
				continuous: false,
				disableScroll: true,
				callback: function(index) {
					cotrolBullets(index, comm_id);
					cotrolArrow(index, comm_id);
				}
			});
			bindArrow(comm_id, sider);
		}
		var cotrolBullets = function(index, comm_id) {
			var bullets = J.g(comm_id + "_posPic");
			bullets.s("em").each(function(index, ele) {
				ele.removeClass("on");
			});
			bullets.s("em").eq(index).addClass("on");
			P.trackEvent(J.g(comm_id + "_rolling").attr('data-event') + "PageTurn" + index);
		}
		var cotrolArrow = function(index, comm_id) {
			var len = J.g(comm_id + "_con").s(".liWarp").length;
			switch (index) {
				case 0:
					J.g(comm_id + "_arrowL").hide()
					break;
				case len - 1:
					J.g(comm_id + "_arrowR").hide();
					J.g(comm_id + "_arrowL").show()
					break;
				default:
					J.g(comm_id + "_arrowL").show();
					J.g(comm_id + "_arrowR").show();
			}
		}
		var bindArrow = function(comm_id, sider) {
			J.g(comm_id + "_arrowL").on("click", function() {
				sider.prev();
				P.trackEvent(J.g(comm_id + "_rolling").attr('data-event') + "L");
			});
			J.g(comm_id + "_arrowR").on("click", function() {
				sider.next();
				P.trackEvent(J.g(comm_id + "_rolling").attr('data-event') + "R");
			});
			J.g(comm_id + "_arrowR").show();
		}
		var checkArgs = function() {
			var args = [].slice.call(arguments),
				flag = true;
			args.forEach(function(comm) {
				!J.g(comm[0]) && (flag = false);
			});
			return flag;
		}
		var resolveArgs = function(data) {
			if (!data) {
				args.forEach(function(comm) {
					hideComm(comm[0]);
				});
				return;
			}
			if (typeof data === "string") {
				data = eval("(" + data + ")");
			}
			if (data.status == "ok") { !! args[0] && args.forEach(function(comm) {
					buildModul(comm[0], data[comm[1]], comm[2]);
				});
			} else {
				args.forEach(function(comm) {
					hideComm(comm[0]);
				});
				return;
			}
		};
		var hideComm = function(comm_id) {
			J.g(comm_id).hide();
		}
		return {
			init: init
		}
	}());

	/**
	 * 查看大图
	 * @version 2.0
	 * @author  hwang
	 * @time    2014-3-9
	 */

	Album.Comm.viewBigPic = (function() {
		var defaultOpts = {
			target: J.D.body,
			continuous: false,
			autoplay: false,
			catogry: false,
			thum: false,
			arrow: true,
			pageNum: true,
			closebtn: true
		};
		var initComp = function() {
			var args = [].slice.call(arguments),
				config = args.pop(),
				els = (args[0] && typeof args[0] === "string") ? args : args[0],
				opts = J.mix(defaultOpts, config),
				ck = els.every(function(el) {
					return !!J.g(el);
				});
			if (!ck || !opts.data) {
				return;
			}
			initMask(opts);
		}
		var initMask = function(opts) {
			var maskEl = J.create("div", {
				"class": "p_mask"
			});
			var maskHtml = '<div class="p_mode">' +
				'<div class="p_mode_rolling" id="p_mode_rolling">' +
				'<div class="p_mode_picBox ht525">' +
				buildPicBox(opts.data) +
				'</div>' +
				'</div>' +
				(opts.closebtn ? '<div class="p_mode_close">╳</div>' : "") +
				(opts.arrow ? '<div class="p_mode_left"></div><div class="p_mode_right"></div>' : "") +
				(opts.pageNum ? '<div class="p_mode_control"><span class="p_mode_pCur"></span><span class="p_mode_slash">/</span><span class="p_mode_pNum"></span></div>' : "") +
				'</div>';
			maskEl.html(maskHtml).appendTo(J.g(opts.target));
		}
		var buildPicBox = function(imgs) {
			var picBoxHtml = "";
			imgs.forEach(function(imgSrc) {
				picBoxHtml += buildPic(imgSrc);
			});
			return picBoxHtml;
		}
		var buildPic = function(imgSrc) {
			return '<div class="p_mode_picShow ht525">' + '<span>' + '<img src="' + imgSrc + '" />' + '<span>' + '</div>';
		}
		return {
			init: initComp
		}
	}());