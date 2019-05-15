$(function(){
    function buildHTML(message){
      image = (message.image === null) ? "" : `<img src="${message.image}" class="lower-message__image">`
        var html =
        `<div class="message" data-message-id=${message.id}>
            <div class="upper-message">
              <div class="upper-message__user-name">
                ${message.user_name}
              </div>
              <div class="upper-message__date">
                ${message.date}
              </div>
            </div>
            <div class="lower-message">
              <p class="lower-message__content">
                ${message.content}
              </p>
            </div>
          </div>
          ${image}`
        return html;
    };
  $('#new_message').on('submit', function(){
      e.preventDefault();
      var formData = new FormData(this);
      var url = $(this).attr('action')
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.messages').append(html);
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');   
        $('.form__submit')[0].reset();
      })
      .fail(function(){
        alert('error');
      })
        return false;
      });
  // 自動更新
  var interval = setInterval(function() {
    if (window.location.href.match(/\/group\/\d+\/message/)) {
      var reloadMessages = function() {
        last_message_id = $('.chat-main__body-list:last').data('message-id') || 0;
    $.ajax({
      url: location.href,
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      var insertHTML = '';
      data.forEach(function(message) {
            insertHTML += buildHTML(message);
          });
        $('.chat-main__body').append(insertHTML);
        $('.chat-main__body').animate({scrollTop: $('.chat-main__body')[0].scrollHeight});
        })
        .fail(function() {
          alert('error');
        })
  } else {
    clearInterval(interval);
  }}, 5000);
  
});
