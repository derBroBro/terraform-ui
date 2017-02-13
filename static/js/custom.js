$.fn.editable.defaults.mode = 'inline';
$(document).ready(function() {
  $('.editable').editable();
});

$('a.delKey').click(function(){
  var url = $(this).attr('href-del');
  $.ajax({
    url: url,
    type: 'DELETE',
    success: function(result) {
      setTimeout(function(){
        console.log(result);
        location.reload();
      }, 500);
    }
  });
});
$('a.addKey').click(function(){
  var url = $(this).attr('href-put');
  var data = {};
  data.name = 'variables.'+$(this.parentNode.parentNode).find('.data-key').val();
  data.value = $(this.parentNode.parentNode).find('.data-val').val();

  $.post(url,
    data,
    function(result) {
      setTimeout(function(){
        console.log(result);
        location.reload();
      }, 500);
    });
});

$('a.post').click(function(){
  var $this = $(this);

  // Animate
  $this.button('loading');

  var url = $this.attr('href-post');
  $.post(url,
     { },
     function(data) {
       setTimeout(function(){
         console.log(data);
         location.reload();
       }, 500);
     }
  );
  return false;
});
$('a.post_val').click(function(){
  var $this = $(this);

  // Animate
  $this.button('loading');

  var url = $this.attr('href-post');
  var id = $this.attr('post-id');
  var post_val = $('#'+id).val();
  var data = {};
  data[id] = post_val;
  $.post(url,
     data,
     function(data) {
       console.log(data);
       setTimeout(function(){
         location.reload();
       }, 500);
     }
  );
  return false;
});
