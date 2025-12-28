---
title: Git学习笔记
tags:
  - Git
  - GitHub
date: '2025-12-16 16:18'
cover: 'https://tymimg.yuzhiboliuhua.cn/post1/cover1.jpg'
categories: blog
description: 本篇文章是GIT的学习笔记，供个人学习。
abbrlink: a91eaa72
---

这个是更详细的教程，主要用到第六条：
[GIT教程-廖雪峰]([简介 - Git教程 - 廖雪峰的官方网站](https://liaoxuefeng.com/books/git/introduction/index.html))

# 将Git仓库和GitHub仓库关联

要用Git往GitHub上上传，需要建立本地Git仓库与GitHub远程仓库之间的“安全身份认证通道”，同时实现“唯一身份识别 + 加密数据传输”，最终能让我们安全、专属地向GitHub推送 / 拉取代码。

以下是关联步骤：

1. 创建SSH Key
	- 创建步骤
		- 在任意文件夹下右键打开Git Bash，输入`ssh-keygen -t rsa -C "youremail@example.com"`，需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可。
		- 登录GitHub，通过右上角头像 -> 设置 -> SSH与GPG公钥 -> 新建SSH密钥，填上任意Title，在Key文本框里粘贴`id_rsa.pub`文件的内容（通过`cat ~/.ssh/id_rsa.pub`查看） -> 添加密钥

# 用Git上传文件

1. 准备好需要上传的文件（工程项目只需准备`Assets`、`Packages`和`Projectsettings`），将要用的文件保存在一个新的文件夹里

2. 接下来是关联该文件夹与GitHub中的仓库的步骤，如果已完成直接跳转第`3`步：
	- 初始化本地Git仓库：`git init`

3. 在这个文件夹中右键点击 `git bash`：
	- 暂存：`git add .`
	- 本地提交：`git commit -m "备注"`
	- 将本地当前分支强制重命名为 `main`：`git branch -M main`
	- 关联远程仓库：`git remote add origin HTTPS`
	- 推送到 GitHub 远程仓库：`git push origin main`（第一次推送：`git push -u origin main `）