$(document).on('turbolinks:load', function() {
  function buildHTML(message){
     image = (message.image === null) ? "" : `<img src="${message.image}" class="lower-message__image">`
        html = `
          <div class="chat-main__body-list" data-message-id="${message.id}">
            <div class="chat-main__message-name">${message.user_name}</div>
            <div class="chat-main__message-time">${message.created_at}</div>
          </div>
          <div class="chat-main__message-body">
            <p class="lower-message__content">${message.content}</p>
          </div>
          ${image}`
        return html
    };
    // メッセージ送信後の処理
  $('.send-btn').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
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
      $('.chat-main__body').append(html);
      $('.send-btn')[0].reset();
    })
    .fail(function() {
      alert('error');
    })
    .always(function() {
      $('.send').prop('disabled', false);
    });
    $('.chat-main__body').animate({scrollTop: $('.chat-main__body')[0].scrollHeight});
  });
  // 自動更新機能
  var interval = setInterval(function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)) {
      var last_message_id = $('.chat-main__body-list:last').data('message-id') || 0;
    $.ajax({
      url: location.href,
      type: 'GET',
      data: {
        id: last_message_id
      },
      dataType: 'json'
    })
    .done(function(data){
      var insertHTML = '';
      data.forEach(function(message) {
        insertHTML += buildHTML(message);
      });
    $('.chat-main__body').append(insertHTML);
    $('.chat-main__body').animate({scrollTop: $('.chat-main__body')[0].scrollHeight});
    })
    .fail(function(data){
      alert('error');
    })
  } else {
    clearInterval(interval);
  }}, 5000);

});
