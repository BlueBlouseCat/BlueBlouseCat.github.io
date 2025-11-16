---
title: Unity插件之Transform
tags:
  - Unity
date: 2025-11-11 20:45
cover: https://tymimg.yuzhiboliuhua.cn/Cover/C.png
categories: Unity
---
`Transform`是Unity中物体的一个基础插件，只要有一个GameObject物体，必然会有`Transform`插件。游戏对象（GameObject）**位移、旋转、缩放、父子关系、坐标转换**等相关操作都由它处理。

---

# 位置、位移和朝向

## 必备知识：Vector3

Vector3 主要是用来表示三维坐标系中的一个点或是一个向量。

1. 申明：

`Vector3 v = new Vector3();`

创建了一个`Vector3`类的实例`v`，并调用`Vector3`的无参构造函数来初始化这个实例，xyz都为0，也可以只传xy，z默认为0

2. 计算

使用运算符重载可以使向量相**加减**，**数乘**，**除**，就是每个向量对应位置相加减，示例如下：

```
Vector3 v1 = new Vector3(1, 1, 1);
Vector3 v2 = new Vector3(2, 2, 2);

print(v1 + v2);
print(v1 - v2);
print(v1 * 10);
print(v2 / 2);
```

输出结果如下：

```
(3, 3, 3) // +
(-1, -1, -1) // -
(10, 10, 10) // x*
(1, 1, 1) // /
```

常用的向量:

```
Vector3.zero //000
Vector3.right //100
Vector3.left //-100
Vector3.forward //001
Vector3.back //00-1
Vector3.up //010
Vector3.down //0-10
```

**计算两个点之间的距离的方法**：`Vector3.Distance(v1, v2);`
## 位置

- 相对世界坐标系：`this.transform.position`
- 相对父对象：`this.transform.localPosition`

**注意：位置的赋值不能单独改变xyz，只能整体改变，改变方式如下：**

`this.transform.position = new Vector3(10, 10, 10);`

**也可以像这样：**

`this.transform.position = Vector3.up * 10;`

如果只想改一个值x，yz想和原有坐标保持一致，可以这样处理：

*方式1：直接赋值*

`this.transform.position = new Vector3(19, this.transform.position.y, this.transform.position.z);`

*方式2：先取出来再赋值*

```
Vector3 vPos = this.transform.localPosition;
vPos.x = 10;
this.transform.localPosition = vPos;
```

## 位移

先来理解坐标系下位移的计算公式：路程 = 方向 * 速度 * 时间

*方式1：自己计算*

最终位置 = 当前位置 + 要移动的距离

`this.transform.position += Vector3.forward * 1 * Time.deltaTime;`

*方式2：API*

```
// 参数1：表示位移多少 路程 = 方向 * 速度 * 时间
// 参数2：表示 相对坐标系（默认相对于自己坐标系）

// 相对于世界坐标系的 z轴 动
this.transform.Translate(Vector3.forward * 1 * Time.deltaTime, Space.World);

// 相对于世界坐标系的 自己的面朝向 动
this.transform.Translate(this.transform.forward * 1 * Time.deltaTime, Space.World);

// 相对于自己的坐标系的 自己的面朝向向量移动（一定不会这样使用）

// 相对于自己的坐标系的 z轴正方向移动
this.transform.Translate(Vector3.forward * 1 * Time.deltaTime, Space.Self); 
```

## 朝向

`this.transform.forward;`
# 角度和旋转
## 角度相关

- 相对世界坐标角度：`this.transform.eulerAngles`
- 相对父对象角度：`this.transform.localEulerAngles`

**注意：欧拉角的取值范围是0~360°，设置角度和设置位置一样，不能单独设置xyz，要一起设置。如果我们希望改变的角度是面板上显示的内容，那一定是改变相对父对象的角度。**

## 旋转相关

*情况一：自转*

```
// 参数1： 每一帧旋转的角度
// 参数2： 不填就是默认相对于自己坐标系进行旋转
this.transform.Rotate(new Vector3(0, 10, 0) * Time.deltaTime, Space.World);
```

*情况二：相对于某一根轴转*

