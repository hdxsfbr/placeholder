;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "placeHolder",
        defaults = {
            defaultText: "Enter some text here..."
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    //private methods

    /**
     * This event handler is called when the focus event is called on the input field. It
     * sets the color of the text to lightgrey, positions the caret to the begining of the field,
     * and unbinds itself from the element.
     */
    var onFocusEventHandler = function () {
        var $this = $(this);

        $this.css({color: "lightgrey"});
        // using closure so "this" can be referenced from the setTimeout function
        var that = this;

        // need to delay the call to setSelectionRange so it happens after the browser's default behaviour
        setTimeout(function () {
            that.setSelectionRange(0, 0);
        }, 1);
        $this.unbind("focus");
    };

    /**
     * This event handler is called when something is typed into the input field. It sets the text
     * color to black, removes the place holder text and unbinds itself from the element.
     */
    var onKeyupEventHandler = function () {
        var $this = $(this);
        $this.css({color: "black"});
        var val = $this.val();
        console.log(val);
        val = val.slice(0, val.indexOf($(this).data("placeholder")));
        $this.val(val);
        $this.unbind("keyup");
    };

    /**
     * This event handler is called the the onblur event is triggered on the input field. It re-initializes
     * the placeholder behavior for the case where the user gave and removed focus to the element
     * without typing anything.
     */
    var onBlurEventHandler = function () {
        var $this = $(this);
        if($this.val() === $this.data("placeholder")) {
            $this.unbind("keyup");
            $this.unbind("focus");
            $this.unbind("blur");
            initPlaceholder.call(this, [$this.data("placeholder")]);
        }
    };

    /**
     * This function initializes the placeholder behavior. If the element is a text field it sets the data attribute
     * for the placeholder text, it sets the color of the text to grey and it sets up the event listeners.
     */
    var initPlaceholder = function(defaultText) {
        var $this = $(this);
        if($this.is("input:text")){
            if(!$this.data("placeholder")) {
                if(!$this.val()) {
                    $this.val(defaultText)
                }
                $this.data("placeholder", $this.val());
            }
            $this.css({color: "grey"});

            $this.focus(onFocusEventHandler);
            $this.keyup(onKeyupEventHandler);
            $this.blur(onBlurEventHandler);
        }
    };

    Plugin.prototype = {
        init: function() {
            initPlaceholder.call(this.element, [this.options.defaultText]);

        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {

        return this.each(function () {

            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };


})( jQuery, window, document );


