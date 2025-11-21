---
title: Unity之物理系统
tags:
  - Unity
  - 物理系统
date: 2025-11-04 14:58
cover: https://tymimg.yuzhiboliuhua.cn/Cover/UnityBlenderT.png
categories: Unity
---
这篇文章记录了Unity中物理系统相关（未完待续）

****
# 碰撞检测
**碰撞产生的条件：两个物体都有碰撞器，至少一个物体有刚体**
碰撞器：用来表现一个3D物体的体积
刚体：用来受到力的效果
**作用：** 实体物体之间产生物理效果
## 物理材质
### 创建物理材质
Project - + - Physic Material 
### 物理材质的参数
| 参数                        | 作用                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------- |
| 滑动摩擦力（Dynamic Friction）   | 值越大摩擦力越大                                                                            |
| 静摩擦力（Static Friction）     | 值越大摩擦力越大                                                                            |
| 弹性（Bounciness）            | 值为0不会反弹，1反弹时不产生任何能量损失                                                               |
| 摩擦力组合方式（Friction Combine） | Average：对两个摩擦力求平均值。/  Minimun：使用两个值中的最小值。 /  Maxmum：使用两个值中的最大值。/  Multiply：两个摩擦值相乘。 |
## 物理碰撞
### Collider碰撞器组件
#### 3D碰撞器种类
- **盒状**
- **球状**
- **胶囊**
- 网格：Mesh Collider，加了刚体的碰撞器必须勾选`Convex`才能受到力的作用
- 轮胎：Wheel Collider
- 地形：Terrain Collider

**注：** 没加粗的三种碰撞器性能消耗较高，但比较准确。
#### 共同参数
| 参数                     | 作用                          |
| ---------------------- | --------------------------- |
| **是否是触发器（Is Trigger）** | **勾选即被物理引擎忽略，用于无物理效果的碰撞检测** |
| 物理材质（Material）         | 可以确定碰撞体和其他对象碰撞时的表现方式        |
| 中心点（Center）            | 碰撞体在对象局部空间中的中心点位置           |
#### 特有参数
| 碰撞器种类                   | 参数                                      | 作用                      |
| ----------------------- | --------------------------------------- | ----------------------- |
| 盒状碰撞器（Box Collider）     | 大小（Size）                                | 碰撞体在X、Y、Z方向上的大小         |
| 球状碰撞器（Sphere Collider）  | 半径（Radius）                              | 球形碰撞器的半径大小              |
| 胶囊碰撞器（Capsule Collider） | 半径（Radius）/  高度（Height）/  轴向（Direction） | 胶囊体的半径 / 高度 / 在局部空间中的轴向 |

**注：** 异形物体使用多种碰撞器组合，刚体对象的子对象碰撞器信息参与碰撞检测。
例如，要创建一个汽车（**质量一定要足够大 1500kg**）：

