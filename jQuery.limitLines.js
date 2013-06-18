/**
 * jQuery.limitLines.js
 *
 * A plugin to limit the lines of contenteditable div
 *
 *
 * @usage
 * $('div').limitLine({limitLines: n})
 *
 * @license MIT
 * @author Kenny.SW Lee (kswlee@gmail.com)
 * @version 1.0.0 2013-06-18
 */

(function($, doc) {
	$.fn.lineHeight = function() {
		if (this.length <= 0) return 0;

		var clone = $(this[0]).clone().empty().appendTo($('body')).html('&nbsp;');
		var baseheight = clone.height();

		clone.html('&nbsp;<br>&nbsp;'); 
		var lineheight = clone.height() - baseheight;
		clone.remove();
		return lineheight;
	};

	$.fn.limitLine = function(option) {		
		return this.each(function(){
			$this = $(this);
			var lineHeight = $this.lineHeight();
			var limitHeight = lineHeight;
			if (option && option.limitLines) limitHeight = limitHeight * option.limitLines;		

			// handler duplicated event binding
			if ($this.data('limitHandler') !== undefined) $this.off('input', $this.data('limitHandler'));					
			
			var disableDetect = false;
			var _limitHandler = function(e) { 
				if ($this.height() <= limitHeight) {
					return;
				}

				if (disableDetect) return;			
				disableDetect = true;

				var rect = { 
					leftTop: {x: $this.offset().left + 2, y: $this.offset().top + lineHeight / 2}, 
					bottomRight: {x: $this.offset().left + $this.width() - 2, y: $this.offset().top + limitHeight - lineHeight / 2}
				};
				var rangeStart = doc.caretRangeFromPoint(rect.leftTop.x, rect.leftTop.y);
				var rangeEnd = doc.caretRangeFromPoint(rect.bottomRight.x, rect.bottomRight.y);

				var range = doc.createRange();
				range.setStart(rangeStart.startContainer, rangeStart.startOffset);
				range.setEnd(rangeEnd.startContainer, rangeEnd.startOffset);
				
				var html = $('<div>').append($(range.cloneContents())).html();
				
				doc.execCommand('selectAll');
				doc.execCommand('insertHTML', false, html);

				disableDetect = false;
			};
			$this.data('limitHandler', _limitHandler).on('input', _limitHandler);
		});
	};
}($ || jQuery, document));