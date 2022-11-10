! function (t, e)
{
	"function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e()
}("undefined" != typeof window ? window : this, function ()
{
	function t()
	{}
	var e = t.prototype;
	return e.on = function (t, e)
	{
		if (t && e)
		{
			var i = this._events = this._events ||
				{},
				n = i[t] = i[t] || [];
			return -1 == n.indexOf(e) && n.push(e), this
		}
	}, e.once = function (t, e)
	{
		if (t && e)
		{
			this.on(t, e);
			var i = this._onceEvents = this._onceEvents ||
				{},
				n = i[t] = i[t] ||
				{};
			return n[e] = !0, this
		}
	}, e.off = function (t, e)
	{
		var i = this._events && this._events[t];
		if (i && i.length)
		{
			var n = i.indexOf(e);
			return -1 != n && i.splice(n, 1), this
		}
	}, e.emitEvent = function (t, e)
	{
		var i = this._events && this._events[t];
		if (i && i.length)
		{
			var n = 0,
				o = i[n];
			e = e || [];
			for (var r = this._onceEvents && this._onceEvents[t]; o;)
			{
				var s = r && r[o];
				s && (this.off(t, o), delete r[o]), o.apply(this, e), n += s ? 0 : 1, o = i[n]
			}
			return this
		}
	}, t
}),
function (t, e)
{
	"use strict";
	"function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (i)
	{
		return e(t, i)
	}) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter")) : t.imagesLoaded = e(t, t.EvEmitter)
}(window, function (t, e)
{
	function i(t, e)
	{
		for (var i in e) t[i] = e[i];
		return t
	}

	function n(t)
	{
		var e = [];
		if (Array.isArray(t)) e = t;
		else if ("number" == typeof t.length)
			for (var i = 0; i < t.length; i++) e.push(t[i]);
		else e.push(t);
		return e
	}

	function o(t, e, r)
	{
		return this instanceof o ? ("string" == typeof t && (t = document.querySelectorAll(t)), this.elements = n(t), this.options = i(
		{}, this.options), "function" == typeof e ? r = e : i(this.options, e), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(function ()
		{
			this.check()
		}.bind(this))) : new o(t, e, r)
	}

	function r(t)
	{
		this.img = t
	}

	function s(t, e)
	{
		this.url = t, this.element = e, this.img = new Image
	}
	var h = t.jQuery,
		a = t.console;
	o.prototype = Object.create(e.prototype), o.prototype.options = {}, o.prototype.getImages = function ()
	{
		this.images = [], this.elements.forEach(this.addElementImages, this)
	}, o.prototype.addElementImages = function (t)
	{
		"IMG" == t.nodeName && this.addImage(t), this.options.background === !0 && this.addElementBackgroundImages(t);
		var e = t.nodeType;
		if (e && d[e])
		{
			for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++)
			{
				var o = i[n];
				this.addImage(o)
			}
			if ("string" == typeof this.options.background)
			{
				var r = t.querySelectorAll(this.options.background);
				for (n = 0; n < r.length; n++)
				{
					var s = r[n];
					this.addElementBackgroundImages(s)
				}
			}
		}
	};
	var d = {
		1: !0,
		9: !0,
		11: !0
	};
	return o.prototype.addElementBackgroundImages = function (t)
	{
		var e = getComputedStyle(t);
		if (e)
			for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n;)
			{
				var o = n && n[2];
				o && this.addBackground(o, t), n = i.exec(e.backgroundImage)
			}
	}, o.prototype.addImage = function (t)
	{
		var e = new r(t);
		this.images.push(e)
	}, o.prototype.addBackground = function (t, e)
	{
		var i = new s(t, e);
		this.images.push(i)
	}, o.prototype.check = function ()
	{
		function t(t, i, n)
		{
			setTimeout(function ()
			{
				e.progress(t, i, n)
			})
		}
		var e = this;
		return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (e)
		{
			e.once("progress", t), e.check()
		}) : void this.complete()
	}, o.prototype.progress = function (t, e, i)
	{
		this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded, this.emitEvent("progress", [this, t, e]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, t, e)
	}, o.prototype.complete = function ()
	{
		var t = this.hasAnyBroken ? "fail" : "done";
		if (this.isComplete = !0, this.emitEvent(t, [this]), this.emitEvent("always", [this]), this.jqDeferred)
		{
			var e = this.hasAnyBroken ? "reject" : "resolve";
			this.jqDeferred[e](this)
		}
	}, r.prototype = Object.create(e.prototype), r.prototype.check = function ()
	{
		var t = this.getIsImageComplete();
		return t ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
	}, r.prototype.getIsImageComplete = function ()
	{
		return this.img.complete && void 0 !== this.img.naturalWidth
	}, r.prototype.confirm = function (t, e)
	{
		this.isLoaded = t, this.emitEvent("progress", [this, this.img, e])
	}, r.prototype.handleEvent = function (t)
	{
		var e = "on" + t.type;
		this[e] && this[e](t)
	}, r.prototype.onload = function ()
	{
		this.confirm(!0, "onload"), this.unbindEvents()
	}, r.prototype.onerror = function ()
	{
		this.confirm(!1, "onerror"), this.unbindEvents()
	}, r.prototype.unbindEvents = function ()
	{
		this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
	}, s.prototype = Object.create(r.prototype), s.prototype.check = function ()
	{
		this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
		var t = this.getIsImageComplete();
		t && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
	}, s.prototype.unbindEvents = function ()
	{
		this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
	}, s.prototype.confirm = function (t, e)
	{
		this.isLoaded = t, this.emitEvent("progress", [this, this.element, e])
	}, o.makeJQueryPlugin = function (e)
	{
		e = e || t.jQuery, e && (h = e, h.fn.imagesLoaded = function (t, e)
		{
			var i = new o(this, t, e);
			return i.jqDeferred.promise(h(this))
		})
	}, o.makeJQueryPlugin(), o
});


