#!/usr/bin/env bash
echo "***********************************************************************"
echo "     基础WEB项目初始化-SRE子应用（必要信息）       "
echo "                                               "
echo "     *使用前必读：                              "
echo "     *1、本项目使用自研 sre-menu 组件（使用文档地址）"
echo "       https://docs.corp.kuaishou.com/d/home/fcAAh3_uCMQwaKD4ddBl2ZDpC"
echo "     *2、需要使用公司npm registry（组件存储用的公司仓库）"
echo "       https://npm.corp.kuaishou.com/          "
echo "                                               "
echo "     *必要初始化信息如下：                        "
echo "     1、输入项目名称（请使用驼峰命名法）           "
echo "     2、输入路径名称（项目名的驼峰改为中划线即可）  "
echo "     3、输入中文名称                            "
echo "     4、输入平台 KIM 联系人                     "
echo "     5、输入TOKEN（ 请KIM @zhanggaozhen03开通 ）"
echo "                                               "
echo "*************************************************************************"
echo "输入项目名称（请使用驼峰命名法）："
read projectName
echo "输入路径名称（请使用中划线 '-'【项目名的驼峰改为中划线即可】）："
read path
echo "输入中文名称："
read cnName
echo "输入平台 KIM 联系人："
read kimUser
echo "输入TOKEN（ 请KIM @zhanggaozhen03开通 ）："
read token

echo ""
echo "请确认初始化信息："
echo "项目名 ${projectName}"
echo "路径名 ${path}"
echo "中文名 ${cnName}"
echo "平台KIM 联系人 ${kimUser}"
echo "TOKEN 信息 ${token}"
echo ""

echo "是否确认 ( Y | yes | y ) ? "
read input

if [ "Y" = "$input" -o "yes" = "$input" -o "y" = "$input" ]; then
  echo "初始化中..."

  # +++++ projectName 替换 +++++
  # 替换 src/router/index.js 文件 projectName
  sed -i '.bak' "s/{{projectName}}/${projectName}/g" `pwd`/src/router/index.js
  # 替换 src/main.js 文件 projectName
  sed -i '.bak' "s/{{projectName}}/${projectName}/g" `pwd`/src/main.js
  # 替换 vue.config.js 文件 projectName
  sed -i '.bak' "s/{{projectName}}/${projectName}/g" `pwd`/vue.config.js

  # +++++ path 替换 +++++
  # 替换 public/index.html 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/public/index.html
  # 替换 src/components/promise/no-promise.vue 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/src/components/promise/no-promise.vue
  # 替换 src/router/index.js 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/src/router/index.js
  # 替换 src/style/main.scss 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/src/style/main.scss
  # 替换 .env.development.local 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/.env.development.local
  # 替换 .env.production.local 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/.env.production.local
  # 替换 app.js 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/app.js
  # 替换 package.json 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/package.json
  # 替换 server.sh 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/server.sh
  # 替换 vue.config.js 文件 path
  sed -i '.bak' "s/{{path}}/${path}/g" `pwd`/vue.config.js

  # +++++ cnName 替换 +++++
  # 替换 public/index.html 文件 cnName
  sed -i '.bak' "s/{{cnName}}/${cnName}/g" `pwd`/public/index.html
  # 替换 src/pages/index.vue 文件 cnName
  sed -i '.bak' "s/{{cnName}}/${cnName}/g" `pwd`/src/pages/index.vue

  # +++++ kimUser 替换 +++++
  # 替换 src/pages/index.vue 文件 kimUser
  sed -i '.bak' "s/{{kimUser}}/${kimUser}/g" `pwd`/src/pages/index.vue

  # +++++ token 替换 +++++
  # 替换 src/pages/index.vue 文件 token
  sed -i '.bak' "s/{{token}}/${token}/g" `pwd`/src/pages/index.vue

  echo "初始化完成."

  echo ""
  echo "******备份文件列表 ( .bak files )*******"
  find . -name "*.bak"
  echo "**************************************"

  echo "是否删除 .bak 文件 ( Y | yes | y ) ? "
  read isdel
  if [ "Y" = "$isdel" -o "yes" = "$isdel" -o "y" = "$isdel" ]; then
    find . -name "*.bak" | xargs rm
    echo "备份文件已删除完成！"
  fi
  else
    echo "初始化失败，已退出！"
fi

echo ""
echo "脚本执行结束 ( exit 0 ) ..."
echo ""
exit 0