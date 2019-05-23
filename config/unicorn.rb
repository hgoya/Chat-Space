# app_path = File.expand_path('../../../', __FILE__)

# worker_processes 1

# working_directory "#{app_path}/current"
# listen "#{app_path}/shared/tmp/sockets/unicorn.sock"
# pid "#{app_path}/shared/tmp/pids/unicorn.pid"
# stderr_path "#{app_path}/shared/log/unicorn.stderr.log"
# stdout_path "#{app_path}/shared/log/unicorn.stdout.log"

# listen 3000
# timeout 60

# preload_app true
# GC.respond_to?(:copy_on_write_friendly=) && GC.copy_on_write_friendly = true

# check_client_connection false

# run_once = true

# before_fork do |server, worker|
#   defined?(ActiveRecord::Base) &&
#     ActiveRecord::Base.connection.disconnect!

#   if run_once
#     run_once = false # prevent from firing again
#   end

#   old_pid = "#{server.config[:pid]}.oldbin"
#   if File.exist?(old_pid) && server.pid != old_pid
#     begin
#       sig = (worker.nr + 1) >= server.worker_processes ? :QUIT : :TTOU
#       Process.kill(sig, File.read(old_pid).to_i)
#     rescue Errno::ENOENT, Errno::ESRCH => e
#       logger.error e
#     end
#   end
# end

# after_fork do |_server, _worker|
#   defined?(ActiveRecord::Base) && ActiveRecord::Base.establish_connection
# end

rails_root = File.expand_path('../../', __FILE__)

worker_processes 2
working_directory rails_root

listen "#{rails_root}/tmp/sockets/unicorn.sock"
pid "#{rails_root}/tmp/pids/unicorn.pid"

before_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
    Process.kill 'QUIT', Process.pid
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to send QUIT'
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end

stderr_path "#{rails_root}/log/unicorn_error.log"
stdout_path "#{rails_root}/log/unicorn.log"
