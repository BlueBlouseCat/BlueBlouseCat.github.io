---
title: 游戏开发
tags:
  - Unity
  - 游戏开发
date: 2025-11-14 10:21
cover: https://tymimg.yuzhiboliuhua.cn/Cover/C.png
categories: Unity
---
这篇文章记录了游戏开发中常用的一些知识点及处理方法。

---

# UI
## 血量
### 血条
### 血格
# 主玩家相关
## 边界判断

有些游戏会涉及到有关玩家的移动，这时候可能会因为玩家移动或者分辨率的原因使玩家不能保持在屏幕内，这时需要处理一定的游戏逻辑来控制主玩家在屏幕范围内。

****

思路如下：

![边界判断](https://tymimg.yuzhiboliuhua.cn/GameDevelopment/屏幕限制.png)

记录玩家之前的位置和玩家现在的位置，判断玩家当前的位置，如果当前位置超出了屏幕范围，则把玩家位置拉回之前的位置。

示例如下：
```
// 当前世界坐标转屏幕的位置
private Vector3 nowPos;
// 位移前玩家的位置
private Vector3 frontPos;

void Update()
{
	// 其余逻辑省略
	
	// 在位移之前 记录之前的位置
	frontPos = this.transform.position;
	
	// 位移逻辑省略
	
	// 移动后进行极限判断
	nowPos = Camera.main.WorldToScreen(this.transform.position);
	// 左右 溢出判断
    if(nowPos.x <= 0 || nowPos.x >= Screen.width)
    {
	    this.transform.position = new Vector3(frontPos.x, this.transform.position.y, this.transform.position.z);
    }
    // 上下 溢出判断
    if(nowPos.y <= 0 || nowPos.y >= Screen.height)
    {
	    this.transform.position = new Vector3(this.transform.position.x, this.transform.position.y, frontPos.z);
    }
}
```