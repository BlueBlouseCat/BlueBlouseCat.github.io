---
title: 游戏开发
tags:
  - Unity
  - 游戏开发
date: 2025-11-14 10:21
cover: https://tymimg.yuzhiboliuhua.cn/Cover/Unity.png
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

## 跑步与走路切换(融合树实现)

要实现按下Shift键从走路切换到跑步，抬起时从跑步切换到走路。

```
public calss Test : MonoBehaviour
{
	private float dValue = 0.5f;
	
	void Start()
	{
		animator = this.GetComponent<Animator>();
	}
	
	void Update()
	{
		animator.SetFloat("Speed", Input.GetAxis("Vertical") * dValue);
		
		if(Input.GetKeyDown(KeyCode.LeftShift))
			dValue = 1;
		if(Input.GetKeyUp(KeyCode.LeftShift))
			dValue = 0.5f;
	}
}
```

## 控制角色部分旋转

思路：人物本来就在不停移动，在这个过程中，人物会一直看向一个点。在头部加上一个空对象，指向看向的点，当这个向量旋转时就会得到一个新的点，从而使人物部分旋转


![[Pasted image 20251208204210.png]]

```
public class Test : MonoBehaviour
{
	private Animator animator;
	
	public Transform headPos;
	// x方向鼠标旋转了多少角度
	private float chageAngleX;
	
	void Start()
	{
		animator = this.GetComponent<Animator>();
	}
	void Update()
	{
		// 控制左右移动
		animator.SetFloat("x", Input.GetAxis("Horizontal"));
		animator.SetFloat("y", Input.GetAxis("Vertical"));
		
		// 角度累加
		chageAngleX += Input.GetAxis("Mouse X");
		changeAngleX = Mathf.Clamp(changeAngleX, -30, 30);// 加紧函数限制范围
	}
	private void OnAnimatorIK(int layerIndex)
	{
		animator.SetLookAtWeight(1, 1, 1);
		Vector3 pos = Quaternion.AngleAxis(changeAgleX, Vector3.up) * (headPos.position + headPos.forward * 10);
		animator.SetLookAtPosition(pos);
	}
}
```

# 地图
## 2D层级显示

当做有伪"z"轴的2D游戏时，需要调整各层的显示。

1. 地板与人物：人物一直显示在地板上方。
	- 地板的`Sprite Renderer`的`Layer`始终低于人物的`Sprite Renderer`的`Layer`。
2. 墙体与人物：人物一直在后方墙体之前，前方墙体之后。
	- 后方墙体：和地板设置为同一层
	- 前方墙体：新建一个`Tilemap`渲染层，把它的`Layer`设置到人物的`Layer`之上
3. 植物与人物：人物从后方经过植物时会被挡住，从前方经过植物时会挡住植物。
	- 方法1：新建一个`Tilemap`渲染层，把它的`Layer`设置与人物的`Layer`一致。层级一致的情况下会通过轴心点排序。（注意：要把`Tilemap`上的模式切换为`Individual`）
	- 方法2：直接将植物拖为一个2D对象，更改他的排序方式为`Pivot`

	- 这两种方法的特点：
		- 方法一：方便快速拖动增加很多植物，不过一个菱形格子只能有一棵植物。
		- 方法二：不是很方便的添加，不过一个菱形格子可以有多棵植物。