![Car.png (204×115)](https://tymimg.yuzhiboliuhua.cn/PhysicalSystem/Car.png)


### 区别碰撞和触发
1. 碰撞：会产生实际的物理效果
2. 触发：看起来不会产生碰撞，但是可以通过函数监听触发
### 响应函数
**注意： 碰撞和触发响应函数属于特殊的生命周期函数，也是通过反射调用**
执行时机：只要挂载的对象能和别的物体产生碰撞或者触发，那么对应的这6个函数就都能被响应。
特殊情况：如果是一个异形物体，刚体在父对象上，不能通过子对象上挂载脚本检测碰撞，必须挂载到这个刚体父对象上。
#### 物理碰撞检测

*触碰时：*
```
private void OnCollisionEnter(Collision collision)
{
	// 碰撞后的执行逻辑
}
```
`Collision`类型的参数包含了碰到自己的对象的相关信息。
关键参数：
1. 碰撞到的对象碰撞器的信息：`collision.collider`
2. 碰撞对象的依附对象（GameObject）：`collision.gameObject`
3. 碰撞对象的依附对象的位置信息：`collision.transform`
4. 触碰点数相关：`collision.contactCount`
	接触点具体的坐标：`ContactPoint[] pos = collision.contacts`

*分离时：*
```
private void OnCollisionExit(Collision collision)
{
	// 碰撞结束执行逻辑
}
```

*相互接触摩擦时：*
```
// 不停调用
private void OnCollisionStay(Collision collision)
{
	// 相互接触摩擦时执行逻辑
}
```

#### 触发器检测

*触发时：*
```
private void OnTriggerEnter(Collider other)
{
	// 触发时执行逻辑
}
```

*结束时：*
```
private void OnTriggerExit(Collider other)
{
	// 水乳相融状态结束执行逻辑
}
```

*正在触发时：*
```
// 不停调用
private void OnTriggerStay(Collider other)
{
	// 水乳相融状态时执行逻辑
}
```
**注：** 碰撞和触发器函数都可以写成虚函数，在子类去重写逻辑。一般会把想要重写的碰撞和触发函数写成保护类型的（没有必要写成 public，因为不会自己手动调用，都是Unity通过反射帮助我们自动调用的）。
## 刚体加力
**给刚体加力的目标：** 让其有一个速度，朝着某一个方向移动
### RigidBody刚体组件
1. 核心功能：
- 赋予对象物理属性，遵循物理定律运动。
- 实现碰撞响应。
- 支持力、扭矩、速度等物理量控制，实现抛射、推动等效果。

2. 关键参数

| 关键参数                        | 作用                                                                         |
| --------------------------- | -------------------------------------------------------------------------- |
| 质量（Mass）                    | 默认为kg，质量越大惯性越大                                                             |
| 空气阻力（Drag）                  | 值越大，物体减速越快                                                                 |
| 角速度拖动（Angular Drag）         | 旋转时的阻力，影响物体旋转减速速度                                                          |
| **是否受重力（Use Gravity）**      | **勾选后对象受重力下落**                                                             |
| 是否运动学（Is Kinematic）         | 勾选后不受物理引擎控制，仅通过代码或动画 HingeJoint 驱动                                         |
| 插值运算（Interpolate）           | 让刚体移动更平滑。`None`不应用；`Interpolate`根据前一帧的变换来平滑变换；`Extrapolate`根据下一帧的估计变换来平滑变换 |
| 碰撞检测模式（Collision Detection） | 防止快速移动的对象穿过其他对象而不检测碰撞                                                      |
| **约束（Constraints）**         | **对刚体运动的限制**                                                               |
### 刚体休眠
1. 定义：Unity为了节约性能，会给刚体加一个休眠机制。在一定情况下不产生力的效果。
2. 解决这个问题的方法：
```
// 获取刚体是否处于休眠状态 如果是
if(rigidBody.IsSleeping())
{
	// 就唤醒它
	rigidBody.WakeUp();
}
```
### 常见操作
#### 施加力
```
// 1. 获取刚体组件
rigidBody = this.GetComponent<Rigidbody>();

// 2. 添加力
// 加力后对象是否停止移动 由阻力决定
rigidBody.AddForce(Vector3.forward * 10); // 相对于世界坐标系z轴正方向加了一个力
rigidBody.AddForce(this.transform.forward * 10); // 相对于世界坐标系 对象朝自己的面朝向移动
rigidBody.AddRelativeForce(Vector3.forward * 10); // 相对于本地坐标
```

`AddForce` 有重载函数，第二个参数是力的模式，主要作用是改变计算方式，也因为计算方式不同，最终的移动速度不同。

| 力的模式           | 效果                               |
| -------------- | -------------------------------- |
| Acceleration   | 给物体施加一个持续的加速度，忽略其质量（m默认为1）       |
| Force          | 给物体添加一个持续的力，与物体的质量有关             |
| Impulse        | 给物体添加一个瞬间的力，与物体的质量有关，忽略时间（t默认为1） |
| VelocityChange | 给物体添加一个瞬时速度（t默认为1），忽略质量（m默认为1）   |

Unity中自带一个力场脚本：`Constant Force`，添加这个脚本后会有持续的力的效果。主要作用是控制场景上一个物体的不停移动和旋转。
#### 施加扭矩力
**作用：让其旋转**
```
// 相对世界坐标
rigidBody.AddTorque(Vector3.up * 10);
// 相对本地坐标
rigidBody.AddRelativeTorque(Vector3.forward * 10);
```
#### 直接改变速度
这个速度方向是相对于**世界坐标系**的：`rigidBody.velocity = Vector3.forward * 5;`
#### 模拟爆炸效果
**注：** 要得到所有希望产生爆炸效果影响的对象的刚体，来执行这个方法
```
// 参数1：受力大小
// 参数2：受力中心
// 参数3：受力半径
rigidBody.AddExplosionForce(100, Vector3.zero, 10);
```

****

# 范围检测
**作用：** 游戏中瞬时的攻击范围判断
## 如何进行范围检测
**必备条件：** 想要被范围检测的对象必须具备碰撞器
**注意点：**
1. 相关API只有当执行该句代码时，进行一次范围检测，它是瞬时的。
2. 相关API并不会产生一个碰撞器，只是碰撞判断计算而已。
### 范围检测API
#### 盒状范围检测( 关于层级补充知识 )
*API1:*
```
// 参数一：立方体的中心点
// 参数二：立方体三边大小
// 参数三：立方体角度
// 参数四：检测指定层级（不填检测所有层）
// 参数五：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：数组（在该范围内的触发器）

Collider[] colliders = 
Physics.OverlapBox(Vector3.zero, new Vector3(3, 4, 5), 
	Quaternion.AngleAxis(45, Vector3.up),
	1 << LayerMask.NameToLayer("UI") |
	1 << LayerMask.NameToLayer("Default"), 
	QueryTriggerInteraction.UseGlobal
	)
```

**补充知识：关于层级（重要）**
通过名字得到层级编号：`LayerMask.NameToLayer`。我们需要通过编号左移构建二进制数，这样每一个编号的层级都是对应位为1的2进制数，我们通过位运算可以选择想要检测层级。
好处：一个 int 就可以表示所有想要检测的层级信息。

层级编号是 0~31（32位，与int占位一致）：

每一个编号代表的都是二进制的一位：

| 层级  | 运算     | 2进制表示     | 2进制运算结果 |
| --- | ------ | --------- | ------- |
| 0层  | 1 << 0 | 0000 0001 | 1       |
| 1层  | 1 << 1 | 0000 0010 | 2       |
| 2层  | 1 << 2 | 0000 0100 | 4       |
| 3层  | 1 << 3 | 0000 1000 | 8       |
| ... | ...    | ...       | ...     |

这样可以进行位运算，比如上面给出的例子是`0000 0001 | 0010 0000 = 0010 0001 = 33`，然后Unity内部进行`&`运算来判断哪些层级要检测。

*API2:*
```
// 参数：前面的参数和 API1 一样，后面需要传一个数组（碰撞到的东西）
// 返回值：一个int（碰撞到的碰撞器数量）
Collider[] colliders;
Physics.OverlapBoxNonAlloc(Vector3.zero, Vector3.one, colliders)
```
#### 球形范围检测
*API1:*
```
// 参数1：中心点
// 参数2：球半径
// 参数3：检测指定层级（不填检测所有层）
// 参数4：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：一个数组（在该范围内的触发器）
Physics.OverlapSphere(Vector3.zero, 5, 
	1 << LayerMask.NameToLayer("Default"),
	QueryTriggerInteraction.UseGlobal
	)
```
*API2：*
```
// 参数：前面的参数和 API1 一样，后面需要传一个数组（碰撞到的东西）
// 返回值：一个int（碰撞到的碰撞器数量）
Collider[] colliders;
Physics.OverlapSphereNonAlloc(Vector3.zero, Vector3.one, colliders)
```
#### 胶囊范围检测
*API1:*
```
// 参数1：半圆一中心点
// 参数2：半圆二中心点
// 参数3：半圆半径
// 参数4：检测指定层级（不填检测所有层）
// 参数5：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：一个数组（在该范围内的触发器）
Physics.OverlapCapsule(Vector3.zero, Vector3.up, 1 
	1 << LayerMask.NameToLayer("Default"),
	QueryTriggerInteraction.UseGlobal
	)
```
*API2:*
```
// 参数：前面的参数和 API1 一样，后面需要传一个数组（碰撞到的东西）
// 返回值：一个int（碰撞到的碰撞器数量）
Collider[] colliders;
Physics.OverlapCapsuleNonAlloc(Vector3.zero, Vector3.up, 1, colliders)
```

****
# 射线检测
**作用：** 在指定点发射一个指定方向的射线，判断该射线与哪些碰撞器相交，得到相应对象。
## 如何进行射线检测
### 声明射线对象

1. 3D世界中的射线

```
// 参数1：起点
// 参数2：方向向量
Ray r = new Ray(Vector3.right, Vector3.forward); // Ray是Unity中提供的一个类
```

`Ray`中的参数：
	1. 起点：`r.origin`
	2. 方向：`r.direction`

****

2. 摄像机发射的射线

```
// 起点：屏幕位置
// 方向：摄像机视口方向
Ray r2 = Camera.main.ScreenPointToRay(Input.mousePosition);
```

### 射线碰撞检测
**注意：** 
	1. 射线检测也是瞬时的，执行代码时进行一次射线检测。
	2. 检测的最大距离 和 检测指定层级 都是int类型，传层级之前一定要传距离
#### 只检测是否碰撞到对象
*API1：*
```
// 1. 准备一条射线
Ray r3 = new Ray(Vector3.zero, Vector3.forward);

// 2. 进行射线检测
// 参数1：射线
// 参数2：检测的最大距离
// 参数3：检测指定层级（不填检测所有层）
// 参数4：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：bool (如果碰撞到对象 返回true，否则返回false)

Physics.Raycast(r3, 1000, 1 << LayerMask.NameToLayer("Monster"), 
	QueryTriggerInteraction.UseGlobal);
```
*API1的等价形式 :*
```
// 把第一个参数射线 换成 射线的起点和方向
Physics.Raycast(Vector3.zero, Vector3.forward, 1000, 
	1 << LayerMask.NameToLayer("Monster"), 
	QueryTriggerInteraction.UseGlobal);
```
#### 获取相交的单个物体信息
API2与API1的区别在于多了一个`out hitInfo`信息
*API2:*
```
// 物体信息类 RaycastHit
RaycastHit hitInfo;
// 参数1：射线
// 参数2：RaycastHit是结构体（值类型）
// Unity会通过out关键词 在函数内部处理后得到碰撞数据后返回
// 参数3：检测的最大距离
// 参数4：检测指定层级（不填检测所有层）
// 参数5：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：bool (如果碰撞到对象 返回true，否则返回false)
if( Physics.Raycast(r3, out hitInfo, 1000, 1 << LayerMask.NameToLayer("Monster"),
	QueryTriggerInteraction.UseGlobal) )
{
	// hitInfo中有碰撞到的物体的信息
}
```
`RaycastHit`中的参数：
	1. 碰撞器信息：`hitInfo.collider`
	2. 碰撞到的点：`hitInfo.point` 作用：在此处创建特效
	3. 法线信息：`hitInfo.normal` 作用：使美术表现更写实，比如贴弹痕
	4. 位置信息：`hitInfo.transform.position`
	5. 与碰撞到的对象的距离：`hitInfo.distance` 作用：处理距离远近对伤害的影响 / 子弹抛物线

*API2的等价形式：*
```
Physics.Raycast(Vector3.zero, Vector3.forward, out hitInfo, 1000,
	1 << LayerMask.NameToLayer("Monster"),
	QueryTriggerInteraction.UseGlobal)
```
#### 获取相交的多个物体信息
*API3:*
作用：可以得到碰撞到的多个对象，如果没有就是容量为0的数组。
```
// 参数1：射线
// 参数2：检测的最大距离
// 参数3：检测指定层级（不填检测所有层）
// 参数4：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：数组（存储所有碰撞到的物体的信息）
RaycastHit[] hits = Physics.RaycastAll(r3, 1000, 
	1 << LayerMask.NameToLayer("Monster"), 
	QueryTriggerInteraction.UseGlobal);
```
*API3的等价形式：*
```
RaycastHit[] hits = Physics.RaycastAll( Vector3.zero, Vector3.forward, 1000, 
	1 << LayerMask.NameToLayer("Monster"), 
	QueryTriggerInteraction.UseGlobal );
```
**注意：** 存储信息的数组是一个栈
#### 获取相交的物体数量
```
// 参数1：射线
// 参数2：碰撞到的物体信息的数组
// 参数3：检测的最大距离
// 参数4：检测指定层级（不填检测所有层）
// 参数5：是否忽略触发器（不填使用UseGlobal）
// UseGlobal-使用全局设置 Collide-检测触发器 Ignore-忽略触发器
// 返回值：int（相交的物体数量）
Physics.RaycastNonAlloc(r3, hits, 1000, 1 << LayerMask.NameToLayer("Monster"), 
	QueryTriggerInteraction.UseGlobal);)
```