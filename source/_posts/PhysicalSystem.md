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

物理材质是用于决定物体产生碰撞时，这些物体之间的摩擦和弹性表现的。
### 创建物理材质
Project右键 -> Creat -> Physic Material / Physic Material 2D
### 物理材质的参数
| 参数                        | 作用                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------- |
| 滑动摩擦力（Dynamic Friction）   | 值越大摩擦力越大                                                                            |
| 静摩擦力（Static Friction）     | 值越大摩擦力越大                                                                            |
| 弹性（Bounciness）            | 值为0不会反弹，1反弹时不产生任何能量损失                                                               |
| 摩擦力组合方式（Friction Combine） | Average：对两个摩擦力求平均值。/  Minimun：使用两个值中的最小值。 /  Maxmum：使用两个值中的最大值。/  Multiply：两个摩擦值相乘。 |
## 物理碰撞
### Collider碰撞器组件

碰撞器是用于在物理系统中表示物体体积的（形状或范围），刚体通过得到碰撞器的范围信息进行计算，判断两个物体的范围是否接触，如果接触，就会模拟力的效果产生速度和旋转。
#### 碰撞器种类
1. 3D碰撞器
- **盒状**
- **球状**
- **胶囊**
- 网格：Mesh Collider，加了刚体的碰撞器必须勾选`Convex`才能受到力的作用
- 轮胎：Wheel Collider
- 地形：Terrain Collider

**注：** 没加粗的三种碰撞器性能消耗较高，但比较准确。

2. 2D碰撞器
- **圆形碰撞器**
- **盒状碰撞器**
- **多边形碰撞器**
- **边界碰撞器**
- 胶囊碰撞器
- 复合碰撞器
#### 共同参数
| 参数                     | 作用                          |
| ---------------------- | --------------------------- |
| **是否是触发器（Is Trigger）** | **勾选即被物理引擎忽略，用于无物理效果的碰撞检测** |
| 物理材质（Material）         | 可以确定碰撞体和其他对象碰撞时的表现方式（摩擦、弹性） |
| 中心点（Center）            | 碰撞体在对象局部空间中的中心点位置           |
#### 特有参数

3D碰撞器：

| 碰撞器种类                   | 参数                                      | 作用                      |
| ----------------------- | --------------------------------------- | ----------------------- |
| 盒状碰撞器（Box Collider）     | 大小（Size）                                | 碰撞体在X、Y、Z方向上的大小         |
| 球状碰撞器（Sphere Collider）  | 半径（Radius）                              | 球形碰撞器的半径大小              |
| 胶囊碰撞器（Capsule Collider） | 半径（Radius）/  高度（Height）/  轴向（Direction） | 胶囊体的半径 / 高度 / 在局部空间中的轴向 |

**注：** 异形物体使用多种碰撞器组合，刚体对象的子对象碰撞器信息参与碰撞检测。
例如，要创建一个汽车（**质量一定要足够大 1500kg**）：

