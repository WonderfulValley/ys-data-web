#!/usr/bin/env bash


APP_NAME='notice-web'
# 该脚本用于在线上机器启动node服务

echo 'starting server'

# 这个是必须的, 启动脚本的目录是根目录
cd `dirname $0`
# 取得本机实际rsync执行路径
PM2_BIN_PATH=`which pm2`

echo ${PM2_BIN_PATH}

# TODO 增加首次判断逻辑
${PM2_BIN_PATH} info ${APP_NAME}-${port}
result=$?
if [ $result = 0 ]
then
  ${PM2_BIN_PATH} delete ${APP_NAME}-${port}
fi
${PM2_BIN_PATH} start app.js --name=${APP_NAME}-${port} --watch

#case $1 in
#  start)
#    ${PM2_BIN_PATH} start app.js --name=${APP_NAME}-${port} --watch ;;
#  reload)
#    ${PM2_BIN_PATH} stop ${APP_NAME}-${port}
#    ${PM2_BIN_PATH} start app.js --name=${APP_NAME}-${port} --watch ;;
#  *)
#  echo "start||reload"
#  exit 255;;
#esac