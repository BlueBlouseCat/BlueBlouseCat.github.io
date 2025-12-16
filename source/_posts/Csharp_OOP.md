---
title: C#之面向对象
tags: CSharp
date: 2025-11-10 15:21
cover: https://tymimg.yuzhiboliuhua.cn/Cover/Csharp.png
categories: 高级编程语言/C#
description: C#是游戏开发（尤其Unity生态）的主流语言，其对面向对象（OOP）思想的完美适配是核心原因之一。本文结合游戏开发场景，梳理C#面向对象的封装、继承、多态核心特性，是学习C#面向对象的实战型笔记。
---
# 封装

---

# 继承

---

# 多态

**所谓多态，是让继承同一父类的子类们在执行相同方法时有不同的表现，从而使同一个对象有唯一的行为特征。**
## 虚拟方法

实现虚拟方法分为三个阶段：
V( virtual虚函数 ) -> O( override重写 ) -> B( base父类 )

下面是一个使用虚拟方法的例子：
首先，声明一个有虚函数的父类：

```
class GameObject
{
	public string name;
	
	// 构造函数
	public GameObject(string name)
	{
		this.name = name;
	}
	
	// 虚函数 可以被子类重写
	public virtual void Atk()
	{
		// 省略内部逻辑
	}
}
```

接下来，用一个子类去重写其中的虚函数：

```
class Player : GameObject
{
	// 构造函数,先执行父类的一个参数的构造函数
	public Player(string name) : base(name)
	{
	
	}
	
	// 重写虚函数
	public override void Atk()
	{
		base.Atk();
	}
}
```

其中，`base`代表父类，可以通过`base`来保留父类的行为。

## 抽象类和抽象方法

**抽象方法和虚拟方法很像，抽象方法是一种特殊的虚拟方法。**

**它俩的区别主要是：虚函数是 “可选重写” 的多态函数，基类可实例化；抽象函数是 “强制重写” 的接口型函数，含抽象函数的类为抽象类，不可实例化。**

---

接下来是一个抽象类和抽象方法的实现：

```
abstract class Thing
{
	public string name;
	
	// （可选）在抽象类中写抽象方法
	// 抽象方法中一定不能有函数体
	public abstract void Fruits;
}
```

**注意：**
1. 抽象类不能被实例化
2. 继承抽象类必须用`override`重写其抽象方法
3. 抽象方法 *只能在抽象类中声明* && *没有方法体* && *不能是私有的*