//--------------------------------------------------------------------------

$(window).bind('load', function ()
{
	const raf = function (entry)
	{
		window.requestAnimationFrame(entry);
	};
	const random = function (min, max)
	{
		max = max + 1;
		return Math.floor(Math.random() * (max - min) + min);
	}
	var app = {
		init: function ()
		{
			this.cacheDOM();
			this.style();
		},
		cacheDOM: function ()
		{
			this.container = $('#container');
			this.images = $('img');

			this.mouseX = null;
			this.mouseY = null;
		},
		style: function ()
		{
			this.images.imagesLoaded(function ()
			{
				$(window).resize(function initial()
				{
					TweenMax.set(app.container,
					{
						opacity: 1
					});
					return initial;
				}());
			});
		},
		cursorEvents: function (e)
		{
			app.mouseX = e.clientX;
			app.mouseY = e.clientY;
		}
	}

	app.init();

	var cContainer = $('#c-container'),
		c = document.getElementById('c'),
		c2Container = $('#c2-container'),
		c2 = document.getElementById('c2'),
		cx = c.getContext('2d'),
		c2x = c2.getContext('2d'),
		particleIndex = 0,
		particles = {},
		particleNum = 1,
		particlesLoaded = false,
		Particle,
		Particle2,
		canvas,
		canvas2;

	c.width = $('#c').outerWidth();
	c.height = $('#c').outerHeight();

	c2.width = $('#c2').outerWidth();
	c2.height = $('#c2').outerHeight();

	//INITIAL CANVAS DRAW
	cx.fillStyle = 'rgba(0,0,0,1)';
	cx.fillRect(0, 0, c.width, c.height);
	c2x.fillStyle = 'rgba(0,0,0,1)';
	c2x.fillRect(0, 0, c2.width, c2.height);

	function particleFactory(thisCanvas, thisContext, thisParticleName, thisCanvasFunction)
	{

		var particleIndex = 0,
			particles = {},
			particleNum = 3,
			particlesLoaded = false;

		thisParticleName = function ()
		{
			this.r = 6;
			this.rStart = this.r;
			this.rIncrement = this.r * -0.01;
			this.x = thisCanvas.width / 2;
			this.y = thisCanvas.height / 2;

			this.vxIsNegative = random(1, 2);

			this.originTriggered = false;
			this.vx = this.vxIsNegative === 1 ? random(0, 50) * -0.1 : random(0, 50) * 0.1;
			this.vxMult = random(10, 20) * 0.1;
			this.vy = random(-10, 10);
			this.vyMult = random(2, 6) * -0.1;
			this.opacityLimit = 1;
			this.opacity = 1;
			this.opacityIncrement = 0.05;
			this.opacityReversing = false;
			this.gravity = 1;
			this.framerate = 0;
			this.framerateCounter = this.framerate;
			this.counter = 0;
			particleIndex++;
			particles[particleIndex] = this;
			this.id = particleIndex;
			this.life = 0;
			this.maxLife = random(0, 100);
			this.hue = random(30, 60);
			this.light = random(50, 100);
			this.color = `hsla(${this.hue},100%,${this.light}%,${this.opacity})`;

			this.bounced = false;

			this.duration = 60;
			this.durationTotal = this.duration + this.opacityLimit * 10;
			this.durationCounter = 0;
		}

		thisParticleName.prototype.draw = function ()
		{

			if ((!this.originTriggered) && (app.mouseX != null))
			{
				this.originTriggered = true;
				this.x = app.mouseX;
				this.y = app.mouseY;
			}
			this.color = `hsla(${this.hue},100%,${this.light}%,${this.opacity})`;
			thisContext.fillStyle = this.color;
			thisContext.beginPath();
			thisContext.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
			thisContext.fill();

			//START DRAW OPERATION
			this.r += this.rIncrement;
			this.x += this.vx;
			this.y += this.vy;
			this.durationCounter++;
			if (this.vx === 0)
			{
				this.vx++;
			}
			if (this.vxIsNegative === 1)
			{
				this.vx
			}
			if (this.vy === 0)
			{
				this.vy++;
			}
			if (this.y > thisCanvas.height - this.rStart)
			{
				if (!this.bounced)
				{
					this.vx *= this.vxMult;
				}
				else
				{
					this.vx *= 0.9;
				}
				this.bounced = true;
				this.vy *= this.vyMult;
				this.y = thisCanvas.height - this.rStart;
			}
			this.vy += this.gravity;
			if ((this.r <= 0))
			{
				delete particles[this.id];
			}
			this.life++;
			//END DRAW OPERATION
		}

		thisCanvasFunction = function ()
		{
			thisContext.globalCompositeOperation = 'source-over';
			thisContext.fillStyle = 'rgba(0,0,0,1)';
			thisContext.fillRect(0, 0, thisCanvas.width, thisCanvas.height);
			if (!particlesLoaded)
			{
				for (var i = 0; i < particleNum; i++)
				{
					new thisParticleName();
				}
			}
			thisContext.globalCompositeOperation = 'lighter';
			for (var i in particles)
			{
				particles[i].draw();
			}
		}
		setInterval(thisCanvasFunction, 15);
	}

	$(window).resize(function initial()
	{
		window.addEventListener('mousemove', app.cursorEvents, false);

		c.width = $('#c').outerWidth();
		c.height = $('#c').outerHeight();

		c2.width = $('#c2').outerWidth();
		c2.height = $('#c2').outerHeight();

		return initial;
	}());

	particleFactory(c, cx, Particle, canvas);
	particleFactory(c2, c2x, Particle2, canvas2);

	TweenMax.set(c2Container,
	{
		scaleY: -1,
		opacity: 1
	});

	TweenMax.set(c2,
	{
		filter: 'blur(7px)'
	});
});