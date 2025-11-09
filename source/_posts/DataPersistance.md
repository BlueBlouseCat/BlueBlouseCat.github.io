---
title: 数据持久化
tags:
  - Unity
date: 2025-11-07 17:41
cover: https://tymimg.yuzhiboliuhua.cn/Cover/DataPersistance.jpg
categories: Unity
---
这篇文章将会记录关于数据持久化的内容。

---
# 数据持久化
1. 概念：
![Data.png](https://tymimg.yuzhiboliuhua.cn/DataMgr/Data.png)

---
# PlayerPrefs

---
# XML
## 定义
一种特殊格式的文件。用于传输和存储数据 。
## XML文件格式
XML是一种树形结构根节点。
### XML基本语法
1. 创建XML文件：把后缀名改为`.xml`

2. 注释：
- 单行注释 
`<!-- 在其中书写注释相关内容 -->`

-  多行注释

```
<!--
	***
	***
-->
```

3. **固定内容：一定要写在第一行**

```
<!-- version代表版本 encoding代表编码格式 -->
<!-- 编码格式：ASCII码 与 UTF-8 就是两种不同的编码格式 -->
<?xml version = "1.0" encoding = "UTF-8"?>
```

4. 基本语法

```
<!-- xml的基本语法 是<元素标签> </元素标签>配对出现 -->
<!-- 可以理解为树形结构：必须要有且仅有一个根节点 -->

<PlayerInfo>
	<name>meimei酱</name>
	<age>19</age>
	<sex>false</sex>
	<ItemList>
		<Item>
			<id>1</id>
			<num>10</num>
		</Item>
		<Item>
			<id>2</id>
			<num>20</num>
		</Item>
	</ItemList>
</PlayerInfo>
```

**注意：特殊符号在xml中的写法**

| 符号  | xml中写作  |
| --- | ------- |
| <   | `&lt`   |
| >   | `&gt`   |
| &   | `&amp`  |
| '   | `&apos` |
| ''  | `&quot` |

### XML属性
**区别属性和元素：** 
- 元素：一个节点之中包裹的东西，即`<>元素</>`
- 属性：写在节点内部的东西，即`<Friend 属性>`

它俩表示的意思一样，只是两种写法。

```
<!-- 属性必须用引号包裹 单引号双引号都可以 -->
<Friend name = "小明" age = '8'>我的朋友</Friend>
```

如果使用属性记录信息，不想使用元素记录，如下：

`<Frind name = "小明" age = "8"/>`

### 验证是否有错
复制到该网址验证：
[xml - 菜鸟教程](https://www.runoob.com/xml/xml-validator.html)

## C#读取存储Xml

1. Xml文件存放的位置：
	- 只读不写：Resource / StreamingAssets 文件夹下
	- 动态存储：Application.persistentDataPath 路径下
2. 读取方法：
	- XmlDocument（较方便且容易操作）
	- XmlTextReader
	- Linq
### 读取
#### 读取Xml文件信息

```
using System.Xml; // 需要引用的命名空间

// 1. 创建文本对象
XmlDocument xml = new XmlDocument();

// 2. 直接根据xml字符串内容 来加载xml文件
// 存放在Resources文件夹下的xml文件加载处理（TestXml是一个在Resources里的xml文件）
TextAsset asset = Resources.Load<TextAsset>("TestXml");
xml.LoadXml(asset.text);

// 3. 通过xml文件的路径去进行加载（TestXml是一个在StreamAssets里的xml文件）
xml.Load(Application.streamingAssetsPath + "/TestXml.xml");
```

#### 读取元素和属性信息

1. 关键的两个类：
- 节点信息类（单个） XmlNode
- 节点列表信息类（多个）XmlNodeList

2. 读取元素：

```
// 1. 获取xml当中的根节点 参数：固定为"Root"
XmlNode root = xml.SelectSingleNode("Root");
// 2. 在通过根节点 去获取下面的子节点 参数：要获取的节点的内容的字符串
XmlNode nodeName = root.SelectSingleNode("name");
// 3. 获取节点包裹的元素信息，直接.InnerText
nodeName.InnerText
```

3. 读取属性：

```
// 1. 通过根节点 去获取下面的子节点
XmlNode nodeItem = root.SelectSingleNode("Item");
// 2. 通过这个节点得到里面的属性 
// 方式1：通过[]得到 []里写的是键
nodeItem.Attributes["id"].Value;
// 方式2：通过 GetNameItem() 得到
nodeItem.Attributes.GetNameItem("id").Value
```

**注意：如果要得到一个同名节点的信息，不要通过XmlNode，这样只能得到第一个节点**

```
// 1. 得到信息
XmlNodeList friendLit = root.SlectNodes("Friend");

// 2. 遍历
// 方式一：迭代器遍历
foreach(XmlNode item in friendList)
{
	print(item.SelectSingleNode("name").InnerText);
}
// 方式二：for循环
for(int i = 0; i < friendList.Count; i ++)
{
	print(friendList[i].SelectSingleNode("name").InnerText);
}
```

### 存储
1. 存储路径：Application.persistentDataPath
2. 关键类：
- XmlDocument 用于创建节点 存储文件
- XmlDeclaration 用于添加版本信息
- XmlElement 节点类

```
using System.Xml;

// 0. 准备存储路径
string path = Application.persistentDataPath + "/PlayerInfo2.xml";


// 1. 创建文本对象
XmlDocument xml = new XmlDocument();


// 2. 添加固定版本信息
// 参数1：版本号
// 参数2：编码格式
// 参数3：只用传一个空字符串
XmlDeclaration xmlDec = xml.CreateXmlDeclaration("1.0", "UTF-8", "");
// 创建完成后 要添加进 文本对象中
xml.AppendChild(xmlDec);


// 3. 添加根节点
XmlElement root = xml.CreateElement("Root");
xml.AppendChild(root);


// 4.添加子节点

// 4.1 为根节点添加子节点
XmlElement name = xml.CreateElement("name");
name.InnerText = "小明";                                 
root.AppendChild(name);

// 4.2 为子节点添加子节点
XmlElement listInt = xml.CreateElement("listInt");
for(int i = 1; i <= 3; i ++)
{
	XmlElement childNode = xml.CreateElement("int");
	childNode.InnerText = i.ToString();
	listInt.AppendChild(childNode);
}
root.AppendChild(listInt);

// 4.3 添加属性
XmlElement itemList = xml.CreateElement("itemList");
for(int i = 1; i = 3; i ++)
{
	XmlElement childNode = xml.CreateElement("Item");
	// 添加属性
	childNode.SetAttribute("id", i.ToString());
	itemList.AppendChild(childNode);
}
root.AppendChild(itemList);


// 5. 保存
xml.Save(path);
```
### 修改
```
// 1. 先判断是否存在文件
if( File.Exists(path) ) // File是自带的类
{
	// 2. 加载后 直接添加节点 移除节点即可
	XmlDocument newXml = new XmlDocument();
	newXml.Load(path);
	
	// 修改就是在原有的基础上 移除或者添加
	
	// 移除
	// 写法1:
	XmlNode node = newXml.SelectStingleNode("Root").SelectStingleNode("name");
	// 写法2：
	XmlNode node = newXml.SelectStingleNode("Root/name");
	// 移除子节点
	XmlNode root2 = newXml.SelectSingleNode("Root");
	root2.RemoveChild(node);
	
	// 添加
	XmlElement speed = newXml.CreateElement("moveSpeed");
	speed.InnerText = "20";
	root2.AppendChild(speed);
	
	// 改了记得存
	newXml.Save(path);
}
```

## XML序列化与反序列化
### 序列化
0. 定义：把 对象 转化为 可传输的字节序列 过程

1. 几个关键类：
- XmlSerializer 用于序列化对象为xml
- StreamWriter 用于存储文件
- using 用于方便流对象释放和销毁

2. 序列化
```
using System.IO; // 使用 StreamWriter 时要引用的命名空间
using System.Xml.Serialization; 

public class Lesson1Test
{
	// 这是我想要保存的类对象
}

public class Main : MonoBehaviour
{
	void Start()
	{
		// 1. 准备一个想要保存的类
		Lesson1Test lt = new Lesson1Test();
		
		
		// 2. 序列化
		// 2.1 确定存储路径
		string path = Application.persistentDataPath + "/Test.xml";
		
		// 2.2 写入文件
		// 括号内的代码：写入一个文件流，如果有该文件直接打开并修改，如果没有直接新建
		// using 的新用法：括号当中包裹的声明的对象 会在 大括号语句块结束后自动释放
		using ( StreamWriter stream = new StreamWriter(path) )
		{
			// 声明一个序列化翻译器
			XmlSerializer s = new XmlSerializer(typeof(Lesson1Test));
			
			// 通过Serialize方法进行序列化翻译
			// 参数1：文件流对象
			// 参数2：想要被翻译的对象
			// 注意：翻译机器的类型要和传入的对象是一致的
			s.Serialize(stream, lt);
		}
	}
}
```

**注意：序列化只支持`public`，不支持字典**

3. 以属性方式存储：
加上一个特性：`[XmlAttribute()]` ，括号里面可以传想要的属性名（字符串形式）

4. 给元素改名字：
- 普通元素：`[XmlElement()]`
- List：`[XmlArray()]`
- List里面的元素：`[XmlArrayItem()]`

### 反序列化
0. 定义：把 字节序列 还原为 对象 的过程

1. 反序列化：
```
using System.IO;
using System.Xml.Serialization; 

// 0.写出要反序列化对象所在路径
string path = Application.persistentDataPath + "/Lesson1Test.xml";
// 1. 判断文件是否存在
if( File.Exists(path) )
{
	// 2. 反序列化
	// 2.1 读取文件
	using (StreamReader reader = new StreamReader(path))
	{
		// 声明一个反序列化翻译器
		XmlSerializer s = new XmlSerializer(typeof(Lesson1Test));
		
		// 通过DeSerialize方法进行反序列化翻译
		// 参数：想要反序列化的对象
		Lesson1Test lt = s.DeSerialize(reader) as Lesson1Test;
	}
}
```

**注意：List对象如果有默认值，反序列化时不会清空，会在后面添加**

### Ixmlserializable 接口
1. 定义：`Ixmlserializable`是`XmlSerializer`提供的可拓展内容。他能让一些不能被序列化和反序列化的特殊类能被处理。

2. 自定义类实践：
```
public class Test1 : Ixmlserializable
{
	public int test1;
	
	// 下面是实现这个接口后要实现的方法
	
	public XmlSchema GetSchema()
	{
		return null;
	}
	
	public void ReadXml(XmlReader reader)
	{
		// 反序列化时自动调用
		// 1. 读属性
		this.test1 = int.Parse(reader["test1"]);
		// 2. 读节点
		// 方式1：
		reader.Read(); // 这时是读到根节点
		reader.Read(); // 这时是读到test1前面包裹节点
		this.test1 = int.Parse(reaser.Value()); // 得到当前内容的值
		reader.Read(); // 这时是读到test1尾部包裹节点
		// 方式2：
		while( reader.Read() )
		{
			if( reader.NodeType == XmlNodeType.Element )
			{
				switch(reader.Name)
				{
					case "test1":
						reader.Read();
						this.test1 = int.Parse(reader.Value);
						break;
				}
			}
		}
		// 3. 读包裹元素节点
		XmlSerializer s = new XmlSerializer(typeof(int));
		// 跳过根节点
		reader.Read();
		reader.ReadStartElement("test1");
		test1 = (int)s.Deserialize(reader);
		reader.ReadEndElement();
	}
	
	public void WriteXml(XmlWriter writer)
	{
		// 序列化时自动调用
		// 1. 写属性
		writer.WriteAttributeString("test1", this.test1.toString());
		// 2. 写节点
		writer.WriteElementString("test1", this.test1.toString());
		// 3. 写包裹节点
		Xmlserializer s = new Xmlserializer(typeof(int));
		writer.WriteStartElement("test1");
		s.Serialize(writer, test1);
		writer.WriteEndElement();
	}
}

public class Main: MonoBehaviour
{
	void Start()
	{
		Test1 t = new Test1();
		// 省略序列化和反序列化内容
	}
}
```
### 让Dictionary支持序列化

思路：继承`Dictionary`，然后实现`Ixmlserializable`接口

```
public class SerializerDictionary<TKey, TValue> : Dictionary<TKey, TValue>, Ixmlserializable
{	
	public XmlSchema GetSchema()
	{
		return null;
	}
	
	public void ReadXml(XmlReader reader)
	{
		XmlSerializer keySer = new XmlSerializer(typeof(TKey));
		XmlSerializer ValueSer = new XmlSerializer(typeof(TValue));
		
		// 跳过根节点
		reader.Read();
		
		while(reader.NodeType != XmlNodeType.EndElemenrt)
		{
			TKey key = (TKey)keySer.Deserialize(reader);
			TValue value = (TValue)keySer.Deserialize(reader);
			this.Add(key, value);
		}
		
		reader.Read();
	}
	
	public void WriteXml(XmlWriter writer)
	{
		XmlSerializer keySer = new XmlSerializer(typeof(TKey));
		XmlSerializer ValueSer = new XmlSerializer(typeof(TValue));
		
		foreach(KeyValuePair<TKey, TValue> kv in this)
		{
			// 键值对的序列化
			keySer.Serialize(writer, kv.Key);
			ValueSer.Serialize(writer, kv.Value);
		}
	}
}

public class Main: MonoBehaviour
{
	void Start()
	{
		TestLesson4 tl4 = new TestLesso4()
		tl4.dic = new SerializerDictionary<int, string>();
		// 省略序列化和反序列化
	}
}
```