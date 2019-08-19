$(function() {
    //
    // Code for text highlighting
    // courtesy of https://markjs.io/
    var mark = function() {  
        // Read the keyword
        var keyword = $("input[name='keyword']").val();
        var options = {}; // don't delete this line
        // Remove previous marked elements and mark
        // the new keyword inside the context
        $(".context").unmark({
            done: function() {
                $(".context").mark(keyword, options);
            }
        });
    };
    $("input[name='keyword']").on("input", mark);
  
    //
    // Code for accordian expansion
    //
    var icons = {
      header: "ui-icon-caret-1-s",
      activeHeader: "ui-icon-caret-1-w"
    };
  
    $( "#accordion" ).accordion({
      icons: icons
    });
  
    $( "#toggle" ).button().on( "click", function() {
      if ( $( "#accordion" ).accordion( "option", "icons" ) ) {
        $( "#accordion" ).accordion( "option", "icons", null );
      } else {
        $( "#accordion" ).accordion( "option", "icons", icons );
      }
    });
});
