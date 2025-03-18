
## MacOS 安装包签名环境变量配置

新建文件 `packages/electron/build-config/.env` 输入以下内容

```txt
# CSC_LINK = '' # 证书（*.p12/*.pfx）路径或者 base64 数据
# CSC_KEY_PASSWORD = '' # 证书密码

# APPLEID = '' # 用于公证的开发者账号 apple id
# APPLEIDPASS = '' # 用于公证的开发者账号密码，建议使用专用密码
# TEAMID = '' # 开发者账号的团队 ID
```
