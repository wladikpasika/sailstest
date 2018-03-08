$( ".form-horizontal .btn.btn-danger" ).click(function(e){
  event.preventDefault();
  return $('.form-horizontal').get(0).reset()});
