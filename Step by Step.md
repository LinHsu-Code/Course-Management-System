# Contents

- [Authenticate](#authenticate)
- [Dependencies Title](#dependencies-title)

## Authenticate

1. 布局
   - title
   - form -> lib role controller ?
   - sign up

> 左 中 右 1/3 1/3 1/3 grid(1fr 1fr 1fr) flex(如何让内容刚好是 1/3) lib? (Row Col)

2. 逻辑
   - 默认选中 ？initialValues
   - email password 规则 --> antd doc
   - click --> validate form
     - 成功 --> http request<url, params?>
       - success --> jump(router) dashboard --> responses store in localStorage
       - fail --> 显示错误 alert message
     - 失败 --> 显示错误
   - 已经登陆后访问 sign in 页面，直接跳转到 dashboard 页面

> crypto-js AES.encrypt salt 'cms'
>
> 如何发？ajax --> POST

## Dependencies Title
