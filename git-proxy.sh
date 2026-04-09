# 设置 http 代理
git config --global http.proxy "http://127.0.0.1:7890"

# 设置 https 代理
git config --global https.proxy "http://127.0.0.1:7890"

# 如果上面两根不行，使用Windows证书系统
git config --global http.sslBackend schannel