![Car.png (204×115)](https://tymimg.yuzhiboliuhua.cn/PhysicalSystem/Car.png)


2D碰撞器：

| 碰撞器种类                          | 参数                                                                                                                                                                                    | 作用                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 圆形碰撞器（Circle Collider 2D）      | 半径（Radius）/  圆心偏移位置（Offset）/  是否被附加的2D效应器使用（Used By Effector）                                                                                                                         | 圆形碰撞器的半径大小 / 圆心偏移位置 / 被附加的2D效应器使用                                                                 |
| 盒状碰撞器（Box Collider 2D）         | 大小（Size）/  是否附加到2D符合碰撞器（Used by Composite）/  自动改变尺寸（Auto Tiling）/  边缘半径（Edge Radius）                                                                                                  | 碰撞体在X、Y、Z方向上的大小 / 附加到2D符合碰撞器 / 如果精灵渲染器组件的Draw Mode设置为Tiled平铺模式，勾选后，当改变精灵大小时将自动更新碰撞器的尺寸 / 使四个顶点为圆角 |
| 多边形碰撞器（Polygon Collider 2D）    | 多边形顶点（Points）                                                                                                                                                                         | **一般用Edit Collider编辑**                                                                            |
| 边界碰撞器（Edge Collider 2D）        |                                                                                                                                                                                       | **一般用Edit Collider编辑**，主要用于确定地形范围                                                                 |
| 胶囊碰撞器（Capsule Collider 2D）     | 胶囊的宽高（Size）/  轴向（Direction）                                                                                                                                                           | 胶囊体的半径 / 高度 / 在局部空间中的轴向                                                                           |
| 复合碰撞器（Composition Collider 2D） | 几何学类型（Geometry Type：空心轮廓（Outlines）、实心多边形（Polygons）/  生成类型（Generation Type）：对2D复合碰撞器或使用的其他碰撞器修改时，Unity立即生成新几何体（Sychronous）、手动生成，代码或点击按钮（Manual）/  从复合碰撞器收集顶点时允许的最小间距值（Vertex Distance） | 合并碰撞体时，碰撞体顶点将组合为两种不同的几何体类型：空心可以放在内部但实心不行 / 复合碰撞器在何时生成新几何体 / 控制碰撞器的准确度                             |

**注意：** 复合碰撞器一定要配合刚体使用


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

### 2D效应器
2D效应器是配合2D碰撞器一起使用，可以让游戏对象在相互接触时产生一些特殊的物理作用力，快捷的实现传送带、互斥、吸引、漂浮、单向碰撞等等效果。

要使一个物体变为效应器，需要添加2个组件：**碰撞器（勾选Used By Editor、is Trigger）** 和 **效应器**

共有参数：

| 参数                                                   | 作用               |
| ---------------------------------------------------- | ---------------- |
| 是否启用碰撞器遮罩（Use Collidr Mask）                          | 开启后可以选择控制碰撞器作用范围 |
| 阻力（区域、点：Drag、浮力：Linear Drag）                         | 受到的移动阻力系数        |
| 扭矩阻力（Angular Drag）                                   | 受到的旋转阻力系数        |
| 施加力的角度（区域：Force Angle、浮力：Flow Angle）                 | 物体进来时受到的力的角度     |
| 施加力的大小（区域、点：Force Magnitude、浮力：Flow Magnitude水平推动的力） | 物体进来时受到的力的大小     |
| 施加力的随机大小变化（区域、点：Force Variation、浮力：Flow Variation）   | 对物体施加的力的大小变化范围   |

特有参数：

| 效应器种类                                 | 主要作用                          | 重要参数                                                                                                                                                                                                                                               |
| ------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 区域效应器Area Effector 2D                 | 在一个区域内让游戏对象受到力和扭矩力的作用         | 1. 是否启用世界坐标系角度（Use Global Angle）：不勾选默认区域效应器角度；2. 施加力的作用点（Force Target）：刚体质心（不产生扭矩力）、碰撞器（有扭矩力）。                                                                                                                                                     |
| 浮力效应器Buoyancy Effector 2D             | 模拟流体行为，浮动和阻力相关设置，让玩家看起来像在水里移动 | 1. 流体密度（Density）：密度越大，向上浮动的力越大；2. 浮力流体的表面位置（Surface Level）。                                                                                                                                                                                        |
| 点效应器Point Effector 2D                 | 模拟磁铁吸引或者排斥的效果                 | 1. 效应器和目标之间距离的缩放（Distance Scale）：计算距离时，会按该比值对距离进行缩放；2. 力源（Force Source）；3. 施加力的作用点（Force Target）：刚体质心（不产生扭矩力）、碰撞器（有扭矩力）；4. 力的模式（Force Mode）：Constant：忽略源和目标之间相隔的距离；Inverse Linear：反线性距离计算，距离越远，力的大小呈线性减小；Inverse Squared：反平方距离，力的大小呈指数减小，类似显示世界重力。 |
| 平台效应器Platform Effector 2D（**不做成触发器**） | 2D游戏当中的平台或可往上跳跃的墙壁            | 1. 旋转偏移量（Rotational Offset）：控制平台角度偏移；2. 是否使用单向碰撞行为（Use One Way）：可以从下方往上跳；3. 是否使用组合单向碰撞行为（Use One Way Grouping）；4. 不允许通过的表面（Surface Arc）；5. 是否在平台两侧使用摩擦（Use Side Friction）；6. 是否在平台两侧使用弹力（Use Side Bounce）；7. 左右两侧平台的响应弧度（Side Arc）。                |
| 表面效应器Surface Effector 2D（**不做成触发器**）  | 模拟传送带                         | 1. 表面保持的速度（Speed）；2. 速度随机增加值（Speed Variation）；3. 力的缩放（Force Scale）：缩放沿表面移动时的力。0为不施加力，值越大，速度越快。不建议设置为1，可能会抵消物体上的其他力；4. 对接触物体表面的接触点施加力（Use Contact Force）：勾选后会让物体旋转；5. 是否使用摩擦力（Use Friction）；6. 是否使用弹力（Use Bounce）。                                  |

## 刚体加力
**给刚体加力的目标：** 让其有一个速度，朝着某一个方向移动
### RigidBody刚体组件
1. 核心功能：
- 赋予对象物理属性，遵循物理定律运动。
- 实现碰撞响应。
- 支持力、扭矩、速度等物理量控制，实现抛射、推动等效果。

2. 关键参数

| 关键参数                        | 作用                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------- |
| 质量（Mass）                    | 默认为kg，质量越大惯性越大                                                                        |
| 空气阻力（Drag）                  | 值越大，物体减速越快                                                                            |
| 角速度拖动（Angular Drag）         | 旋转时的阻力，影响物体旋转减速速度                                                                     |
| **是否受重力（Use Gravity）**      | **勾选后对象受重力下落**                                                                        |
| 是否运动学（Is Kinematic）         | 勾选后不受物理引擎控制，仅通过代码或动画 HingeJoint 驱动                                                    |
| 插值运算（Interpolate）           | 让刚体移动更平滑。`None`不应用；`Interpolate`根据前一帧的变换来平滑变换；`Extrapolate`根据下一帧的估计变换来平滑变换            |
| 碰撞检测模式（Collision Detection） | 防止快速移动的对象穿过其他对象而不检测碰撞。`Discrete`：离散检测，性能消耗更低，但是可能存在问题；`Continuous`：连续检测，性能消耗更高，但比较准确。 |
| **约束（Constraints）**         | **对刚体运动的限制**                                                                          |

3. 2D刚体组件

2D刚体组件与3D刚体组件最大的区别是`Body Type`刚体类型不同。

- 这是`Dynamic`动态的刚体类型对应的参数：

| 特殊参数                      | 作用                                                                  |
| ------------------------- | ------------------------------------------------------------------- |
| 物理材质（Material）            | 可以确定碰撞体和其他对象碰撞时的表现方式                                                |
| Simulate                  | 碰撞器、关节模拟物理效果                                                        |
| 使用自动质量（Use Auto Mass）     | 是否使用自动质量                                                            |
| 影响位置移动的阻力系数（Linear Dray）  | 值越大，阻力越大                                                            |
| 影响旋转移动的阻力系数（Angular Dray） | 值越大，阻力越大                                                            |
| 受重力影响的程度（Gravity Scale）   | 值越大，受重力程度越大                                                         |
| 睡眠模式（Sleeping  Mode）      | 刚体休眠（Never Sleep：从不休眠；Start Awake：最初唤醒； Start Asleep：最初睡眠，但可以被碰撞唤醒） |

**注意：**
1. 如果父物体上的刚体设置了物理材质，若子物体有碰撞器但是没有设置材质，则会用通用的刚体的物理材质。（查看通用物理材质：Edit -> Project Settings -> Physics 2D）
2. 物理材质的使用优先级：碰撞器 -> 刚体 -> Physics 2D

- 这是`Kinematic`运动学类型的刚体类型对应的参数：

特点：不受力的影响，只能通过代码让其动起来。能和动态2D刚体产生碰撞，但是不会动，只会进入碰撞检测函数，因此它没有质量、摩擦系数等属性，性能消耗较低。

| 特殊参数                        | 作用                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Simulate                    | 碰撞器、关节模拟物理效果。运动学类型的刚体的特殊作用：启用后，会充当一个无限质量的不可移动对象，可以和所有2D刚体产生碰撞。（如果`Use Full Kinematic Contacts` 禁用，他只会和动态刚体碰撞） |
| Use Full Kinematic Contacts | 启用：和所有2D刚体碰撞；禁用：只能和动态刚体产生碰撞。                                                                                  |

- 这是`Static`静态类型的刚体类型对应的参数：

特点：完全不动的需要检测碰撞的对象。相当于无限质量不可移动的对象。性能消耗最小，只能和动态刚体碰撞。**相当于只能检测动态刚体的碰撞器。**


**如何选择这3种刚体类型：**
1. `Dynamic`动态刚体：受力作用，要动要碰撞的对象
2. `Kinematic`运动学刚体：通过刚体API移动的对象，不受力作用，但是想要进行碰撞检测。
3. `Static`静态刚体：不动不受力作用的静态物体，但是想要进行碰撞检测。


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
Rigidbody rigidBody = this.GetComponent<Rigidbody>();

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

参数：
- `Force`：物理更新时（Edit -> Project Setting -> Time）施加于物体上的线性力
- `Relative Force`：物理更新时相对于刚体对象的坐标系施加线性力
- `Torque`：物理更新时施加的扭矩力

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

