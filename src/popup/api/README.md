# 使用的API接口说明

## Memos

官方API接口说明：https://memos.apidocumentation.com/

### 认证方式
使用 Authorization 头进行认证, 认证需要的 Token 在 memos 实例中生成，生成方式如下：

> Memos -> Settings -> My Account -> Access Tokens -> Create

接口调用示例：

```
GET https://memo.xxxxxx.com/api/v1/auth/sessions/current
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

### 接口概要 

获取当前用户(会话)信息： GET /api/v1/auth/sessions/current​
可获取到用户id, 返回的name格式为 users/{user} user即id 

```json
{"user":{"name":"users/2", "role":"USER", "username":"test", "email":"", "displayName":"", "avatarUrl":"", "description":"", "password":"", "state":"NORMAL", "createTime":"2025-09-10T07:00:37Z", "updateTime":"2025-09-10T07:00:37Z"}, "lastAccessedAt":null}
```
