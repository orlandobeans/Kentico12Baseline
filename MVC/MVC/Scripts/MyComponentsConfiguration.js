﻿(function (pageBuilder) {
    var richTextEditor = pageBuilder.richTextEditor = pageBuilder.richTextEditor || {};
    var configurations = richTextEditor.configurations = richTextEditor.configurations || {};

    // Ensure Shared Toolbar Exists, add some styling and remove the quick insert.
    if ($("body > .FroalaSharedToolbarHolder").length === 0) {
        $("body")
            .prepend("<div class='FroalaSharedToolbarSpacer' style='width: 100%;'></div>")
            .prepend("<div class='FroalaSharedToolbarHolder' style='position: fixed; top: 0; left: 0; right: 0; z-index: 2147483640;'></div>")
            .prepend("<style>.fr-quick-insert {display: none;} .fr-toolbar.fr-top { border-top-right-radius: 0;border-top-left-radius: 0;border-bottom: 1px solid lightgrey;}</style>");
    }

    function CheckTriggerHide(editor) {
        setTimeout(function () {
            if ($(editor.$tb).parent().find(document.activeElement).length === 0 && $(editor.$el).parent().find(document.activeElement).length === 0 && $(document.activeElement).closest(".fr-popup, kentico-modal-dialog").length === 0) {
                editor.$tb.hide();
                $("body .FroalaSharedToolbarSpacer").css({ 'height': $("body .FroalaSharedToolbarHolder").height() + 85 + 'px' });
            }
        }, 50);
    }

    // Base configuration for Shared toolbar
    var BaseConfiguration = {
        toolbarVisibleWithoutSelection: true,
        toolbarInline: false,
        editorClass: "froala-wysiwyg",
        iframe: false,
        paragraphFormatSelection: true,
        fontAwesomeTemplate: '<span class="fa fa-[NAME] fr-deletable" aria-hidden="true">&nbsp;</span>',
        events: {
            initialized: function () {
                // Custom logic to take Inline toolbar and move it to a shared location, but not make it a shared toolbar
                var editor = this;

                // Add new unique Toolbar to shared toolbar
                var NewContainer = $("<div class='FroalaToolBar_" + $(this.el).closest(".ktc-widget").attr("id") + "'></div>");
                $("body > .FroalaSharedToolbarHolder").append(NewContainer);

                // Move the inline editor to this location
                $(editor.$tb).appendTo(NewContainer);

                // Enforce Blur and Focus triggers here as the Froala focus and blur do not trigger properly when switching between editors
                $(editor.$el).focus(function () {
                    editor.$tb.show();
                    // 85 = 50 for second row of tools (if one is not already expanded) + 35 for widget header height
                    $("body .FroalaSharedToolbarSpacer").css({
                        'height': editor.$tb.height() + 35 + ($(".fr-more-toolbar.fr-expanded", editor.$tb).length > 0 ? 0 : 50) + 'px'
                    });
                });
                $(editor.$el).blur(function () {
                    CheckTriggerHide(editor);
                });
                $(editor.$tb).focusout(function () {
                    CheckTriggerHide(editor);
                });

                // Hide toolbar
                editor.$tb.hide();
            }
        }
    };

    // Overrides the default configuration of widgets (i.e. when no configuration is specified)
    configurations["default"] = $.extend({}, BaseConfiguration, {
    /*
        paragraphStyles: {
         'sample-class' : 'Sample Style'
        },
        htmlUntouched: true,
        */
    });

    // Defines a new configuration for a simple toolbar with only formatting options and disables the inline design of the toolbar
        configurations["basic"] = $.extend({}, BaseConfiguration, {
        toolbarButtons: ['paragraphFormat', '|', 'bold', 'italic', 'underline', '|', 'align', 'formatOL', 'formatUL']
    });

})(window.kentico.pageBuilder);