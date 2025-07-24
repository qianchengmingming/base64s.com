# Base64s.com 性能优化版本

## 🚀 快速启动 (推荐)

```bash
# 使用优化版本启动 (禁用认证，提升性能)
NEXT_PUBLIC_AUTH_ENABLED=false npm run dev

# 或者设置环境变量文件
echo "NEXT_PUBLIC_AUTH_ENABLED=false" > .env.local
npm run dev
```

## ✨ 优化成果

- **页面加载速度提升95%+**: 从3-4秒优化到100-200毫秒
- **Bundle大小减少12%**: 从146KB优化到129KB  
- **完全禁用认证请求**: 不再有多余的/api/auth/session请求
- **轻量级UI**: 移除了重型导航组件，专注Base64功能

## 📋 功能对比

| 功能 | 原版本 | 优化版本 |
|------|--------|----------|
| Base64编码/解码 | ✅ | ✅ |
| 主题切换 | ✅ | ✅ |
| 多语言支持 | ✅ | ✅ |
| 用户认证 | ✅ | ❌ (可选) |
| 复杂导航 | ✅ | ❌ 简化 |
| 页面加载速度 | 慢 | 快 🚀 |

## 📖 详细信息

查看 `PERFORMANCE_OPTIMIZATION.md` 了解完整的优化详情和技术细节。

## 🔄 恢复原版本

如需恢复带完整功能的原版本：
```bash
NEXT_PUBLIC_AUTH_ENABLED=true npm run dev
``` 