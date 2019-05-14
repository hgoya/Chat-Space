$(function(){
  var search_list = $("#user_search-result");

  function matchUser(user) {
    var html =
    `<div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${ user.user_name }</p>
      <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${ user.user_name }">追加</a>
    </div>`
    search_list.append(html);
    return html
  }

  function noMatchUser(user) {
    var html =
    `<div class="chat-group-user clearfix">
      <p class="chat-group-user__name">${ user }</p>
    </div>`
    search_list.append(html);
  }

  var member_list = $("#chat-group-users");

  function addUserToGroup(user_id, name) {
    var html =
    `<div class="chat-group-user clearfix js-chat-member" id="chat-group-user-${ user_id }">
      <input name="group[user_ids][]" type="hidden" value="${ user_id }">
      <p class="chat-group-user__name">${ name }</p>
      <a class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn">削除</a>
    </div>`
    member_list.append(html);
  }

  $("#user-search-field").on("keyup", function() {
    var input = $("#user-search-field").val();
    var group_id = $(".chat__group_id").val();
    $.ajax({
      url: '/users',
      type: 'GET',
      data: { keyword: input, group_id: group_id },
      dataType: 'json'
    })
    .done(function(user) {
      $("#user_search-result").empty();
        if (user.length !== 0) {
          user.forEach(function(user) {
          matchUser(user);
          });
        }
        else {
          noMatchUser("一致するユーザーはいません。")
        }
    })
    .fail(function(user) {
      alert("error");
    })
  });

    $(document).on("click", ".user-search-add", function() {
      var user_id = $(this).data("user-id");
      var name = $(this).data("user-name");
      addUserToGroup(user_id, name);
      $(this).parent().remove();
    });

    $(document).on("click", ".user-search-remove", function() {
      $(this).parent().remove();
    });
});
