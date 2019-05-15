class UsersController < ApplicationController
  
  def index
    # groupのidを取得
    if params[:group_id].present?
      @group = Group.find(params[:group_id])
      # groupに所属しているuserのidを配列で取得
      @ids = @group.users.ids
      @users = User.where.not(id: @ids).where('(name LIKE(?)) and (id != ?)', "%#{params[:keyword]}%", "#{current_user.id}")
    else
      @users = User.where('(name LIKE(?)) and (id != ?)', "%#{params[:keyword]}%", "#{current_user.id}")
    end
    respond_to do |format|
      format.json
    end
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end

end
