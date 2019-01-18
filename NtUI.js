/*
 * NtUI.js
 * NtUI Framework Core
 *
 * Developed by Nataniel López @ 9/15/17
 * Copyright © 2017 Nataniel López & Nt-Systems
 */

 const ntui = function (layout, theme, path) {

	//info
	ntui.version = "1.0";
	ntui.build = "0011";
	ntui.info = "NtUI Framework v" + ntui.version + " build " + ntui.build + " | Copyright © 2017 Nataniel López & Nt-Systems. All rights reserved.";

	//paths
	ntui.paths = {};

	//paths.root
	for (let i = document.getElementsByTagName('script').length - 1; i >= 0; i--) {
		if (document.getElementsByTagName('script')[i].getAttribute('src')) {
			if (document.getElementsByTagName('script')[i].getAttribute('src').substr(-7).toUpperCase() === 'NTUI.JS') {
				ntui.paths.root = document.getElementsByTagName('script')[i].getAttribute('src');
				ntui.paths.root = ntui.paths.root.substr(0, ntui.paths.root.length - 7);
				if (ntui.paths.root !== '' && ntui.paths.root.substr(-1) !== '/') {
					ntui.paths.root += '/';
				}
				i = 0;
			}
		}
	}
	if (ntui.paths.root === undefined) {
		console.error('[NtUI] {paths} Failed to fetch root path. Please respect framework filename.');
	}

	//createElement
	ntui.createElement = function (tag, attrs, html) {
		if (tag) {
			let element = document.createElement(tag);
			if (attrs) {
				let properties = Object.keys(attrs);
				if (properties.length > 0) {
					for (let i = properties.length - 1; i >= 0; i--) {
						if (properties[i]) {
							element.setAttribute(properties[i], eval('attrs.' + properties[i]));
						}
					}
					i = undefined;
				}
			}
			if (html) {
				if (typeof html === 'object') {
					if (html.outerHTML !== undefined) {
						element.innerHTML = html.outerHTML;
					} else {
						element.innerHTML = html;
					}
				} else {
					element.innerHTML = html;
				}
			}
			return element;
		}
	};

	//render
	ntui.render = function (object, target) {
		if (object && target) {
			if (object.innerHTML) {
				let i = 0;
				let objects = [];
				while (object.innerHTML.indexOf('${', i) !== -1) {
					let parse = object.innerHTML.substr((object.innerHTML.indexOf('${', i) + 2), (object.innerHTML.indexOf('}', i) - object.innerHTML.indexOf('${', i) - 2));
					if (parse !== '') {
						if (parse.indexOf('.') !== -1) {
							objects[objects.length] = parse.split('.').join('__');
						} else {
							objects[objects.length] = parse;
						}
					}
					i = (object.innerHTML.indexOf('}', i) + 1);
				}
				i = undefined;
				if (objects[0]) {
					if (ntui.render.objects) {
						ntui.render.objects = JSON.parse(ntui.render.objects);
					} else {
						ntui.render.objects = {};
					}
					for (i = objects.length - 1; i >= 0; i--) {
						if (objects[i].indexOf('__') !== -1) {
							if (eval(objects[i].split('__').join('.')) !== undefined) {
								if (objects[i].indexOf('+') === -1 && objects[i].indexOf('-') === -1 && objects[i].indexOf('*') === -1 && objects[i].indexOf('/') === -1 && objects[i].indexOf('=') === -1 && objects[i].indexOf('!') === -1 && objects[i].indexOf('>') === -1 && objects[i].indexOf('<') === -1) {
									if (eval('ntui.render.objects.' + objects[i]) === undefined) {
										eval('ntui.render.objects.' + objects[i] + '=' + Object.keys(ntui.render.objects).length);
									}
									objects[i] = objects[i].split('__').join('.');
									if (typeof eval(objects[i]) === 'function') {
										if (typeof eval(objects[i] + '()') === 'object') {
											object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i].split('.').join('__')) + '" >' + eval(objects[i] + '()').outerHTML + '</ntui-render>');
										} else {
											object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i].split('.').join('__')) + '" >' + eval(objects[i] + '()') + '</ntui-render>');
										}
									} else {
										if (typeof eval(objects[i]) === 'object') {
											object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i].split('.').join('__')) + '" >' + eval(objects[i]).outerHTML + '</ntui-render>');
										} else {
											object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i].split('.').join('__')) + '" >' + eval(objects[i]) + '</ntui-render>');
										}
									}
								} else {
									if (eval(objects[i].split('__').join('.')) !== undefined) {
										object.innerHTML = object.innerHTML.split('${' + objects[i].split('__').join('.') + '}').join(eval(objects[i].split('__').join('.')));
									}
								}
							} else {
								if (eval('ntui.render.objects.' + objects[i]) === undefined) {
									eval('ntui.render.objects.' + objects[i] + '=' + Object.keys(ntui.render.objects).length);
								}
								objects[i] = objects[i].split('__').join('.');
								object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i].split('.').join('__')) + '" ></ntui-render>');
							}
						} else {
							if (window[objects[i]] !== undefined) {
								if (eval('ntui.render.objects.' + objects[i]) === undefined) {
									eval('ntui.render.objects.' + objects[i] + '=' + Object.keys(ntui.render.objects).length);
								}
								if (typeof window[objects[i]] === 'function') {
									if (typeof window[objects[i]]() === 'object') {
										object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i]) + '" >' + window[objects[i]]().outerHTML + '</ntui-render>');
									} else {
										object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i]) + '" >' + window[objects[i]]() + '</ntui-render>');
									}
								} else {
									if (typeof window[objects[i]] === 'object') {
										object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i]) + '" >' + window[objects[i]].outerHTML + '</ntui-render>');
									} else {
										object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i]) + '" >' + window[objects[i]] + '</ntui-render>');
									}
								}
							} else {
								if (eval(objects[i]) !== undefined) {
									object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join(eval(objects[i]));
								} else {
									if (eval('ntui.render.objects.' + objects[i]) === undefined) {
										eval('ntui.render.objects.' + objects[i] + '=' + Object.keys(ntui.render.objects).length);
									}
									object.innerHTML = object.innerHTML.split('${' + objects[i] + '}').join('<ntui-render object="' + eval('ntui.render.objects.' + objects[i]) + '" ></ntui-render>');
								}
							}
						}
					}
					i = undefined;
					ntui.render.objects = JSON.stringify(ntui.render.objects);
				}
			}
			target.appendChild(object);
		} else {
			if (document.getElementsByTagName('ntui-render').length) {
				ntui.render.objects = JSON.parse(ntui.render.objects);
				for (let i = document.getElementsByTagName('ntui-render').length - 1; i >= 0; i--) {
					for (let n = Object.keys(ntui.render.objects).length - 1; n >= 0; n--) {
						if (eval('ntui.render.objects.' + Object.keys(ntui.render.objects)[n] + '==' + document.getElementsByTagName('ntui-render')[i].getAttribute('object'))) {
							if (Object.keys(ntui.render.objects)[n].indexOf('__') !== -1) {
								if (!document.getElementsByTagName('ntui-render')[i].getElementsByTagName('ntui-render').length) {
									if (typeof eval(Object.keys(ntui.render.objects)[n].split('__').join('.')) === 'function') {
										if (typeof eval(Object.keys(ntui.render.objects)[n].split('__').join('.') + '()') === 'object') {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != eval(Object.keys(ntui.render.objects)[n].split('__').join('.') + '()').outerHTML) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = eval(Object.keys(ntui.render.objects)[n].split('__').join('.') + '()').outerHTML;
											}
										} else {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != eval(Object.keys(ntui.render.objects)[n].split('__').join('.') + '()')) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = eval(Object.keys(ntui.render.objects)[n].split('__').join('.') + '()');
											}
										}
									} else {
										if (typeof eval(Object.keys(ntui.render.objects)[n].split('__').join('.')) === 'object') {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != eval(Object.keys(ntui.render.objects)[n].split('__').join('.')).outerHTML) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = eval(Object.keys(ntui.render.objects)[n].split('__').join('.')).outerHTML;
											}
										} else {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != eval(Object.keys(ntui.render.objects)[n].split('__').join('.'))) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = eval(Object.keys(ntui.render.objects)[n].split('__').join('.'));
											}
										}
									}
								}
							} else {
								if (!document.getElementsByTagName('ntui-render')[i].getElementsByTagName('ntui-render').length) {
									if (typeof window[Object.keys(ntui.render.objects)[n]] === 'function') {
										if (typeof window[Object.keys(ntui.render.objects)[n]]() === 'object') {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != window[Object.keys(ntui.render.objects)[n]]().outerHTML) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = window[Object.keys(ntui.render.objects)[n]]().outerHTML;
											}
										} else {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != window[Object.keys(ntui.render.objects)[n]]()) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = window[Object.keys(ntui.render.objects)[n]]();
											}
										}
									} else {
										if (typeof window[Object.keys(ntui.render.objects)[n]] === 'object') {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != window[Object.keys(ntui.render.objects)[n]].outerHTML) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = window[Object.keys(ntui.render.objects)[n]].outerHTML;
											}
										} else {
											if (document.getElementsByTagName('ntui-render')[i].innerHTML != window[Object.keys(ntui.render.objects)[n]]) {
												document.getElementsByTagName('ntui-render')[i].innerHTML = window[Object.keys(ntui.render.objects)[n]];
											}
										}
									}
								}
							}
						}
					}
					n = undefined;
				}
				i = undefined;
				ntui.render.objects = JSON.stringify(ntui.render.objects);
			}
		}
	};
	ntui.render.objects = undefined;

	//load
	ntui.load = function (target, html, callback) {
		if (target) {
			if (html !== undefined && html.substr(-5).toLowerCase() === '.html') {
				let HDTA = ntui.createElement(
					'iframe', {
						style: 'display:none;',
						src: html,
					}
					);
				HDTA.onload = function () {
					if (HDTA.contentDocument.body.innerHTML) {
						if (typeof target === 'object') {
							target.innerHTML = '';
							ntui.render(HDTA.contentDocument.body, target);
						} else {
							target = HDTA.contentDocument.body.innerHTML;
						}
						if (callback !== undefined && typeof callback === 'function') {
							callback();
						}
						ntui.ui.components.window.removeChild(HDTA);
					} else {
						console.error('[NtUI] {load} Invalid html "' + html + '".');
					}
				};
				ntui.ui.components.window.appendChild(HDTA);
			}
		}
	};

	//platform
	if (window.innerWidth > screen.width || screen.width <= 800) {
		ntui.platform = 'mobile';
	} else {
		ntui.platform = 'desktop';
	}

	//css
	ntui.css = function (css) {
		if (ntui.css.workspace.innerHTML.trim()) {
			ntui.css.workspace.innerHTML += css;
		} else {
			ntui.css.workspace.innerHTML = css;
		}
	};

	//workspace
	ntui.css.workspace = ntui.createElement(
		'style', {
			type: 'text/css',
			rel: 'stylesheet',
			media: 'screen',
			class: 'ntui-css'
		}
		);
	if (!document.body) {
		let async_interval_css = setInterval(function () {
			if (document.body) {
				clearInterval(async_interval_css);
				document.body.appendChild(ntui.css.workspace);
			}
		}, 0);
	} else {
		document.body.appendChild(ntui.css.workspace);
	}

	//class
	ntui.css.newClass = function (className, css) {
		if (className) {
			if (ntui.css.workspace.innerHTML.indexOf('.' + className + '{') === -1) {
				if (css === undefined) {
					css = '';
				}
				ntui.css('.' + className + '{' + css + '}');
			} else {
				console.error('[NtUI] [CSS] {newClass} CSS Class: "' + className + '" already exists."');
			}
		}
	};
	ntui.css.setClass = function (className, css) {
		if (className && css !== undefined) {
			if (ntui.css.workspace.innerHTML.indexOf('.' + className + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('.' + className + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join('.' + className + '{' + css + '}');
				patch = undefined;
			} else {
				console.error('[NtUI] [CSS] {setClass} Can\'t find CSS Class: "' + className + '".');
			}
		}
	};
	ntui.css.addToClass = function (className, css) {
		if (className && css) {
			if (ntui.css.workspace.innerHTML.indexOf('.' + className + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('.' + className + '{'),
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.substr(0, patch.length - 1) + css + '}');
				patch = undefined;
			} else {
				console.error('[NtUI] [CSS] {addToClass} Can\'t find CSS Class: "' + className + '".');
			}
		}
	};
	ntui.css.setToClass = function (className, property, css) {
		if (className && property && css !== undefined) {
			if (ntui.css.workspace.innerHTML.indexOf('.' + className + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('.' + className + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				if (patch.indexOf(property + ':') !== -1) {
					let subpatch = {
						start: patch.indexOf(property + ':')
					};
					subpatch.end = patch.indexOf(';', subpatch.start) - (subpatch.start - 1);
					subpatch = patch.substr(subpatch.start, subpatch.end);
					ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.split(subpatch).join(property + ': ' + css + ';'));
					patch = undefined;
					subpatch = undefined;
				} else {
					ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.substr(0, patch.length - 1) + property + ': ' + css + ';}');
				}
			} else {
				console.error('[NtUI] [CSS] {setToClass} Can\'t find CSS Class: "' + className + '".');
			}
		}
	};
	ntui.css.getFromClass = function (className, property) {
		if (className && property) {
			if (ntui.css.workspace.innerHTML.indexOf('.' + className + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('.' + className + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				if (patch.indexOf(property + ':') !== -1) {
					let subpatch = {
						start: patch.indexOf(property + ':')
					};
					subpatch.end = patch.indexOf(';', subpatch.start) - (subpatch.start - 1);
					subpatch = patch.substr(subpatch.start, subpatch.end);
					return subpatch.substr(0, subpatch.length - 1).split(property + ':').join('');
				} else {
					return undefined;
				}
			} else {
				console.error('[NtUI] [CSS] {getFromClass} Can\'t find CSS Class: "' + className + '".');
			}
		}
	};
	ntui.css.removeFromClass = function (className, property) {
		if (className && property) {
			if (ntui.css.workspace.innerHTML.indexOf('.' + className + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('.' + className + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				if (patch.indexOf(property + ':') !== -1) {
					let subpatch = {
						start: patch.indexOf(property + ':')
					};
					subpatch.end = patch.indexOf(';', subpatch.start) - (subpatch.start - 1);
					subpatch = patch.substr(subpatch.start, subpatch.end);
					ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.split(subpatch).join(''));
					patch = undefined;
					subpatch = undefined;
				} else {
					console.error('[NtUI] [CSS] {removeFromClass} Can\'t find property "' + property + '" in "' + className + '".');
				}
			} else {
				console.error('[NtUI] [CSS] {removeFromClass} Can\'t find CSS Class: "' + className + '".');
			}
		}
	};

	//object
	ntui.css.newObject = function (object, css) {
		if (object) {
			if (ntui.css.workspace.innerHTML.indexOf('#' + object + '{') === -1) {
				if (css === undefined) {
					css = '';
				}
				ntui.css('#' + object + '{' + css + '}');
			} else {
				console.error('[NtUI] [CSS] {newObject} CSS Object: "' + object + '" already exists."');
			}
		}
	};
	ntui.css.setObject = function (object, css) {
		if (object && css !== undefined) {
			if (ntui.css.workspace.innerHTML.indexOf('#' + object + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('#' + object + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join('#' + object + '{' + css + '}');
				patch = undefined;
			} else {
				console.error('[NtUI] [CSS] {setObject} Can\'t find CSS Object: "' + object + '".');
			}
		}
	};
	ntui.css.addToObject = function (object, css) {
		if (object && css) {
			if (ntui.css.workspace.innerHTML.indexOf('#' + object + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('#' + object + '{'),
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.substr(0, patch.length - 1) + css + '}');
				patch = undefined;
			} else {
				console.error('[NtUI] [CSS] {addToObject} Can\'t find CSS Object: "' + object + '".');
			}
		}
	};
	ntui.css.setToObject = function (object, property, css) {
		if (object && property && css !== undefined) {
			if (ntui.css.workspace.innerHTML.indexOf('#' + object + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('#' + object + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				if (patch.indexOf(property + ':') !== -1) {
					let subpatch = {
						start: patch.indexOf(property + ':')
					};
					subpatch.end = patch.indexOf(';', subpatch.start) - (subpatch.start - 1);
					subpatch = patch.substr(subpatch.start, subpatch.end);
					ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.split(subpatch).join(property + ': ' + css + ';'));
					patch = undefined;
					subpatch = undefined;
				} else {
					ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.substr(0, patch.length - 1) + property + ': ' + css + ';}');
				}
			} else {
				console.error('[NtUI] [CSS] {setToObject} Can\'t find CSS Object: "' + object + '".');
			}
		}
	};
	ntui.css.getFromObject = function (object, property) {
		if (object && property) {
			if (ntui.css.workspace.innerHTML.indexOf('#' + object + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('#' + object + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				if (patch.indexOf(property + ':') !== -1) {
					let subpatch = {
						start: patch.indexOf(property + ':')
					};
					subpatch.end = patch.indexOf(';', subpatch.start) - (subpatch.start - 1);
					subpatch = patch.substr(subpatch.start, subpatch.end);
					return subpatch.substr(0, subpatch.length - 1).split(property + ':').join('');
				} else {
					console.error('[NtUI] [CSS] {getFromObject} Can\'t find property "' + property + '" in "' + object + '".');
				}
			} else {
				console.error('[NtUI] [CSS] {getFromObject} Can\'t find CSS Object: "' + object + '".');
			}
		}
	};
	ntui.css.removeFromObject = function (object, property) {
		if (object && property) {
			if (ntui.css.workspace.innerHTML.indexOf('#' + object + '{') !== -1) {
				let patch = {
					start: ntui.css.workspace.innerHTML.indexOf('#' + object + '{')
				};
				patch.end = ntui.css.workspace.innerHTML.indexOf('}', patch.start) - (patch.start - 1);
				patch = ntui.css.workspace.innerHTML.substr(patch.start, patch.end);
				if (patch.indexOf(property + ':') !== -1) {
					let subpatch = {
						start: patch.indexOf(property + ':')
					};
					subpatch.end = patch.indexOf(';', subpatch.start) - (subpatch.start - 1);
					subpatch = patch.substr(subpatch.start, subpatch.end);
					ntui.css.workspace.innerHTML = ntui.css.workspace.innerHTML.split(patch).join(patch.split(subpatch).join(''));
					patch = undefined;
					subpatch = undefined;
				} else {
					console.error('[NtUI] [CSS] {removeFromObject} Can\'t find property "' + property + '" in "' + object + '".');
				}
			} else {
				console.error('[NtUI] [CSS] {removeFromObject} Can\'t find CSS Object: "' + object + '".');
			}
		}
	};

	//animation
	ntui.css.animation = function (element, start, end, duration) {
		if (element !== undefined && start !== undefined && end !== undefined && duration !== undefined) {
			ntui.css('@keyframes ntui-css-animation-custom' + ntui.css.animation.ids + '{from{' + start + '}to{' + end + '}}');
			element.style.animation = 'ntui-css-animation-custom' + ntui.css.animation.ids + ' ' + duration;
			ntui.css.animation.ids++;
		}
	};
	ntui.css.animationAdv = function (element, css, duration) {
		if (element !== undefined && css !== undefined && duration !== undefined) {
			ntui.css('@keyframes ntui-css-animation-custom' + ntui.css.animation.ids + '{' + css + '}');
			element.style.animation = 'ntui-css-animation-custom' + ntui.css.animation.ids + ' ' + duration;
			ntui.css.animation.ids++;
		}
	};
	ntui.css.animation.ids = 0;
	ntui.css.classes = undefined;
	ntui.css.objects = undefined;

	//ui
	ntui.ui = {};

	//components
	ntui.ui.components = {};

	//window
	ntui.ui.components.window = ntui.createElement(
		'div', {
			class: 'ntui-ui-components-window'
		}
		);
	if (!document.body) {
		let async_interval_window = setInterval(function () {
			if (document.body) {
				clearInterval(async_interval_window);
				document.body.appendChild(ntui.ui.components.window);
			}
		}, 0);
	} else {
		document.body.appendChild(ntui.ui.components.window);
	}

	//mainMenu
	ntui.ui.components.mainmenu = ntui.createElement(
		'div', {
			class: 'ntui-ui-components-mainmenu'
		}
		);

	//headerBar
	ntui.ui.components.headerbar = ntui.createElement(
		'div', {
			class: 'ntui-ui-components-headerbar'
		}
		);

	//pageContent
	ntui.ui.components.pagecontent = ntui.createElement(
		'div', {
			class: 'ntui-ui-components-pagecontent'
		}
		);

	//pageFooter
	ntui.ui.components.pagefooter = ntui.createElement(
		'div', {
			class: 'ntui-ui-components-pagefooter'
		}
		);

	//layout
	ntui.ui.layout = function (layout, callback) {
		if (layout !== undefined) {

			//parseLayout
			let parseLayout = function (object, script) {

				//script
				if (object !== true && script !== undefined) {
					let loaded = false;
					script = ntui.createElement('script', {
						src: script,
						type: 'text/javascript'
					});
					ntui.ui.components.window.appendChild(script);
					script.onload = function () {
						parseLayout(object);
						loaded = true;
					};
					setTimeout(function () {
						if (loaded === false) {
							console.error('[NtUI] {ui.layout} Failed to load layout script.');
							if (document.body) {
								if (getComputedStyle(document.body).getPropertyValue('opacity') === '0') {
									document.body.style.opacity = 1;
								}
							}
							ntui.ui.components.window.style.opacity = 1;
						}
					}, 10000);
				} else {

					//cleanUp
					ntui.ui.components.window.style.opacity = 0;
					ntui.ui.components.mainmenu.innerHTML = '';
					ntui.ui.components.headerbar.innerHTML = '';
					ntui.ui.components.pagecontent.innerHTML = '';
					ntui.ui.components.pagefooter.innerHTML = '';

					//mainMenu
					if (layout.getElementsByTagName('mainMenu').length) {
						ntui.ui.components.mainmenu.innerHTML = layout.getElementsByTagName('mainMenu')[0].innerHTML;
						layout.removeChild(layout.getElementsByTagName('mainMenu')[0]);
					}

					//menuItem
					if (ntui.ui.components.mainmenu.getElementsByTagName('menuItem').length) {
						let menuItems = [];
						for (let i = ntui.ui.components.mainmenu.getElementsByTagName('menuItem').length - 1; i >= 0; i--) {
							let HDTA = ntui.createElement('a');
							if (ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('id')) {
								HDTA.setAttribute('itemID', ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('id'));
							} else {
								HDTA.setAttribute('itemID', 'item' + i);
							}
							if (ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('state')) {
								HDTA.setAttribute('state', ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('state'));
							} else {
								HDTA.setAttribute('state', 'auto');
							}
							if (ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('onclick')) {
								if (ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('onclick').substr(-1) !== ';') {
									HDTA.setAttribute('onclick', ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('onclick') + ';ntui.ui.mainmenu.toggleItem(\'' + HDTA.getAttribute('itemID') + '\'' + ');');
								} else {
									HDTA.setAttribute('onclick', ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('onclick') + 'ntui.ui.mainmenu.toggleItem(\'' + HDTA.getAttribute('itemID') + '\'' + ');');
								}
							} else {
								HDTA.setAttribute('onclick', 'ntui.ui.mainmenu.toggleItem(\'' + HDTA.getAttribute('itemID') + '\'' + ');');
							}
							if (ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('href')) {
								HDTA.setAttribute('href', ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].getAttribute('href'));
							}
							HDTA.innerHTML = ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i].innerHTML;
							ntui.ui.components.mainmenu.removeChild(ntui.ui.components.mainmenu.getElementsByTagName('menuItem')[i]);
							menuItems[menuItems.length] = HDTA;
							HDTA = undefined;
						}
						ntui.render(ntui.ui.components.mainmenu, ntui.ui.components.window);
						for (i = menuItems.length - 1; i >= 0; i--) {
							if (menuItems[i]) {
								ntui.render(menuItems[i], ntui.ui.components.mainmenu);
							}
						}
					}

					//headerBar
					if (layout.getElementsByTagName('headerBar').length) {
						ntui.ui.components.headerbar.innerHTML = layout.getElementsByTagName('headerBar')[0].innerHTML;
						layout.removeChild(layout.getElementsByTagName('headerBar')[0]);
					} else {
						ntui.ui.components.headerbar.innerHTML = '<span style="margin-left:16px;">' + document.title + '</span>';
					}
					ntui.render(ntui.ui.components.headerbar, ntui.ui.components.window);

					//pageContent
					if (layout.getElementsByTagName('pageContent').length) {
						ntui.ui.components.pagecontent.innerHTML = layout.getElementsByTagName('pageContent')[0].innerHTML;
						layout.removeChild(layout.getElementsByTagName('pageContent')[0]);
					}
					ntui.render(ntui.ui.components.pagecontent, ntui.ui.components.window);

					//pageFooter
					if (layout.getElementsByTagName('pageFooter').length) {
						ntui.ui.components.pagefooter.innerHTML = layout.getElementsByTagName('pageFooter')[0].innerHTML;
						layout.removeChild(layout.getElementsByTagName('pageFooter')[0]);
					} else {
						ntui.ui.components.pagefooter.innerHTML = ntui.info;
					}
					ntui.render(ntui.ui.components.pagefooter, ntui.ui.components.window);

					//callback
					if (callback !== undefined && typeof callback === 'function') {
						callback();
					}

					//cleanUp
					if (document.body) {
						if (getComputedStyle(document.body).getPropertyValue('opacity') === '0') {
							document.body.style.opacity = 1;
						}
					}
					ntui.ui.components.window.style.opacity = 1;
				}
			};

			//element detection
			if (typeof layout !== 'object' && layout.substr(-5).toLowerCase() === '.html') {
				let script = layout.substr(0, layout.length - 5) + '.js';
				let HDTA = ntui.createElement(
					'iframe', {
						style: 'display:none;',
						src: layout,
					}
					);
				HDTA.onload = function () {
					if (HDTA.contentDocument.getElementsByTagName('layout').length) {
						layout = HDTA.contentDocument.getElementsByTagName('layout')[0];
						parseLayout(false, script);
					} else {
						console.error('[NtUI] {ui.layout} Invalid layout "' + layout + '".');
					}
					ntui.ui.components.window.removeChild(HDTA);
				};
				ntui.ui.components.window.appendChild(HDTA);
			} else {
				parseLayout(true);
			}
		}
	};

	//mainmenu
	ntui.ui.mainmenu = {};

	//toggleItem
	ntui.ui.mainmenu.toggleItem = function (itemID) {
		if (itemID !== undefined) {
			for (let i = 0; i < ntui.ui.components.mainmenu.getElementsByTagName('a').length; i++) {
				if (ntui.ui.components.mainmenu.getElementsByTagName('a')[i].getAttribute('itemID') && ntui.ui.components.mainmenu.getElementsByTagName('a')[i].getAttribute('itemID') === itemID) {
					if (ntui.ui.components.mainmenu.getElementsByTagName('a')[i].getAttribute('state') !== 'active') {
						ntui.ui.components.mainmenu.getElementsByTagName('a')[i].setAttribute('state', 'active');
					}
				} else {
					if (ntui.ui.components.mainmenu.getElementsByTagName('a')[i].getAttribute('state') === 'active') {
						ntui.ui.components.mainmenu.getElementsByTagName('a')[i].setAttribute('state', 'default');
					}
				}
			}
		}
	};

	//events
	ntui.ui.events = {};

	//update
	ntui.ui.update = function () {
		if (ntui.ui.update.busy === false) {

			//prevent
			ntui.ui.update.busy = true;

			//mobile
			if (ntui.platform === 'mobile') {
				if (!document.getElementsByClassName('ntui-ui-mobile').length) {
					let HDTA = ntui.createElement(
						'meta', {
							name: 'viewport',
							content: 'user-scalable=no, width=' + screen.width,
							class: 'ntui-ui-mobile'
						}
						);
					document.head.appendChild(HDTA);
				}
				if (!document.getElementsByClassName('ntui-ui-mobile-theme').length) {
					if (ntui.ui.theme.getProperty('--color-primary')) {
						HDTA = ntui.createElement(
							'meta', {
								name: 'theme-color',
								content: ntui.ui.theme.getProperty('--color-primary'),
								class: 'ntui-ui-mobile-theme'
							}
							);
						document.head.appendChild(HDTA);
					}
				}

				//event
				if (ntui.ui.events.onMobile !== undefined && typeof ntui.ui.events.onMobile === 'function') {
					ntui.ui.events.onMobile();
				}
			} else {

				//event
				if (ntui.ui.events.onDesktop !== undefined && typeof ntui.ui.events.onDesktop === 'function') {
					ntui.ui.events.onDesktop();
				}
			}

			//mainMenu
			ntui.ui.components.mainmenu.style.top = ntui.ui.components.headerbar.offsetHeight + 'px';

			//pageContent
			ntui.ui.components.pagecontent.style.marginTop = ntui.ui.components.headerbar.offsetHeight + ntui.ui.components.mainmenu.offsetHeight + 'px';

			//event
			if (ntui.ui.events.onUpdate !== undefined && typeof ntui.ui.events.onUpdate === 'function') {
				ntui.ui.events.onUpdate();
			}

			//prevent
			setTimeout(function () {
				ntui.ui.update.busy = false;
			}, 0);
		}
	};
	ntui.ui.update.busy = false;

	//watchdog
	ntui.ui.update.watchdog = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			ntui.ui.update();
		});
	});

	ntui.ui.update.watchdog.observe(ntui.ui.components.window, {
		subtree: true,
		childList: true
	});

	//theme
	ntui.ui.theme = function (theme) {
		if (theme !== undefined) {
			let path = ntui.paths.root + 'Themes';
			if (theme.substr(-1) === '/') {
				theme = theme.substr(0, theme.length - 1);
			}
			for (let i = theme.length - 1; i >= 0; i--) {
				if (theme.substr(0, i).substr(-1) === '/') {
					path = theme.substr(0, i - 1);
					theme = theme.substr(i, theme.length);
					i = 0;
				}
			}
			if (document.getElementsByClassName('ntui-ui-theme').length) {
				document.getElementsByClassName('ntui-ui-theme')[0].setAttribute('href', path + '/' + theme + '/' + theme + '.css');
			} else {
				let HDTA = ntui.createElement(
					'link', {
						class: 'ntui-ui-theme',
						rel: 'stylesheet',
						href: path + '/' + theme + '/' + theme + '.css'
					}
					);
				HDTA.onload = function () {
					ntui.ui.update();
				};
				document.head.appendChild(HDTA);
				HDTA = undefined;
			}
			ntui.ui.update();
		}
	};

	//getProperty
	ntui.ui.theme.getProperty = function (prop) {
		if (prop) {
			if (getComputedStyle(ntui.ui.components.window).getPropertyValue(prop)) {
				return getComputedStyle(ntui.ui.components.window).getPropertyValue(prop).replace(/ /g, '');
			} else {
				return undefined;
			}
		}
	};

	//setProperty
	ntui.ui.theme.setProperty = function (prop, value) {
		if (prop && value) {
			if (getComputedStyle(ntui.ui.components.window).getPropertyValue(prop)) {
				if (ntui.ui.components.window.getAttribute('style')) {
					ntui.ui.components.window.setAttribute('style', ntui.ui.components.window.getAttribute('style').split(prop + ':' + ntui.ui.theme.getProperty(prop) + ';').join('') + prop + ':' + value.replace(/ /g, '') + ';');
				} else {
					ntui.ui.components.window.setAttribute('style', prop + ':' + value + ';');
				}
			} else {
				console.error('[NtUI] [ui.theme] {getProperty} Can\'t find property: "' + prop + '"');
			}
		}
	};

	//newProperty
	ntui.ui.theme.newProperty = function (prop, value) {
		if (prop) {
			if (value === undefined) {
				value = '';
			}
			if (!getComputedStyle(ntui.ui.components.window).getPropertyValue(prop)) {
				if (ntui.ui.components.window.getAttribute('style')) {
					ntui.ui.components.window.setAttribute('style', ntui.ui.components.window.getAttribute('style') + prop + ':' + value.replace(/ /g, '') + ';');
				} else {
					ntui.ui.components.window.setAttribute('style', prop + ':' + value + ';');
				}
			} else {
				console.error('[NtUI] [ui.theme] {getProperty} Property "' + prop + '" already exists.');
			}
		}
	};

	//dialogs
	ntui.ui.dialogs = {};

	//prompt
	ntui.ui.dialogs.prompt = function (msg, title, button, onclick, onshow) {
		if (msg) {
			if (title === undefined) {
				title = '';
			}
			if (button === undefined) {
				button = 'OK';
			}
			if (onclick === undefined) {
				onclick = 'ntui.ui.dialogs.close();';
			} else {
				if (onclick.substr(0, 22) !== 'ntui.ui.dialogs.close(') {
					if (onclick.substr(-1) !== ';') {
						onclick = onclick + ';ntui.ui.dialogs.close();';
					} else {
						onclick = onclick + 'ntui.ui.dialogs.close();';
					}
				}
			}
			if (onshow === undefined) {
				onshow = function () { };
			}
			if (document.getElementsByClassName('ntui-ui-components-dialogs-prompt').length) {
				ntui.ui.dialogs.close();
				ntui.ui.dialogs.prompt(msg, title, button, onclick, onshow);
			}
			ntui.render(
				ntui.createElement(
					'div', {
						class: 'ntui-ui-components-dialogs-dim'
					}
					),
				ntui.ui.components.window
				);
			let dialog = ntui.createElement(
				'div', {
					class: 'ntui-ui-components-dialogs-prompt'
				},
				'<div class="ntui-ui-components-dialogs-title">' + title + '</div>' +
				'<div class="ntui-ui-components-dialogs-msg">' + msg + '</div>' +
				'<span class="ntui-ui-components-dialogs-button" onclick="' + onclick + '">' + button + '</span>'
				);
			ntui.render(dialog, ntui.ui.components.window);
			if (ntui.platform === 'mobile') {
				dialog.style.width = '86%';
				dialog.style.left = '7%';
				dialog.style.marginTop = '-' + (dialog.offsetHeight / 2) + 'px';
			} else {
				dialog.style.width = '50%';
				dialog.style.left = '25%';
				dialog.style.marginTop = '-' + (dialog.offsetHeight / 2) + 'px';
			}
			if (typeof onshow === 'function') {
				onshow();
			}
		}
	};

	ntui.ui.dialogs.close = function (onclose) {
		if (document.getElementsByClassName('ntui-ui-components-dialogs-prompt').length) {
			ntui.ui.components.window.removeChild(document.getElementsByClassName('ntui-ui-components-dialogs-dim')[0]);
			ntui.ui.components.window.removeChild(document.getElementsByClassName('ntui-ui-components-dialogs-prompt')[0]);
		}
		if (onclose !== undefined && typeof onclose === 'function') {
			onclose();
		}
	};

	//load
	ntui.ui.components.window.style.opacity = 0;
	if (theme === undefined) {
		theme = 'Default';
	}
	if (!layout) {
		if (document.body) {
			layout = document.body;
		} else {
			console.warn('[NtUI] {core} Unable to fetch layout, please load it manually.');
		}
	}
	ntui.start = function () {
		console.log(ntui.info);
		ntui.ui.theme(theme, path);
		ntui.ui.layout(layout, ntui.onload);
		if (ntui.ready && typeof ntui.ready === 'function') {
			ntui.ready();
		}

		//ui fixes
		ntui.ui.update.interval = setInterval(function () {
			ntui.ui.update();
		}, 250);
		setTimeout(function () {
			clearInterval(ntui.ui.update.interval);
			ntui.ui.update.interval = setInterval(function () {
				ntui.ui.update();
			}, 500);
			setTimeout(function () {
				clearInterval(ntui.ui.update.interval);
				ntui.ui.update.interval = setInterval(function () {
					ntui.ui.update();
				}, 1000);
				setTimeout(function () {
					clearInterval(ntui.ui.update.interval);
					ntui.ui.update.interval = undefined;
				}, 5000);
			}, 2500);
		}, 2500);

		ntui.start = undefined;
	};
	if (document.readyState !== 'complete') {
		window.addEventListener('load', ntui.start);
	} else {
		ntui.start();
	}
};
