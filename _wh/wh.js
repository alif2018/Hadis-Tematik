(function($) {
var maxZ = 0;
$.fn.easyDrag = function(params) {
if(params == "kill"){
this.each(function(){ var self = $(this); 
var handle = self.data('handle');
handle.off('mousedown', easyDrag_onMouseDown);
handle.off('touchstart', easyDrag_onTouchStart);
handle.css('cursor', '');
self.removeClass('easydrag_enabled');
}); 
} else if(params == 'killall'){ 
$('.easydrag_enabled').easyDrag('kill'); 
} else {
params = $.extend({
handle: '.handle', 
axis: false, 
container: false, 
start: function(){},
drag: function(){},
stop: function(){},
cursor: 'move', 
ontop: true,
clickable: true
}, params);
this.each(function(){ var self = $(this);
if(!self.hasClass('easydrag_enabled')){ 
if(params.handle == 'this' || self.find(params.handle).length==0){
var handle = self;
} else {
var handle = self.find(params.handle);
}
if(params.cursor != ''){ handle.css('cursor', params.cursor); } 
handle.data(params);
var boulet = self;
boulet.addClass('easydrag_enabled'); 
boulet.data('handle', handle); 
handle.data('boulet', boulet);
if(self.css('z-index')!='auto' && params.ontop){
maxZ = Math.max(maxZ, self.css('z-index'));
};
if(self.css('position') != 'absolute' && self.css('position') != 'fixed'){
if(self.css('left') == 'auto'){ self.css('left', '0'); } 
if(self.css('top') == 'auto'){ self.css('top', '0'); }
self.css('position', 'relative');
}
handle.on('mousedown', easyDrag_onMouseDown);
handle.on('touchstart', easyDrag_onTouchStart);
}
});
}
return this;
};
var self, t, boulet, initItemX, initItemY, initEventX, initEventY, axis, container, refX, refY; 
function easyDrag_onMouseDown(event){ event.preventDefault();
t = Date.now();
self = $(this); 
boulet = self.data('boulet');
initItemX = parseInt(boulet.css('left'));
initItemY = parseInt(boulet.css('top'));
axis = self.data('axis');
container = self.data('container');
initEventX = event.pageX;
initEventY = event.pageY;
if(container.length){
refX = self.offset().left;
refY = self.offset().top;
}
self.data('start').call(boulet);
$(document).on('mousemove', easyDrag_onMouseMove);
$(document).on('click', easyDrag_onMouseUp);
if(self.data('ontop')){ 
maxZ++;
boulet.css('z-index', maxZ);
}
}
function easyDrag_onMouseMove(e){ e.preventDefault();
self.data('drag').call(boulet); 
var nextX = initItemX + e.pageX-initEventX;
var nextY = initItemY + e.pageY-initEventY;
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }
easyDrag_contain();
}
function easyDrag_onMouseUp(e){ 
$(document).off('mousemove', easyDrag_onMouseMove);
$(document).off('click', easyDrag_onMouseUp);
self.data('stop').call(boulet); 
var d = Date.now() - t;
if(d>300 || !self.data('clickable')){
e.preventDefault(); 
e.stopPropagation();
} 
}
function easyDrag_onTouchStart(event){ event.preventDefault(); 
t = Date.now();
self = $(this); 
boulet = self.data('boulet');
initItemX = parseInt(boulet.css('left'));
initItemY = parseInt(boulet.css('top'));
axis = self.data('axis');
container = self.data('container');
if(container.length){
refX = self.offset().left;
refY = self.offset().top;
}
var touch = event.originalEvent.changedTouches[0];
initEventX = touch.pageX;
initEventY = touch.pageY;
self.data('start').call(boulet);
$(document).on('touchmove', easyDrag_onTouchMove);
$(document).on('touchend', easyDrag_onTouchEnd);
if(self.data('ontop')){ 
maxZ++;
boulet.css('z-index', maxZ);
}
}
function easyDrag_onTouchMove(e){ e.preventDefault();
self.data('drag').call(boulet); 
var touch = e.originalEvent.changedTouches[0];
var nextX = initItemX + touch.pageX-initEventX;
var nextY = initItemY + touch.pageY-initEventY;
if(!axis || axis=='x'){ boulet.css({'left': nextX+'px'}); }
if(!axis || axis=='y'){ boulet.css({'top': nextY+'px'}); }
easyDrag_contain();
}
function easyDrag_onTouchEnd(e){
$(document).off('touchmove', easyDrag_onTouchMove);
$(document).off('touchend', easyDrag_onTouchEnd);
self.data('stop').call(boulet); 
var d = Date.now() - t;
if(d>300 || !self.data('clickable')){
e.preventDefault(); 
e.stopPropagation();
} 
}
function easyDrag_contain(){
if(container.length){
var cur_offset = boulet.offset();
var container_offset = container.offset();
var limite1 = container_offset.left;
var limite2 = limite1+container.width()-boulet.innerWidth();
limite1 += parseInt(boulet.css('margin-left'));
if(cur_offset.left<limite1){
boulet.offset({left: limite1});
} else if(cur_offset.left>limite2){
boulet.offset({left: limite2});
}
var limite1 = container_offset.top;
var limite2 = limite1+container.height()-boulet.innerHeight();
limite1 += parseInt(boulet.css('margin-top'));
if(cur_offset.top<limite1){
boulet.offset({top: limite1});
} else if(cur_offset.top>limite2){
boulet.offset({top: limite2});
}
}
};
})(jQuery);
jQuery.extend({
highlight: function (node, re, hwRE1, hwRE2, nodeName, className) {
if (node.nodeType === 3) {
var match = node.data.match(re);
if (match) {
var matchIndex = match.index;
var matchLength = match[0].length;
if (hwRE1 !== null) {
var text = match.input;
var matchHead = text.substring(0, matchIndex).match(hwRE1);
if (matchHead !== null) {
matchIndex -= matchHead[1].length;
}
var matchTail =
text.substring(matchIndex + matchLength).match(hwRE2);
if (matchTail !== null) {
matchLength += matchTail[1].length;
}
}
var highlight = document.createElement(nodeName || 'span');
highlight.className = className || 'highlight';
var wordNode = node.splitText(matchIndex);
wordNode.splitText(matchLength);
var wordClone = wordNode.cloneNode(true);
highlight.appendChild(wordClone);
wordNode.parentNode.replaceChild(highlight, wordNode);
return 1; 
}
} else if ((node.nodeType === 1 && node.childNodes) && 
!/^(script|style|text|tspan|textpath)$|(^svg:)/i.test(node.tagName) && 
!(node.tagName === nodeName.toUpperCase() && node.className === className)) { 
for (var i = 0; i < node.childNodes.length; i++) {
i += jQuery.highlight(node.childNodes[i], re, hwRE1, hwRE2, nodeName, className);
}
}
return 0;
}
});
jQuery.fn.unhighlight = function (options) {
var settings = { className: 'highlight', element: 'span' };
jQuery.extend(settings, options);
return this.find(settings.element + "." + settings.className).each(function () {
var parent = this.parentNode;
parent.replaceChild(this.firstChild, this);
parent.normalize();
}).end();
};
jQuery.fn.highlight = function (words, options) {
var settings = { className: 'highlight', element: 'span', caseSensitive: false, wordsOnly: false, highlightWord: false };
jQuery.extend(settings, options);
if (words.constructor === String) {
words = [words];
}
words = jQuery.grep(words, function(word, i){
return word != '';
});
words = jQuery.map(words, function(word, i) {
return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
});
if (words.length == 0) { return this; };
var flag = settings.caseSensitive ? "" : "i";
var pattern = "(" + words.join("|") + ")";
if (settings.wordsOnly) {
pattern = "\\b" + pattern + "\\b";
}
var re = new RegExp(pattern, flag);
var hwRE1 = null;
var hwRE2 = null;
if (settings.highlightWord) {
try {
hwRE1 = new RegExp("([\\p{L}\\p{N}_-]+)$", "u");
hwRE2 = new RegExp("^([\\p{L}\\p{N}_-]+)", "u");
} catch (ignored) {}
}
return this.each(function () {
jQuery.highlight(this, re, hwRE1, hwRE2, settings.element, settings.className);
});
};
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ checked: false, ontoggle: null }, 
options);
var toggle = this.first();
toggle.addClass("toggle-toggle");
toggle.removeData("toggleState"); 
toggle.click(function (event) {
event.preventDefault();
methods.check.call(toggle, "toggle");
});
if (typeof settings.ontoggle === "function") {
toggle.data("onChangeState", settings.ontoggle);
}
methods.check.call(toggle, settings.checked);
return toggle;
},
check: function (checked) { 
var toggle = this.first();
var isChecked = toggle.data("toggleState");
if (checked === "toggle") {
if (typeof isChecked === "boolean") {
checked = !isChecked;
} else {
checked = false;
}
}
if (typeof checked === "boolean") {
var toggle = this.first();
if ((typeof isChecked === "undefined") ||
checked !== isChecked) {
if (checked) {
toggle.addClass("toggle-checked");
} else {
toggle.removeClass("toggle-checked");
}
toggle.data("toggleState", checked);
if (toggle.data("onChangeState")) {
toggle.data("onChangeState").call(toggle, checked);
}
}
return toggle;
} else {
return isChecked;
}
},
};
$.fn.toggle = function (method) {
if (methods[method]) {
return methods[method].apply(
this, 
Array.prototype.slice.call(arguments, 1));
} else if ((typeof method === "object") || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Method '" + method + "' does not exist in jQuery.toggle");
return this;
} 
};
})(jQuery);
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ selected: 0, onselect: null,
position: "north" }, 
options);
var tabs = this.first();
tabs.addClass("tabs-tabs");
if (settings.position === "west") {
tabs.addClass("tabs-west");
}
tabs.children("li").each(function (itemIndex) {
$(this).addClass("tabs-tab");
var links = $(this).children("a[href]");
links.each(function (i) {
$(this).attr("draggable", "false");
});
$(this).add(links).click(function (event) {
event.preventDefault();
event.stopImmediatePropagation();
methods.select.call(tabs, itemIndex);
});
});
if (typeof settings.onselect === "function") {
tabs.data("onSelectTab", settings.onselect);
}
methods.select.call(tabs, settings.selected);
return tabs;
},
select: function (index) { 
var tabs = this.first();
if (typeof index === "number") {
var items = tabs.children("li");
if (index < 0) {
index = 0;
} else if (index >= items.length) {
index = items.length - 1;
}
tabs.removeData("selectedTab");
var selected = false;
items.each(function (itemIndex) {
var panel = methods.getPanel.call(tabs, $(this));
if (itemIndex === index) {
$(this).addClass("tabs-selected");
panel.show();
selected = true;
} else {
$(this).removeClass("tabs-selected");
panel.hide();
}
});
if (selected) {
tabs.data("selectedTab", index);
if (tabs.data("onSelectTab")) {
tabs.data("onSelectTab").call(tabs, index);
}
}
return tabs;
} else {
return tabs.data("selectedTab");
}
},
getPanel: function (item) {
var href = item.children("a[href]").first().attr("href");
if (href && href.indexOf("#") === 0) {
return $(href);
} else {
return $();
}
},
};
$.fn.tabs = function (method) {
if (methods[method]) {
return methods[method].apply(
this, 
Array.prototype.slice.call(arguments, 1));
} else if ((typeof method === "object") || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Method '" + method + "' does not exist in jQuery.tabs");
return this;
} 
};
})(jQuery);
;(function ($) {
var methods = {
init: function (options) { 
var settings = $.extend({ initiallyCollapsed: false }, options);
var toc = this.first();
toc.addClass("toc-toc");
toc.data("toc", settings);
var collapsible = methods.getCollapsibleEntries.call(toc);
if (collapsible.length > 0) {
var hasSingleRoot = (toc.children("li").length === 1);
methods.restoreCollapsibleEntries.call(toc, collapsible, 
hasSingleRoot);
var clickEndX = NaN;
var paddingLeft = collapsible.css("padding-left");
if (paddingLeft.substr(-2) === "px") {
clickEndX = 
parseInt(paddingLeft.substring(0, paddingLeft.length-2));
}
if (isNaN(clickEndX)) {
clickEndX = 16;
}
collapsible.click(function (event) {
var entry = $(this);
var x = event.pageX - entry.offset().left;
if (x >= 0 && x < clickEndX) {
event.stopImmediatePropagation();
var contents = entry.children("ul");
if (entry.hasClass("toc-collapsed")) {
entry.removeClass("toc-collapsed")
.addClass("toc-expanded");
contents.show();
} else {
entry.removeClass("toc-expanded")
.addClass("toc-collapsed");
contents.hide();
}
methods.saveCollapsibleEntries.call(toc, collapsible);
}
});
}
return toc;
},
expandCollapseAll: function (expand) {
var toc = this.first();
var collapsible = methods.getCollapsibleEntries.call(toc);
collapsible.each(function () { 
var entry = $(this);
if (expand && entry.hasClass("toc-collapsed")) {
entry.removeClass("toc-collapsed")
.addClass("toc-expanded");
entry.children("ul").show();
} else if (!expand && entry.hasClass("toc-expanded")) {
entry.removeClass("toc-expanded")
.addClass("toc-collapsed");
entry.children("ul").hide();
}
});
methods.saveCollapsibleEntries.call(toc, collapsible);
return toc;
},
showEntry: function (entry, scroll) {
var toc = this.first();
entry.parents(toc, "li").each(function () {
var e = $(this);
if (e.hasClass("toc-collapsed")) {
e.removeClass("toc-collapsed").addClass("toc-expanded");
e.children("ul").show();
}
});
if (scroll && toc.is(":visible")) {
var scrollable = methods.getScrollParent.call(toc);
scrollable.scrollTop(entry.offset().top - 
scrollable.offset().top);
}
return toc;
},
getScrollParent: function() {
var position = this.css("position");
var excludeStaticParent = (position === "absolute");
var scrollParent = this.parents().filter(function() {
var parent = $(this);
if (excludeStaticParent && 
parent.css("position") === "static") {
return false;
}
return (/(auto|scroll)/).test(parent.css("overflow") + 
parent.css("overflow-y") + 
parent.css("overflow-x"));
}).eq(0);
return (position === "fixed" || scrollParent.length === 0)? 
$(this[0].ownerDocument || document) : scrollParent;
},
getCollapsibleEntries: function () {
return $("li", this).filter(function () {
return $(this).children("ul").length > 0;
});
},
saveCollapsibleEntries: function (collapsible) {
var settings = this.data("toc");
if (settings.storageKey) {
var state = [];
collapsible.each(function () {
state.push($(this).hasClass("toc-collapsed")? 0 : 1);
});
window.sessionStorage.setItem(settings.storageKey,
state.join(""));
}
},
restoreCollapsibleEntries: function (collapsible, hasSingleRoot) {
var fallback = true;
var settings = this.data("toc");
if (settings.storageKey) {
var storedValue = 
window.sessionStorage.getItem(settings.storageKey);
if (storedValue) {
var state = storedValue.split("");
if (state.length === collapsible.length) {
fallback = false;
collapsible.each(function (index) {
var entry = $(this);
var contents = entry.children("ul");
if (parseInt(state[index], 10) === 0) {
entry.addClass("toc-collapsed");
contents.hide();
} else {
entry.addClass("toc-expanded");
contents.show();
}
});
}
}
}
if (fallback) {
if (settings.initiallyCollapsed) {
collapsible.each(function (index) {
var entry = $(this);
if (hasSingleRoot && index === 0) {
entry.addClass("toc-expanded");
} else {
entry.addClass("toc-collapsed");
entry.children("ul").hide();
}
});
} else {
collapsible.each(function (index) {
$(this).addClass("toc-expanded");
});
}
}
}
};
$.fn.toc = function (method) {
if (methods[method]) {
return methods[method].apply(
this, 
Array.prototype.slice.call(arguments, 1));
} else if ((typeof method === "object") || !method) {
return methods.init.apply(this, arguments);
} else {
$.error("Method '" + method + "' does not exist in jQuery.toc");
return this;
} 
};
})(jQuery);
var wh = (function () {
var toc_entries = [
["Bukhari 401-500","Praktek-Website.html",[
["Cover","Praktek-Website.html#_gjdgxs",null],
["KATA PENGANTAR","Praktek-Website.html#_30j0zll",null],
["BAB 1","Praktek-Website-3.html",null],
["PERBUATAN-PERBUATAN ZHALIM DAN MERAMPOK","Praktek-Website-3.html#_2et92p0",[
["A. Bab: Jika memecahkan piring atau sesuatu milik orang\n        lain.","Praktek-Website-3.html#_tyjcwt",[
["1. HR. Shahih Bukhari No.2301","Praktek-Website-3.html#_3dy6vkm",null]
]],
["B. Bab: Jika menghancurkan bangunan milik orang lain maka harus\n        menggantinya.","Praktek-Website-7.html",[
["2. HR. Shahih Bukhari No. 2302","Praktek-Website-7.html#_4d34og8",null]
]]
]],
["BAB 2","Praktek-Website-9.html",null],
["ASY-SYIRKAH (PERSERIKATAN USAHA)","Praktek-Website-9.html#_17dp8vu",[
["A. Bab: Berserikat dalam makanan, An Nahd, barang dagangan dan\n        bagaimana cara pembagian sesuatu yang ditakar atau ditimbang,","Praktek-Website-9.html#_3rdcrjn",[
["3. HR. Shahih Bukhari No2303","Praktek-Website-9.html#_26in1rg",null],
["5. HR. Shahih Bukhari 2305","Praktek-Website-13.html",null],
["6. HR. Shahih Bukhari No. 2306","Praktek-Website-14.html",null]
]],
["B. Bab: Hasil yang diperoleh dari harta yang dicampur, maka\n        keduanya dapat berserikat dalam mengeluarkan zakatnya.","Praktek-Website-15.html",[
["7. HR. Shahih Bukhari No. 2307","Praktek-Website-15.html#_44sinio",null]
]],
["C. Bab: Pembagian kambing.","Praktek-Website-17.html",[
["8. HR. Shahih Bukhari No. 2308","Praktek-Website-17.html#_z337ya",null]
]],
["D. Bab: Makan kurma dua biji-dua biji sekaligus di antara\n        orang-orang yang iut berseriat, kecuali dengan seizin mereka.","Praktek-Website-19.html",[
["9. HR. Shahih Bukhari No. 2309","Praktek-Website-19.html#_1y810tw",null],
["10. HR.Shahih Bukahri No 2310","Praktek-Website-21.html",null]
]],
["E. Bab: Menghitung nilai barang milik bersama secara\n        adil.","Praktek-Website-22.html",[
["11. HR. Shahih Bukhari No 2311","Praktek-Website-22.html#_1ci93xb",null],
["12. HR. Shahih Bukhari No. 2312","Praktek-Website-24.html",null]
]],
["F. Bab: Apakah dalam pembagian dan pemgambilan hak dapat\n        dilakukan dengan undian?","Praktek-Website-25.html",[
["13. HR. Shahih Bukahri No. 2313","Praktek-Website-25.html#_qsh70q",null]
]],
["G. Bab: Akad persekutuan anak yatim dan orang-orang yang\n        mendapatkan warisan.","Praktek-Website-27.html",[
["14. HR. Shahih Bukhari No. 2314","Praktek-Website-27.html#_1pxezwc",null]
]],
["H. Bab: Persekutuan dalam tanah dan selainnya.","Praktek-Website-29.html",[
["15. HR. Shahih Bukhari No.2315","Praktek-Website-29.html#_2p2csry",null]
]],
["I. Bab: Jika orang-orang yang berserikat membagi rumah atau\n        yang selainnya,","Praktek-Website-31.html",[
["16. HR. Shahih Bukhari No.2316","Praktek-Website-31.html#_3o7alnk",null]
]],
["J. Bab: Berserikat dalam emas dan perak.","Praktek-Website-33.html",[
["17. HR. Shahih Bukhari No. 2317","Praktek-Website-33.html#_ihv636",null]
]],
["K. Bab: Perserikatan orang dzimmi dengan musyrik dalam akad\n        muzara\'ah.","Praktek-Website-35.html",null],
["L. Bab: Pembagian kambing dan berlaku adil.","Praktek-Website-36.html",[
["19. HR. Shahih Bukhari No. 2319","Praktek-Website-36.html#_41mghml",null]
]],
["M. Bab: Berserikat dalam makanan dan selainnya.","Praktek-Website-38.html",[
["20. HR. Shahih Bukhari No 2320","Praktek-Website-38.html#_vx1227",null]
]],
["N. Bab: Berserikat dalam kepemilikan budak dan\n        selainnya.","Praktek-Website-40.html",[
["21. HR. Shahih Bukhari No.2321","Praktek-Website-40.html#_1v1yuxt",null],
["22. HR. Shahih Bukhari No. 2322","Praktek-Website-42.html",null]
]],
["O. Bab: Berserikat dalam hadyu dan hewan kurban.","Praktek-Website-43.html",[
["23. HR.Shahih Bukhari No.2323","Praktek-Website-43.html#_19c6y18",null]
]],
["P. Bab: Menyamakan sepuluh kambing dengan satu unta dalam\n        pembagian.","Praktek-Website-45.html",[
["24. HR. Shahih Bukhari No.2324","Praktek-Website-45.html#_28h4qwu",null]
]]
]],
["BAB 3","Praktek-Website-47.html",null],
["GADAI","Praktek-Website-47.html#_37m2jsg",[
["A. Bab: Gadai saat tidak dalam perjalanan.","Praktek-Website-47.html#_1mrcu09",[
["25. HR. Shahih Bukhari No. 2325","Praktek-Website-47.html#_46r0co2",null]
]],
["B. Bab: Menggadaikan baju perang.","Praktek-Website-51.html",[
["26. HR. Shahih Bukhari No. 2326","Praktek-Website-51.html#_111kx3o",null]
]],
["C. Bab: Menggadaikan senjata.","Praktek-Website-53.html",[
["27. HR. Shahih Bukhari No. 2327","Praktek-Website-53.html#_206ipza",null]
]],
["D. Bab: Menggadaikan kendaraan tunggangan dan hewan\n        perah.","Praktek-Website-55.html",[
["28. HR. Shahih Bukhari No.2328","Praktek-Website-55.html#_2zbgiuw",null],
["29. HR. Shahih Bukhari No. 2329","Praktek-Website-57.html",null]
]],
["E. Bab: Gadai bagi orang-orang yahudi dan selainnya.","Praktek-Website-58.html",[
["30. HR. Shahih Bukhari No. 2330","Praktek-Website-58.html#_2dlolyb",null]
]],
["F. Bab: Jika orang yang menggadaikan, penerima gadai dan\n        selainnya berselisih maka bukti harus diberikan oleh pihak\n        penuduh.","Praktek-Website-60.html",[
["31. HR. Shahih Bukhari No. 2331","Praktek-Website-60.html#_3cqmetx",null],
["32. HR. Shahih Bukhari No. 2332","Praktek-Website-62.html",null]
]]
]],
["BAB 4","Praktek-Website-63.html",null],
["MEBEBASKAN BUDAK","Praktek-Website-63.html#_2r0uhxc",[
["A. Bab: Memerdekakan budak dan keutamaannya.","Praktek-Website-63.html#_1664s55",[
["33. HR. Shahih Bukhari No. 2333","Praktek-Website-63.html#_3q5sasy",null]
]],
["B. Bab: Budak yang bagaimanakah yang paling utama?","Praktek-Website-67.html",[
["34. HR. Shahih Bukhari No. 2334","Praktek-Website-67.html#_kgcv8k",null]
]],
["C. Bab: Dianjurkan untuk memerdekakan budak saat\n        gerhana.","Praktek-Website-69.html",[
["35. HR. Shahih Bukhari No. 2335","Praktek-Website-69.html#_1jlao46",null],
["36. HR. Shahih Bukhari No. 2336","Praktek-Website-71.html",null]
]],
["D. Bab: Memerdekakan budak yang dimiliki oleh dua\n        orang.","Praktek-Website-72.html",[
["37. HR. Shahih Bukhari No. 2337","Praktek-Website-72.html#_xvir7l",null],
["38. HR. Shahih Bukhari No. 2338","Praktek-Website-74.html",null],
["39. HR. Shahih Bukhari No. 2339","Praktek-Website-75.html",null],
["40. HR. Shahih Bukhari No.2340","Praktek-Website-76.html",null],
["41. HR. Shahih Bukhari No 2341","Praktek-Website-77.html",null]
]],
["E. Bab: Memerdekakan satu bagian pada diri seorang budak,\n        sedang ia tidak memiliki harta.","Praktek-Website-78.html",[
["42. HR. Shahih Bukhari No 2342","Praktek-Website-78.html#_3vac5uf",null]
]],
["F. Bab: Salah dan lupa dalam pembebasan budak.","Praktek-Website-80.html",[
["43. HR. Shahih Bukhari No. 2343","Praktek-Website-80.html#_pkwqa1",null],
["44. HR. Shahih Bukhari No. 2344","Praktek-Website-82.html",null]
]],
["G. Bab: Jika seseorang berkata kepada budaknya \'Dia milik\n        Allah\', dan ia berniat untuk memerdekakannya.","Praktek-Website-83.html",[
["45. HR.Shahih Bukhari No. 2345","Praktek-Website-83.html#_48pi1tg",null],
["46. HR. Shahih Bukhari No. 2346","Praktek-Website-85.html",null],
["47. HR. Shahih Bukhari No. 2347","Praktek-Website-86.html",null]
]],
["H. Bab: Ummul Walad.","Praktek-Website-87.html",[
["48. HR. Shahih Bukhari No. 2348","Praktek-Website-87.html#_2250f4o",null]
]],
["I. Bab: Menjual budak mudabbar.","Praktek-Website-89.html",[
["49. HR. Shahih Bukhari No. 2349","Praktek-Website-89.html#_319y80a",null]
]],
["J. Bab: Menjual wala\' dan menghibahannya.","Praktek-Website-91.html",[
["50. HR. Shahih Bukhari No.2350","Praktek-Website-91.html#_40ew0vw",null],
["51. HR. Shahih Bukhari No. 2351","Praktek-Website-93.html",null]
]],
["K. Bab: Jika saudara atau paman seseorang ditawan, apakah ia\n        ditebus jika statusnya seorang musyrik?","Praktek-Website-94.html",[
["52. HR. Shahih Bukhari No. 2352","Praktek-Website-94.html#_3ep43zb",null]
]],
["L. Bab: Memerdekakan orang musyrik.","Praktek-Website-96.html",[
["53. HR. Shahih Bukhari No. 2353","Praktek-Website-96.html#_4du1wux",null]
]],
["M. Bab: Jika orang arab memiliki budak, lalu ia\n        menghibahkannya, menjualnya, menggaulinya, menebus dan menawan\n        keturunannya.","Praktek-Website-98.html",[
["54. HR. Shahih Bukhari No. 2354","Praktek-Website-98.html#_184mhaj",null],
["55. HR. Shahih Bukhari No. 55","Praktek-Website-100.html",null],
["57. HR. Shahih Bukhari No. 2357","Praktek-Website-101.html",null]
]],
["N. Bab: Keutamaan mendidik dan mengajar buda\n        perempuannya.","Praktek-Website-102.html",[
["58. HR. Shahih Bukhari No. 2358","Praktek-Website-102.html#_36ei31r",null]
]],
["O. Bab: Sabda Nabi Shallallahu \'alaihi wa Sallam \'Budak itu\n        saudara kalian.","Praktek-Website-104.html",[
["59. HR. Shahih Bukhari No, 2359","Praktek-Website-104.html#_45jfvxd",null]
]],
["P. Bab: Seorang buda jika ia beribadah dengan baik dan patuh\n        kepada tuannya.","Praktek-Website-106.html",[
["60. HR. Shahih Bukhari No. 2360","Praktek-Website-106.html#_zu0gcz",null],
["61. HR. Shahih Bukhari No. 2361","Praktek-Website-108.html",null],
["62. HR. ShahiH Bukhari No. 2362","Praktek-Website-109.html",null],
["63. HR. Shahih Bukhari No, 2363","Praktek-Website-110.html",null]
]],
["Q. Bab: Larangan memperpanjang perbudakan.","Praktek-Website-111.html",[
["64. HR. Shahih Bukhari No. 2364","Praktek-Website-111.html#_1d96cc0",null],
["65. HR. Shahih Bukhari No. 2365","Praktek-Website-113.html",null],
["66. HR. Shahih Bukhari No. 2366","Praktek-Website-114.html",null],
["67. HR. Shahih Bukhari No. 2367","Praktek-Website-115.html",null],
["68. HR. Shahih Bukhari No. 2368","Praktek-Website-116.html",null],
["69. HR. Shahih Bukhari No. 2369","Praktek-Website-117.html",null]
]],
["R. Bab: Jika budaknya datang dengan membawa makanannya.","Praktek-Website-118.html",[
["70. HR. Shhaih Bukhari No. 2370","Praktek-Website-118.html#_2pta16n",null]
]],
["S. Bab: Budak itu pemimpin atas harta tuannya.","Praktek-Website-120.html",[
["71. HR. Shahih Bukhari No. 2371","Praktek-Website-120.html#_3oy7u29",null]
]],
["T. Bab: Jika memukul budak hendaklah menjauhi wajah.","Praktek-Website-122.html",[
["72. HR. Shahih Bukhari No. 2372","Praktek-Website-122.html#_j8sehv",null]
]],
["U. Bab: Persyaratan yang dibolehkan dalam Mukatab.","Praktek-Website-124.html",[
["73. HR. Shahih Bukhari No. 2373","Praktek-Website-124.html#_1idq7dh",null],
["74. HR. Shahih Bukhari No. 2374","Praktek-Website-126.html",null]
]],
["V. Bab: Budak mukatab minta bantuan dan meminta-minta kepada\n        orang lain.","Praktek-Website-127.html",[
["75. HR. Shahih Bukhari No. 2375","Praktek-Website-127.html#_wnyagw",null]
]],
["W. Bab: Menjual budak mukatab jika rela.","Praktek-Website-129.html",[
["76. HR. Shahih Bukhari No. 2376","Praktek-Website-129.html#_1vsw3ci",null]
]],
["X. Bab: Jika budak mukatab berkata \'Beli dan memerdekakanlah\n        aku,","Praktek-Website-131.html",[
["77. HR. Shahih Bukhari No. 2377","Praktek-Website-131.html#_2uxtw84",null]
]]
]],
["BAB 5","Praktek-Website-133.html",null],
["HIBAH, KEUTAMAANYA DAN ANJURAN MELAKUKANYA","Praktek-Website-133.html#_3u2rp3q",[
["A. Bab: Bab","Praktek-Website-133.html#_2981zbj",[
["78. HR. Shahih Bukhari No. 2378","Praktek-Website-133.html#_odc9jc",null],
["79. HR. Shahih Bukhari No. 2379","Praktek-Website-137.html",null]
]],
["B. Bab: Menghibahkan barang yang sedikit.","Praktek-Website-138.html",[
["80. HR. Shahih Bukhari No. 2380","Praktek-Website-138.html#_47hxl2r",null]
]],
["C. Bab: Orang yang minta hibah dari kawannya","Praktek-Website-140.html",[
["81. HR. Shahih Bukhari No. 2381","Praktek-Website-140.html#_11si5id",null]
]],
["D. Bab: Meminta minum.","Praktek-Website-142.html",[
["83. HR. Shahih Bukhari No. 2383","Praktek-Website-142.html#_20xfydz",null]
]],
["E. Bab: Menerima hadiah dari hasil buruan.","Praktek-Website-144.html",[
["84. HR. Shahih Bukhari No. 2384","Praktek-Website-144.html#_302dr9l",null],
["85. HR. Shahih Bukhari No.2385","Praktek-Website-146.html",null]
]],
["F. Bab: Menerima hadiah.","Praktek-Website-147.html",[
["86. HR. Shahih Bukhari No. 2386","Praktek-Website-147.html#_2eclud0",null],
["87. HR. Shahih Bukhari No. 2387","Praktek-Website-149.html",null],
["88. HR. Shahih Bukhari No 2388","Praktek-Website-150.html",null],
["89. HR. Shahih Bukhari No. 2389","Praktek-Website-151.html",null],
["90. HR. Shahih Bukhari No. 2390","Praktek-Website-152.html",null],
["91. HR. Shahih Bukhari No. 2391","Praktek-Website-153.html",null]
]],
["G. Bab: Orang yang memberikan hadiah kepada sahabatnya.","Praktek-Website-154.html",[
["92. HR. Shahih Bukhari No. 2392","Praktek-Website-154.html#_3qwpj7n",null],
["93. HR. Shahih Bukhari No. 2393","Praktek-Website-156.html",null]
]],
["H. Bab: Hadiah yang tidak ditolak.","Praktek-Website-157.html",[
["94. HR. Shhaih Bukhari No. 2394","Praktek-Website-157.html#_356xmb2",null]
]],
["I. Bab: Pendapat yang mengatakan &quot;Boleh menghibahkan barang\n        yang tidak ada di tempat&quot;.","Praktek-Website-159.html",[
["95. HR. Shahih Bukhari No. 2395","Praktek-Website-159.html#_44bvf6o",null]
]],
["J. Bab: Imbalan dalam hibah.","Praktek-Website-161.html",[
["96. HR. Shahih Bukhari No. 2396","Praktek-Website-161.html#_ymfzma",null]
]],
["K. Bab: Hibah untuk anak.","Praktek-Website-163.html",[
["97. HR. Shahih Bukhari No. 2397","Praktek-Website-163.html#_1xrdshw",null]
]],
["L. Bab: Saksi dalam hibah.","Praktek-Website-165.html",[
["98. HR. Shahih Bukhari No. 2398","Praktek-Website-165.html#_2wwbldi",null]
]],
["M. Bab: Hibah suami untuk isteri dan isteri untuk\n        suami.","Praktek-Website-167.html",[
["99. HR. Shahih Bukhari No. 2399","Praktek-Website-167.html#_3w19e94",null],
["100. HR. Shahih Bukhari No. 2400","Praktek-Website-169.html",null]
]]
]],
["PROFIL PENULIS","Praktek-Website-170.html",null]
]]];
var toc_initiallyCollapsed = false;
var messages = [
"Contents",
"Index",
"Search",
"Collapse All",
"Expand All",
"Previous Page",
"Next Page",
"Print Page",
"Toggle search result highlighting",
"No results found for %W%.",
"1 result found for %W%.",
"%N% results found for %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also" 
];
var messageTranslations = {
"de": [
"Inhalt",
"Index",
"Suchen",
"Alle ausblenden",
"Alle einblenden",
"Vorherige Seite",
"Nächste Seite",
"Print Page",
"Hervorhebung von Suchergebnissen ein-/ausschalten",
"Keine Ergebnisse für %W% gefunden.",
"1 Ergebnis für %W% gefunden.",
"%N% Ergebnisse für %W% gefunden.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Siehe",
"Siehe auch"
],
"es": [
"Contenido",
"Índice",
"Buscar",
"Contraer todo",
"Expandir todo",
"Página anterior",
"Página siguiente",
"Print Page",
"Alternar el resaltado de los resultados de la búsqueda",
"No se ha encontrado ningún resultado para %W%.",
"Se ha encontrado un resultado para %W%.",
"Se han encontrado %N% resultados para %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Ver",
"Ver también"
],
"fr": [
"Sommaire",
"Index",
"Rechercher",
"Replier Tout",
"Déplier Tout",
"Page Précédente",
"Page Suivante",
"Imprimer Page",
"Basculer la mise en surbrillance",
"Aucun résultat trouvé pour %W%.",
"1 résultat trouvé pour %W%.",
"%N% résultats trouvés pour %W%.",
"Arrêter de rechercher",
"Ouvrir le panneau de navigation",
"Fermer le panneau de navigation",
"terme",
"mot",
"Atteindre",
"Voir",
"Voir aussi"
],
"it": [
"Sommario",
"Indice",
"Ricerca",
"Comprimi tutto",
"Espandi tutto",
"Pagina precedente",
"Pagina successiva",
"Print Page",
"Attiva/Disattiva evidenziazione risultati ricerca",
"Nessun risultato trovato per %W%.",
"1 risultato trovato per %W%.",
"%N% risultati trovati per %W%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Vedere",
"Vedere anche"
],
"ja": [
"目次",
"索引",
"検索",
"すべて折りたたむ",
"すべて展開",
"前のページ",
"次のページ",
"Print Page",
"検索キーワードをハイライト表示",
"%W% の検索結果は見つかりませんでした。",
"%W% の検索結果が 1 件見つかりました。",
"%W% の検索結果が%N% 件見つかりました。%N%",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"参照：",
"その他参照："
],
"pl": [
"Spis treści",
"Indeks",
"Wyszukaj",
"Zwiń wszystko",
"Rozwiń wszystko",
"Poprzednia strona",
"Następna strona",
"Print Page",
"Przełącz wyróżnianie wyników wyszukiwania",
"Brak wyników dla %W%.",
"Znaleziono 1 wynik dla %W%.",
"Znaleziono następującą liczbę wyników dla %W%: %N%",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"Zobacz",
"Zobacz również"
],
"ru": [
"Содержание",
"Указатель",
"Поиск",
"Свернуть все",
"Развернуть все",
"Предыдущая",
"Следующая",
"Print Page",
"Выделение результатов поиска",
"Ничего не найдено по запросу \"%W%\".",
"Найдено результатов по запросу \"%W%\": 1.",
"Найдено результатов по запросу \"%W%\": %N%.",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"См.",
"См. также"
],
"zh-cn": [
"目录",
"索引",
"搜索",
"全部折叠",
"全部展开",
"上一页",
"下一页",
"Print Page",
"切换搜索结果高亮",
"未找到有关 %W% 的结果。",
"找到 1 条有关 %W% 的结果。",
"找到 %N% 条有关 %W% 的结果。",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also"
],
"zh-tw": [
"目錄",
"索引",
"搜尋",
"收合全部",
"展開全部",
"上一頁",
"下一頁",
"Print Page",
"反白顯示切換搜尋結果",
"找不到 %W% 的結果。",
"找到 １ 個 %W% 的結果。",
"找到 %N% 個 %W% 的結果。",
"Stop searching",
"Open navigation pane",
"Close navigation pane",
"term",
"word",
"Go",
"See",
"See also"
]
};
var preferredUserLanguage = null; 
function getUserLanguage(lang) {
if (lang === null) {
lang = window.navigator.userLanguage || window.navigator.language;
}
if (lang) {
lang = lang.toLowerCase();
if (lang.length > 5) {
lang = lang.substring(0, 5);
}
if (lang.indexOf("_") >= 0) {
lang = lang.replace(/_/g, "-");
}
if (lang in messageTranslations) {
return lang;
} else {
var pos = lang.indexOf("-");
if (pos > 0) {
lang = lang.substring(0, pos);
}
if (lang in messageTranslations) {
return lang;
} else {
return null;
}
}
} else {
return null;
}
}
var userLanguage = getUserLanguage(preferredUserLanguage);
function msg(message) {
if (userLanguage !== null) {
var translation = messageTranslations[userLanguage];
if (translation !== undefined) {
var index = -1;
var count = messages.length;
for (var i = 0; i < count; ++i) {
if (messages[i] === message) {
index = i;
break;
}
}
if (index >= 0) {
message = translation[index];
}
}
}
return message;
}
var storageId = "-y8ys8e9m8rj7-17wrv4awvakea";
function storageSet(key, value) {
window.sessionStorage.setItem(key + storageId, String(value));
}
function storageGet(key) {
return window.sessionStorage.getItem(key + storageId);
}
function storageDelete(key) {
window.sessionStorage.removeItem(key + storageId);
}
function initMenu() {
var menu = $("#wh-menu");
menu.attr("title", msg("Open navigation pane"));
menu.click(function () {
if (menu.hasClass("wh-icon-menu")) {
openNavigation();
} else {
closeNavigation();
}
});
}
function openNavigation() {
var menu = $("#wh-menu");
menu.removeClass("wh-icon-menu").addClass("wh-icon-close");
menu.attr("title", msg("Close navigation pane"));
var glass = $('<div id="wh-body-glass"></div>');
glass.css({ "position": "absolute",
"top": "0px",
"left": "0px",
"z-index": "50",
"width": "100%",
"height": "100%",
"background-color": "#808080",
"opacity": "0.5" });
$("body").append(glass);
glass.click(closeNavigation);
var top = menu.position().top;
top += menu.outerHeight( false);
var height = $("#wh-body").height() - top;
var nav = $("#wh-navigation");
nav.css({ "position": "absolute",
"top": top + "px",
"right": "0px",
"z-index": "100",
"width": "66%",
"height": height + "px",
"border-style": "solid",
"display": "flex" }); 
}
function closeNavigation() {
var menu = $("#wh-menu");
menu.removeClass("wh-icon-close").addClass("wh-icon-menu");
menu.attr("title", msg("Open navigation pane"));
$("#wh-body-glass").remove();
var nav = $("#wh-navigation");
nav.css({ "position": "",
"top": "",
"right": "",
"z-index": "",
"width": "",
"height": "",
"border-style": "",
"display": "" });
var position = parseInt(storageGet("whSeparatorPosition"), 10);
if (!isNaN(position)) {
nav.width(position);
}
}
function initSeparator() {
var navigation = $("#wh-navigation");
var separator = $("#wh-separator");
var content = $("#wh-content");
separator.easyDrag({
axis: "x",
container: $("#wh-body"),
clickable: false,
cursor: "", 
start: function() { 
$(this).data("startDragLeftOffset", $(this).offset().left);
},
stop: function() {
var delta = 
$(this).offset().left - $(this).data("startDragLeftOffset");
if (delta !== 0) {
var availableW = $("#wh-body").width();
var reservedW = 1 + getPad(navigation,  false)/2 +
separator.outerWidth( true) +
getPad(content,  false)/2;
var maxW = availableW - reservedW;
var w = navigation.width() + delta;
if (w < reservedW) {
w = reservedW; 
} else if (w > maxW) {
w = maxW;
}
saveSeparatorPosition(separator, w);
navigation.width(w);
}
}
});
var position = parseInt(storageGet("whSeparatorPosition"), 10);
if (isNaN(position)) {
position = navigation.width();
}
saveSeparatorPosition(separator, position);
navigation.width(position);
}
function getPad(pane, vertical) {
if (vertical) {
return pane.outerHeight( true) - pane.height();
} else {
return pane.outerWidth( true) - pane.width();
}
}
function saveSeparatorPosition(separator, position) {
separator.css("left", "0px");
storageSet("whSeparatorPosition", position.toString());
}
function populateTOC() {
var tocPane = $("#wh-toc-pane");
var list = $("<ul id='wh-toc'></ul>");
tocPane.append(list);
if (typeof toc_entries !== "undefined") {
var count = toc_entries.length;
for (var i = 0; i < count; ++i) {
addTOCEntry(toc_entries[i], list);
}
toc_entries = undefined; 
}
}
function addTOCEntry(entry, list) {
var text = entry[0];
var href = entry[1];
var children = entry[2];
var count = (children !== null)? children.length : 0;
var item = $("<li></li>");
list.append(item);
if (href !== null) {
var link = $("<a></a>");
link.attr("href", href);
link.attr("draggable", "false");
link.html(text);
item.append(link);
} else {
item.html(text);
}
if (count > 0) {
var sublist = $("<ul></ul>");
item.append(sublist);
for (var i = 0; i < count; ++i) {
addTOCEntry(children[i], sublist);
}
}
}
function doInitTOC() {
populateTOC();
var toc = $("#wh-toc");
var tocOptions = { storageKey: ("whTOCState" + storageId) };
if ((typeof toc_initiallyCollapsed !== "undefined") &&
toc_initiallyCollapsed) {
tocOptions.initiallyCollapsed = true;
}
toc.toc(tocOptions);
}
var fieldKeys = {
ENTER: 13,
ESCAPE: 27,
UP: 38,
DOWN: 40
};
function startSearch(field) {
stopSearch(field);
var query = $.trim(field.val());
if (query.length === 0) {
field.val("");
return null;
}
var words = splitWords(query);
if (words === null) {
field.val("");
return null;
}
return [query, words];
}
function splitWords(query) {
var split = query.split(/\s+/);
var words = [];
for (var i = 0; i < split.length; ++i) {
var segment = split[i];
if (stringStartsWith(segment, '"') || stringStartsWith(segment, "'")) {
segment = segment.substring(1);
}
if (stringEndsWith(segment, '"') || stringEndsWith(segment, "'")) {
segment = segment.substring(0, segment.length-1);
}
if (segment.length > 0) {
words.push(segment.toLowerCase());
}
}
if (words.length === 0) {
words = null;
}
return words;
}
function stringStartsWith(text, prefix) {
return (text.indexOf(prefix) === 0);
}
function stringEndsWith(text, suffix) {
return (text.substr(-suffix.length) === suffix);
}
function stopSearch(field) {
$("#wh-search-results").empty();
var pane = $("#wh-search-pane");
pane.scrollTop(0);
var words = pane.removeData("whSearchedWords2");
if (words !== null) {
unhighlightSearchedWords();
}
clearSearchState();
}
function highlightSearchedWords(words) {
$("#wh-content").highlight(words, 
{ caseSensitive: false, highlightWord: true,
className: "wh-highlighted" });
}
function unhighlightSearchedWords() {
$("#wh-content").unhighlight({ className: "wh-highlighted" });
}
function doSearch(query, words) {
var searchResults = $("#wh-search-results");
var searchedWords = [];
var resultIndices = findWords(words, searchedWords);
displaySearchResults(query, words, searchedWords, 
resultIndices, searchResults);
saveSearchState(query, words, searchedWords, resultIndices);
}
function displaySearchResults(query, words, searchedWords, 
resultIndices, searchResults) {
searchResults.empty();
if (resultIndices === null || resultIndices.length === 0) {
searchResults.append(searchResultHeader(0, words));
return;
}
searchResults.append(searchResultHeader(resultIndices.length, words));
searchResults.append(searchResultList(resultIndices));
var resultLinks = $("#wh-search-result-list a");
highlightSearchedWordsImmediately(searchedWords, resultLinks);
var currentPage = trimFragment(window.location.href);
resultLinks.click(function (event) {
if (this.href === currentPage) {
event.preventDefault();
} 
});
}
function findWords(words, searchedWords) {
var pageCount = wh.search_baseNameList.length;
var hits = new Array(pageCount);
var i, j, k;
for (i = 0; i < pageCount; ++i) {
hits[i] = 0;
}
var wordCount = words.length;
for (i = 0; i < wordCount; ++i) {
var indices;
var fallback = true;
var word = words[i];
if (wh.search_stemmer !== null && 
word.search(/^[-+]?\d/) < 0) { 
var stem = wh.search_stemmer.stemWord(word);
if (stem != word) {
indices = wh.search_wordMap[stem];
if (indices !== undefined) {
fallback = false;
searchedWords.push(stem);
if (word.indexOf(stem) < 0) {
searchedWords.push(word);
}
}
}
}
if (fallback) {
indices = wh.search_wordMap[word];
searchedWords.push(word);
}
if (indices !== undefined) {
var hitPageCount = 0;
var indexCount = indices.length;
for (j = 0; j < indexCount; ++j) {
var index = indices[j];
if ($.isArray(index)) {
hitPageCount += index.length;
} else {
++hitPageCount;
}
}
var unit = 100.0 * ((pageCount - hitPageCount + 1)/pageCount);
for (j = 0; j < indexCount; ++j) {
var index = indices[j];
if ($.isArray(index)) {
var hitIncr = 
10000.0 + (((indexCount - j)/indexCount) * unit);
for (k = 0; k < index.length; ++k) {
hits[index[k]] += hitIncr;
}
} else {
hits[index] += 
10000.0 + (((indexCount - j)/indexCount) * unit);
}
}
} else {
return null;
}
}
var resultIndices = [];
var minHitValue = 10000.0 * wordCount; 
for (i = 0; i < pageCount; ++i) {
if (hits[i] > minHitValue) {
resultIndices.push(i);
}
}
if (resultIndices.length === 0) {
resultIndices = null;
} else if (resultIndices.length > 1) {
function comparePageIndices(i, j) {
var delta = hits[j] - hits[i];
if (delta !== 0) {
return delta;
} else {
return (i - j);
}
};
resultIndices.sort(comparePageIndices);
}
return resultIndices;
}
function searchResultHeader(resultCount, words) {
var header = $("<div id='wh-search-result-header'></div>");
var message;
switch (resultCount) {
case 0:
message = msg("No results found for %W%.");
break;
case 1:
message = msg("1 result found for %W%.");
break;
default:
message = 
msg("%N% results found for %W%.").replace(new RegExp("%N%", "g"),
resultCount.toString());
}
message = escapeHTML(message);
var spans = "";
for (var i = 0; i < words.length; ++i) {
if (i > 0) {
spans += " ";
}
spans += "<span class='wh-highlighted'>";
spans += escapeHTML(words[i]);
spans += "</span>";
}
header.html(message.replace(new RegExp("%W%", "g"), spans));
return header;
}
function escapeHTML(text) {
return text.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;");
}
function searchResultList(resultIndices) {
var list = $("<ul id='wh-search-result-list'></ul>");
var resultCount = resultIndices.length;
for (var i = 0; i < resultCount; ++i) {
var index = resultIndices[i];
var item = $("<li class='wh-search-result-item'></li>");
if ((i % 2) === 1) {
item.addClass("wh-odd-item");
}
list.append(item);
var link = $("<a></a>");
link.attr("href", wh.search_baseNameList[index]);
link.attr("draggable", "false");
link.html(wh.search_titleList[index]);
item.append(link);
}
return list;
}
function highlightSearchedWordsImmediately(searchedWords, resultLinks) {
var currentPage = trimFragment(window.location.href);
var resultLink = resultLinks.filter(function () {
return this.href === currentPage;
});
if (resultLink.length === 1) {
$("#wh-search-pane").data("whSearchedWords2", searchedWords);
var highlightToggle = $("#wh-search-highlight");
if (highlightToggle.length === 0 || highlightToggle.toggle("check")) {
highlightSearchedWords(searchedWords);
}
}
}
function saveSearchState(query, words, searchedWords, resultIndices) {
storageSet("whSearchQuery", query);
storageSet("whSearchedWords", words.join(" "));
storageSet("whSearchedWords2", searchedWords.join(" "));
storageSet("whSearchResults", 
((resultIndices === null || resultIndices.length === 0)? 
"" : resultIndices.join(",")));
}
function clearSearchState() {
storageDelete("whSearchQuery");
storageDelete("whSearchedWords");
storageDelete("whSearchedWords2");
storageDelete("whSearchResults");
}
function restoreSearchState(field) {
var query = storageGet("whSearchQuery");
if (query) {
var words = storageGet("whSearchedWords");
var searchedWords = storageGet("whSearchedWords2");
var list = storageGet("whSearchResults");
if (query.length > 0 && 
words !== undefined && 
searchedWords !== undefined && 
list !== undefined) {
words = words.split(" ");
if (words.length > 0) {
searchedWords = searchedWords.split(" ");
if (searchedWords.length > 0) {
var resultIndices = [];
if (list.length > 0) {
var items = list.split(",");
var count = items.length;
for (var i = 0; i < count; ++i) {
var index = parseInt(items[i], 10);
if (index >= 0) {
resultIndices.push(index);
} else {
return;
}
}
}
field.val(query);
displaySearchResults(query, words, searchedWords,
resultIndices, $("#wh-search-results"));
}
}
}
}
}
function initContent() {
selectTOCEntry(window.location.href);
$("#wh-toc a[href], #wh-content a[href]").click(function () {
if (trimFragment(this.href) === trimFragment(window.location.href)) {
selectTOCEntry(this.href);
}
});
}
function trimFragment(href) {
var hash = href.lastIndexOf("#");
if (hash >= 0) {
return href.substring(0, hash);
} else {
return href;
}
}
function selectTOCEntry(url) {
var links = $("#wh-toc a");
links.removeClass("wh-toc-selected");
var selectable = links.filter(function () {
return (this.href === url);
});
var hash;
if (selectable.length === 0 && (hash = url.lastIndexOf("#")) >= 0) {
url = url.substring(0, hash);
selectable = links.filter(function () {
return (this.href === url);
});
}
if (selectable.length === 0) {
selectable = links.filter(function () {
return (trimFragment(this.href) === url);
});
}
if (selectable.length > 0) {
selectable = selectable.first();
selectable.addClass("wh-toc-selected");
var entry = selectable.parent("li");
$("#wh-toc").toc("showEntry", entry,  false);
var pane = $("#wh-toc-pane");
if (pane.is(":visible")) {
pane.removeData("whPendingScroll");
pane.scrollTop(entry.offset().top - pane.offset().top);
} else {
pane.data("whPendingScroll", { container: pane, component: entry });
}
}
}
function processPendingScroll(pane) {
var scroll = pane.data("whPendingScroll");
if (scroll !== undefined) {
pane.removeData("whPendingScroll");
scroll.container.scrollTop(scroll.component.offset().top - 
scroll.container.offset().top);
}
}
function layout(resizeEvent) {
var menu = $("#wh-menu");
if (menu.hasClass("wh-icon-close")) {
if (resizeEvent === null) {
closeNavigation();
} else if (window.matchMedia("(max-width: 575.98px)").matches) {
var top = menu.position().top;
top += menu.outerHeight( false);
var height = $("#wh-body").height() - top;
$("#wh-navigation").css("height", height + "px");
} else {
closeNavigation();
}
}
var h = $(window).height();
var pane = $("#wh-header");
if (pane.length > 0 && pane.is(":visible")) {
h -= pane.outerHeight( true);
}
pane = $("#wh-footer");
if (pane.length > 0 && pane.is(":visible")) {
h -= pane.outerHeight( true);
}
var body = $("#wh-body");
body.outerHeight(h,  true);
}
function scrollToFragment() {
var fragment = getFragment(window.location.href);
if (fragment !== null) {
fragment = fragment.replace(/\./g, "\\.");
var anchor = $(fragment);
if (anchor) {
var content = $("#wh-content");
content.scrollTop(anchor.offset().top - content.offset().top + 
content.scrollTop());
}
}
}
function getFragment(href) {
var hash = href.lastIndexOf("#");
if (hash >= 0) {
return href.substring(hash); 
} else {
return null;
}
}
 function initPage() {
initMenu();
initSeparator();
initNavigation();
initTOC();
var hasIndex = ($("#wh-index-container").length === 1);
var indexField = null;
if (hasIndex) {
indexField = $("#wh-index-field");
initIndex(indexField);
}
var searchField = $("#wh-search-field");
initSearch(searchField);
initContent();
$(window).resize(layout);
layout( null);
if (hasIndex) {
restoreIndexTerm(indexField);
}
restoreSearchState(searchField);
scrollToFragment();
}
function initNavigation() {
var indexTab = $("#wh-index-tab");
if ($("#wh-toc-tab > a").css("font-weight") > 
$("#wh-toc-tab").css("font-weight")) { 
$("#wh-toc-tab > a").text(msg("Contents"));
if (indexTab.length === 1) {
$("#wh-index-tab > a").text(msg("Index"));
}
$("#wh-search-tab > a").text(msg("Search"));
} else {
$("#wh-toc-tab").attr("title", msg("Contents"));
if (indexTab.length === 1) {
indexTab.attr("title", msg("Index"));
}
$("#wh-search-tab").attr("title", msg("Search"));
}
var index = 0;
var tabsState = storageGet("whTabsState");
if (tabsState) {
index = parseInt(tabsState);
}
$("#wh-tabs").tabs({ selected: index, onselect: tabSelected });
}
function tabSelected(index) {
var index = $("#wh-tabs").tabs("select");
storageSet("whTabsState", index);
var pane;
switch (index) {
case 0:
pane = $("#wh-toc-pane");
break;
case 1:
pane = $("#wh-index-pane");
if (pane.length === 1) {
$("#wh-index-field").focus();
break;
}
case 2:
pane = $("#wh-search-pane");
$("#wh-search-field").focus();
break;
}
processPendingScroll(pane);
}
function initTOC() {
var title = $("#wh-toc-title");
if (title.length === 1) {
title.text(msg("Contents"));
}
doInitTOC();
initTOCButtons();
}
function initTOCButtons() {
var toc = $("#wh-toc");
var button = $("#wh-toc-collapse-all");
button.attr("title", msg("Collapse All"))
.click(function (event) { 
event.preventDefault();
toc.toc("expandCollapseAll", false); 
});
button = $("#wh-toc-expand-all");
button.attr("title", msg("Expand All"))
.click(function (event) { 
event.preventDefault();
toc.toc("expandCollapseAll", true); 
});
button = $("#wh-toc-previous");
button.attr("title", msg("Previous Page"))
.click(function (event) { 
goTo(true);
});
button = $("#wh-toc-next");
button.attr("title", msg("Next Page"))
.click(function (event) { 
goTo(false);
});
button = $("#wh-toc-print");
button.attr("title", msg("Print Page"))
.click(function (event) { 
print();
});
}
function goTo(previous) {
var anchors = $("#wh-toc a[href]");
var currentPage = trimFragment(window.location.href);
var currentAnchor = anchors.filter(function (index) {
return (trimFragment(this.href) === currentPage);
});
var target = null;
if (currentAnchor.length > 0) {
if (previous) {
currentAnchor = currentAnchor.first();
} else {
currentAnchor = currentAnchor.last();
}
var index = anchors.index(currentAnchor);
if (index >= 0) {
if (previous) {
--index;
} else {
++index;
}
if (index >= 0 && index < anchors.length) {
target = anchors.get(index);
}
}
} else if (anchors.length > 0) {
if (previous) {
target = anchors.last().get(0);
} else {
target = anchors.first().get(0);
}
}
if (target !== null) {
window.location.href = trimFragment(target.href);
}
}
function print() {
var anchors = $("#wh-toc a[href]");
var currentPage = trimFragment(window.location.href);
var currentAnchor = anchors.filter(function (index) {
return (trimFragment(this.href) === currentPage);
});
if (currentAnchor.length > 0) {
currentAnchor = currentAnchor.first();
var currenTitle = currentAnchor.text();
var popup = 
window.open("", "whPrint", 
"left=0,top=0,height=400,width=600" +
",resizable=yes,scrollbars=yes,status=yes");
if (popup) {
var doc = popup.document;
doc.open();
doc.write("<html><head><title>");
doc.write(escapeHTML(currenTitle));
doc.write("</title>");
doc.write("<base href=\"");
doc.write(currentPage);
doc.write("\">");
$("head > link[rel='stylesheet'][href], head > style").each(
function (index) {
if (!$(this).is("link") ||
$(this).attr("href").indexOf("_wh/wh.css") < 0) {
var div = $("<div></div>").append($(this).clone());
doc.write(div.html());
}
});
doc.write("</head><body>");
doc.write($("#wh-content").html());
doc.write("</body></html>");
doc.close();
popup.setTimeout(function() { popup.print(); popup.close(); }, 250);
}
}
}
function populateIndex() {
var indexPane = $("#wh-index-pane");
var list = $("<ul id='wh-index'></ul>");
indexPane.append(list);
if (typeof index_entries !== "undefined") {
var count = index_entries.length;
for (var i = 0; i < count; ++i) {
addIndexEntry(index_entries[i], list);
}
index_entries = undefined; 
}
}
function addIndexEntry(entry, list) {
var item = $("<li class='wh-index-entry'></li>");
list.append(item);
var term = $("<span class='wh-index-term'></span>");
term.html(entry.term);
item.append(term);
var i;
var terms = entry.see;
if (terms !== undefined) {
var seeList = $("<ul class='wh-index-entries'></ul>");
item.append(seeList);
addSee("see", terms, seeList);
} else {
var hrefs = entry.anchor;
if (hrefs !== undefined) {
var j = 0;
var hrefCount = hrefs.length;
for (i = 0; i < hrefCount; i += 2) {
var href = hrefs[i];
var href2 = hrefs[i+1];
item.append("\n");
var link = $("<a class='wh-index-anchor'></a>");
link.attr("href", href);
link.attr("draggable", "false");
++j;
link.text("[" + j + "]");
item.append(link);
if (href2 !== null) {
item.append("&#8212;");
var link2 = $("<a class='wh-index-anchor'></a>");
link2.attr("href", href2);
link2.attr("draggable", "false");
++j;
link2.text("[" + j + "]");
item.append(link2);
}
}
}
var entries = entry.entry;
terms = entry.seeAlso;
if (entries !== undefined || terms !== undefined) {
var subList = $("<ul class='wh-index-entries'></ul>");
item.append(subList);
if (entries !== undefined) {
var entryCount = entries.length;
for (i = 0; i < entryCount; ++i) {
addIndexEntry(entries[i], subList);
}
}
if (terms !== undefined) {
addSee("see-also", terms, subList);
}
}
}
}
function addSee(refType, terms, list) {
var termCount = terms.length;
for (var i = 0; i < termCount; ++i) {
var term = terms[i];
var item = $("<li></li>");
item.addClass("wh-index-" + refType);
item.html("\n" + term);
list.append(item);
var see = $("<span class='wh-index-ref-type'></span>");
see.text((refType === "see")? msg("See") : msg("See also"));
see.prependTo(item);
}
}
function initIndex(field) {
var title = $("#wh-index-title");
if (title.length === 1) {
title.text(msg("Index"));
}
populateIndex();
$("#wh-index > li:odd").addClass("wh-odd-item");
field.attr("autocomplete", "off").attr("spellcheck", "false")
.attr("placeholder", msg("term"));
var allItems = $("#wh-index li");
field.keyup(function (event) {
switch (event.which) {
case fieldKeys.ENTER:
goSuggestedIndexEntry(field, allItems);
break;
case fieldKeys.ESCAPE:
cancelSuggestIndexEntry(field, allItems);
break;
case fieldKeys.UP:
autocompleteIndexEntry(field, allItems, true);
break;
case fieldKeys.DOWN:
autocompleteIndexEntry(field, allItems, false);
break;
default:
suggestIndexEntry(field, allItems);
}
});
$("#wh-go-page").attr("title", msg("Go"))
.click(function (event) {
goSuggestedIndexEntry(field, allItems);
});
$("#wh-index a.wh-index-anchor").click(function (event) {
selectIndexEntry(this, field, allItems);
});
}
var indexEntries = null;
function suggestIndexEntry(field, allItems) {
cancelSuggestIndexItem(field, allItems);
var prefix = normalizeTerm(field.val());
if (prefix.length > 0) {
if (indexEntries === null) {
initIndexEntries();
}
var entryCount = indexEntries.length;
for (var i = 0; i < entryCount; i += 2) {
if (indexEntries[i].indexOf(prefix) === 0) {
suggestIndexItem(indexEntries[i+1]);
break;
}
}
}
}
function normalizeTerm(term) {
if (term.length > 0) {
term = term.replace(/^\s+|\s+$/g, "")
.replace(/\s{2,}/g, " ")
.toLowerCase();
}
return term;
}
function initIndexEntries() {
indexEntries = [];
collectIndexEntries($("#wh-index > li"), null, indexEntries);
}
function collectIndexEntries(items, parentTerm, list) {
items.each(function () {
var termSpan = $(this).children("span.wh-index-term");
if (termSpan.length === 1) {
var term = normalizeTerm(termSpan.text());
if (parentTerm !== null) {
term = parentTerm + " " + term;
}
list.push(term);
list.push(this);
var subItems = $(this).children("ul.wh-index-entries")
.children("li.wh-index-entry");
if (subItems.length > 0) {
collectIndexEntries(subItems, term, list);
}
}
});
}
function suggestIndexItem(item) {
var suggest = $(item);
suggest.addClass("wh-suggested-item");
var pane = $("#wh-index-pane");
if (pane.is(":visible")) {
pane.removeData("whPendingScroll");
pane.scrollTop(suggest.offset().top - pane.offset().top);
} else {
pane.data("whPendingScroll", { container: pane, component: suggest });
}
}
function cancelSuggestIndexEntry(field, allItems) {
field.val("");
cancelSuggestIndexItem(field, allItems);
}
function cancelSuggestIndexItem(field, allItems) {
storageDelete("whIndexTerm");
allItems.removeClass("wh-suggested-item");
var pane = $("#wh-index-pane");
pane.scrollTop(0);
pane.removeData("whPendingScroll");
}
function goSuggestedIndexEntry(field, allItems) {
var item = allItems.filter(".wh-suggested-item");
if (item.length === 1) {
var anchors = item.children("a.wh-index-anchor");
if (anchors.length > 0) {
var anchor = anchors.get(0);
selectIndexEntry(anchor, field, allItems);
window.location.href = anchor.href;
}
}
}
function autocompleteIndexEntry(field, allItems, previous) {
cancelSuggestIndexItem(field, allItems);
var term = null;
var item = null;
if (indexEntries === null) {
initIndexEntries();
}
var prefix = normalizeTerm(field.val());
if (prefix.length > 0) {
var entryCount = indexEntries.length;
var i;
for (i = 0; i < entryCount; i += 2) {
if (indexEntries[i] === prefix) {
var index;
if (previous) {
index = i - 2;
} else {
index = i + 2;
}
if (index >= 0 && index+1 < entryCount) {
term = indexEntries[index];
item = indexEntries[index+1];
} else {
term = indexEntries[i];
item = indexEntries[i+1];
}
break;
}
}
if (item === null) {
for (i = 0; i < entryCount; i += 2) {
if (indexEntries[i].indexOf(prefix) === 0) {
term = indexEntries[i];
item = indexEntries[i+1];
break;
}
}
}
} else {
term = indexEntries[0];
item = indexEntries[1];
}
if (item !== null) {
field.val(term);
suggestIndexItem(item);
}
}
function selectIndexEntry(anchor, field, allItems) {
var term = null;
var item = $(anchor).parent().get(0);
if (indexEntries === null) {
initIndexEntries();
}
var entryCount = indexEntries.length;
for (var i = 0; i < entryCount; i += 2) {
if (indexEntries[i+1] === item) { 
term = indexEntries[i];
break;
}
}
if (term === null) {
storageDelete("whIndexTerm");
} else {
storageSet("whIndexTerm", term);
field.val(term);
allItems.removeClass("wh-suggested-item");
$(item).addClass("wh-suggested-item");
}
}
function restoreIndexTerm(field) {
var term = storageGet("whIndexTerm");
if (term) {
field.val(term);
if (indexEntries === null) {
initIndexEntries();
}
var entryCount = indexEntries.length;
for (var i = 0; i < entryCount; i += 2) {
if (indexEntries[i] === term) {
suggestIndexItem(indexEntries[i+1]);
break;
}
}
}
}
function initSearch(field) {
var title = $("#wh-search-title");
if (title.length === 1) {
title.text(msg("Search"));
}
field.attr("autocomplete", "off").attr("spellcheck", "false")
.attr("placeholder", msg("word"));
field.keyup(function (event) {
switch (event.which) {
case fieldKeys.ENTER:
search(field);
break;
case fieldKeys.ESCAPE:
cancelSearch(field);
break;
}
});
$("#wh-do-search").attr("title", msg("Search"))
.click(function (event) {
search(field);
});
$("#wh-cancel-search").attr("title", msg("Stop searching"))
.click(function (event) { 
cancelSearch(field);
});
var toggle = $("#wh-search-highlight");
toggle.attr("title", msg("Toggle search result highlighting"));
toggle.toggle({ checked: storageGet("whHighlightOff")? false : true,
ontoggle: toggleHighlight });
}
function toggleHighlight(checked) {
if (checked) {
storageDelete("whHighlightOff");
} else {
storageSet("whHighlightOff", "1");
}
var words = $("#wh-search-pane").data("whSearchedWords2");
if (words !== undefined) {
if (checked) {
highlightSearchedWords(words);
} else {
unhighlightSearchedWords();
}
}
}
function search(field) {
var pair = startSearch(field);
if (pair === null) {
return;
}
doSearch(pair[0], pair[1]);
}
function cancelSearch(field) {
field.val("");
stopSearch(field);
}
return {
initPage: initPage,
}
})();
$(document).ready(function() {
wh.initPage();
$("#wh-body").css({ "visibility": "visible", "opacity": "1" }); 
});