```
// 参数1：相对于的轴
// 参数2：转动的角度 旋转速度*时间
// 参数3：不填默认相对于自己的坐标系进行旋转
this.transform.Rotate(Vector3.right, 10 * Time.delataTime, Space.World);
```

*情况3：相对于某一个点*

```
// 参数1：相对于的点
// 参数2：相对于哪一个点的哪一条轴
// 参数3：转的角度 旋转速度*时间
this.transform.RotateAround(Vector3.zero, Vector3.right, 10 * Time.deltaTime);
```

# 缩放和看向
## 缩放

- 相对于世界坐标系：`this.transform.lossyScale`
- 相对于本地坐标系（父对象）： `this.transform.localScale`

**注意：缩放不能只改xyz，要一起改并且都是相对于父对象的改**

Unity没有提供关于缩放的API，如果想要让缩放发生变化，只能自己去算：
`this.transform.localScale += Vector3.one * Time.deltaTime;

## 看向

- 看向一个点（相当于世界坐标系）`this.transform.LookAt(Vector3.zero);`
- 看向一个对象（传入一个对象的Transform信息）`this.transform.LookAt(lookAtObj)`

# 父子关系
## 儿子的操作

1. 获取父对象：`this.transform.parent`，之后可以获取父对象`name`等所有信息。

---

2. 设置父对象：
- 断绝父子关系：`this.transform.SetParent(null);`
- 设置父亲：`this.transform.SetParent(GameObject.Find("Father2").transform);`

设置父亲还有一种重载，在原有的API后面多了一个`bool`参数，代表是否保留世界坐标的**位置、角度、缩放、信息**。
- `true`代表会保留世界坐标下的状态，和父对象进行计算得到本地坐标系的信息。
- `false`代表不会保留，会直接把世界坐标系下的位置、角度、缩放直接赋值到本地坐标系下。

---

3. 判断自己的爸爸是谁：

```
if(son.IsChildOf(this.transform))
{
	print("是当前脚本依附对象的儿子。");
}
```

---

4. 儿子的编号：
- 得到自己当前的编号：`son.GetSiblingIndex();`
- 把自己设置为第一个儿子：`son.SetAsFirstSibling();`
- 把自己设置为最后一个儿子：`son.SetAsLastSibling();`
- 把自己设置为指定个儿子：`son.SetSiblingIndex(1);`   其中，填的编号超出了范围（负数或者更大的数）不会报错，会直接设置成最后一个编号。

## 父亲的操作

1. 获取子对象：
- 通过编号得到自己对应的儿子：`this.transform.GetChild(0);`，返回值是`transform`
- 获取知道名字的子对象：`this.transform.Find("Children1");`，之后可以获取子对象`name`等所有信息。

**注意：**
- 返回值是儿子的`transform`信息
- `transform`的`Find()`方法可以找到失活对象；但`GameObject`的`Find()`方法不能找到失活对象
- 如果要找到它的孙子，可以通过`this.transform.Find("PM/labPM");`这个API找

---

2. 和自己所有儿子断绝关系：`this.transform.DetachChildren();`

---

3. 遍历儿子：
- 得到自己儿子的数量：`this.transform.childCount`
**注意：** 失活的儿子也会算数量，孙子不会计算进去
- 遍历：

```
for(int i = 0; i < this.transform.childCount; i ++)
{
	// 处理其他逻辑
}
```

# 坐标转换
## 世界坐标转本地坐标
**作用：可以帮我们判断相对位置**
1. *世界坐标系的点*转换为*相对本地坐标系的点*
- 受缩放影响
`this.transform.InverseTransformPoint(vector3.forward);`

2. *世界坐标系的方向*转换为*相对本地坐标系的方向*
- 不受缩放影响
`this.transform.InverseTransformDirection(vector3.forward);`
- 受缩放影响
`this.transform.InverseTransformVector(vector3.forward);`

## 本地坐标转世界坐标
1. *本地坐标系的点*转换为*相对世界坐标系的点*
- 受缩放影响
`this.transform.TransformPoint(Vector3.forward);`

2. *本地坐标系的方向*转换为*相对世界坐标系的方向*
- 不受缩放影响
`this.transform.TransformDirection(vector3.forward);`
- 受缩放影响
`this.transform.TransformVector(vector3.forward);`