/*
 Navicat Premium Dump SQL

 Source Server         : 8.134.196.44_3306
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41-0ubuntu0.22.04.1)
 Source Host           : 8.134.196.44:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41-0ubuntu0.22.04.1)
 File Encoding         : 65001

 Date: 02/03/2025 03:03:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `cover` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
  `description` varchar(500) DEFAULT NULL COMMENT '文章描述',
  `viewCount` int DEFAULT '0' COMMENT '浏览数',
  `likeCount` int DEFAULT '0' COMMENT '点赞数',
  `createdAt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedAt` datetime DEFAULT NULL COMMENT '更新时间',
  `type` tinyint(1) DEFAULT '1' COMMENT '文章类型',
  `top` tinyint(1) DEFAULT '0' COMMENT '是否置顶',
  `uuid` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '唯一标识',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 107 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (-1, '关于页面', '关于页面存档，勿删', 59, '2024-05-03 21:37:41', '2025-02-04 11:58:33', 1, 0, '5080abae095211efbc2d00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (92, '私链（联盟链）部署方式', '## 安装geth \n\n\n### 使用apt源安装方式 （ubuntu 22）\n\n	sudo apt-get install software-properties-common\n	sudo add-apt-repository -y ppa:ethereum/ethereum\n	sudo apt-get update\n	sudo apt-get install ethereum\n	//升级apt源\n	sudo apt-get upgrade\n	//查看geth是否安装成功和version\n	geth version\n\n## 创建账号密码（联盟链）\n\n因为需要将账号（地址）存放在指定目录所以不使用gethconsole的方式创建账号密码。\n\n	mkdir ddnNode\n	cd ddnNode\n	mkdir node1\n	mkdir node2\n	mkdir node3\n\n创建完三个节点目录后使用geth --datadir <目录> account new\n	geth --datadir ./node1/data account new\n	geth --datadir ./node2/data account new\n	geth --datadir ./node3/data account new\n\n每次运行账号后会返回私钥和存储位置，妥善保存，其中0x后的是地址\n\n## 创建创世区块文件\n\n创建完账号密码后需要初始化区块链，使用puppeth来创建创世区块文件，自己编辑也是可以的，但是会出现很多奇奇怪怪的bug。\n\n	//使用apt-get获取puppeth\n	sudo apt-get install puppeth\n	//启动puppeth\n	puppeth\n	//返回\n	+-----------------------------------------------------------+\n	| Welcome to puppeth, your Ethereum private network manager |\n	|                                                           |\n	| This tool lets you create a new Ethereum network down to  |\n	| the genesis block, bootnodes, miners and ethstats servers |\n	| without the hassle that it would normally entail.         |\n	|                                                           |\n	| Puppeth uses SSH to dial in to remote servers, and builds |\n	| its network components out of Docker containers using the |\n	| docker-compose toolset.                                   |\n	+-----------------------------------------------------------+\n	Please specify a network name to administer (no spaces, hyphens or capital letters please) \n\n	//填写你的区块链链名\n	luxchain\n	\n	//返回\n	Sweet, you can set this via --network=luxchain next time!\n\n输入完私链名称后, 出现选择菜单. 选择2: 配置新创世块\n\n\n	What would you like to do? (default = stats)\n	 1. Show network stats\n	 2. Configure new genesis\n	 3. Track new remote server\n	 4. Deploy network components\n\n\n出现子菜单, 选择私链的共识机制(Consensus Protocols).\n\n- proof-of-work(PoW): 工作量证明, 通过算力证明来达成共识\n- proof-of-authority(PoA): 权威证明, 通过预先设定的权威节点来负责达成共识\n\n这里选择PoA的认证方式, 和目前以太坊主链保持一致\n\n\n	Which consensus engine to use? (default = clique)\n	 1. Ethash - proof-of-work\n	 2. Clique - proof-of-authority\n\n选择2 poa共识算法\n\n选择PoA后, 会提示选择出块的间隔时间. 由于是用于内部测试的私链, 可以将出块时间设置较少, 这里配置5秒.\n\n	How many seconds should blocks take? (default = 15)\n\n	5\n\n设置那个账号作为权威来生成块, 这里输入account1账号作为权威账号\n\n```shell\nWhich accounts are allowed to seal? (mandatory at least one)\n> 0x5a92A5Da4F5AAa216A192eaF5ea28bf0940CcAC8\n> 0x\n```\n\n选择是否需要初始化就给指定账号ether, 这里可以输入之前建立账号的地址.直接输入地址，最好将创建的所有账号输入。\n\n```shell\nWhich accounts should be pre-funded? (advisable at least one)\n> 0x5a92A5Da4F5AAa216A192eaF5ea28bf0940CcAC8\n> 0x45443Ba7C01e9B40ae455d1eCb5FaDe1E8955a89\n> 0xD6Fb0c6c67F2a962e696DDD0eCd434fE2B240907\n```\n\n\n是否需要添加预编译账号时给预编译账号1wei的余额，推荐选择yes，不选yes部署时可能会有奇奇怪怪的bug。\n\n```shell\nShould the precompile-addresses (0x1 .. 0xff) be pre-funded with 1 wei? (advisable yes)\nyes\n```\n\n输入私链ID, 直接输入回车,已默认随机数作为私链ID，这里就随便填个数字\n\n```shell\nSpecify your chain/network ID if you want an explicit one (default = random)\n>4396\n```\n\n创世块中可以输入个人个性化信息, 这里可以随便输入字符.\n\n```shell\nAnything fun to embed into the genesis block? (max 32 bytes)\n>This is bayunche\'s private chain.\n```\n\n回到主菜单, 重新选择2\n\n```shell\nWhat would you like to do? (default = stats)\n 1. Show network stats\n 2. Manage existing genesis\n 3. Track new remote server\n 4. Deploy network components\n>\n```\n\n\n选择导出创世块配置文件\n\n```shell\n 1. Modify existing fork rules\n 2. Export genesis configuration\n>2\n```\n\n在提示创世块配置文件位置时, 直接输入回车, 默认当前目录生成创世块配置文件\n\n```shell\nWhich file to save the genesis into? (default = luxchain.json)\n>\n```\n\n创世块配置文件生成后, 会回到主菜单, 直接按Ctrl+z退出puppeth.\n\n\n## 初始化区块链\n\n创建完创世块配置文件后，就需要初始化区块链了，创建多节点的要求就是基于同个创世区块\n\n```shell\ngeth --datadir ./node1/data init ./luxitem.json\ngeth --datadir ./node2/data init ./luxitem.json\ngeth --datadir ./node3/data init ./luxitem.json\n```\n\n初始化区块链后就可以启动节点了\n\n```bash\ngeth --datadir ./node1/data --port 2001  --http --http.port 8548 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  console\n\ngeth --datadir ./node2/data --port 2002  --http --http.port 8549 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  console\n\ngeth --datadir ./node3/data --port 2002  --http --http.port 8549 --allow-insecure-unlock    --rpc.enabledeprecatedpersonal  console\n```\n\n启动成功后，我们需要将node1 和node2、3进行链接，geth会扫描但是不会自动链接节点。(以太坊主链则通过在代码中预设了启动节点, 可以启动发现其他节点)\n\n登录node1, 获取节点地址\n\n（如果在启动时没打console启动geth console，则需要再开一个bash以连接到console）\n链接方式：\n\n```bash\ngeth attach ipc:node1/data/geth.ipc\n```\n\n```bash\n\nadmin.nodeInfo.enode\n>enode://a1d457bad1a14bd0e8ff33fdc379224430602770b3a51eb012f82613935c5fb212cbee23f56749632c1a98a44821f9f87a806f8ab318bfe5fb03b4af4865f669@127.0.0.1:2001\n\n```\n\n或者在log的p2p networking中可以获取到ennode\n\n在node2和node3的console中添加node1的ennode\n\n```bash\n>admin.addPeer(\"enode://a1d457bad1a14bd0e8ff33fdc379224430602770b3a51eb012f82613935c5fb212cbee23f56749632c1a98a44821f9f87a806f8ab318bfe5fb03b4af4865f669@127.0.0.1:2001\")\n\n>true\n```\n\n在node1中可以查看是否成功添加节点\n\n```bash\n>net.peerCount\n\n>2\n```\n\n或者log中会出现peercount从0变为2\n\n```bash\n\nINFO [12-14|16:55:47.141] Looking for peers                        peercount=2 tried=105 static=0\n```\n\n## 设置账户以备部署\n\n我们在前面使用了node1的账户作为验证账户，为防止出现错误，也使用node1来设置账户。\n\n首先获取账户的余额以确认是否设置成功。\n\n```bash\n>eth.getBalance(eth.accounts[0])\n>9.04625697166532776746648320380374280103671755200316906558262375061821325312e+74\n```\n\n然后解锁账户以备挖矿更新链(设置为0是永久解锁)\n\n```bash\n>personal.unlockAccount(eth.accounts[0],\"123456\", 0) \n>true\n>personal.listWallets\n>[{\n    accounts: [{\n        address: \"0x5a92a5da4f5aaa216a192eaf5ea28bf0940ccac8\",\n        url: \"keystore:///root/ddnwork/ddnNode/node1/data/keystore/UTC--2023-12-14T07-32-52.094500002Z--5a92a5da4f5aaa216a192eaf5ea28bf0940ccac8\"\n    }],\n    status: \"unLocked\",\n    url: \"keystore:///root/ddnwork/ddnNode/node1/data/keystore/UTC--2023-12-14T07-32-52.094500002Z--5a92a5da4f5aaa216a192eaf5ea28bf0940ccac8\"\n}]\n```\n\n设置矿工账户（可以获得eth）\n\n```bash\n>miner.setEtherbase(\"0x5a92a5da4f5aaa216a192eaf5ea28bf0940ccac8\")\n>true\n```\n\n然后启动挖矿以实时更新链\n\n```bash\n>miner.start()\n>null\n```\n\n## 部署合约\n\n这里我使用了我自己编写的truffle项目，在truffle-config中找到network。\n\n	networks: {\n	    development: {\n	      host: \"127.0.0.1\", // Ganache 或本地节点的地址\n	      port: 7545, // Ganache 或本地节点的 RPC 端口\n	      network_id: \"5777\", // 任意网络 ID\n	    },\n	    advanced: {\n	      host: \"127.0.0.1\",\n	      port: 8545,\n	      network_id: \"*\", // Any network (default: none)\n	    }\n	  },\n\n修改port为部署的http端口\n\n然后使用yarn进行部署操作\n\n```bash\nyarn truffle migrate --network product\n```\n\n部署的时候会先对你的合约进行编译，编译成abi后再进行部署。\n\n```bash\nCompiling your contracts...\n===========================\n> Everything is up to date, there is nothing to compile.\n\n\nStarting migrations...\n======================\n> Network name:    \'product\'\n> Network id:      4396\n> Block gas limit: 4877543 (0x4a6ce7)\n\n\n1_LuxuryItemTracking_migration.js\n=================================\n\n   Deploying \'Migrations\'\n   ----------------------\n   > transaction hash:    0x3ac893fda6e51c6fcfd1f2d3393312251f905842ebabe0569fa6c03a4c4e14ea\n   > Blocks: 0            Seconds: 0\n   > contract address:    0x4A17Af1b0E3a024a94de2E1cfe6F1A73286a852D\n   > block number:        39\n   > block timestamp:     1702544153\n   > account:             0x5a92A5Da4F5AAa216A192eaF5ea28bf0940CcAC8\n   > balance:             904625697166532776746648320380374280103671755200316906558.262375061821325312\n   > gas used:            318427 (0x4dbdb)\n   > gas price:           1 gwei\n   > value sent:          0 ETH\n   > total cost:          0.000318427 ETH\n\n\n   Deploying \'LuxuryItemTracking\'\n   ------------------------------\n   > transaction hash:    0x6577c1310af48da5019267fc80b7f22c3da5e3350456a80ad629f71491bb5458\n   > Blocks: 1            Seconds: 4\n   > contract address:    0xc9D08B8421Fc514733ACBFABFB6b33a3e9fb9e38\n   > block number:        40\n   > block timestamp:     1702544158\n   > account:             0x5a92A5Da4F5AAa216A192eaF5ea28bf0940CcAC8\n   > balance:             904625697166532776746648320380374280103671755200316906558.262375061821325312\n   > gas used:            4159271 (0x3f7727)\n   > gas price:           1 gwei\n   > value sent:          0 ETH\n   > total cost:          0.004159271 ETH\n\n   > Saving migration to chain.\n   > Saving artifacts\n   -------------------------------------\n   > Total cost:         0.004477698 ETH\n\nSummary\n=======\n> Total deployments:   2\n> Final cost:          0.004477698 ETH\n\n\nDone in 14.51s.\n\n```', 70, '2024-05-04 14:03:19', '2025-02-08 13:56:51', 1, 0, '017a2f4c09dc11efbc2d00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (93, 'Go语言基础学习笔记', '\n## 1. 包、变量和函数\n\n### （一）每个 Go 程序都由包构成\n\n程序从 `main` 包开始运行。\n\n本程序通过导入路径 `\"fmt\"` 和 `\"math/rand\"` 来使用这两个包。\n\n按照约定，包名与导入路径的最后一个元素一致。例如，`\"math/rand\"` 包中的源码均以 `package rand` 语句开始。\n\n```go\n\npackage main\n\nimport (\n	\"fmt\"\n	\"math/rand\"\n)\n\nfunc main() {\n	fmt.Println(\"我最喜欢的数字是 \", rand.Intn(10))\n}\n```\n\n### (二)导入\n\n导入方式相当于JS ,用圆括号将导入的包分成一组，这是“分组”形式的导入语句。\n\n示例：\n\n```go\n\nimport \"fmt\"\nimport \"math\" //多个导入语句导入方式\n\nimport (\n\n\"ejs\"\n\"expole\"\n	   \n	   )\n```\n\n不过使用分组导入语句要更好。\n\n### （三）导出名\n\n导出名这个点和JS有很大差距，导入的包都有一个或多个导出名，导出名必须为**大写** 。\n同时，在导入一个包时，你只能**引用其中已导出的名字**。 任何「未导出」的名字在该包外均无法访问。\n\n### （四）函数\n\n函数和TS的函数比较相似，都是由定义func+函数名+返回值+函数体构成\n\n这是官方网站的定义：函数可接受零个或多个参数。\n\nps：注意类型是在变量的**后面**。\n\n同时，当连续两个或多个函数的已命名形参类型相同时，除最后一个类型以外，其它都可以省略。\n\n与JS/TS不同的是，Go的函数能返回**多个值**，定义方式是圆括号包裹返回值的类型，同时返回值使用return。获取返回值并赋值的方式也有些许不同\n\n示例：\n\n```go\n\npackage main\n\nimport \"fmt\"\n\nfunc add(x int, y int) int {\n	return x + y\n}\nfunc divide(x,y int) int {\nreturn x-y\n}\nfunc getString (x,y string) (string,string) {\nreturn y,x \n}\n\n\nfunc main() {\n  a,b :=getString(\"nihao\",“你好”)\n  \n	fmt.Println(add(42, 13))\n}\n```\n\n特殊的Go的返回值可以被命名，他们会被视为直接在函数顶层进行定义。我们约定俗成的将返回值的命名定义成能反映返回值含义的命名。同时返回值能被当成文档使用。\n同时，没有参数的 `return` 语句会直接返回已命名的返回值，也就是「裸」返回值。\n注意：裸返回语句应当仅用在下面这样的短函数中。在长的函数中它们会影响代码的可读性\n\n```go\n\npackage main\n\nimport \"fmt\"\n\nfunc split(sum int) (x, y int) {\n	x = sum * 4 / 9\n	y = sum - x\n	return\n}\n\n//等价于\n\nfunc split(sum int) (int,int){\n    x :=sum *4 /9\n    y := sun-x\n    return x,y\n}\n\nfunc main() {\n	fmt.Println(split(17))\n}\n```\n\n\n### （五）变量\n\n变量的定义方式和commonJS很相似，都是使用var进行定义和声明，和函数的参数列表一样，类型在最后。同时var的使用区域可以是在包层级也可以是在函数层级。\n\n```Go\npackage main\n\nimport \"fmt\"\n\nvar c, python, java bool\n\nfunc main() {\n	var i int\n	fmt.Println(i, c, python, java)\n}\n\n```\n\n同样的，初始化变量的方式也和JS相似。和TS相似，如果给予了变量初始值，将会自动推断变量的类型，可以省略变量的类型定义。\n\n``` Go\n\npackage main\n\nimport \"fmt\"\n\nvar i, j int = 1, 2  //声明并赋值\n\nfunc main() {\n	var c, python, java = true, false, \"no!\"\n	fmt.Println(i, j, c, python, java)\n}\n```\n\n\n短变量声明方式：在函数那一块中，示例使用了`:=`的方式进行声明并赋值，这就是短变量声明方式。但简单归简单短变量声明还是有许多限制的，如：在函数中，短赋值语句 `:=` 可在**隐式**确定类型的 `var` 声明中使用。函数外的每个语句都 **必须** 以关键字开始（`var`、`func` 等），因此 `:=` 结构不能在函数外使用。也就是包层级无法使用短变量声明方式\n\n```Go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	var i, j int = 1, 2\n	k := 3\n	c, python, java := true, false, \"no!\"\n\n	fmt.Println(i, j, k, c, python, java)\n}\n\n```\n\n踩坑点注意：在 Go 中，是允许在函数内部使用函数字面量（function literals）的方式来定义一个函数。但是，使用这种方式定义函数时，不允许使用函数名。也就是说\n```go\nfunc main() {\n// func any (face int) int { 这种情况是不允许的\n//return face\n//}\n//正确的声明方式\nany :=func (face int ) int {\nreturn face\n}\n}\n```\n### （六）变量的基本类型\n\n1.bool 布尔类型\n2.string 字符串类型\n3.int 整型 家族有：int  int8  int16  int32  int64 uint uint8 uint16 uint32 uint64 uintptr\n4.byte 字节，也就是uint8的别名\n5.rune 表示一个unicode码位，也就是int32的别名\n6.float 浮点数  家族有：float32 float64\n7.complex64 32位实数或者虚数 complex128 64位实数或虚数\n\n在我们直接声明一个变量但没有对它进行赋值的时候，Go会自动给这个变量添加零值（万恶的JS,万恶的undefined），零值的值是根据声明对象时的类型决定的，数值类型为0、布尔类型为false，字符串为“”（空串）。\n\n### （七）类型转换\n\n在Go中类型转换需要显式的使用表达式T（v）将值v转换为类型T。\n转换示例：\n```go\nvar i int = 42\nvar f float64 = float64(i)\nvar u uint = uint(f)\n```\n\n或者使用短变量声明方式进行转化\n\n``` Go\ni := 42\nf := float64(i)\nu := uint(f)\n\n```\n\n### （八）类型推断\n\n类型推断的方式和TS相似，但是有一部分区别。\n当右边包含未指明类型的数值常量时，新变量的类型就可能是 `int`、`float64` 或 `complex128` 了，这取决于常量的精度：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	v := 42.123+0.5i \n	fmt.Printf(\"v is of type %T\\n\", v)//v is of type complex128\n}\n```\n \n\n### （九）常量\n\n常量的声明方式和JS相似，都是使用`const`关键字进行定义，但是唯一需要注意的是，常量不能使用`:=`短变量声明方式进行声明。\n数值常量是高精度的**值**，一个未指定类型的常量由上下文来决定其类型。\n\n', 53, '2024-05-05 13:23:48', '2025-02-07 11:44:16', 1, 0, 'a700f3000a9f11efbc2d00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (94, 'Go语言基础学习笔记（流程控制语句）', '## 2.流程控制语句\n\n### （一）for循环\n\n区别于cpp、js、java，Go只有一种循环结构，也就是for循环。\n基本的for循环由三个部分构成，他们使用分号进行分隔：\n\n初始化语句：i:=0;\n条件表达式：在每次迭代前进行求值操作，i<xxx;i++\n后置语句：在每次迭代的结尾执行\n\n初始化语句通常为短变量声明语句，该变量语句仅在 `for`语句的作用域中可见。\n一旦表达式求值为false循环迭代将会终止。\n\n注意：和cpp、java、js等语言不同，Go 的 `for` 语句后面的三个构成部分外没有小括号， 大括号 `{ }` 则是必须的。\n\nps：初始化语句和后置语句是可选的。\n\n示例：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	sum := 0\n	for i := 0; i < 10; i++ {\n		sum += i\n	}\n	fmt.Println(sum)\n}\n```\n\n如果你删去分号，前置初始化语句，只保留条件表达式，这就是和cpp中的while拥有相同功能的“while”。\n\n示例：\n\n``` go\n\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	sum := 1\n	for sum < 1000 {\n		sum += sum\n	}\n	fmt.Println(sum)\n}\n\n```\n\n\n如果你需要使用无限循环，你只需要省略循环条件，这个循环就不会结束，所以你会发现无限循环可以写的非常紧凑。\n\n示例：\n\n```go\npackage main\n\nfunc main() {\n	for {\n	}\n}\n\n```\n\n\n### （二）if判断语句 \n\ngo的if判断和js、cpp等非常相似，只是在表达式外无需使用圆括号包裹。但是花括号是必须的。\n\n示例：\n\n```go\n\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\nfunc sqrt(x float64) string {\n	if x < 0 {\n		return sqrt(-x) + \"i\"\n	}\n	return fmt.Sprint(math.Sqrt(x))\n}\n\nfunc main() {\n	fmt.Println(sqrt(2), sqrt(-4))\n}\n\n```\n\n注意：和for一样，if语句可以在条件表达式前执行一个简短语句。\n该语句声明的变量作用域仅在 `if` 之内。也就是块级作用域的定义，相当于JS中的let定义。\n\n示例：\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\nfunc pow(x, n, lim float64) float64 {\n	if v := math.Pow(x, n); v < lim {\n		return v\n	}\n	return v //输出为undefined\n}\n\nfunc main() {\n	fmt.Println(\n		pow(3, 2, 10),\n		pow(3, 3, 20),\n	)\n}\n\n```\n\n如果使用else，那简短语句定义的变量同样可以在对应的任何 `else` 块中使用。\n示例：\n\n（在 `main` 的 `fmt.Println` 调用开始前，两次对 `pow` 的调用均已执行并返回其各自的结果。）\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\nfunc pow(x, n, lim float64) float64 {\n	if v := math.Pow(x, n); v < lim {\n		return v\n	} else {\n		fmt.Printf(\"%g >= %g\\n\", v, lim)\n	}\n	// can\'t use v here, though\n	return lim\n}\n\nfunc main() {\n	fmt.Println(\n		pow(3, 2, 10),\n		pow(3, 3, 20),\n	)\n}\n\n```\n\n### （三）switch分支语句\n\n\n\n`switch`语句和 C++、Java、JavaScript 和 PHP 中的switch语句相似但有两点不同。\n\n在效果上，Go 的做法相当于这些语言中为每个 `case` 后面自动添加了所需的 `break` 语句，不需要再添加break。\n\n另外一点不同在于case不需要特定为常量，且取值可以不限于整数。\n\n示例：\n\n```Go\n\n package main\n\nimport (\n	\"fmt\"\n	\"runtime\"\n)\n\nfunc main() {\n	fmt.Print(\"Go 运行的系统环境：\")\n	switch os := runtime.GOOS; os {\n	case \"darwin\":\n		fmt.Println(\"macOS.\")\n	case \"linux\":\n		fmt.Println(\"Linux.\")\n	default:\n		// freebsd, openbsd,\n		// plan9, windows...\n		fmt.Printf(\"%s.\\n\", os)\n	}\n}\n\n```\n\n注意：`switch` 的 `case` 语句从上到下顺次执行，直到匹配成功时停止。\n\n无条件的switch和多个if else的功能相似，无条件switch等同于switch true。\n\n### （四）defer 推迟 （关键字）\n\ndefer语句会让后面跟随的函数推迟到外部函数返回后再执行。defer实现的效果类似promise then的效果，在父函数执行完成后再调用该函数。\n\n注意：使用defer关键字推迟调用的函数，函数的参数会立即进行求值，但是直到外层函数返回前都不会调用\n\nps：使用defer关键字推迟的函数会被压入栈中，当外层函数返回时，被推迟的调用会按照后进先出的顺序调用。\n\n示例：\n\n```go\n\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	fmt.Println(\"counting\")\n\n	for i := 0; i < 10; i++ {\n		defer fmt.Println(i)\n	}\n\n	fmt.Println(\"done\")\n}\n\n```\n\n', 183, '2024-05-06 18:52:22', '2025-02-02 15:37:10', 1, 0, 'b78f26f60b9611efbc2d00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (95, 'Go语言基础学习笔记（更多类型）', '\n接下来就是最麻烦的结构体和切片了，还有我们最爱的指针（cpp永远的痛）\n\n### 3.指针\n\nGo和cpp一样，都提供了指针操作的能力。\n\n官方定义：指针保存了值的内存地址。\n\n指针的其实就是一个标志，标志着存储了这个值的内存地址。JS的浅拷贝和深拷贝也是这个问题，但是Go提供了直接对内存地址操作的方式也可以近似的理解为深拷贝。\n\n类型 `*T` 是指向 `T` 类型值的指针，其零值为 `nil`。  （重点，后面会用到很多次）\n\n	·var p *int\n\n`&` 操作符会生成一个指向其操作数的指针。\n\n	i := 42\n	p = &i\n\n`*` 操作符表示指针指向的底层值。与 C 不同，Go 没有指针运算。\n\n示例：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	i, j := 42, 2701\n\n	p := &i         // 指向 i\n	fmt.Println(*p) // 通过指针读取 i 的值\n	*p = 21         // 通过指针设置 i 的值\n	fmt.Println(i)  // 查看 i 的值\n\n	p = &j         // 指向 j\n	*p = *p / 37   // 通过指针对 j 进行除法运算\n	fmt.Println(j) // 查看 j 的值\n\n```\n\n### 4.struct 结构体\n\n一个结构体（struct）就是一组字段 （field）。struct关键字是用来定义一个结构类型。\n可以理解为TypeScript中的对象type定义方式。\n\n示例：\n\n```go\n\npackage main\n\nimport \"fmt\"\n\ntype Vertex struct {\n	X int\n	Y int\n}\n\nfunc main() {\n	fmt.Println(Vertex{1, 2})\n}\n\n```\n\n结构体字段可以使用点号 `.`来访问。（这不就和TS/JS一样嘛）\n\n现在我们定义一个指针指向Vertex。\n\n如果我们有一个指向结构体的指针 `p` 那么可以通过 `(*p).X` 来访问其字段 `X`。 不过这么写太啰嗦了，所以语言也允许我们使用隐式解引用，直接写 `p.X` 就可以\n\n```go\n\nv:=Vertex{1.3}\n\np:=&v\n\np.X=15\n\n```\n\n### 5.数组 \n\n类型 `[n]T` 表示一个数组，它拥有 `n` 个类型为 `T` 的值。\n\n定义方式：\n\n	var a [10] int \n\n会将变量 `a` 声明为拥有 10 个整数的数组。\n\n数组的长度是其类型的一部分，因此数组不能改变大小。 这看起来是个限制，不过没关系，Go 拥有更加方便的使用数组的方式.。\n\n示例：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	var a [2]string\n	a[0] = \"Hello\"\n	a[1] = \"World\"\n	fmt.Println(a[0], a[1])\n	fmt.Println(a)\n\n	primes := [6]int{2, 3, 5, 7, 11, 13}\n	fmt.Println(primes)\n}\n\n```\n\n### 6.切片\n\n每个数组的大小都是固定的。而切片则为数组元素提供了动态大小的、灵活的视角。 在实践中，切片比数组更常用。\n\n切片其实就是切割后的数组。使用类型 `[]T` 表示一个元素类型为 `T` 的切片。\n\n切片通过两个下标来界定，一个下界和一个上界，二者以冒号分隔：\n\n	a[low : high]\n\n切片是左闭右开区间，以下表达式创建了一个切片，它包含 `a` 中下标从 1 到 3 的元素：\n\n	a[1:4]\n\n示例：\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	primes := [6]int{2, 3, 5, 7, 11, 13}\n\n	var s []int = primes[1:4]\n	fmt.Println(s)\n}\n\n```\n\nps：切片就像数组的引用 切片并不存储任何数据，它只是描述了底层数组中的一段。如果你修改了切片中的元素会导致底层数组的改变，所有基于这个数组的切片都会观测到这个修改。\n\n除了从数组切割而来，还有其他办法创建一个切片，就是使用切片字面量。\n\n	s := []int{1, 2, 3, 4, 5} // 直接创建长度为5、容量也为5的int切片\n\n\n\n在进行切片的时候，你可以利用它的默认行为来忽略上下界。切片下界的默认值为 0，上界则是该切片的长度。\n\n对于数组\n\n	var a [10]int\n\n来说，以下切片表达式和它是等价的：\n\n	a[0:10]\n	a[:10]\n	a[0:]\n	a[:]\n\n\n切片拥有 **长度** 和 **容量**，切片的长度就是它所包含的元素个数。\n\n切片的容量是从它的第一个元素开始数，到其底层数组元素末尾的个数。\n\n切片 `s` 的长度和容量可通过表达式 `len(s)` 和 `cap(s)` 来获取。\n\n你可以通过重新切片来扩展一个切片，给它提供足够的容量。\n\n注意：切片在一定程度上算数组的条件引用，所以他的零值是nil。\n\nnil 切片的长度和容量为 0 且没有底层数组。\n\n如果你需要创建动态数组，可以使用`make`函数进行创建\n\n`make` 函数会分配一个元素为零值的数组并返回一个引用了它的切片：\n\n	a := make([]int, 5)  // len(a)=5\n\n要指定它的容量，需向 `make` 传入第三个参数：\n\n	b := make([]int, 0, 5) // len(b)=0, cap(b)=5\n	\n	b = b[:cap(b)] // len(b)=5, cap(b)=5\n	b = b[1:]      // len(b)=4, cap(b)=4\n\n\n切片可以包含任何类型，当然也可以包含切片。\n\n示例：\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"strings\"\n)\n\nfunc main() {\n	// 创建一个井字棋（经典游戏）\n	board := [][]string{\n		[]string{\"_\", \"_\", \"_\"},\n		[]string{\"_\", \"_\", \"_\"},\n		[]string{\"_\", \"_\", \"_\"},\n	}\n\n	// 两个玩家轮流打上 X 和 O\n	board[0][0] = \"X\"\n	board[2][2] = \"O\"\n	board[1][2] = \"X\"\n	board[1][0] = \"O\"\n	board[0][2] = \"X\"\n\n	for i := 0; i < len(board); i++ {\n		fmt.Printf(\"%s\\n\", strings.Join(board[i], \" \"))\n	}\n}\n\n```\n\n如果需要向切片中添加元素，我们需要使用内置的`append`函数。\n\nappend函数参数：第一个参数为需要进行添加的切片，第二个以及后面的参数为添加的元素。\n\n`append` 的第一个参数 `s` 是一个元素类型为 `T` 的切片，其余类型为 `T` 的值将会追加到该切片的末尾。\n\n`append` 的结果是一个包含原切片所有元素加上新添加元素的切片。\n\n当 `s` 的底层数组太小，不足以容纳所有给定的值时，它就会分配一个更大的数组。 返回的切片会指向这个新分配的数组。\n\n示例：\n\n```go\n\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	var s []int\n	printSlice(s)\n\n	// 可在空切片上追加\n	s = append(s, 0)\n	printSlice(s)\n\n	// 这个切片会按需增长\n	s = append(s, 1)\n	printSlice(s)\n\n	// 可以一次性添加多个元素\n	s = append(s, 2, 3, 4)\n	printSlice(s)\n}\n\nfunc printSlice(s []int) {\n	fmt.Printf(\"len=%d cap=%d %v\\n\", len(s), cap(s), s)\n}\n\n```\n\n\n注意：当切片容量不足以容纳新元素时，`append()`函数会自动扩容。扩容策略如下：\n\n1. **首次扩容**：新容量为原容量的两倍加上新添加元素的数量。\n2. **后续扩容**：若原容量已达到或超过1000，新容量为原容量的1.25倍加上新添加元素的数量；否则，新容量仍为原容量的两倍加上新添加元素的数量。\n\n扩容可能导致性能开销和数据迁移，因此在预知切片大小的情况下，建议使用`make()`函数指定合适的初始容量。\n\n\n常见错误和问题：、\n（1）修改切片元素会影响所有引用同一底层数组的切片。理解这一点有助于避免数据竞争和意外修改。\n（2）访问切片时，索引超出切片长度会导致panic。确保索引在有效范围内：\n（3）`append()`函数可能改变原切片的地址，因此应始终使用其返回值：\n\n	s := []int{1, 2, 3} s = append(s, 4) // 必须使用append的返回值，否则可能丢失新添加的元素\n\n\n切片和映射的遍历方式：\n\n当使用 `for` 循环遍历切片时，每次迭代都会返回两个值。 第一个值为当前元素的下标，第二个值为该下标所对应元素的一份副本。\n\n```go\npackage main\n\nimport \"fmt\"\n\nvar pow = []int{1, 2, 4, 8, 16, 32, 64, 128}\n\nfunc main() {\n	for i, v := range pow {\n		fmt.Printf(\"2**%d = %d\\n\", i, v)\n	}\n}\n\n```\n\n可以将下标或值赋予 `_` 来忽略它。如果只需要索引或者值只需要使用下划线就可以忽略\n\n```go\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n	pow := make([]int, 10)\n	for i := range pow {\n		pow[i] = 1 << uint(i) // == 2**i\n	}\n	for _, value := range pow {\n		fmt.Printf(\"%d\\n\", value)\n	}\n}\n\n```\n\n### 7.map映射\n\n\nmap是一种无序的基于key-value的数据结构，Go语言中的map是引用类型，必须初始化才能使用。\n类似于JS中的对象，`map` 映射将键映射到值。映射的零值为 `nil` 。`nil` 映射既没有键，也不能添加键。`make` 函数会返回给定类型的映射，并将其初始化备用。\n创建映射的方式推荐使用make函数进行创建：`	m := make(map[string]int)` 其中map是映射关键字，string代表了键的类型，int代表了值的类型。\n\n\n示例：\n\n```go\n\npackage main\n\nimport \"fmt\"\n\ntype Vertex struct {\n	Lat, Long float64\n}\n\nvar m map[string]Vertex\n\nfunc main() {\n	m = make(map[string]Vertex)\n	m[\"Bell Labs\"] = Vertex{\n		40.68433, -74.39967,\n	}\n	fmt.Println(m[\"Bell Labs\"])\n}\n\n```\n\n映射的字面量和结构体类似，只不过必须有键名。\n\n```go\n\npackage main\n\nimport \"fmt\"\n\ntype Vertex struct {\n	Lat, Long float64\n}\n\nvar m = map[string]Vertex{\n	\"Bell Labs\": Vertex{\n		40.68433, -74.39967,\n	},\n	\"Google\": Vertex{\n		37.42202, -122.08408,\n	},\n}\n\nfunc main() {\n	fmt.Println(m)\n}\n\n```\n\n映射的修改，使用`m[key] = elem`对key的元素进行修改，获取元素对应的值使用`elem = m[key]`,删除元素使用`delete(m, key)`传入映射以及需要删除的key。\n\n如果我们需要检查某个键是否存在，可以使用`elem, ok = m[key]`的双赋值方式进行检测。\n若 `key` 在 `m` 中，`ok` 为 `true` ；否则，`ok` 为 `false`。\n若 `key` 不在映射中，则 `elem` 是该映射元素类型的零值。\n\n### 8.函数闭包\n\n函数也是值。它们可以像其他值一样传递。\n\n函数值可以用作函数的参数或返回值。\nGo 函数可以是一个闭包。闭包是一个函数值，它引用了其函数体之外的变量。 该函数可以访问并赋予其引用的变量值，换句话说，该函数被“绑定”到了这些变量。\n\n例如，函数 `adder` 返回一个闭包。每个闭包都被绑定在其各自的 `sum` 变量上。\n\n', 183, '2024-05-08 13:55:58', '2025-02-03 02:05:02', 1, 0, 'a41d402f0cff11efbc2d00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (96, 'Go语言基础学习笔记 （方法与结构）', '## 1.方法\n\n在Go中没有类这一定义，不同于java和js。不过你可以为类型定义方法，和js中的对象中的某一项为函数的调用方式相似。\n\n在Go中，方法是一类带特殊的**接受者**参数的函数。\n\n方法接收者在它自己的参数列表内，位于`func`关键字和方法名中间\n\n	func (v Vertex) Abs() float64 //类似于这样\n\n示例：\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\ntype Vertex struct {\n	X, Y float64\n}\n\nfunc (v Vertex) Abs() float64 {\n	return math.Sqrt(v.X*v.X + v.Y*v.Y)\n}\n\nfunc main() {\n	v := Vertex{3, 4}\n	fmt.Println(v.Abs())\n}\n\n```\n\n在这个示例中，`Abs` 方法拥有一个名字为 `v`，类型为 `Vertex` 的接收者。\n\n\n需要记住的是：方法只是一个带接收者参数的函数。现在这个 `Abs` 的写法就是个正常的函数，功能并没有什么变化。\n\n同时，我们也能为非结构类型体，如基本类型等声明方法。\n\n在示例中，我们声明了一个带 `Abs` 方法的数值类型 `MyFloat`。\n\n你只能为在同一个包中定义的接收者类型声明方法，而不能为其它别的包中定义的类型 （包括 `int` 之类的内置类型）声明方法。\n\nps：也就是接收者的类型定义和方法声明必须在同一包内。\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\ntype MyFloat float64\n\nfunc (f MyFloat) Abs() float64 {\n	if f < 0 {\n		return float64(-f)\n	}\n	return float64(f)\n}\n\nfunc main() {\n	f := MyFloat(-math.Sqrt2)\n	fmt.Println(f.Abs())\n}\n\n```\n与此同时，你可以为指针类型的接收者定义方法，这意味着对于某类型 `T`，接收者的类型可以用 `*T` 的文法。 （此外，`T` 本身不能是指针，比如不能是 `*int`。）指针接收者的方法可以修改接收者指向的值。 由于方法经常需要修改它的接收者，指针接收者比值接收者更常用。\n\n若使用值接收者，那么 `Scale` 方法会对原始 `Vertex` 值的副本进行操作。（对于函数的其它参数也是如此。）`Scale` 方法必须用指针接收者来更改 `main` 函数中声明的 `Vertex` 的值。\n\nps：要区分什么时候使用指针接收者还是使用值接收者其实只需要判断你的方法执行时是否需要改变调用者，如果需要，使用指针接收者以实现调用方法时对接受者的变更能体现到原调用者，反之则使用值调用者。\n\n实际上，值接收者在调用方法时是创建一个副本，再对副本进行操作，如果方法的接收者是一个非常大的`struct`，每次调用接受者函数 都会形成struct的大副本，对性能有巨大的影响。\n\n\nGo中默认带指针参数的函数必须接受一个指针，而接收者为指针的的方法被调用时，接收者既能是值又能是指针。\n\n```go\nvar v Vertex\nScaleFunc(v, 5)  // 编译错误！\nScaleFunc(&v, 5) // OK\n\nvar b Vertex\nb.Scale(5)  // OK\np := &b\np.Scale(10) // OK\n```\n\n对于语句 `v.Scale(5)` 来说，即便 `v` 是一个值而非指针，带指针接收者的方法也能被直接调用。 也就是说，由于 `Scale` 方法有一个指针接收者，为方便起见，Go 会将语句 `v.Scale(5)` 解释为 `(&v).Scale(5)`。反之也一样，接受一个值作为参数的函数必须接受一个指定类型的值，而以值为接收者的方法被调用时，接收者既能为值又能为指针。\n\n### 2.接口\n\n接口在Go中是一种数据类型，提供了另外一种数据类型即接口，它把所有的具有共性的方法定义在一起，任何其他类型只要实现了这些方法就是实现了这个接口。\n\nGo 语言中的接口是隐式实现的，也就是说，如果一个类型实现了一个接口定义的所有方法，那么它就自动地实现了该接口。因此，我们可以通过将接口作为参数来实现对不同类型的调用，从而实现多态。\n\n多态：多态是指代码可以根据类型的具体实现采取不同行为的能力。因为任何用户定义的类型都可以实现任何接口，所以通过不同实体类型对接口值方法的调用就是多态。\n\n示例：\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\ntype Abser interface {\n	Abs() float64\n}\n\nfunc main() {\n	var a Abser\n	f := MyFloat(-math.Sqrt2)\n	v := Vertex{3, 4}\n\n	a = f  // a MyFloat 实现了 Abser\n	a = &v // a *Vertex 实现了 Abser\n\n	// 下面一行，v 是一个 Vertex（而不是 *Vertex）\n	// 所以没有实现 Abser。\n	a = v\n\n	fmt.Println(a.Abs())\n}\n\ntype MyFloat float64\n\nfunc (f MyFloat) Abs() float64 {\n	if f < 0 {\n		return float64(-f)\n	}\n	return float64(f)\n}\n\ntype Vertex struct {\n	X, Y float64\n}\n\nfunc (v *Vertex) Abs() float64 {\n	return math.Sqrt(v.X*v.X + v.Y*v.Y)\n}\n\n```\n\n接口也是值。可以像值一样进行传递。同时，接口值也能作为函数的参数和返回值。\n\n在内部，接口值可以看做包含值和具体类型的元组：\n\n(value, type)\n\n接口值保存了一个具体底层类型的具体值。\n\n接口值调用方法时会执行其底层类型的同名方法。\n\n示例：\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"math\"\n)\n\ntype I interface {\n	M()\n}\n\ntype T struct {\n	S string\n}\n\nfunc (t *T) M() {\n	fmt.Println(t.S)\n}\n\ntype F float64\n\nfunc (f F) M() {\n	fmt.Println(f)\n}\n\nfunc main() {\n	var i I\n\n	i = &T{\"Hello\"}\n	describe(i)\n	i.M()\n\n	i = F(math.Pi)\n	describe(i)\n	i.M()\n}\n\nfunc describe(i I) {\n	fmt.Printf(\"(%v, %T)\\n\", i, i)\n}\n\n```\n\n就算接口内的具体值为 nil，方法仍然会被 nil 接收者调用。在一些语言中（说的就是你Java），这会触发一个空指针异常，但在 Go 中通常会写一些方法来优雅地处理它（如本例中的 `M` 方法）。\n\nnil 接口值既不保存值也不保存具体类型，为 nil 接口调用方法会产生运行时错误，因为接口的元组内并未包含能够指明该调用哪个 **具体** 方法的类型。\n\n\n如果直接定义一个接口并指定了零个方法，这个接口就是空接口。\n\n空接口可以保存任何类型的值。空接口被用来处理未知类型的值。例如，`fmt.Print` 可接受类型为 `interface{}` 的任意数量的参数。\n\n### 4.类型断言\n\n类型断言为我们提供了一个访问接口具体值的方式。\n\n	t := i.(T)\n\n该语句的断言值i保存了具体类型T，并将底层类型为T的值赋予变量t。\n\n若 `i` 并未保存 `T` 类型的值，该语句就会触发一个 panic。\n\n为了 **判断** 一个接口值是否保存了一个特定的类型，类型断言可返回两个值：其底层值以及一个报告断言是否成功的布尔值。\n\n	t, ok := i.(T)\n\n若 `i` 保存了一个 `T`，那么 `t` 将会是其底层值，而 `ok` 为 `true`。\n\n否则，`ok` 将为 `false` 而 `t` 将为 `T` 类型的零值，程序并不会产生 panic。\n\n其实就是直接对该interface中的值进行一个类型的确认，确认成功就不会panic，如果和你需要确认的类型不相同将会触发一个panic。\n\n### 5.类型选择\n\n在go中类型选择是一种按顺序从几个类型断言中选择分支的结构。类型选择一般和switch语句非常相似，不过类型选择中的case是类型而不是值，他们针对给定接口所存储的值的类型进行比较。\n\n```go\nswitch v := i.(type) {\ncase T:\n    // v 的类型为 T\ncase S:\n    // v 的类型为 S\ndefault:\n    // 没有匹配，v 与 i 的类型相同\n}\n```\n类型选择中的声明与类型断言 `i.(T)` 的语法相同，只是具体类型 `T` 被替换成了关键字 `type`。\n\n此选择语句判断接口值 `i` 保存的值类型是 `T` 还是 `S`。在 `T` 或 `S` 的情况下，变量 `v` 会分别按 `T` 或 `S` 类型保存 `i` 拥有的值。在默认（即没有匹配）的情况下，变量 `v` 与 `i` 的接口类型和值相同。\n\n\n一个简单的练习：\n\n```go\npackage main\n\nimport (\n	\"fmt\"\n	\"strings\"\n)\n\ntype IPAddr [4]byte\n\n// TODO: 为 IPAddr 添加一个 \"String() string\" 方法。\n\nfunc (ip IPAddr) String() string {\n	// 使用 strings.Join 将字节切片转换为点号分隔的字符串\n	// 需要先将每个字节转换为字符串\n	strParts := make([]string, len(ip))\n	for i, octet := range ip {\n		strParts[i] = fmt.Sprint(octet)\n	}\n	return strings.Join(strParts, \".\")\n}\n\nfunc main() {\n	hosts := map[string]IPAddr{\n		\"loopback\":  {127, 0, 0, 1},\n		\"googleDNS\": {8, 8, 8, 8},\n	}\n\n	for name, ip := range hosts {\n\n		fmt.Printf(\"%v: %v\\n\", name, ip)\n	}\n}\n\n```\n\n### 6.错误\n\nGo 程序使用 `error` 值来表示错误状态。与`fmt.Stringer` 类似，`error` 类型是一个内建接口：\n\n```go \ntype error interface {\n    Error() string\n}\n```\n\n（与 `fmt.Stringer` 类似，`fmt` 包也会根据对 `error` 的实现来打印值。）\n\n通常函数会返回一个 `error` 值，调用它的代码应当判断这个错误是否等于 `nil` 来进行错误处理。\n\n```go\ni, err := strconv.Atoi(\"42\")\nif err != nil {\n    fmt.Printf(\"couldn\'t convert number: %v\\n\", err)\n    return\n}\nfmt.Println(\"Converted integer:\", i)\n```\n\n`error` 为 nil 时表示成功；非 nil 的 `error` 表示失败。', 199, '2024-05-29 22:16:58', '2025-02-09 02:23:08', 1, 0, '1c4e03591dc611efbc2d00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (97, 'Go 并发安全和锁', '\n\n\n有时候，我们在go代码编写中会出现多个goroutine同时操作一个临界区(也就是一个资源)，这种情况会发生竞态问题。\n\n会出现竞态问题的代码如下：\n\n```go\nvar x int64\n\nvar sg sync.WaitGroup\n\nfunc add () {\n\n    for i:=0;i++ {\n    x= x+1\n    } \n    wg.Done()\n  \n}\n\nfunc main (){\nwg.Add(2)\ngo add()\ngo add()\nwg.Wait()\nfmt.Println(x)\n}\n```\n\n上面我们使用了开启了两个协程调用add对x进行累加，这两个协程在修改和访问x变量时会出现数据竞争的问题，导致最后结果和预期是不符的\n\n这种情况下我们可以使用加锁的方式控制go协程对共享资源进行操作以保证不会出现竞态问题。\n\n## 互斥锁\n\ngo提供了sync包中的Mutex类型对互斥锁进行实现。他能保证同时只有一个goroutine可以访问共享资源。互斥锁能保证在同一时间，对资源的写入和读取操作有且只有一个，并且多个协程在等待同一个锁的时候，唤醒协程的策略是随机的。\n\nps:互斥锁的性能是比较低的，go提供的互斥锁的类型是经过优化的，在绝大多数情况下是比自己写锁是要好的。\n\n现在使用互斥锁来解决上面的问题\n\n```go\nvar x int64\n\nvar sg sync.WaitGroup\n\nvar lock sync.Mutex\n\nfunc add () {\n\n    for i:=0;i++ {\n    lock.Lock()\n    x= x+1\n    lock.Unlock\n    } \n    wg.Done()\n  \n}\n\nfunc main (){\nwg.Add(2)\ngo add()\ngo add()\nwg.Wait()\nfmt.Println(x)\n}\n```\n\n## 读写互斥锁\n\n互斥锁是完全互斥的，这个就导致在实际场景下（读多写少），我们去并发的读取一个资源，加互斥锁的话会导致性能的急剧下降，这种情况下我们可以使用读写锁。sync包中也提供了一个读写锁的实现，就是sync包中的RWMutex类型。\n\n读写锁分为两种锁，一种是读锁，一种是写锁。在协程获取到资源的读锁后，其他协程如果获取读锁，将会继续获得读锁，而获取写锁的话将会等待所有读锁释放后才能获取到写锁。同理，当一个协程获取到写锁时，所有获取读锁和写锁的协程都将等待写锁释放后才能获取对应的写锁和读锁。\n\n\n读写锁示例：\n\n```go\nvar (\n\n    x      int64\n\n    wg     sync.WaitGroup\n\n    lock   sync.Mutex\n\n    rwlock sync.RWMutex\n\n)\n\n  \n\nfunc write() {\n\n    // lock.Lock()   // 加互斥锁\n\n    rwlock.Lock() // 加写锁\n\n    x = x + 1\n\n    time.Sleep(10 * time.Millisecond) // 假设读操作耗时10毫秒\n\n    rwlock.Unlock()                   // 解写锁\n\n    // lock.Unlock()                     // 解互斥锁\n\n    wg.Done()\n\n}\n\n  \n\nfunc read() {\n\n    // lock.Lock()                  // 加互斥锁\n\n    rwlock.RLock()               // 加读锁\n\n    time.Sleep(time.Millisecond) // 假设读操作耗时1毫秒\n\n    rwlock.RUnlock()             // 解读锁\n\n    // lock.Unlock()                // 解互斥锁\n\n    wg.Done()\n\n}\n\n  \n\nfunc main() {\n\n    start := time.Now()\n\n    for i := 0; i < 10; i++ {\n\n        wg.Add(1)\n\n        go write()\n\n    }\n\n  \n\n    for i := 0; i < 1000; i++ {\n\n        wg.Add(1)\n\n        go read()\n\n    }\n\n  \n\n    wg.Wait()\n\n    end := time.Now()\n\n    fmt.Println(end.Sub(start))\n\n}\n```\n\n', 264, '2024-06-26 00:26:49', '2025-02-05 11:16:40', 1, 0, 'b8dcd2a0330f11ef88ac00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (98, '前端性能优化', '# 一、分析\n\n## 1.瀑布图：分析网路链路\n重要的点有三个：\n1.I**nitial Connection** [橙色] 这个过程仅仅发生在瀑布图中的开头几行, 否则这就是个性能问题。\n2.**Time To First Byte (TTFB)** [绿色] - TTFB 是浏览器请求发送到服务器的时间+服务器处理请求时间+响应报文的第一字节到达浏览器的时间. 我们用这个指标来判断你的web服务器是否性能不够, 或者说你是否需要使用CDN。\n3.**Downloading (蓝色)** - 这是浏览器用来下载资源所用的时间. 这段时间越长, 说明资源越大. 理想情况下, 你可以通过控制资源的大小来控制这段时间的长度。\n## 2.包分析：webpack-bundle-analyzer\n\n其中模块面积占的越大说明在bundle包中size越大。\n\n它能够排查出来的信息有\n\n- 显示包中所有打入的模块\n- 显示模块size 及 gzip后的size\n\n## 3.chrome 自带的性能分析工具 performance\n\n它能排查出来的信息有：\n- FCP/LCP 时间是否过长？\n- 请求并发情况 是否并发频繁？\n- 请求发起顺序 请求发起顺序是否不对？\n- javascript执行情况 javascript执行是否过慢？\n\n主要的性能指标如下：\n- **`First Paint 首次绘制（FP）`**  \n    这个指标用于记录页面第一次绘制像素的时间，如显示页面背景色。\n    \n    > FP不包含默认背景绘制，但包含非默认的背景绘制。\n    \n- **`First contentful paint 首次内容绘制 (FCP)`**  \n    LCP是指页面开始加载到最大文本块内容或图片显示在页面中的时间。如果 FP 及 FCP 两指标在 2 秒内完成的话我们的页面就算体验优秀。\n- **`Largest contentful paint 最大内容绘制 (LCP)`**  \n    用于记录视窗内最大的元素绘制的时间，该时间会随着页面渲染变化而变化，因为页面中的最大元素在渲染过程中可能会发生改变，另外该指标会在用户第一次交互后停止记录。官方推荐的时间区间，在 2.5 秒内表示体验优秀\n- **`First input delay 首次输入延迟 (FID)`**  \n    首次输入延迟，FID（First Input Delay），记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟。\n- **`Time to Interactive 可交互时间 (TTI)`**  \n    首次可交互时间，TTI（Time to Interactive）。这个指标计算过程略微复杂，它需要满足以下几个条件：\n    \n    1. 从 FCP 指标后开始计算\n    2. 持续 5 秒内无长任务（执行时间超过 50 ms）且无两个以上正在进行中的 GET 请求\n    3. 往前回溯至 5 秒前的最后一个长任务结束的时间\n    \n    对于用户交互（比如点击事件），推荐的响应时间是 100ms 以内。那么为了达成这个目标，推荐在空闲时间里执行任务不超过 50ms（ [W3C](https://link.segmentfault.com/?enc=WwAu0gQeRgiuT95BvznUgw%3D%3D.pGFoNjDmlCryH%2FGJ%2BOU3BxIGYVRFrayNpZqBxqYuKVYpBxitz2%2BLYSKFXqeIGc5zfrMGcnLagnXsd6WfEznTjwnS0H6ey7B2d%2BcQ%2B%2FDPRExxJDhKfIWYujwKojNgb4JYabbky0JtHA6YC2RjYJLHDw%3D%3D) 也有这样的标准规定），这样能在用户无感知的情况下响应用户的交互，否则就会造成延迟感。\n    \n- `Total blocking time 总阻塞时间 (TBT)`  \n    阻塞总时间，TBT（Total Blocking Time），记录在 FCP 到 TTI 之间所有长任务的阻塞时间总和。\n- `Cumulative layout shift 累积布局偏移 (CLS)`  \n    累计位移偏移，CLS（Cumulative Layout Shift），记录了页面上非预期的位移波动。页面渲染过程中突然插入一张巨大的图片或者说点击了某个按钮突然动态插入了一块内容等等相当影响用户体验的网站。这个指标就是为这种情况而生的，计算方式为：位移影响的面积 * 位移距离。\n\n### 4.进阶获取各个阶段的响应时间可以通过  PerformanceNavigationTiming获取\n\n	function showNavigationDetails() {\n	 const [entry] =   performance.getEntriesByType(\"navigation\"); \n	 console.table(entry.toJSON()); \n	 }\n\n这个函数能获取到各个阶段的响应时间。\n具体的参数为：\nnavigationStart 加载起始时间 \nredirectStart 重定向开始时间（如果发生了HTTP重定向，每次重定向都和当前文档同域的话，就返回开始重定向的fetchStart的值。其他情况，则返回0）\nredirectEnd 重定向结束时间（如果发生了HTTP重定向，每次重定向都和当前文档同域的话，就返回最后一次重定向接受完数据的时间。其他情况则返回0） \nfetchStart 浏览器发起资源请求时，如果有缓存，则返回读取缓存的开始时间 domainLookupStart 查询DNS的开始时间。如果请求没有发起DNS请求，如keep-alive，缓存等，则返回fetchStart\ndomainLookupEnd 查询DNS的结束时间。如果没有发起DNS请求，同上\nconnectStart 开始建立TCP请求的时间。如果请求是keep-alive，缓存等，则返回domainLookupEnd (secureConnectionStart) 如果在进行TLS或SSL，则返回握手时间 connectEnd 完成TCP链接的时间。如果是keep-alive，缓存等，同connectStart \nrequestStart 发起请求的时间 \nresponseStart 服务器开始响应的时间 \ndomLoading 是开始渲染dom的时间，具体未知 \ndomInteractive 未知 \ndomContentLoadedEventStart 开始触发DomContentLoadedEvent事件的时间 domContentLoadedEventEnd DomContentLoadedEvent事件结束的时间 \ndomComplete 是dom渲染完成时间，具体未知\nloadEventStart 触发load的时间，如没有则返回0 \nloadEventEnd load事件执行完的时间，如没有则返回0 \nunloadEventStart unload事件触发的时间 \nunloadEventEnd unload事件执行完的时间\n\n**关于Web性能，会用到的时间参数：**\n\nDNS解析时间： domainLookupEnd - domainLookupStart \nTCP建立连接时间： connectEnd - connectStart \n白屏时间： responseStart - navigationStart \ndom渲染完成时间： domContentLoadedEventEnd - navigationStart \n页面onload时间： loadEventEnd - navigationStart\n\n根据这些时间参数，我们就可以判断哪一阶段对性能有影响。\n\n# 二、优化\n\n## 1.经典的tree shaking\n\nwebpack4.x默认对tree shaking进行了支持，如果项目中使用的还是webpack3.x或2.x可以使用如下方式配置tree shaking.\n\nbable.config:\n\n``` json\n{\n  \"presets\": [\n    [\"env\", {\n      \"loose\": true,\n      \"modules\": false\n    }]\n  ]\n}\n```\n\n\nWebpack.config:\n\n```json\nmodule: {\n  rules: [\n    { test: /\\.js$/, loader: \'babel-loader\' }\n  ]\n},\n\nplugins: [\n  new webpack.LoaderOptionsPlugin({\n    minimize: true,\n    debug: false\n  }),\n  new webpack.optimize.UglifyJsPlugin({\n    compress: {\n      warnings: true\n    },\n    output: {\n      comments: false\n    },\n    sourceMap: false\n  })\n]\n```\n\n## 2.split chunks(分包)\n\n在没配置任何东西的情况下，webpack 4 就智能的帮你做了代码分包。入口文件依赖的文件都被打包进了main.js，那些大于 30kb 的第三方包，如：echarts、xlsx、dropzone等都被单独打包成了一个个独立 bundle。\n\n它内置的代码分割策略是这样的：\n\n- 新的 chunk 是否被共享或者是来自 node_modules 的模块\n- 新的 chunk 体积在压缩之前是否大于 30kb\n- 按需加载 chunk 的并发请求数量小于等于 5 个\n- 页面初始加载时的并发请求数量小于等于 3 个\n\n想通过这个实现性能优化，只使用分包是不够的，还需要增加下文的拆包。\n\n## 3.拆包\n\n假设：原本bundle包为2M，一次请求拉取。拆分为 bundle（1M） + react桶（CDN）（1M） 两次请求并发拉取。\n\n从这个角度来看，1+1的模式拉取资源更快。\n\n换一个角度来说，全量部署项目的情况，每次部署bundle包都将重新拉取。比较浪费资源。react桶的方式可以命中强缓存，这样的化，就算全量部署也只需要重新拉取左侧1M的bundle包即可，节省了服务器资源。优化了加载速度。\n\n注意：在本地开发过程中，react等资源建议不要引入CDN，开发过程中刷新频繁，会增加CDN服务其压力，走本地就好\n\n## 4.默认的Gzip\n\n一般在现在直接创建的项目中都会启用gzip对代码和文件进行压缩，注意的点是gzip需要运维老哥那边编写nginx配置以实现gzip压缩。\n\nNginx配置方式：\n\n	http { \n	gzip on;\n	 gzip_buffers 32 4K;\n	  gzip_comp_level 6;\n	   gzip_min_length 100; \n	   gzip_types application/javascript text/css text/xml; \n	   gzip_disable \"MSIE [1-6]\\.\"; \n	   gzip_vary on; \n	   }\n\n## 5.图片压缩\n\n图片压缩也是老生长谈的问题了，需要注意的点就是一定和pm和ui沟通好，需要压缩自带图片的（icon，banner等）让pm和ui进行确认该图片显示效果是否正常符合预期。或者直接让ui把压缩了的图片发给你。\n\n如果要自己压的话推荐[tinypng](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Ftinypng.com%2F&source=article&objectId=1733071)。\n\n## 6.雪碧图\n\n在网站中有很多小图片的时候，一定要把这些小图片合并为一张大的图片，然后通过background分割到需要展示的图片。\n\n因为浏览器请求规则的问题，一次最多并发六个请求，超过6个会将它分为多次并发。就比如你的页面上有10个相同CDN域名小图片，那么需要发起10次请求去拉取，分两次并发。第一次并发请求回来后，发起第二次并发。\n\n如果你把10个小图片合并为一张大图片的画，那么只用一次请求即可拉取下来10个小图片的资源。减少服务器压力，减少并发，减少请求次数。\n\n## 7.CDN\n\n网上一问优化就是cdn部署静态资源，一问怎么做啥也不会\n\n第一先选cdn：阿里、腾讯、七牛\n\n这里拿七牛作为例子：\n\n```bash\nnpm install qiniu\n```\n\n安装完七牛的sdk之后创建qiniu.js文件\n\n```js\n\n//引入模块\nconst readline = require(\'readline\'); \nconst colors = require( \"colors\"); \nconst FS = require(\'fs\');\nconst Join = require(\'path\').join; // 路径片段连接到一起，并规范化生成的路径 \nconst QiNiu = require(\'qiniu\')；\n\n//初始化配置\nconst accessKey = \'*******\'; // 七牛秘钥\nconst secretKey = \'*******\'; // 七牛秘钥\nconst bucket = \'***\' // 七牛空间名（筒名）\nconst prefix = \'***\' // 七牛目录名称（前缀）\nconst limit = 10 // 分页请求 每页数量\nvar uploadNore =  [\'index.html\'] // 忽略文件数组（可以为文件或文件夹）忽略文件数组（可以为文件或文件夹）\n// 鉴权对象\nconst mac = new QiNiu.auth.digest.Mac(accessKey, secretKey);\n// 获取七牛配置\nconst config = new QiNiu.conf.Config();\n// 是否使用https域名\n// config.useHttpsDomain = true;\n// 上传是否使用cdn加速\n// config.useCdnDomain = true;\n// 空间对应的机房 Zone_z0(华东)\nconfig.zone = QiNiu.zone.Zone_z0;\n// 资源管理相关的操作首先要构建BucketManager对象\nconst bucketManager = new QiNiu.rs.BucketManager(mac, config);\n// 相关颜色配置 console颜色主题\ncolors.setTheme({\n  silly: \'rainbow\',\n  input: \'grey\',\n  verbose: \'cyan\',\n  prompt: \'grey\',\n  info: \'green\',\n  data: \'grey\',\n  help: \'cyan\',\n  warn: \'yellow\',\n  debug: \'blue\',\n  error: \'red\'\n});\n//定义相关方法\n// 这里采用异步方法操作 获取远程列表的目的只是为了删除 但只能是获取到列表后 回调里再删除\n// 获取远程七牛 指定前缀 文件列表\nasync function getQiniuList() {\n  var options = {\n    limit: limit,\n    prefix: prefix,\n  }\n  var array = []\n  var list = await getList()\n  // marker 上一次列举返回的位置标记，作为本次列举的起点信息\n  async function getList(mark=false) {\n    if(mark){\n      var options = {\n        limit: options.limit,\n        prefix: options.prefix,\n        mark: mark\n      }\n    }\n    return new Promise(function(resolve, reject){\n      bucketManager.listPrefix(bucket, options, function(err, respBody, respInfo) {\n        if (err) {\n          console.log(err);\n          throw err;\n        }\n        if (respInfo.statusCode == 200) {\n          //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，指定options里面的marker为这个值\n          var nextMarker = respBody.marker;\n          var commonPrefixes = respBody.commonPrefixes;\n          var items = respBody.items;\n          items.forEach(function(item) {\n            array.push(QiNiu.rs.deleteOp(bucket, item.key))\n          });\n          if(respBody.marker){\n            getList(respBody.marker)\n          } else{\n            resolve(array)\n          }\n        } else {\n          console.log(respInfo.statusCode);\n          console.log(respBody);\n        }\n      });\n    })\n  }\n  return list\n}\n// 批量删除远程七牛 指定列表 所有文件\nasync function delAll(){\n  async function delQiniuAll() {\n    return new Promise(function(resolve, reject){\n      // 获取七牛远程列表数据\n      getQiniuList().then(res => {\n        if (res.length!==0){\n          console.log(\'远程列表为空\'.debug);\n          del(res, resolve)\n        } else {\n          resolve()\n        }\n      })\n    })\n  }\n  await delQiniuAll()\n}\nfunction del(deleteOperations, resolve) {\n  bucketManager.batch(deleteOperations, function(err, respBody, respInfo) {\n    if (err) {\n      console.log(err);\n      //throw err;\n    } else {\n      // 200 is success, 298 is part success\n      if (parseInt(respInfo.statusCode / 100) == 2) {\n        respBody.forEach(function(item, index) {\n          if (item.code == 200) {\n            resolve(index)\n            console.log(\'删除成功\'+\'第\'+(parseInt(index)+1)+\'个文件\'.info)\n          } else {\n            console.log(\'删除失败\'.error);\n            console.log(item.code + \"\\t\" + item.data.error.error);\n            resolve(index)\n          }\n        });\n      } else {\n        console.log(respInfo.deleteusCode);\n        console.log(respBody);\n      }\n    }\n  });\n}\n// 上传所有文件到骑牛\nfunction upAllToQiniu(){\n  console.log(\'开时删除七牛远程资源列表\'.debug);\n  // 先删除所有 再上传\n  delAll().then(res => {\n    console.log(\'开时上传资源到七牛\'.debug);\n    var files = FS.readdirSync(\'dist/\'); // 文件目录\n    var localFile = findSync(\'dist/\')\n    // key 为远程 七牛目录文件名\n    // localFile[key] 为本地完成路径+文件名称\n    for(var key in localFile){\n      upOneToQiniu(localFile[key], key)\n    }\n  })\n}\n\n// 上传单文件到骑牛 localFile为本地完成路径+文件名称 key为远程 七牛目录文件名\nfunction upOneToQiniu(localFile, key) {\n  var mac = new QiNiu.auth.digest.Mac(accessKey, secretKey);\n  var options = {\n    scope: bucket,\n  };\n  var putPolicy = new QiNiu.rs.PutPolicy(options);\n  var uploadToken = putPolicy.uploadToken(mac);\n  var formUploader = new QiNiu.form_up.FormUploader(config)\n  var putExtra = new QiNiu.form_up.PutExtra()\n  // 文件上传\n  formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,\n    respBody, respInfo) {\n    if (respErr) {\n      throw respErr\n    }\n    if (respInfo.statusCode == 200) {\n      console.log(localFile.info+\'=>\'+respBody.key.info + \'上传成功\')\n    } else {\n      console.log(\'上传失败\' + respInfo.statusCode.error);\n      console.log(\'上传失败\' + respBody.error)\n    }\n  })\n}\n// 拿到文件 目录路径 startPath 根目录名称\nfunction findSync(startPath) {\n  let targetObj={};\n  function finder(path) {\n    // 获取当前目录下的 文件或文件夹\n    let files=FS.readdirSync(path);\n    // 循环获 当前目录下的所有文件\n    files.forEach((val,index) => {\n      let fPath=Join(path,val);\n      let stats=FS.statSync(fPath);\n      if(stats.isDirectory()) {\n        finder(fPath);\n      }\n      if(stats.isFile() && isNore(fPath)) {\n        targetObj[fPath.replace(startPath, prefix)] = fPath;\n      }\n    });\n  }\n  finder(startPath);\n  return targetObj;\n}\n/**\n * 判断当前路径是否在忽略文件数组中\n * @param {String} path 路径\n */\nfunction isNore(path) {\n  for( var item of uploadNore) { // 遍历忽略数组\n    if (path.indexOf(item) !== -1) {\n      return false\n    }\n  }\n  return true\n}\n// process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程 因为是全局变量，所以无需使用 require()。\nvar rl = readline.createInterface({\n  input: process.stdin, // 要监听的可读流\n  output: process.stdout, // 要写入逐行读取数据的可写流\n  prompt: (\'是否进行远程部署> (Y/N)\').warn\n});\nrl.prompt();\n// 每当 input 流接收到接收行结束符（\\n、\\r 或 \\r\\n）时触发 \'line\' 事件。 通常发生在用户按下 <Enter> 键或 <Return> 键。监听器函数被调用时会带上一个包含接收的那一行输入的字符串。\nrl.on(\'line\', (line) => {\n  switch (line.trim()) {\n    case \'y\':\n    case \'Y\':\n      console.log(\'开始执行远程部署\'.help);\n      // 上传\n      upAllToQiniu()\n      rl.close();\n      break;\n    case \'n\':\n    case \'N\':\n      console.log(\'您取消了远程部署\'.help);\n      rl.close();\n      break;\n    default:\n      console.log(`你输入的：\'${line.trim()}\'为无效命令，请重新输入`.warn);\n      rl.prompt();\n      break;\n  }\n})\n\n```\n\n最后如何调用呢，很简单，在packge.json中添加\n\n```json\n\"script\":{\n\"qiniu\": \"node build/qiniu.js\",\n}\n```\n\n然后在打包完之后执行这个：\n\n```bash\nyarn run qiniu\n```\n### 8. 图片懒加载\n\n用这个npm包就行\n\n[layzr.js](https://github.com/callmecavs/layzr.js)\n\n## 9.SSR\n\n如果项目中将会出现大量的detail页面和交互跳转非常频繁，可以考虑使用SSR框架构建项目。\n优点就是SEO，首屏优化。缺点就是占用服务器资源\n\n## 10.抽离css\n\n借助mini-css-extract-plugin:本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。\n\n```js\nconst MiniCssExtractPlugin = require(\"mini-css-extract-plugin\");\n {\n test: /\\.less$/,\n use: [\n // \"style-loader\", // 不再需要style-loader，⽤MiniCssExtractPlugin.loader代替\n  MiniCssExtractPlugin.loader,\n  \"css-loader\", // 编译css\n  \"postcss-loader\",\n  \"less-loader\" // 编译less\n ]\n },\nplugins: [\n  new MiniCssExtractPlugin({\n   filename: \"css/[name]_[contenthash:6].css\",\n   chunkFilename: \"[id].css\"\n  })\n ]\n\n```\n\n## 11.避免回流和重绘\n\n### 重绘 (Repaint)\n\n当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。\n\n### 回流\n\n当Render Tree中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。\n\n**回流必将引起重绘，重绘不一定会引起回流，回流比重绘的代价要更高**\n\n### 避免方式：\n\n**CSS**\n\n- 避免使用table布局。\n- 尽可能在DOM树的最末端改变class。\n- 避免设置多层内联样式。\n- 将动画效果应用到position属性为absolute或fixed的元素上。\n- 避免使用CSS表达式（例如：calc()）。\n\n**JavaScript**\n\n- 避免频繁操作样式，最好一次性重写style属性，或者将样式列表定义为class并一次性更改class属性。\n- 避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。\n- 也可以先为元素设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘。\n- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。\n- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。\n\n\n\n\n# 三、针对vue的特殊性能优化方式\n\n## 1. v-show与v-if\n\n在真正需要dom条件性渲染的情况下才使用v-if，只控制dom展示和隐藏的最好使用v-show降低性能开销。\n\n### 2. 使用computed和watch\n\n在需要使用一个近似于不变的变量同时该变量依赖于其他变量进行计算等操作时，最好使用computed，可以保证在依赖变量不改变时获取缓存的computed值。\n\n### 3. v-for 遍历避免同时使用 v-if\n\n`v-for` 比 `v-if` 优先级高，如果每一次都需要遍历整个数组，将会影响速度，尤其是当之需要渲染很小一部分的时候，必要情况下应该替换成 computed 属性.\n\n### 4. 路由懒加载\n\nVue 是单页面应用，可能会有很多的路由引入 ，这样使用 webpcak 打包后的文件很大，当进入首页时，加载的资源过多，页面会出现白屏的情况，不利于用户体验。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效了。这样会大大提高首屏显示的速度，但是可能其他的页面的速度就会降下来。\n\n示例：\n```js\nconst Foo = () => import(‘./Foo.vue’)\nconst router = new VueRouter({\n  routes: [\n    { path: ‘/foo’, component: Foo }\n  ]\n})\n```\n\n# 四、针对React的优化方案\n\nreact优化方案太多了，这里只挑用的最多的讲一讲\n\n## 1.优化Render过程\n\n### PureComponent、React.memo\n\n在 React 工作流中，如果只有父组件发生状态更新，即使父组件传给子组件的所有 Props 都没有修改，也会引起子组件的 Render 过程。\n\n从 React 的声明式设计理念来看，如果子组件的 Props 和 State 都没有改变，那么其生成的 DOM 结构和副作用也不应该发生改变。当子组件符合声明式设计理念时，就可以忽略子组件本次的 Render 过程。\n\nPureComponent 和 React.memo 就是应对这种场景的，PureComponent 是对类组件的 Props 和 State 进行浅比较，React.memo 是对函数组件的 Props 进行浅比较。\n\n### useMemo、useCallback 实现稳定的 Props 值\n\n如果传给子组件的派生状态或函数，每次都是新的引用，那么 PureComponent 和 React.memo 优化就会失效。所以需要使用 useMemo 和 useCallback 来生成稳定值，并结合 PureComponent 或 React.memo 避免子组件重新 Render。\n\n### useMemo 减少组件 Render 过程耗时\n\nuseMemo 是一种缓存机制，当它的依赖未发生改变时，就不会触发重新计算。一般用在「计算派生状态的代码」非常耗时的场景中，如：遍历大列表做统计信息。\n\n### 利用Suspense 和 lazy\n\n\n```jsx\nimport React, { lazy, Suspense } from \"react\";\n\nexport default class UserSalutation extends React.Component {\n\n    render() {\n        if(this.props.username !== \"\") {\n          const WelcomeComponent = lazy(() => import(\"./welcomeComponent\"));\n          return (\n              <div>\n                  <Suspense fallback={<div>Loading...</div>}>\n                      <WelcomeComponent />\n                  </Suspense>\n              </div>\n          )\n        } else {\n            const GuestComponent = lazy(() => import(\"./guestComponent\"));\n            return (\n                <div>\n                    <Suspense fallback={<div>Loading...</div>}>\n                        <GuestComponent />\n                    </Suspense>\n                </div>\n            )\n        }\n    }\n}\n```\n\n### 添加index和key\n\n在使用列表和map渲染元素的时候记得添加index和key以降低react自动添加可能带来的性能损失。\n\n### 数据流转结构超过子父祖三代推荐使用状态管理库的发布订阅模式\n\n超过子父祖三代的数据流转会导致公共祖先传递数据需要层层向下传递，给不需要使用到该状态的组件带来了不必要的render。使用状态管理库或发布订阅模式可以有效的降低render次数。', 89, '2024-07-02 22:13:56', '2025-02-02 18:14:43', 1, 0, '51d3bb33387d11ef88ac00163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (101, '网安入门笔记', '\n这两天在摸自己的直播平台的时候，正好看到了一些关于网安的知识，学习了一下顺手记个笔记。\n\n## ==RedTeam==\n\n需要注意的点是，我们拿到的往往只有一个域名，其他的信息都是需要依赖于自己获取的。而想成功的渗透就是依赖于自己获得的信息与管理员的信息的信息差，依赖于信息差所暴露出的漏洞就可能获取到想要的权限。\n\n### 快速打点\n\n首先我们需要明白，在新手阶段，我们常常挖不动SRC，这是因为我们没有意识到在大型站点中，主站的防护力度是最高的。而且作为主站，面向的攻击肯定是最多的，早就被挖了几千几万遍了，洞早都修完了。所以我们应该从其他的角度分析，作为大型网站，最脆弱的就是在于边缘资产（下属子公司网站，app请求api的目标ip）这些边缘资产对于大公司大企业来说，很多时候根本不清楚自己的边缘资产有哪些，从分析我们就可以得出一个结论，边缘资产的突破概率是最高的。这就是为什么我们要扫描子域名、扫描c段。\n\n在经过对边缘资产的分析之后，我们就可以把拿到的一大堆c段与子域名，塞进我们的工具里批量识别应用指纹和扫描漏洞，运气不错就能很简单的找到洞了。\n\n这就是我们常说的快速打点的方式，也就是大批量的扫描企业的联网资产以获取漏洞、以此获取对象的内网入口点。\n\n### 社工\n\n高端局尤其是特大型企业常用的一种渗透方式，手段包括但不限于钓鱼邮件、接近并套取手机信息、威胁利诱等。\n\n详细了解方式建议看看《社会工程学攻击手册》\n\n### 常规手工WEB渗透\n\n基本的手段很多，讲几个经常被用到和提到的\n1. SQL注入获取webshell\n2. 文件上传获取webshell\n3. 框架漏洞获取webshell\n4. 中间人攻击获取权限\n5. 跨站脚本攻击获取权限\n\n### 其他手段\n\n对于大型企业来说，应用vpn对访问进行管理是一件很稀松平常的事情，但是我们可以反向利用vpn利用撞库的方式狠狠的鸿儒弱密码的SSLvpn然后光明正大的进入内网。\n\n还有就是利用一些特征来寻找入口（协议滥用、配置错误）\n\n这些只是正常渗透的开始，因为比较重要的服务和数据一般都保存在内网中，而且大型企业一般内部网络之间都有隔离和防护。\n\n\n### 内网渗透\n\n一般我们瞄准的就是这几样东西：凭证、内网拓扑结构、重要文件、数据库等。然后\n绘制出目标内网的结构。\n\n内网渗透其实可以单拎出来将很多东西，难度不亚于外网渗透，这块了解的比较少，主要了解的一些方式就是利用凭证和收集的密码进行重放、利用内网设备漏洞进行提权然后平权渗透。\n\n\n然后按模板写写报告就完事。\n\n\n', 7, '2024-09-12 14:40:53', '2024-11-12 08:35:06', 1, 0, 'f4deb8b270d111efb8f200163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (102, 'Electron入门笔记-简介篇', '写完直播平台，有种需要搞个配套的桌面端软件的感觉（，于是抱着充盈一下自己技术栈的考虑，先做一个小工具帮我干干跑签到脚本的活。看了一圈桌面端开发，比较符合技术栈学习成本比较低的还得是Electron （~~最爱Chromium的一集~~）。别问为啥不用flutter和dotnet，学习成本好高啊kora！\n\n首先呢，去官网翻了一圈，学了一下怎么搭建一个基础的项目，但是呢官网的教程是原生HTML+JS，有点难搞（炒鸡不想写原生JS 更别说JQ 最讨厌$的一集）。一想肯定有办法跑Vue或者React，直接一个~~其人之道~~开偷，Github启动。翻了一圈，找到了个蛮好用的包可以跑Vite叫`electron-vite`。于是翻翻文档开始动手搭环境。\n\n### 基本搭建方式（原生HTML+JS）\n\n\n``` bash\n\nmkdir script_plateform\n\ncd script_plateform\n\ntouch index.html\n\ntouch main.js\n\nyarn init \n\nyarn add electron --dev\n\n```\n\n``` HTML\n//index.html\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n    <title>test</title>\n</head>\n<body>\n    hello world\n</body>\n</html>\n\n\n```\n\n``` js\n//main.js\n//主进程\n\n//引入electron模块\nvar electron =require(\'electron\');\n\n//nodejs中的path模块\nvar path=require(\'path\');\n\n//创建electron引用     控制应用生命周期的模块\nvar app=electron.app;     \n\n//创建electron BrowserWindow的引用          窗口相关的模块\nvar BrowserWindow=electron.BrowserWindow;\n\n//变量 保存对应用窗口的引用\nvar mainWindow=null;\n\nfunction createWindow(){\n    //创建BrowserWindow的实例 赋值给mainWindow打开窗口   \n    mainWindow=new BrowserWindow({width:800,height:600,webPreferences: {\n        nodeIntegration: true\n    }}); \n  \n    mainWindow.loadFile(path.join(\'index.html\'));\n    //开启渲染进程中的调试模式\n    mainWindow.webContents.openDevTools();\n\n    mainWindow.on(\'closed\',()=>{\n        mainWindow=null;\n    })    \n\n}\n\napp.on(\'ready\',createWindow)\n\n// 当所有的窗口被关闭后退出应用   Quit when all windows are closed.\napp.on(\'window-all-closed\', () => {\n    // On OS X it is common for applications and their menu bar\n    // to stay active until the user quits explicitly with Cmd + Q\n\n    // 对于OS X系统，应用和相应的菜单栏会一直激活直到用户通过Cmd + Q显式退出\n    if (process.platform !== \'darwin\') {\n      app.quit();\n    }\n  });\n  \n//macos\napp.on(\'activate\', () => {\n// 对于OS X系统，当dock图标被点击后会重新创建一个app窗口，并且不会有其他\n    if (mainWindow === null) {\n        createWindow();\n    }\n});\n\n```\n\n到这里基本环境就搭建完了，接下来我们讲讲怎么用electron-vite装个vue3。\n\n### 利用electron-vite搭建项目\n\nPS：要求node版本＞18+和vite版本4.0+\n\n```bash\nyarn add electron-vite -D\n```\n\n然后就是简简单单的yarn跑一下\n\n```bash \nyarn create @quick-start/electron my-app --template vue\n```\n\n项目搭建的时候是和vite差不多的都可以使用不同的模板进行搭建\n具体的模板可以看这个[快速开始 | electron-vite](https://cn.electron-vite.org/guide/)\n\n到这里我们就搭建好了项目，接下来我们可以研究研究electron的线程了。\n\n', 20, '2024-10-25 13:53:15', '2025-01-25 09:03:32', 1, 0, '6d9add99929511efb8f200163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (103, 'Electron入门笔记-线程篇', '\n众所周知Electron是基于Chromium，所以某种程度上可以算是一个小浏览器（？），这就形成了我们现在需要了解的一个多线程模型。\n\n首先，我们讲讲Chrome里的多线程模型：\n早期的浏览器都是使用单个进程来处理每一个标签页的所有功能，导致当一个标签页出现崩溃或者无响应的情况时，整个浏览器都面临崩溃或无响应。为了解决这个问题，Chrome开发团队使用多线程来处理每一个标签标签页，同时利用一个主进程（浏览器进程）来处理整个浏览器的生命周期。\n\nElectron也继承了这一思想（还是Chromium 一直是Chromium），每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。 主进程在 Node.js 环境中运行，这意味着它具有 `require` 模块和使用所有 Node.js API 的能力。而主线程主要起到的就是创建应用程序窗口和与原生api进行交互。\n\n而我们渲染则调用的是渲染进程（类似与标签页），这就给我们一个使用框架进行开发的机会，不过有一个非常大的问题，在设计上渲染进程是无权访问require或者其他的nodeapi，所以这就引出下一个我们需要了解的概念：`Preload脚本`\n\n在Preload脚本中包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码 。 这些脚本虽运行于渲染器的环境中，却因能访问 Node.js API 而拥有了更多的权限。所以我们是能在Preload脚本中启动vite、webpack或者是node（Production）以实现框架热更新和部署的。\n\n在项目中，我们一般的最佳实践是分为两个js文件，分别是主线程的main.js和调用node api的preload.js。渲染线程也就是页面专门放在renderer文件夹中。\n\n主线程：\n\n```js\n//main.js\n\nimport { app, shell, BrowserWindow, ipcMain, ipcRenderer, utilityProcess } from \'electron\'\n\nimport { join } from \'path\'\n\nimport { electronApp, optimizer, is } from \'@electron-toolkit/utils\'\n\nimport icon from \'../../resources/icon.svg\'\n\nimport { dir } from \'console\'\n\nconst fs = require(\'fs\')\n\nconst path = require(\'path\')\n\nfunction createWindow() {\n\n  // Create the browser window.\n\n  const mainWindow = new BrowserWindow({\n\n    width: 900,\n\n    height: 670,\n\n    show: false,\n\n    autoHideMenuBar: true,\n\n    ...(process.platform === \'linux\' ? { icon } : {}),\n\n    webPreferences: {\n\n      preload: join(__dirname, \'../preload/index.js\'),\n\n      sandbox: false\n\n    }\n\n  })\n\n  \n\n  mainWindow.on(\'ready-to-show\', () => {\n\n    mainWindow.show()\n\n  })\n\n  \n\n  mainWindow.webContents.setWindowOpenHandler((details) => {\n\n    shell.openExternal(details.url)\n\n    return { action: \'deny\' }\n\n  })\n\n  \n\n  // HMR for renderer base on electron-vite cli.\n\n  // Load the remote URL for development or the local html file for production.\n\n  if (is.dev && process.env[\'ELECTRON_RENDERER_URL\']) {\n\n    mainWindow.loadURL(process.env[\'ELECTRON_RENDERER_URL\'])\n\n  } else {\n\n    mainWindow.loadFile(join(__dirname, \'../renderer/index.html\'))\n\n  }\n\n  \n\n  //启动新的子线程来运行本地js脚本\n\n  //捕获脚本的log并保存在脚本路径\n\n  // 捕获脚本的运行状态包括错误\n\n  ipcMain.handle(\'run-script\', (event, scriptPath) => {\n\n    const { fork } = utilityProcess\n\n    const child = fork(scriptPath, [], { silent: true })\n\n    //将运行状态返回给渲染进程\n\n    mainWindow.webContents.send(\'script-running\', true)\n\n    console.log(\'成功将运行状态返回给渲染进程\')\n\n    // 将子进程的输出日志流式保存至文件\n\n    // 文件路径为脚本路径加上时间戳加上.log后缀\n\n    const logPath = scriptPath + \'-\' + Date.now() + \'.log\'\n\n    const logStream = fs.createWriteStream(logPath, { flags: \'a\' })\n\n    child.stdout.pipe(logStream)\n\n    child.stderr.pipe(logStream)\n\n  \n\n    // 将子进程的运行状态返回给渲染进程\n\n    child.on(\'message\', (message) => {\n\n      mainWindow.webContents.send(\'script-message\', message)\n\n      console.log(message)\n\n    })\n\n  \n\n    child.on(\'error\', (error) => {\n\n      mainWindow.webContents.send(\'script-error\', error)\n\n      // 将错误保存到脚本路径\n\n      const errorPath = scriptPath + \'-\' + Date.now() + \'.error\'\n\n      fs.appendFile(errorPath, error, (err) => {\n\n        if (err) {\n\n          console.error(\'Failed to save error:\', err)\n\n        } else {\n\n          console.log(\'Error saved to\', errorPath)\n\n        }\n\n      })\n\n      console.error(error)\n\n    })\n\n    child.on(\'exit\', (code) => {\n\n      mainWindow.webContents.send(\'script-exit\', false)\n\n      console.log(`子进程退出，退出码 ${code}`)\n\n    })\n\n  })\n\n}\n\n  \n\n// This method will be called when Electron has finished\n\n// initialization and is ready to create browser windows.\n\n// Some APIs can only be used after this event occurs.\n\napp.whenReady().then(() => {\n\n  // Set app user model id for windows\n\n  electronApp.setAppUserModelId(\'com.electron\')\n\n  \n\n  // Default open or close DevTools by F12 in development\n\n  // and ignore CommandOrControl + R in production.\n\n  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils\n\n  app.on(\'browser-window-created\', (_, window) => {\n\n    optimizer.watchWindowShortcuts(window)\n\n  })\n\n  \n\n  // IPC test\n\n  ipcMain.on(\'ping\', () => console.log(\'pong\'))\n\n  \n\n  createWindow()\n\n  \n\n  app.on(\'activate\', function () {\n\n    // On macOS it\'s common to re-create a window in the app when the\n\n    // dock icon is clicked and there are no other windows open.\n\n    if (BrowserWindow.getAllWindows().length === 0) createWindow()\n\n  })\n\n})\n\n  \n\n// Quit when all windows are closed, except on macOS. There, it\'s common\n\n// for applications and their menu bar to stay active until the user quits\n\n// explicitly with Cmd + Q.\n\napp.on(\'window-all-closed\', () => {\n\n  if (process.platform !== \'darwin\') {\n\n    app.quit()\n\n  }\n\n})\n\n  \n\n// In this file you can include the rest of your app\"s specific main process\n\n// code. You can also put them in separate files and require them here.\n\n  \n\n//监听渲染进程的事件，调用dialog获取文件夹信息\n\nipcMain.handle(\'open-directory-dialog\', async (event) => {\n\n  console.log(\'open-directory-dialog\')\n\n  const { dialog } = require(\'electron\')\n\n  try {\n\n    const result = await dialog.showOpenDialog({\n\n      properties: [\'openDirectory\']\n\n    })\n\n    return result.filePaths[0]\n\n  } catch (error) {\n\n    console.log(error)\n\n  }\n\n})\n\n  \n\n//监听渲染进程的事件,从渲染进程中获取到本地文件夹路径，遍历获取文件夹中的js文件名称(过滤node_modules、.git文件夹)\n\n//组成文件名称,文件路径对象数组 ，返回给渲染进程\n\n  \n\nipcMain.handle(\'get-script-list\', async (event, dirPath) => {\n\n  console.log(\'get-script-list\')\n\n  \n\n  const getJSFiles = (dirPath) => {\n\n    let jsFiles = []\n\n  \n\n    // 读取目录内容\n\n    const files = fs.readdirSync(dirPath)\n\n  \n\n    for (const file of files) {\n\n      const filePath = path.join(dirPath, file)\n\n      const stat = fs.statSync(filePath)\n\n  \n\n      if (stat.isDirectory()) {\n\n        // 如果是目录，递归调用\n\n        if (file !== \'node_modules\' && file !== \'.git\') {\n\n          if (file !== \'dist\') {\n\n            jsFiles = jsFiles.concat(getJSFiles(filePath))\n\n          }\n\n        }\n\n      } else if (path.extname(file).toLowerCase() === \'.js\') {\n\n        // 如果是 JS 文件，添加包含路径和名称的对象到结果数组\n\n        jsFiles.push({\n\n          path: filePath,\n\n          name: file\n\n        })\n\n      }\n\n    }\n\n  \n\n    return jsFiles\n\n  }\n\n  try {\n\n    // const files = fs.readdirSync(dirPath)\n\n    // 深度查找所有的js文件\n\n    const scriptList = getJSFiles(dirPath)\n\n    return scriptList\n\n  } catch (error) {\n\n    console.log(error)\n\n  }\n\n})\n\nipcMain.handle(\'read-file\', async (event, filePath) => {\n\n  try {\n\n    let fs = require(\'fs\').promises // 确保使用 fs.promises\n\n    const bufferContent = await fs.readFile(filePath, () => {}, { encoding: \'utf8\' })\n\n    const content = bufferContent.toString(\'utf-8\')\n\n    return content\n\n  } catch (error) {\n\n    console.error(\'Error reading file:\', error)\n\n    throw error // 处理错误\n\n  }\n\n})\n\n//修改后的脚本内容保存到本地\n\n  \n\nipcMain.handle(\'save-script\', async (event, filePath, content) => {\n\n  try {\n\n    let fs = require(\'fs\').promises // 确保使用 fs.promises\n\n    await fs.writeFile(filePath, content, \'utf8\')\n\n    return true\n\n  } catch (error) {\n\n    console.error(\'Error writing file:\', error)\n\n  \n\n    return false\n\n  }\n\n})\n\n  \n\n//监听渲染进程的事件，获取传入的脚本路径中文件夹的最新log文件，返回给渲染进程\n\n// @params scriptPath 脚本路径\n\nipcMain.handle(\'get-log-file\', async (event, scriptPath) => {\n\n  const dirPath = path.dirname(scriptPath)\n\n  //获取文件夹中的所有log文件\n\n  const files = fs.readdirSync(dirPath)\n\n  // 利用修改时间筛选出最新的log文件\n\n  const logFiles = files.filter((file) => path.extname(file).toLowerCase() === \'.log\')\n\n  const latestLogFile = logFiles.sort(\n\n    (a, b) =>\n\n      fs.statSync(path.join(dirPath, b)).mtime.getTime() -\n\n      fs.statSync(path.join(dirPath, a)).mtime.getTime()\n\n  )[0]\n\n  // 返回文件内容\n\n  return latestLogFile\n\n})\n```\n\n渲染线程：\n\n```js\n//preload.js\n\nimport { contextBridge } from \'electron\'\n\nimport { electronAPI } from \'@electron-toolkit/preload\'\n\n  \n\n// Custom APIs for renderer\n\nconst api = {}\n\n  \n\n// Use `contextBridge` APIs to expose Electron APIs to\n\n// renderer only if context isolation is enabled, otherwise\n\n// just add to the DOM global.\n\nif (process.contextIsolated) {\n\n  try {\n\n    contextBridge.exposeInMainWorld(\'electron\', electronAPI)\n\n    contextBridge.exposeInMainWorld(\'api\', api)\n\n  } catch (error) {\n\n    console.error(error)\n\n  }\n\n} else {\n\n  window.electron = electronAPI\n\n  window.api = api\n\n}\n```\n\n最后，我们来讲讲效率进程，作为主进程生成多个子进程`UtilityProcess` API。 主进程在 Node.js 环境中运行，这意味着它具有 `require` 模块和使用所有 Node.js API 的能力。 效率进程可用于托管，例如：不受信任的服务， CPU 密集型任务或以前容易崩溃的组件 托管在主进程或使用Node.js`child_process.fork ` API 生成的进程中。 效率进程和 Node 生成的进程之间的主要区别.js child_process模块是实用程序进程可以建立通信 通道与使用`MessagePort`的渲染器进程。 当需要从主进程派生一个子进程时，Electron 应用程序可以总是优先使用 效率进程API 而不是Node.js `child_process.fork `API。\n\n最佳实践：\n\n```js\n// 主进程\nconst { app, utilityProcess } = require(\'electron\')\n\napp.whenReady().then(() => {\n  // 创建进程池管理多个utility process\n  const processPool = []\n  \n  function createUtilityProcess() {\n    const utility = utilityProcess.fork(\'worker.js\', [], {\n      stdio: \'pipe\',\n      serviceName: `worker-${processPool.length}`\n    })\n\n    // 错误处理\n    utility.on(\'error\', (err) => {\n      console.error(\'Utility process error:\', err)\n    })\n\n    // 退出处理\n    utility.on(\'exit\', (code) => {\n      console.log(`Worker exited with code ${code}`)\n      // 从进程池中移除\n      const index = processPool.indexOf(utility)\n      if (index > -1) {\n        processPool.splice(index, 1)\n      }\n    })\n\n    processPool.push(utility)\n    return utility\n  }\n\n  // 使用示例\n  const worker = createUtilityProcess()\n  worker.postMessage({ type: \'START_TASK\', data: {...} })\n})\n```', 21, '2024-10-25 13:57:12', '2025-01-25 09:53:15', 1, 0, 'fada39b9929511efb8f200163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (104, 'Electron入门笔记-通信篇', '\n因为主线程和渲染线程之间的隔离（安全策略）我们想调用原生的一些方法比如读写文件、打开对话框等等是无法在渲染线程中调用的，于是我们可以利用Electron提供的IPC通道的方式进行通信。\n\n首先我们可以将通信按通信的对象划分为四类：渲染->主线程、渲染->主线程（需要返回值）、主线程->渲染线程和渲染线程->渲染线程\n\nPS：最佳实践是需要在preload.js中暴露electron的api的，为了减少篇幅只展示一次示例。\n\n```js\n//preload.js\n\nimport { contextBridge } from \'electron\' // 导入contextBridge模块\n\nimport { electronAPI } from \'@electron-toolkit/preload\' // 导入electronAPI模块\n\n  \n\n// Custom APIs for renderer\n\nconst api = {} // 定义一个空对象，用于存储自定义的API\n\n  \n\n// Use `contextBridge` APIs to expose Electron APIs to\n\n// renderer only if context isolation is enabled, otherwise\n\n// just add to the DOM global.\n\nif (process.contextIsolated) { // 如果启用了上下文隔离\n\n  try {\n\n    contextBridge.exposeInMainWorld(\'electron\', electronAPI) // 将electronAPI暴露给渲染进程\n\n    contextBridge.exposeInMainWorld(\'api\', api) // 将api暴露给渲染进程\n\n  } catch (error) {\n\n    console.error(error) // 如果出现错误，打印错误信息\n\n  }\n\n} else {\n\n  window.electron = electronAPI // 如果没有启用上下文隔离，将electronAPI添加到DOM全局\n\n  window.api = api // 如果没有启用上下文隔离，将api添加到DOM全局\n\n}\n```\n\n### 渲染->主线程\n\n如果要向主线程发送消息，需要在渲染线程使用ipcRenderer.send这个API发送消息，然后在主线程使用ipcMain.on来接收\n\n示例：\n\n```vue\n//changeTitle.vue\n\n//......\n\n<script setup>\n//......\nconst changeTitle = async () => {\n\n   await window.electron.ipcRenderer.send(\'change-title\', data.title)\n}\n</script>\n```\n\n```js \n//main.js\n\n//......\n\nipcMain.on(\'change-title\',()=>{\nconst webContents = event.sender  \nconst win = BrowserWindow.fromWebContents(webContents)  \nwin.setTitle(title)\n})\n```\n\n\n### 渲染线程->主线程（需要返回值）\n\n\n如果当我们需要向主线程发送消息，等待主线程返回一个结果，这个时候我们就可以使用`ipcRenderer.invoke`与 `ipcMain.handle`搭配使用来完成。除了调用的方法不同和需要传值以外，和不需要返回值的非常相似。\n\n在接下来的示例中会展示一个从渲染器进程打开一个原生的对话框并返回符合条件的文件路径。\n\n示例：\n\n```vue\n// ScriptList.vue\n\n//......\n\n<script setup>\n//传送open-directory-dialog事件获取脚本文件夹路径\n\nconst openDialog = () => {\n\n  window.electron.ipcRenderer.invoke(\'open-directory-dialog\').then(async (res) => {\n\n    console.log(res)\n\n    if (res == \'\') {\n\n      return\n\n    }\n\n    data.scriptDirectory = res\n\n    scriptStore.updateScriptDirectory(res)\n\n    await getScriptList()\n\n  })\n\n}\n\n  \n\n//通过ipcRenderer向主进程发送消息，获取脚本列表\n\nconst getScriptList = async () => {\n\n  if (scriptStore.scriptDirectory === \'\') return\n\n  const scriptList = await window.electron.ipcRenderer.invoke(\n\n    \'get-script-list\',\n\n    scriptStore.scriptDirectory\n\n  )\n\n  \n\n  scriptStore.updateScripts(scriptList)\n\n  \n\n  await getScriptStatus(scriptList)\n\n}\n</script>\n```\n\n```js\n//main.js\n\n//......\n\nipcMain.handle(\'open-directory-dialog\', async (event) => {\n\n  console.log(\'open-directory-dialog\')\n\n  const { dialog } = require(\'electron\')\n\n  try {\n\n    const result = await dialog.showOpenDialog({\n\n      properties: [\'openDirectory\']\n\n    })\n\n    return result.filePaths[0]\n\n  } catch (error) {\n\n    console.log(error)\n\n  }\n\n})\n\n  \n\n//监听渲染进程的事件,从渲染进程中获取到本地文件夹路径，遍历获取文件夹中的js文件名称(过滤node_modules、.git文件夹)\n\n//组成文件名称,文件路径对象数组 ，返回给渲染进程\n\n  \n\nipcMain.handle(\'get-script-list\', async (event, dirPath) => {\n\n  console.log(\'get-script-list\')\n\n  \n\n  const getJSFiles = (dirPath) => {\n\n    let jsFiles = []\n\n  \n\n    // 读取目录内容\n\n    const files = fs.readdirSync(dirPath)\n\n  \n\n    for (const file of files) {\n\n      const filePath = path.join(dirPath, file)\n\n      const stat = fs.statSync(filePath)\n\n  \n\n      if (stat.isDirectory()) {\n\n        // 如果是目录，递归调用\n\n        if (file !== \'node_modules\' && file !== \'.git\') {\n\n          if (file !== \'dist\') {\n\n            jsFiles = jsFiles.concat(getJSFiles(filePath))\n\n          }\n\n        }\n\n      } else if (path.extname(file).toLowerCase() === \'.js\') {\n\n        // 如果是 JS 文件，添加包含路径和名称的对象到结果数组\n\n        jsFiles.push({\n\n          path: filePath,\n\n          name: file\n\n        })\n\n      }\n\n    }\n\n  \n\n    return jsFiles\n\n  }\n\n  try {\n\n    // const files = fs.readdirSync(dirPath)\n\n    // 深度查找所有的js文件\n\n    const scriptList = getJSFiles(dirPath)\n\n    return scriptList\n\n  } catch (error) {\n\n    console.log(error)\n\n  }\n\n})\n```\n\n\n\n### 主线程->渲染线程\n\n将消息从主进程发送到渲染器进程时，需要指定是哪一个渲染器接收消息。 消息需要通过其 `WebContents`实例发送到渲染器进程。 此 `WebContents`实例包含一个`send`方法，其使用方式与 `ipcRenderer.send` 相同。\n\n示例：\n\n```js\n//main.js\n\nfunction createWindow () {  \nconst mainWindow = new BrowserWindow({  \nwebPreferences: {  \npreload: path.join(__dirname, \'preload.js\')  \n}  \n})  \n  \nconst menu = Menu.buildFromTemplate([  \n{  \nlabel: app.name,  \nsubmenu: [  \n{  \nclick: () => mainWindow.webContents.send(\'update-counter\', 1),  \nlabel: \'Increment\'  \n},  \n{  \nclick: () => mainWindow.webContents.send(\'update-counter\', -1),  \nlabel: \'Decrement\'  \n}  \n]  \n}  \n  \n])  \n  \nMenu.setApplicationMenu(menu)  \nmainWindow.loadFile(\'index.html\')  \n  \n\n```\n\n```HTML\n//index.html\n<!DOCTYPE html>  \n<html>  \n<head>  \n<meta charset=\"UTF-8\">  \n<!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  \n<meta http-equiv=\"Content-Security-Policy\" content=\"default-src \'self\'; script-src \'self\'\">  \n<title>Menu Counter</title>  \n</head>  \n<body>  \nCurrent value: <strong id=\"counter\">0</strong>  \n<script>\nconst counter = document.getElementById(\'counter\')  \n  \nwindow.electronAPI.onUpdateCounter((value) => {  \nconst oldValue = Number(counter.innerText)  \nconst newValue = oldValue + value  \ncounter.innerText = newValue.toString()  \nwindow.electronAPI.counterValue(newValue)  \n})\n</script>  \n</body>  \n</html>\n```\n\nPS:对于从主进程到渲染器进程的 IPC，没有与 `ipcRenderer.invoke` 等效的 API，所以我们可以通过添加一个回调的方式来实现\n\n示例：\n\n```HTML\n//index.html\n\n<!DOCTYPE html>  \n<html>  \n<head>  \n<meta charset=\"UTF-8\">  \n<!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->  \n<meta http-equiv=\"Content-Security-Policy\" content=\"default-src \'self\'; script-src \'self\'\">  \n<title>Menu Counter</title>  \n</head>  \n<body>  \nCurrent value: <strong id=\"counter\">0</strong>  \n<script>\nconst counter = document.getElementById(\'counter\')  \n  \nwindow.electronAPI.onUpdateCounter((value) => {  \nconst oldValue = Number(counter.innerText)  \nconst newValue = oldValue + value  \ncounter.innerText = newValue.toString()  \nwindow.electronAPI.counterValue(newValue)  \n})\n</script>  \n</body>  \n</html>\n\n```\n\n```js\n//main.js\n\n//...\nipcMain.on(\'counter-value\', (_event, value) => {  \nconsole.log(value) // will print value to Node console  \n})\n//...\n```\n\n\n### 渲染进程->渲染进程\n\n一般遇上这种情况，推荐使用主进程中转的方式实现，但是实际使用中会出现主进程负载压力过大的问题影响性能，所以我们可以使用electron提供的消息端口的方式进行通信。\n\n消息代理方式：\n\n主进程设置监听器监听消息，然后在preload.js中设置发送信息的api以实现转发消息。\n\n最佳实践：\n\n```js\n//main.js\n\n// main.js (主进程，基本相同)\nconst { app, BrowserWindow, ipcMain } = require(\'electron\')\nconst path = require(\'path\')\n\nlet window1 = null\nlet window2 = null\n\nfunction createWindows() {\n  // 创建第一个窗口\n  window1 = new BrowserWindow({\n    width: 800,\n    height: 600,\n    webPreferences: {\n      contextIsolation: true,\n      preload: path.join(__dirname, \'preload.js\')\n    }\n  })\n\n  // 创建第二个窗口\n  window2 = new BrowserWindow({\n    width: 800,\n    height: 600,\n    webPreferences: {\n      contextIsolation: true,\n      preload: path.join(__dirname, \'preload.js\')\n    }\n  })\n\n  window1.loadFile(\'window1.html\')\n  window2.loadFile(\'window2.html\')\n\n  // 处理窗口间通信\n  ipcMain.on(\'window1-to-window2\', (event, data) => {\n    window2.webContents.send(\'message-from-window1\', data)\n  })\n\n  ipcMain.on(\'window2-to-window1\', (event, data) => {\n    window1.webContents.send(\'message-from-window2\', data)\n  })\n}\n\napp.whenReady().then(createWindows)\n\n```\n\n```js\n\n// preload.js\nconst { contextBridge, ipcRenderer } = require(\'electron\')\n\ncontextBridge.exposeInMainWorld(\'electronAPI\', {\n  // 发送消息到其他窗口\n  sendToOtherWindow: (channel, data) => {\n    ipcRenderer.send(channel, data)\n  },\n  // 接收来自其他窗口的消息\n  onReceiveMessage: (channel, callback) => {\n    ipcRenderer.on(channel, (event, data) => callback(data))\n  }\n})\n```\n\n如果需要更复杂功能可以参考下述最佳实践（使用ts）\n\n```ts\n// types.ts\ninterface WindowMessage {\n  type: string\n  payload: any\n  timestamp: string\n  sender: string\n}\n\n// messageManager.ts\nclass WindowMessageManager {\n  private static instance: WindowMessageManager\n  private messageQueue: Map<string, WindowMessage[]>\n  \n  private constructor() {\n    this.messageQueue = new Map()\n  }\n\n  static getInstance() {\n    if (!WindowMessageManager.instance) {\n      WindowMessageManager.instance = new WindowMessageManager()\n    }\n    return WindowMessageManager.instance\n  }\n\n  queueMessage(targetWindow: string, message: WindowMessage) {\n    if (!this.messageQueue.has(targetWindow)) {\n      this.messageQueue.set(targetWindow, [])\n    }\n    this.messageQueue.get(targetWindow)?.push(message)\n  }\n\n  getQueuedMessages(windowId: string): WindowMessage[] {\n    return this.messageQueue.get(windowId) || []\n  }\n\n  clearQueue(windowId: string) {\n    this.messageQueue.delete(windowId)\n  }\n}\n```\n\n\n如果使用Messageport的话可以参考以下的最佳实践。\n\n最佳实践：\n\n```js\n// main.js\nconst { app, BrowserWindow, MessageChannelMain } = require(\'electron\')\nconst path = require(\'path\')\n\nlet window1 = null\nlet window2 = null\n\nasync function createWindows() {\n  // 创建两个窗口\n  window1 = new BrowserWindow({\n    width: 800,\n    height: 600,\n    webPreferences: {\n      contextIsolation: true,\n      preload: path.join(__dirname, \'preload.js\')\n    },\n    title: \'Window 1\'\n  })\n\n  window2 = new BrowserWindow({\n    width: 800,\n    height: 600,\n    webPreferences: {\n      contextIsolation: true,\n      preload: path.join(__dirname, \'preload.js\')\n    },\n    title: \'Window 2\'\n  })\n\n  // 加载HTML文件\n  await window1.loadFile(\'window1.html\')\n  await window2.loadFile(\'window2.html\')\n\n  // 创建消息通道\n  const { port1, port2 } = new MessageChannelMain()\n\n  // 将端口发送到各个渲染器\n  window1.webContents.postMessage(\'port-setup\', null, [port1])\n  window2.webContents.postMessage(\'port-setup\', null, [port2])\n\n  // 错误处理\n  window1.webContents.on(\'destroyed\', () => {\n    port1.close()\n  })\n\n  window2.webContents.on(\'destroyed\', () => {\n    port2.close()\n  })\n}\n\napp.whenReady().then(createWindows)\n```\n\n```js\n// preload.js\nconst { contextBridge, ipcRenderer } = require(\'electron\')\n\nlet messagePort = null\n\ncontextBridge.exposeInMainWorld(\'electronMessagePort\', {\n  // 初始化端口\n  onPortSetup: (callback) => {\n    ipcRenderer.once(\'port-setup\', (event) => {\n      messagePort = event.ports[0]\n      callback()\n    })\n  },\n\n  // 发送消息\n  postMessage: (message) => {\n    if (messagePort) {\n      messagePort.postMessage(message)\n    } else {\n      console.error(\'MessagePort not initialized\')\n    }\n  },\n\n  // 接收消息\n  onMessage: (callback) => {\n    if (messagePort) {\n      messagePort.onmessage = (event) => callback(event.data)\n    } else {\n      console.error(\'MessagePort not initialized\')\n    }\n  },\n\n  // 开始监听\n  start: () => {\n    if (messagePort) {\n      messagePort.start()\n    }\n  }\n})\n```\n\n如果使用ts进行开发可以参考以下的最佳实践\n\n最佳实践：\n\n\n```ts\n// types.ts\ninterface MessageData {\n  id: number\n  from: string\n  content: string\n  timestamp: string\n  type?: string\n  metadata?: Record<string, unknown>\n}\n\n// messagePortManager.ts\nclass MessagePortManager {\n  private static instance: MessagePortManager\n  private port: MessagePort | null = null\n  private messageQueue: MessageData[] = []\n  private isConnected: boolean = false\n  private listeners: Set<(message: MessageData) => void> = new Set()\n\n  private constructor() {}\n\n  static getInstance() {\n    if (!MessagePortManager.instance) {\n      MessagePortManager.instance = new MessagePortManager()\n    }\n    return MessagePortManager.instance\n  }\n\n  setPort(port: MessagePort) {\n    this.port = port\n    this.setupPort()\n  }\n\n  private setupPort() {\n    if (!this.port) return\n\n    this.port.onmessage = (event) => {\n      const message = event.data as MessageData\n      this.notifyListeners(message)\n    }\n\n    this.port.onmessageerror = (event) => {\n      console.error(\'MessagePort error:\', event)\n    }\n\n    this.port.start()\n    this.isConnected = true\n    this.flushMessageQueue()\n  }\n\n  private flushMessageQueue() {\n    while (this.messageQueue.length > 0) {\n      const message = this.messageQueue.shift()\n      if (message) {\n        this.sendMessage(message)\n      }\n    }\n  }\n\n  sendMessage(message: MessageData) {\n    if (this.isConnected && this.port) {\n      try {\n        this.port.postMessage(message)\n        return true\n      } catch (error) {\n        console.error(\'Error sending message:\', error)\n        return false\n      }\n    } else {\n      this.messageQueue.push(message)\n      return false\n    }\n  }\n\n  addListener(callback: (message: MessageData) => void) {\n    this.listeners.add(callback)\n    return () => this.listeners.delete(callback)\n  }\n\n  private notifyListeners(message: MessageData) {\n    this.listeners.forEach(listener => {\n      try {\n        listener(message)\n      } catch (error) {\n        console.error(\'Error in message listener:\', error)\n      }\n    })\n  }\n\n  close() {\n    if (this.port) {\n      this.port.close()\n      this.port = null\n      this.isConnected = false\n    }\n  }\n}\n```\n\n```ts\n// 在预加载脚本中\nconst manager = MessagePortManager.getInstance()\n\ncontextBridge.exposeInMainWorld(\'electronMessagePort\', {\n  onPortSetup: (callback) => {\n    ipcRenderer.once(\'port-setup\', (event) => {\n      manager.setPort(event.ports[0])\n      callback()\n    })\n  },\n\n  sendMessage: (message) => {\n    return manager.sendMessage(message)\n  },\n\n  onMessage: (callback) => {\n    return manager.addListener(callback)\n  }\n})\n```', 18, '2024-10-25 14:07:39', '2024-11-05 10:20:54', 1, 0, '702eb929929711efb8f200163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (105, 'Spring原理', '\nSpring作为Java开发中最常用的框架，其核心知识主要涉及五个方面：IOC控制反转、AOP面向切面编程、事务管理、事务的传播行为和bean的生命周期。\n\nSpring的核心思想是解耦和简化。\n\n![[Pasted image 20241104081833.png]]\n### IOC控制反转\n\n\n控制反转（Inversion of Control，缩写为 **IoC**），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入（Dependency Injection，简称 **DI**）。简单来说，就是本来bean和bean之间的互相调用，被IOC容器给统一管理了，防止了业务bean相互代码侵入。\n\n注意：虽然控制反转这种设计原则非常好用，能大大的降低耦合度但是不是所有系统都能应用这个设计原则，假设你的系统只需要一次编写后再也不修改，你大可以直接对系统类之间的引用写死，毕竟每引用一个技术，整体应用的复杂度又会上一个台阶。\n\n依赖注入的方式主要就分为两种（其实还有一种值注入的方式但是不推荐）：\n\nsetter注入和构造器注入。\n\n#### setter注入\n\n与传统的 JavaBean 的写法更相似，程序开发人员更容易理解、接受。通过 setter 方法设定依赖关系显得更加直观、自然。但是，对于复杂的依赖关系，如果采用构造注入，会导致构造器过于臃肿，难以阅读。Spring 在创建 Bean 实例时，需要同时实例化其依赖的全部实例，因而导致性能下降。而使用设值注入，则能避免这些问题。\n\n示例：\n\n```java\n@Component \npublic class UserService { \nprivate UserRepository userRepository; \n@Autowired \npublic void setUserRepository(UserRepository userRepository) { \nthis.userRepository = userRepository;\n}\n}\n```\n\n#### 构造器注入\n\n1. 构造器注入可以在构造器中决定依赖关系的注入顺序，优先依赖的优先注入。\n2. 对于依赖关系无需变化的 Bean ，构造注入更有用处。因为没有 **setter** 方法，所有的依赖关系全部在构造器内设定，无须担心后续的代码对依赖关系产生破坏。\n3. 依赖关系只能在构造器中设定，则只有组件的创建者才能改变组件的依赖关系，对组件的调用者而言，组件内部的依赖关系完全透明，更符合高内聚的原则。\n\n示例：\n\n```java\n@Component \npublic class UserService { \nprivate final UserRepository userRepository; \n@Autowired \npublic UserService(UserRepository userRepository) { \nthis.userRepository = userRepository; \n}\n}\n```\n\n### AOP面向切面编程\n\nAOP全名 Aspect-Oriented Programming ，中文直译为面向切面编程，当前已经成为一种比较成熟的编程思想，可以用来很好的解决应用系统中分布于各个模块的交叉关注点问题。在轻量级的J2EE中应用开发中，使用AOP来灵活处理一些具有 **横切性质** 的系统级服务，如事务处理、安全检查、缓存、对象池管理等，已经成为一种非常适用的解决方案。\n\n#### 为什么我们需要AOP\n\n当我们需要对系统添加一些功能，但这些功能并不影响实际业务功能，我们也不想因为新的功能影响业务功能，于是面向切面编程就应运而生了。\n所以，AOP 以横截面的方式插入到主流程中，**Spring AOP 面向切面编程能帮助我们无耦合的实现：**\n\n- 性能监控，在方法调用前后记录调用时间，方法执行太长或超时报警。\n- 缓存代理，缓存某方法的返回值，下次执行该方法时，直接从缓存里获取。\n- 软件破解，使用 AOP 修改软件的验证类的判断逻辑。\n- 记录日志，在方法执行前后记录系统操作日志。\n- 工作流系统，工作流系统需要将业务代码和流程引擎代码混合在一起执行，那么我们可以使用AOP将其分离，并动态挂接业务。\n- 权限验证，方法执行前验证是否有权限执行当前方法，没有则抛出没有权限执行异常，有业务代码捕捉。\n- 等等\n\nAOP 其实就是从应用中划分出来了一个切面，然后在这个切面里面插入一些 **“增强”**，最后产生一个增加了新功能的 **代理对象**，注意，是代理对象，这是Spring AOP 实现的基础。这个代理对象只不过比原始对象（Bean）多了一些功能而已，比如 **Bean预处理**、**Bean后处理**、**异常处理** 等。 AOP 代理的目的就是 **将切面织入到目标对象**。\n\n示例：\n\n```java\n@Aspect\n@Component\npublic class LoggingAspect {\n    \n    @Before(\"execution(* com.example.service.*.*(..))\")\n    public void logBefore(JoinPoint joinPoint) {\n        System.out.println(\"Method \" + joinPoint.getSignature().getName() + \" starting\");\n    }\n    \n    @AfterReturning(pointcut = \"execution(* com.example.service.*.*(..))\", returning = \"result\")\n    public void logAfter(JoinPoint joinPoint, Object result) {\n        System.out.println(\"Method \" + joinPoint.getSignature().getName() + \" completed\");\n    }\n}\n```\n\n### bean的生命周期\n\n\n其实bean的生命周期理解起来很简单，只要理解了Spring的核心思想：`解耦`和`简化`其实也就明白了bean的生命周期。\n\nbean的生命周期分为四部分，`定义`、`实例`、`增强`和`销毁`。\n\n#### 定义\n\n从 **xml** 定义 **bean关系**，**properties**、**yaml**、**json**定义 **属性**，关系和属性这就能撑起一个基础的bean的定义\n\n#### 实例\n\n通过定义的**BeanDefinitionReader**扫描定义信息生成bean的定义对象**BeanDefinition**。\n\n#### 增强\n\n对**BeanDefinition**添加特殊的业务能力实现增强操作。\n\n#### 销毁\n\n执行***DisposableBean***接口的***destroy***方法,然后执行自定义的销毁方式。\n\n#### 总结\n\n1. 实例化Bean\n2. 设置属性值\n3. 执行BeanNameAware接口的setBeanName方法\n4. 执行BeanFactoryAware接口的setBeanFactory方法\n5. 执行ApplicationContextAware接口的setApplicationContext方法\n6. 执行BeanPostProcessor的postProcessBeforeInitialization方法\n7. 执行InitializingBean接口的afterPropertiesSet方法\n8. 执行自定义初始化方法\n9. 执行BeanPostProcessor的postProcessAfterInitialization方法\n   ---使用Bean---\n10. 执行DisposableBean接口的destroy方法\n11. 执行自定义销毁方法\n\n### 事务管理\n\n开发中比较频繁使用的就是事务管理，不过在了解Spring的事务管理前，我们需要对事务有基础的理解。\n\n#### 事务\n\n**事务是逻辑上的一组操作，要么都执行，要么都不执行。**\n\n假设你到外面操作，大概能分为两个操作，一个是吃饭，一个是付钱，万一在这两个操作之间突然出现错误比如银行系统崩溃或者网络故障，这样就不对了。事务就是保证这两个关键操作要么都成功，要么都要失败。\n\n##### 事务的特性\n\n1. 原子性（Atomicity）：事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；\n2. 一致性（Consistency）：执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；\n3. 隔离性（Isolation）：并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的；\n4. 持久性（Durability）：一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。\n\n#### Spring的事务管理\n\n对于单机版事务，ORM 框架对事务的支持都是通过数据库的连接（Connection）来实现的，无论我们用的是 JDBC、JDBCTemplate、Hiberate、Mybatis 他们的底层都是基于 Connection 去做的各种封装，例如 Hiberate 封装了 Transaction 对象，MyBatis 封装了 SqlSession 对象。但本质上底层最终都会调用下面这段代码\n\n```java\n// 关闭自动提交，开启事务 \nconnection.setAutoCommit(false);\n// 正常完成提交事务 \nconnection.commit(); \n// 遇到异常的时候回滚 \nconnection.rollback();\n```\n\nspring的事务管理主要有两种方式编程式事务和声明式事务。\n\n示例：\n\n```java\n\n// 1. 声明式事务\n@Service\npublic class UserService {\n    @Transactional(rollbackFor = Exception.class)\n    public void createUser(User user) {\n        // 业务逻辑\n    }\n}\n\n// 2. 编程式事务\n@Service\npublic class UserService {\n    @Autowired\n    private TransactionTemplate transactionTemplate;\n    \n    public void createUser(User user) {\n        transactionTemplate.execute(new TransactionCallbackWithoutResult() {\n            @Override\n            protected void doInTransactionWithoutResult(TransactionStatus status) {\n                // 业务逻辑\n            }\n        });\n    }\n}\n```\n\n### 事务的传播行为\n\nSpring 的事务传播属性主要用于解决多个事务方法之间相互调用时，事务如何进行传播和管理的问题。当一个事务方法调用另一个事务方法时，事务传播属性定义了被调用方法应该如何处理事务。大事务中嵌套了很多小事务，它们彼此影响，最终导致最外层大的事务丧失了事务的原子性。\n\n事务传播属性可以控制事务的边界和范围，以确保数据的一致性和完整性。它解决了以下几个问题：\n\n嵌套事务：当一个事务方法内部调用另一个事务方法时，是否创建一个新的事务或者加入已存在的事务。嵌套事务允许在一个事务中存在多个子事务，每个子事务都有自己的保存点，可以独立地进行提交或回滚。通过事务传播属性，可以控制是否开启新的嵌套事务。\n事务边界：当一个事务方法被另一个非事务方法调用时，是否开启新的事务。如果事务方法被非事务方法调用，那么根据事务传播属性的设置，可以选择开启新的事务或者不开启事务。\n多事务方法协作：当多个事务方法相互协作完成一个复杂的业务逻辑时，事务传播属性可以确保这些方法都在同一个事务中执行，以保证数据的一致性。通过将事务传播属性设置为 REQUIRED，可以要求被调用方法必须在一个已存在的事务中执行，如果不存在事务，则会开启新的事务。\n事务的隔离性：事务传播属性还可以影响事务的隔离级别。当一个事务方法被另一个事务方法调用时，事务传播属性可以决定被调用方法使用的事务隔离级别。例如，如果将事务传播属性设置为 REQUIRES_NEW，被调用方法将在一个新的事务中执行，使用独立的隔离级别。\n\nSpring 的事务传播属性可以配置以下七个值，每个值都代表不同的含义和行为：\n\nREQUIRED：如果当前已经存在一个事务，则加入该事务，否则新建一个事务。这是默认值。主要用于增删改的方法。\nSUPPORTS：如果当前已经存在一个事务，则加入该事务，否则以非事务的方式执行。主要应用在查询方法。\nREQUIRES_NEW：每次都会新建一个事务，如果当前已经存在一个事务，则将当前事务挂起（暂停），始终采用独立事务方法，主要用于日志记录的方法。\nMANDATORY：如果当前已经存在一个事务，则加入该事务，否则抛出异常，不常用。\nNOT_SUPPORTED：以非事务的方式执行操作，如果当前存在一个事务，则将当前事务挂起（暂停），不常用。\nNEVER：以非事务的方式执行操作，如果当前存在一个事务，则抛出异常，不常用。\nNESTED：如果当前已经存在一个事务，则在该事务内嵌套一个子事务，否则新建一个事务。如果子事务失败，则只回滚子事务，而不回滚父事务。如果父事务失败，则回滚所有事务。\n', 15, '2024-11-06 10:30:26', '2025-02-06 22:00:28', 1, 0, '155b6cfa9be711efb8f200163e01ab96');
INSERT INTO `article` (`id`, `title`, `content`, `viewCount`, `createdAt`, `updatedAt`, `type`, `top`, `uuid`) VALUES (106, 'Shiro入门-配置自定义jwtFilter和自定义realm', '#Java  #shiro #鉴权 #J2EE #Spring\n## Spring Boot集成Shiro+JWT实现权限控制\n\n## 1. 项目依赖配置\n\n在`pom.xml`中添加必要的依赖：\n\n```xml\n<dependencies>\n    <!-- Shiro Spring -->\n    <dependency>\n        <groupId>org.apache.shiro</groupId>\n        <artifactId>shiro-spring</artifactId>\n        <version>1.9.0</version>\n    </dependency>\n    \n    <!-- JWT -->\n    <dependency>\n        <groupId>com.auth0</groupId>\n        <artifactId>java-jwt</artifactId>\n        <version>4.3.0</version>\n    </dependency>\n</dependencies>\n```\n\n## 2. 核心组件说明\n\n### 2.1 JWTToken\n实现`AuthenticationToken`接口，用于封装JWT令牌：\n- 用于替代Shiro默认的UsernamePasswordToken\n- 实现getPrincipal()和getCredentials()方法\n- 用于JWT令牌的身份验证\n\n示例：\n\n```java\npublic class JwtToken implements AuthenticationToken {  \n    private String token;  \n  \n    public JwtToken(String token) {  \n        this.token = token;  \n    }  \n  \n    @Override  \n    public Object getPrincipal() {  \n        return token;  \n    }  \n  \n    @Override  \n    public Object getCredentials() {  \n        return token;  \n    }  \n}\n```\n\n### 2.2 JWTUtil\nJWT工具类，提供以下功能：\n- createToken(): 创建JWT令牌\n- getUsername(): 从令牌中获取用户名\n- verify(): 验证令牌有效性\n- 支持令牌过期时间设置\n\n示例：\n\n```java\n@Component  \npublic class JwtUtil {  \n    @Value(\"${jwt.secret:hasuneMiku}\")  \n    private String secret;  \n  \n    @Value(\"${jwt.expiration:86400}\")  \n    private Long expiration;  \n  \n    public String generateToken(String username) {  \n        return Jwts.builder().setSubject(username).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + expiration * 1000)).signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();  \n    }  \n  \n    public String generateToken(String userId, String userName) {  \n        return Jwts.builder().setSubject(userId).setSubject(userName).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + expiration * 1000)).signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();  \n    }  \n  \n    public String getUserNameFromToken(String token) {  \n        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getSubject();  \n    }  \n  \n    public boolean validateToken(String token) throws JwtException {  \n        try {  \n            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);  \n            return true;  \n        } catch (JwtException e) {  \n            return false;  \n        }  \n    }  \n  \n    private SecretKey getSigningKey() {  \n        byte[] keyBytes = Decoders.BASE64.decode(secret.replace(\"\\r\\n\", \"\"));  \n        return Keys.hmacShaKeyFor(keyBytes);  \n    }  \n  \n  \n}\n```\n\n### 2.3 JWTFilter\n继承`BasicHttpAuthenticationFilter`，实现JWT过滤：\n- isLoginAttempt(): 判断是否是登录请求\n- executeLogin(): 执行登录逻辑\n- isAccessAllowed(): 判断是否允许访问\n- 从请求头中获取Authorization信息\n\n示例：\n\n```java\npublic class JWTFilter extends BasicHttpAuthenticationFilter {  \n  \n    @Override  \n    protected boolean isLoginAttempt(ServletRequest request, ServletResponse response) {  \n        HttpServletRequest req = (HttpServletRequest) request;  \n        String authorization = req.getHeader(\"Authorization\");  \n        return authorization != null;  \n    }  \n  \n    @Override  \n    protected boolean executeLogin(ServletRequest request, ServletResponse response) {  \n        HttpServletRequest req = (HttpServletRequest) request;  \n        String token = req.getHeader(\"Authorization\");  \n        JwtToken jwtToken = new JwtToken(token);  \n        getSubject(request, response).login(jwtToken);  \n        return true;  \n    }  \n  \n    @Override  \n    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {  \n        if (isLoginAttempt(request, response)) {  \n            try {  \n                executeLogin(request, response);  \n                return true;  \n            } catch (Exception e) {  \n                return false;  \n            }  \n        }  \n        return false;  \n    }  \n}\n```\n\n### 2.4 CustomRealm\n自定义Realm实现，继承`AuthorizingRealm`：\n- doGetAuthorizationInfo(): 处理授权逻辑\n- doGetAuthenticationInfo(): 处理认证逻辑\n- supports(): 支持JWT令牌验证\n\n示例：\n\n```java\npublic class JwtRealm extends AuthorizingRealm {  \n    @Autowired  \n    private UserService userService;  \n  \n    @Autowired  \n    private PermService permService;  \n  \n    @Autowired  \n    private RoleService roleService;  \n  \n    @Autowired  \n    private JwtUtil jwtUtil;  \n  \n    @Override  \n    public boolean supports(AuthenticationToken token) {  \n        return token instanceof JwtToken;  \n    }  \n  \n    @Override  \n    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {  \n        String username = principals.toString();  \n        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();  \n        // 获取用户权限  \n        Set<String> permissions = permService.getPermByuserName(username);  \n        Set<String> roles = roleService.getRolesByUserName(username);  \n        info.setStringPermissions(permissions);  \n        info.setRoles(roles);  \n        return info;  \n    }  \n  \n    @Override  \n    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken)  \n  \n            throws AuthenticationException {  \n        String token = (String) authenticationToken.getCredentials();  \n        String username = jwtUtil.getUserNameFromToken(token);  \n  \n        if (username == null || !jwtUtil.validateToken(token)) {  \n            throw new AuthenticationException(\"token invalid\");  \n        }  \n  \n        // 验证用户是否存在  \n        if (!userService.exist(username)) {  \n            throw new UnknownAccountException(\"User doesn\'t exist!\");  \n        }  \n  \n        return new SimpleAuthenticationInfo(username, token, getName());  \n    }  \n  \n}\n```\n\n## 3. 配置类说明\n\n### ShiroConfig配置类包含：\n1. ShiroFilterFactoryBean配置：\n   - 配置JWT过滤器\n   - 设置过滤规则\n   - 配置无权限跳转\n\n2. SecurityManager配置：\n   - 设置自定义Realm\n   - 关闭Session管理\n   - 配置为无状态模式\n\n3. 开启注解支持：\n   - 配置DefaultAdvisorAutoProxyCreator\n   - 配置AuthorizationAttributeSourceAdvisor\n   - 配置LifecycleBeanPostProcessor\n\n示例：\n\n```java\n\n@Configuration  \npublic class ShiroConfig {  \n  \n    @Bean  \n    public ShiroFilterFactoryBean shiroFilter(DefaultWebSecurityManager securityManager) {  \n        ShiroFilterFactoryBean factoryBean = new ShiroFilterFactoryBean();  \n        factoryBean.setSecurityManager(securityManager);  \n  \n        // 添加jwt过滤器  \n        Map<String, Filter> filterMap = new HashMap<>();  \n        filterMap.put(\"jwt\", new JWTFilter());  \n        factoryBean.setFilters(filterMap);  \n  \n        // 设置无权限时跳转的url  \n        factoryBean.setUnauthorizedUrl(\"/unauthorized\");  \n  \n        // 设置过滤规则  \n        Map<String, String> filterRuleMap = new HashMap<>();  \n  \n        // 登录接口放行  \n        filterRuleMap.put(\"/api/auth/**\", \"anon\");  \n  \n        // 其他所有路径都需要jwt验证  \n        filterRuleMap.put(\"/**\", \"jwt\");  \n        factoryBean.setFilterChainDefinitionMap(filterRuleMap);  \n  \n        return factoryBean;  \n    }  \n  \n    @Bean  \n    public DefaultWebSecurityManager securityManager(JwtRealm realm) {  \n        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();  \n        securityManager.setRealm(realm);  \n  \n        // 关闭shiro自带的session  \n        DefaultSubjectDAO subjectDAO = new DefaultSubjectDAO();  \n        DefaultSessionStorageEvaluator defaultSessionStorageEvaluator = new DefaultSessionStorageEvaluator();  \n        defaultSessionStorageEvaluator.setSessionStorageEnabled(false);  \n        subjectDAO.setSessionStorageEvaluator(defaultSessionStorageEvaluator);  \n        securityManager.setSubjectDAO(subjectDAO);  \n  \n        return securityManager;  \n    }  \n  \n    @Bean  \n    public JwtRealm realm() {  \n        return new JwtRealm();  \n    }  \n  \n    /**  \n     * 开启Shiro的注解支持  \n     */  \n    @Bean  \n    public DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator() {  \n        DefaultAdvisorAutoProxyCreator advisorAutoProxyCreator = new DefaultAdvisorAutoProxyCreator();  \n        advisorAutoProxyCreator.setProxyTargetClass(true);  \n        return advisorAutoProxyCreator;  \n    }  \n  \n    @Bean  \n    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(DefaultWebSecurityManager securityManager) {  \n        AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();  \n        advisor.setSecurityManager(securityManager);  \n        return advisor;  \n    }  \n  \n    @Bean  \n    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {  \n        return new LifecycleBeanPostProcessor();  \n    }  \n}\n```\n\n## 4. 权限控制使用方式\n\n### 4.1 注解方式\n```java\n// 角色控制\n@RequiresRoles(\"admin\")\npublic void adminOperation() {}\n\n// 权限控制\n@RequiresPermissions(\"user:read\")\npublic void readOperation() {}\n\n// 登录认证\n@RequiresAuthentication\npublic void authenticatedOperation() {}\n```\n\n### 4.2 编程方式\n```java\nSubject subject = SecurityUtils.getSubject();\n// 检查角色\nsubject.checkRole(\"admin\");\n// 检查权限\nsubject.checkPermission(\"user:read\");\n```\n\n## 5. 接口调用流程\n\n1. 用户登录：\n   - 调用登录接口\n   - 验证用户名密码\n   - 生成JWT令牌返回\n\n2. 请求接口：\n   - 请求头携带令牌：`Authorization: {token}`\n   - JWTFilter进行令牌解析\n   - CustomRealm进行权限验证\n   - 返回请求结果\n\n## 6. UserService接口定义\n\n需要实现以下方法：\n```java\npublic interface UserService {\n    // 获取用户权限列表\n    Set<String> getPermissions(String username);\n    \n    // 获取用户角色列表\n    Set<String> getRoles(String username);\n    \n    // 检查用户是否存在\n    boolean exists(String username);\n    \n    // 验证用户密码\n    boolean checkPassword(String username, String password);\n}\n```\n\n## 7. 常见问题与解决方案\n\n### 7.1 登录失败问题\n\n1. **问题**: 明明用户名密码正确，但始终登录失败\n   **解决方案**: \n   - 检查密码加密方式是否一致\n   - 确认salt值的使用是否正确\n   ```java\n   // 正确的密码校验方式\n   String encryptPassword = new SimpleHash(\n       \"MD5\",                          // 算法名称\n       password,                       // 原密码\n       ByteSource.Util.bytes(salt),    // 盐值\n       1024                           // 迭代次数\n   ).toHex();\n   ```\n\n### 7.2 授权失败问题\n\n1. **问题**: 注解不生效\n   **解决方案**:\n   - 确认已经配置了AOP支持\n   - 检查是否启用了注解支持\n   ```java\n   @EnableAspectJAutoProxy\n   @Configuration\n   public class ShiroConfig {\n       // ...配置代码\n   }\n   ```\n\n### 7.3 Session问题\n\n1. **问题**: Session频繁失效\n   **解决方案**:\n   - 调整session超时时间\n   - 确认是否存在集群环境下的session同步问题\n   ```java\n   sessionManager.setGlobalSessionTimeout(3600000); // 设置为1小时\n   ```\n\n### 7.4 跨域问题\n\n1. **问题**: 跨域请求被拦截\n   **解决方案**:\n   ```java\n   @Bean\n   public FilterRegistrationBean corsFilter() {\n       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();\n       CorsConfiguration config = new CorsConfiguration();\n       config.setAllowCredentials(true);\n       config.addAllowedOrigin(\"*\");\n       config.addAllowedHeader(\"*\");\n       config.addAllowedMethod(\"*\");\n       source.registerCorsConfiguration(\"/**\", config);\n       FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));\n       bean.setOrder(0);\n       return bean;\n   }\n   ```\n\n### 7.5 性能优化建议\n\n1. **缓存配置**:\n   ```java\n   @Bean\n   public CacheManager cacheManager() {\n       EhCacheManager cacheManager = new EhCacheManager();\n       cacheManager.setCacheManagerConfigFile(\"classpath:ehcache.xml\");\n       return cacheManager;\n   }\n   ```\n\n2. **并发性能优化**:\n   ```java\n   @Bean\n   public SecurityManager securityManager() {\n       DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();\n       // 开启并发验证\n       ((DefaultSubjectDAO)securityManager.getSubjectDAO())\n           .setSessionStorageEvaluator(new DefaultSessionStorageEvaluator());\n       return securityManager;\n   }\n   ```\n\n## 最佳实践建议\n\n1. 始终使用安全的密码加密方式\n2. 合理配置缓存，提高性能\n3. 正确处理异常，提供友好的错误提示\n4. 定期清理过期session\n5. 使用注解进行权限控制时要考虑粒度\n6. 在生产环境中要禁用开发模式配置\n', 14, '2024-11-07 10:44:09', '2025-02-05 09:08:36', 1, 0, '2a4a68239cb211efb8f200163e01ab96');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `articleId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 176 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (160, 'Geth', 92);
INSERT INTO `category` VALUES (162, 'GO', 94);
INSERT INTO `category` VALUES (163, 'GO', 93);
INSERT INTO `category` VALUES (164, 'GO', 95);
INSERT INTO `category` VALUES (165, 'GO', 96);
INSERT INTO `category` VALUES (166, 'GO', 97);
INSERT INTO `category` VALUES (167, '前端开发', 98);
INSERT INTO `category` VALUES (170, '跨平台开发', 102);
INSERT INTO `category` VALUES (171, '跨平台开发', 103);
INSERT INTO `category` VALUES (172, '跨平台开发', 104);
INSERT INTO `category` VALUES (174, 'java', 105);
INSERT INTO `category` VALUES (175, 'java', 106);

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `articleId` int NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `updatedAt` datetime NULL DEFAULT NULL,
  `userId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 57 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (55, 93, 'ceshi', '2024-05-06 15:39:39', '2024-05-06 15:39:39', 47529556);
INSERT INTO `comment` VALUES (56, 93, '⚪神启动！', '2024-06-30 13:24:46', '2024-06-30 13:24:46', 47529555);

-- ----------------------------
-- Table structure for fragment
-- ----------------------------
DROP TABLE IF EXISTS `fragment`;
CREATE TABLE `fragment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `author` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 101 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fragment
-- ----------------------------

-- ----------------------------
-- Table structure for ip
-- ----------------------------
DROP TABLE IF EXISTS `ip`;
CREATE TABLE `ip`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `auth` tinyint(1) NULL DEFAULT 1,
  `userId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  CONSTRAINT `ip_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ip
-- ----------------------------
INSERT INTO `ip` VALUES (2, '::ffff:127.0.0.1', 1, 47529556);

-- ----------------------------
-- Table structure for record
-- ----------------------------
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `articleId` int NOT NULL,
  `userId` int NULL DEFAULT NULL,
  `recordTime` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1332 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of record
-- ----------------------------
INSERT INTO `record` VALUES (101, -1, NULL, '2024-05-04 12:50:48');
INSERT INTO `record` VALUES (102, -1, NULL, '2024-05-04 12:55:03');
INSERT INTO `record` VALUES (103, 92, NULL, '2024-05-04 14:03:21');
INSERT INTO `record` VALUES (104, 92, NULL, '2024-05-04 14:40:59');
INSERT INTO `record` VALUES (105, -1, NULL, '2024-05-04 14:41:17');
INSERT INTO `record` VALUES (106, -1, NULL, '2024-05-04 14:41:19');
INSERT INTO `record` VALUES (107, 92, NULL, '2024-05-04 14:43:03');
INSERT INTO `record` VALUES (108, -1, NULL, '2024-05-04 20:29:17');
INSERT INTO `record` VALUES (109, 92, NULL, '2024-05-04 20:29:20');
INSERT INTO `record` VALUES (110, 92, NULL, '2024-05-04 22:18:02');
INSERT INTO `record` VALUES (111, -1, NULL, '2024-05-05 00:24:12');
INSERT INTO `record` VALUES (112, -1, NULL, '2024-05-05 00:24:15');
INSERT INTO `record` VALUES (113, 92, NULL, '2024-05-05 01:40:33');
INSERT INTO `record` VALUES (114, 92, NULL, '2024-05-05 12:42:31');
INSERT INTO `record` VALUES (115, 92, NULL, '2024-05-05 12:44:35');
INSERT INTO `record` VALUES (116, -1, NULL, '2024-05-05 12:45:00');
INSERT INTO `record` VALUES (117, 93, NULL, '2024-05-05 13:23:50');
INSERT INTO `record` VALUES (118, -1, NULL, '2024-05-05 13:59:14');
INSERT INTO `record` VALUES (119, -1, NULL, '2024-05-05 13:59:16');
INSERT INTO `record` VALUES (120, -1, NULL, '2024-05-05 13:59:41');
INSERT INTO `record` VALUES (121, 93, NULL, '2024-05-05 13:59:47');
INSERT INTO `record` VALUES (122, 93, NULL, '2024-05-05 14:04:10');
INSERT INTO `record` VALUES (123, 93, NULL, '2024-05-06 13:40:43');
INSERT INTO `record` VALUES (124, 93, NULL, '2024-05-06 14:02:50');
INSERT INTO `record` VALUES (125, 93, NULL, '2024-05-06 15:32:37');
INSERT INTO `record` VALUES (126, -1, NULL, '2024-05-06 15:35:38');
INSERT INTO `record` VALUES (127, 93, NULL, '2024-05-06 15:38:27');
INSERT INTO `record` VALUES (128, 92, NULL, '2024-05-06 15:49:07');
INSERT INTO `record` VALUES (129, 93, NULL, '2024-05-06 15:50:29');
INSERT INTO `record` VALUES (130, 93, NULL, '2024-05-06 15:54:04');
INSERT INTO `record` VALUES (131, 93, NULL, '2024-05-06 15:54:37');
INSERT INTO `record` VALUES (132, 93, NULL, '2024-05-06 16:07:34');
INSERT INTO `record` VALUES (133, 93, NULL, '2024-05-06 16:07:53');
INSERT INTO `record` VALUES (134, 92, NULL, '2024-05-06 16:08:42');
INSERT INTO `record` VALUES (135, 93, NULL, '2024-05-06 16:15:23');
INSERT INTO `record` VALUES (136, 92, NULL, '2024-05-06 16:15:39');
INSERT INTO `record` VALUES (137, 93, NULL, '2024-05-06 16:15:40');
INSERT INTO `record` VALUES (138, 92, NULL, '2024-05-06 16:15:42');
INSERT INTO `record` VALUES (139, 92, NULL, '2024-05-06 16:15:45');
INSERT INTO `record` VALUES (140, 92, NULL, '2024-05-06 16:29:02');
INSERT INTO `record` VALUES (141, 94, NULL, '2024-05-06 18:52:24');
INSERT INTO `record` VALUES (142, 94, NULL, '2024-05-06 18:53:25');
INSERT INTO `record` VALUES (143, 94, NULL, '2024-05-06 18:53:39');
INSERT INTO `record` VALUES (144, 94, NULL, '2024-05-06 19:03:54');
INSERT INTO `record` VALUES (145, 94, NULL, '2024-05-06 22:47:05');
INSERT INTO `record` VALUES (146, 93, NULL, '2024-05-06 22:57:43');
INSERT INTO `record` VALUES (147, 94, NULL, '2024-05-06 22:57:58');
INSERT INTO `record` VALUES (148, 93, NULL, '2024-05-06 22:58:02');
INSERT INTO `record` VALUES (149, -1, NULL, '2024-05-08 13:30:31');
INSERT INTO `record` VALUES (150, 95, NULL, '2024-05-08 13:55:59');
INSERT INTO `record` VALUES (151, 95, NULL, '2024-05-08 18:25:00');
INSERT INTO `record` VALUES (152, 95, NULL, '2024-05-09 14:31:49');
INSERT INTO `record` VALUES (153, 95, NULL, '2024-05-12 22:01:26');
INSERT INTO `record` VALUES (154, 95, NULL, '2024-05-12 22:02:04');
INSERT INTO `record` VALUES (155, 93, NULL, '2024-05-12 22:02:10');
INSERT INTO `record` VALUES (156, 95, NULL, '2024-05-12 22:03:43');
INSERT INTO `record` VALUES (157, 93, NULL, '2024-05-12 22:19:54');
INSERT INTO `record` VALUES (158, 93, NULL, '2024-05-12 22:22:11');
INSERT INTO `record` VALUES (159, 92, NULL, '2024-05-12 22:23:33');
INSERT INTO `record` VALUES (160, 93, NULL, '2024-05-12 22:23:34');
INSERT INTO `record` VALUES (161, 95, NULL, '2024-05-12 22:23:39');
INSERT INTO `record` VALUES (162, 94, NULL, '2024-05-12 22:23:40');
INSERT INTO `record` VALUES (163, 95, NULL, '2024-05-12 22:32:18');
INSERT INTO `record` VALUES (164, 93, NULL, '2024-05-12 22:32:48');
INSERT INTO `record` VALUES (165, 95, NULL, '2024-05-12 22:32:58');
INSERT INTO `record` VALUES (166, 92, NULL, '2024-05-12 22:35:32');
INSERT INTO `record` VALUES (167, 95, NULL, '2024-05-12 22:40:26');
INSERT INTO `record` VALUES (168, 95, NULL, '2024-05-12 22:41:21');
INSERT INTO `record` VALUES (169, 95, NULL, '2024-05-12 22:46:17');
INSERT INTO `record` VALUES (170, 95, NULL, '2024-05-13 18:32:25');
INSERT INTO `record` VALUES (171, 95, NULL, '2024-05-13 18:46:51');
INSERT INTO `record` VALUES (172, -1, NULL, '2024-05-17 15:51:26');
INSERT INTO `record` VALUES (173, 95, NULL, '2024-05-17 16:06:32');
INSERT INTO `record` VALUES (174, 95, NULL, '2024-05-17 18:31:00');
INSERT INTO `record` VALUES (175, 92, NULL, '2024-05-29 12:16:39');
INSERT INTO `record` VALUES (176, 94, NULL, '2024-05-29 13:58:02');
INSERT INTO `record` VALUES (177, 96, NULL, '2024-05-29 22:17:00');
INSERT INTO `record` VALUES (178, 92, NULL, '2024-06-03 22:51:28');
INSERT INTO `record` VALUES (179, 92, NULL, '2024-06-04 14:11:02');
INSERT INTO `record` VALUES (180, 92, NULL, '2024-06-06 22:56:43');
INSERT INTO `record` VALUES (181, 96, NULL, '2024-06-19 20:49:57');
INSERT INTO `record` VALUES (182, 92, NULL, '2024-06-19 20:50:26');
INSERT INTO `record` VALUES (183, 96, NULL, '2024-06-19 21:42:47');
INSERT INTO `record` VALUES (184, 95, NULL, '2024-06-19 21:42:55');
INSERT INTO `record` VALUES (185, 93, NULL, '2024-06-19 21:43:14');
INSERT INTO `record` VALUES (186, 96, NULL, '2024-06-19 21:44:58');
INSERT INTO `record` VALUES (187, 97, NULL, '2024-06-26 00:26:50');
INSERT INTO `record` VALUES (188, 97, NULL, '2024-06-26 00:27:07');
INSERT INTO `record` VALUES (189, 92, NULL, '2024-06-26 00:27:10');
INSERT INTO `record` VALUES (190, 97, NULL, '2024-06-26 14:02:36');
INSERT INTO `record` VALUES (191, 97, NULL, '2024-06-26 17:07:42');
INSERT INTO `record` VALUES (192, 97, NULL, '2024-06-28 12:44:41');
INSERT INTO `record` VALUES (193, 97, NULL, '2024-06-28 13:10:33');
INSERT INTO `record` VALUES (194, 97, NULL, '2024-06-28 14:31:45');
INSERT INTO `record` VALUES (195, 97, NULL, '2024-06-28 14:38:16');
INSERT INTO `record` VALUES (196, 97, NULL, '2024-06-28 14:49:54');
INSERT INTO `record` VALUES (197, 97, NULL, '2024-06-28 15:07:16');
INSERT INTO `record` VALUES (198, 97, NULL, '2024-06-28 15:07:34');
INSERT INTO `record` VALUES (199, 97, NULL, '2024-06-28 15:07:42');
INSERT INTO `record` VALUES (200, -1, NULL, '2024-06-28 15:08:30');
INSERT INTO `record` VALUES (201, -1, NULL, '2024-06-28 15:08:36');
INSERT INTO `record` VALUES (202, 92, NULL, '2024-06-28 15:09:31');
INSERT INTO `record` VALUES (203, 92, NULL, '2024-06-28 15:09:38');
INSERT INTO `record` VALUES (204, 97, NULL, '2024-06-28 15:19:39');
INSERT INTO `record` VALUES (205, 97, NULL, '2024-06-28 15:21:18');
INSERT INTO `record` VALUES (206, 97, NULL, '2024-06-28 15:24:56');
INSERT INTO `record` VALUES (207, 97, NULL, '2024-06-28 15:25:45');
INSERT INTO `record` VALUES (208, 97, NULL, '2024-06-28 15:27:09');
INSERT INTO `record` VALUES (209, 97, NULL, '2024-06-28 19:48:56');
INSERT INTO `record` VALUES (210, 97, NULL, '2024-06-28 22:32:28');
INSERT INTO `record` VALUES (211, 97, NULL, '2024-06-28 22:33:20');
INSERT INTO `record` VALUES (212, 97, NULL, '2024-06-28 22:35:15');
INSERT INTO `record` VALUES (213, 97, NULL, '2024-06-28 23:49:33');
INSERT INTO `record` VALUES (214, 97, NULL, '2024-06-28 23:49:37');
INSERT INTO `record` VALUES (215, 96, NULL, '2024-06-29 00:25:52');
INSERT INTO `record` VALUES (216, 97, NULL, '2024-06-29 01:26:19');
INSERT INTO `record` VALUES (217, 97, NULL, '2024-06-29 01:26:25');
INSERT INTO `record` VALUES (218, 93, NULL, '2024-06-29 01:52:18');
INSERT INTO `record` VALUES (219, 93, NULL, '2024-06-29 01:52:36');
INSERT INTO `record` VALUES (220, 93, NULL, '2024-06-29 01:53:45');
INSERT INTO `record` VALUES (221, 97, NULL, '2024-06-29 02:16:23');
INSERT INTO `record` VALUES (222, 96, NULL, '2024-06-29 02:22:28');
INSERT INTO `record` VALUES (223, 97, NULL, '2024-06-29 02:22:28');
INSERT INTO `record` VALUES (224, 95, NULL, '2024-06-29 02:22:33');
INSERT INTO `record` VALUES (225, 97, NULL, '2024-06-29 13:30:55');
INSERT INTO `record` VALUES (226, 97, NULL, '2024-06-29 13:31:15');
INSERT INTO `record` VALUES (227, 97, NULL, '2024-06-29 13:31:58');
INSERT INTO `record` VALUES (228, 97, NULL, '2024-06-29 13:32:27');
INSERT INTO `record` VALUES (229, 97, NULL, '2024-06-29 13:35:25');
INSERT INTO `record` VALUES (230, 97, NULL, '2024-06-29 13:36:00');
INSERT INTO `record` VALUES (231, 97, NULL, '2024-06-29 13:36:22');
INSERT INTO `record` VALUES (232, 97, NULL, '2024-06-29 13:37:26');
INSERT INTO `record` VALUES (233, 97, NULL, '2024-06-29 13:37:30');
INSERT INTO `record` VALUES (234, 97, NULL, '2024-06-29 13:37:49');
INSERT INTO `record` VALUES (235, 97, NULL, '2024-06-29 13:38:11');
INSERT INTO `record` VALUES (236, 97, NULL, '2024-06-29 13:38:20');
INSERT INTO `record` VALUES (237, 97, NULL, '2024-06-30 00:50:18');
INSERT INTO `record` VALUES (238, 97, NULL, '2024-06-30 00:52:40');
INSERT INTO `record` VALUES (239, 93, NULL, '2024-06-30 00:52:44');
INSERT INTO `record` VALUES (240, 96, NULL, '2024-06-30 01:45:38');
INSERT INTO `record` VALUES (241, 96, NULL, '2024-06-30 01:47:12');
INSERT INTO `record` VALUES (242, 96, NULL, '2024-06-30 01:50:20');
INSERT INTO `record` VALUES (243, 96, NULL, '2024-06-30 01:52:09');
INSERT INTO `record` VALUES (244, 96, NULL, '2024-06-30 01:53:10');
INSERT INTO `record` VALUES (245, 96, NULL, '2024-06-30 01:53:37');
INSERT INTO `record` VALUES (246, 96, NULL, '2024-06-30 01:57:15');
INSERT INTO `record` VALUES (247, 96, NULL, '2024-06-30 02:01:09');
INSERT INTO `record` VALUES (248, 96, NULL, '2024-06-30 02:04:35');
INSERT INTO `record` VALUES (249, 96, NULL, '2024-06-30 02:05:05');
INSERT INTO `record` VALUES (250, 96, NULL, '2024-06-30 02:05:43');
INSERT INTO `record` VALUES (251, 97, NULL, '2024-06-30 02:17:34');
INSERT INTO `record` VALUES (252, 93, NULL, '2024-06-30 02:17:40');
INSERT INTO `record` VALUES (253, 93, NULL, '2024-06-30 13:23:58');
INSERT INTO `record` VALUES (254, 93, NULL, '2024-06-30 13:25:21');
INSERT INTO `record` VALUES (255, 93, NULL, '2024-06-30 13:25:26');
INSERT INTO `record` VALUES (256, 97, NULL, '2024-06-30 13:33:29');
INSERT INTO `record` VALUES (257, 97, NULL, '2024-06-30 13:33:47');
INSERT INTO `record` VALUES (258, 97, NULL, '2024-06-30 13:33:47');
INSERT INTO `record` VALUES (259, 97, NULL, '2024-06-30 13:34:10');
INSERT INTO `record` VALUES (260, 97, NULL, '2024-06-30 13:34:11');
INSERT INTO `record` VALUES (261, 97, NULL, '2024-06-30 13:34:13');
INSERT INTO `record` VALUES (262, 97, NULL, '2024-06-30 13:34:29');
INSERT INTO `record` VALUES (263, 97, NULL, '2024-06-30 13:34:41');
INSERT INTO `record` VALUES (264, 97, NULL, '2024-06-30 13:34:42');
INSERT INTO `record` VALUES (265, 97, NULL, '2024-06-30 13:35:39');
INSERT INTO `record` VALUES (266, 97, NULL, '2024-06-30 14:06:43');
INSERT INTO `record` VALUES (267, 97, NULL, '2024-06-30 14:17:44');
INSERT INTO `record` VALUES (268, -1, NULL, '2024-06-30 17:16:32');
INSERT INTO `record` VALUES (269, -1, NULL, '2024-06-30 17:16:33');
INSERT INTO `record` VALUES (270, 97, NULL, '2024-06-30 17:16:54');
INSERT INTO `record` VALUES (271, 95, NULL, '2024-06-30 17:16:55');
INSERT INTO `record` VALUES (272, 97, NULL, '2024-06-30 17:24:20');
INSERT INTO `record` VALUES (273, -1, NULL, '2024-06-30 17:24:47');
INSERT INTO `record` VALUES (274, -1, NULL, '2024-06-30 17:47:02');
INSERT INTO `record` VALUES (275, 97, NULL, '2024-07-01 16:18:47');
INSERT INTO `record` VALUES (276, 97, NULL, '2024-07-01 18:07:38');
INSERT INTO `record` VALUES (277, 97, NULL, '2024-07-01 18:07:38');
INSERT INTO `record` VALUES (278, 97, NULL, '2024-07-01 18:20:20');
INSERT INTO `record` VALUES (279, 97, NULL, '2024-07-01 18:26:57');
INSERT INTO `record` VALUES (280, 97, NULL, '2024-07-01 18:27:09');
INSERT INTO `record` VALUES (281, 97, NULL, '2024-07-01 18:45:44');
INSERT INTO `record` VALUES (282, 97, NULL, '2024-07-02 00:49:29');
INSERT INTO `record` VALUES (283, 93, NULL, '2024-07-02 00:49:33');
INSERT INTO `record` VALUES (284, 97, NULL, '2024-07-02 01:02:27');
INSERT INTO `record` VALUES (285, 97, NULL, '2024-07-02 01:02:36');
INSERT INTO `record` VALUES (286, 97, NULL, '2024-07-02 01:02:38');
INSERT INTO `record` VALUES (287, 96, NULL, '2024-07-02 01:02:40');
INSERT INTO `record` VALUES (288, 96, NULL, '2024-07-02 01:02:43');
INSERT INTO `record` VALUES (289, 95, NULL, '2024-07-02 01:02:45');
INSERT INTO `record` VALUES (290, 97, NULL, '2024-07-02 01:02:45');
INSERT INTO `record` VALUES (291, 94, NULL, '2024-07-02 01:02:47');
INSERT INTO `record` VALUES (292, 95, NULL, '2024-07-02 01:02:47');
INSERT INTO `record` VALUES (293, 94, NULL, '2024-07-02 01:02:50');
INSERT INTO `record` VALUES (294, 94, NULL, '2024-07-02 01:02:52');
INSERT INTO `record` VALUES (295, 94, NULL, '2024-07-02 01:02:55');
INSERT INTO `record` VALUES (296, 94, NULL, '2024-07-02 01:03:12');
INSERT INTO `record` VALUES (297, 97, NULL, '2024-07-02 01:03:18');
INSERT INTO `record` VALUES (298, 96, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (299, 94, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (300, 95, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (301, 97, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (302, 95, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (303, 94, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (304, 97, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (305, 96, NULL, '2024-07-02 01:07:06');
INSERT INTO `record` VALUES (306, 94, NULL, '2024-07-02 01:12:17');
INSERT INTO `record` VALUES (307, 94, NULL, '2024-07-02 01:12:17');
INSERT INTO `record` VALUES (308, 94, NULL, '2024-07-02 01:12:17');
INSERT INTO `record` VALUES (309, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (310, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (311, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (312, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (313, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (314, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (315, 94, NULL, '2024-07-02 01:12:18');
INSERT INTO `record` VALUES (316, 94, NULL, '2024-07-02 01:12:19');
INSERT INTO `record` VALUES (317, 94, NULL, '2024-07-02 01:12:19');
INSERT INTO `record` VALUES (318, 94, NULL, '2024-07-02 01:12:19');
INSERT INTO `record` VALUES (319, 94, NULL, '2024-07-02 01:12:19');
INSERT INTO `record` VALUES (320, 94, NULL, '2024-07-02 01:12:19');
INSERT INTO `record` VALUES (321, 94, NULL, '2024-07-02 01:12:20');
INSERT INTO `record` VALUES (322, 94, NULL, '2024-07-02 01:12:20');
INSERT INTO `record` VALUES (323, 94, NULL, '2024-07-02 01:12:20');
INSERT INTO `record` VALUES (324, 94, NULL, '2024-07-02 01:12:20');
INSERT INTO `record` VALUES (325, 94, NULL, '2024-07-02 01:12:20');
INSERT INTO `record` VALUES (326, 94, NULL, '2024-07-02 01:12:21');
INSERT INTO `record` VALUES (327, 94, NULL, '2024-07-02 01:12:21');
INSERT INTO `record` VALUES (328, 94, NULL, '2024-07-02 01:12:21');
INSERT INTO `record` VALUES (329, 94, NULL, '2024-07-02 01:12:21');
INSERT INTO `record` VALUES (330, 94, NULL, '2024-07-02 01:12:21');
INSERT INTO `record` VALUES (331, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (332, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (333, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (334, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (335, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (336, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (337, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (338, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (339, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (340, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (341, 94, NULL, '2024-07-02 01:12:22');
INSERT INTO `record` VALUES (342, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (343, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (344, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (345, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (346, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (347, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (348, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (349, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (350, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (351, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (352, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (353, 94, NULL, '2024-07-02 01:12:23');
INSERT INTO `record` VALUES (354, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (355, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (356, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (357, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (358, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (359, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (360, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (361, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (362, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (363, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (364, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (365, 94, NULL, '2024-07-02 01:12:24');
INSERT INTO `record` VALUES (366, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (367, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (368, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (369, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (370, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (371, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (372, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (373, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (374, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (375, 94, NULL, '2024-07-02 01:12:25');
INSERT INTO `record` VALUES (376, 94, NULL, '2024-07-02 01:12:26');
INSERT INTO `record` VALUES (377, 94, NULL, '2024-07-02 01:12:26');
INSERT INTO `record` VALUES (378, 94, NULL, '2024-07-02 01:12:26');
INSERT INTO `record` VALUES (379, 94, NULL, '2024-07-02 01:12:26');
INSERT INTO `record` VALUES (380, 94, NULL, '2024-07-02 01:12:26');
INSERT INTO `record` VALUES (381, 94, NULL, '2024-07-02 01:12:26');
INSERT INTO `record` VALUES (382, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (383, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (384, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (385, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (386, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (387, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (388, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (389, 94, NULL, '2024-07-02 01:12:27');
INSERT INTO `record` VALUES (390, 94, NULL, '2024-07-02 01:12:28');
INSERT INTO `record` VALUES (391, 94, NULL, '2024-07-02 01:12:28');
INSERT INTO `record` VALUES (392, 94, NULL, '2024-07-02 01:12:28');
INSERT INTO `record` VALUES (393, 94, NULL, '2024-07-02 01:12:29');
INSERT INTO `record` VALUES (394, 94, NULL, '2024-07-02 01:12:29');
INSERT INTO `record` VALUES (395, 94, NULL, '2024-07-02 01:12:29');
INSERT INTO `record` VALUES (396, 94, NULL, '2024-07-02 01:12:29');
INSERT INTO `record` VALUES (397, 94, NULL, '2024-07-02 01:12:29');
INSERT INTO `record` VALUES (398, 94, NULL, '2024-07-02 01:12:30');
INSERT INTO `record` VALUES (399, 94, NULL, '2024-07-02 01:12:30');
INSERT INTO `record` VALUES (400, 94, NULL, '2024-07-02 01:12:30');
INSERT INTO `record` VALUES (401, 94, NULL, '2024-07-02 01:12:31');
INSERT INTO `record` VALUES (402, 94, NULL, '2024-07-02 01:12:31');
INSERT INTO `record` VALUES (403, 94, NULL, '2024-07-02 01:12:31');
INSERT INTO `record` VALUES (404, 94, NULL, '2024-07-02 01:12:31');
INSERT INTO `record` VALUES (405, 94, NULL, '2024-07-02 01:12:32');
INSERT INTO `record` VALUES (406, 94, NULL, '2024-07-02 01:12:32');
INSERT INTO `record` VALUES (407, 94, NULL, '2024-07-02 01:12:32');
INSERT INTO `record` VALUES (408, 94, NULL, '2024-07-02 01:12:32');
INSERT INTO `record` VALUES (409, 95, NULL, '2024-07-02 01:12:35');
INSERT INTO `record` VALUES (410, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (411, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (412, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (413, 94, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (414, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (415, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (416, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (417, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (418, 95, NULL, '2024-07-02 01:12:36');
INSERT INTO `record` VALUES (419, 95, NULL, '2024-07-02 01:12:37');
INSERT INTO `record` VALUES (420, 95, NULL, '2024-07-02 01:12:37');
INSERT INTO `record` VALUES (421, 95, NULL, '2024-07-02 01:12:37');
INSERT INTO `record` VALUES (422, 95, NULL, '2024-07-02 01:12:37');
INSERT INTO `record` VALUES (423, 95, NULL, '2024-07-02 01:12:37');
INSERT INTO `record` VALUES (424, 95, NULL, '2024-07-02 01:12:37');
INSERT INTO `record` VALUES (425, 95, NULL, '2024-07-02 01:12:38');
INSERT INTO `record` VALUES (426, 95, NULL, '2024-07-02 01:12:38');
INSERT INTO `record` VALUES (427, 95, NULL, '2024-07-02 01:12:38');
INSERT INTO `record` VALUES (428, 95, NULL, '2024-07-02 01:12:38');
INSERT INTO `record` VALUES (429, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (430, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (431, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (432, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (433, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (434, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (435, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (436, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (437, 95, NULL, '2024-07-02 01:12:40');
INSERT INTO `record` VALUES (438, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (439, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (440, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (441, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (442, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (443, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (444, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (445, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (446, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (447, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (448, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (449, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (450, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (451, 95, NULL, '2024-07-02 01:12:41');
INSERT INTO `record` VALUES (452, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (453, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (454, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (455, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (456, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (457, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (458, 94, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (459, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (460, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (461, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (462, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (463, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (464, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (465, 95, NULL, '2024-07-02 01:12:42');
INSERT INTO `record` VALUES (466, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (467, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (468, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (469, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (470, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (471, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (472, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (473, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (474, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (475, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (476, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (477, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (478, 95, NULL, '2024-07-02 01:12:43');
INSERT INTO `record` VALUES (479, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (480, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (481, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (482, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (483, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (484, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (485, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (486, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (487, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (488, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (489, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (490, 95, NULL, '2024-07-02 01:12:44');
INSERT INTO `record` VALUES (491, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (492, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (493, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (494, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (495, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (496, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (497, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (498, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (499, 95, NULL, '2024-07-02 01:12:45');
INSERT INTO `record` VALUES (500, 95, NULL, '2024-07-02 01:12:46');
INSERT INTO `record` VALUES (501, 95, NULL, '2024-07-02 01:12:46');
INSERT INTO `record` VALUES (502, 94, NULL, '2024-07-02 01:12:46');
INSERT INTO `record` VALUES (503, 95, NULL, '2024-07-02 01:12:46');
INSERT INTO `record` VALUES (504, 95, NULL, '2024-07-02 01:12:47');
INSERT INTO `record` VALUES (505, 95, NULL, '2024-07-02 01:12:47');
INSERT INTO `record` VALUES (506, 95, NULL, '2024-07-02 01:12:47');
INSERT INTO `record` VALUES (507, 95, NULL, '2024-07-02 01:12:49');
INSERT INTO `record` VALUES (508, 95, NULL, '2024-07-02 01:12:49');
INSERT INTO `record` VALUES (509, 95, NULL, '2024-07-02 01:12:49');
INSERT INTO `record` VALUES (510, 95, NULL, '2024-07-02 01:12:50');
INSERT INTO `record` VALUES (511, 95, NULL, '2024-07-02 01:12:50');
INSERT INTO `record` VALUES (512, 95, NULL, '2024-07-02 01:12:50');
INSERT INTO `record` VALUES (513, 95, NULL, '2024-07-02 01:12:50');
INSERT INTO `record` VALUES (514, 95, NULL, '2024-07-02 01:12:51');
INSERT INTO `record` VALUES (515, 96, NULL, '2024-07-02 01:12:51');
INSERT INTO `record` VALUES (516, 96, NULL, '2024-07-02 01:12:51');
INSERT INTO `record` VALUES (517, 96, NULL, '2024-07-02 01:12:51');
INSERT INTO `record` VALUES (518, 95, NULL, '2024-07-02 01:12:52');
INSERT INTO `record` VALUES (519, 96, NULL, '2024-07-02 01:12:52');
INSERT INTO `record` VALUES (520, 96, NULL, '2024-07-02 01:12:52');
INSERT INTO `record` VALUES (521, 96, NULL, '2024-07-02 01:12:52');
INSERT INTO `record` VALUES (522, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (523, 94, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (524, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (525, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (526, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (527, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (528, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (529, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (530, 96, NULL, '2024-07-02 01:12:53');
INSERT INTO `record` VALUES (531, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (532, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (533, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (534, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (535, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (536, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (537, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (538, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (539, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (540, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (541, 96, NULL, '2024-07-02 01:12:54');
INSERT INTO `record` VALUES (542, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (543, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (544, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (545, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (546, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (547, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (548, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (549, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (550, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (551, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (552, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (553, 96, NULL, '2024-07-02 01:12:55');
INSERT INTO `record` VALUES (554, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (555, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (556, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (557, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (558, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (559, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (560, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (561, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (562, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (563, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (564, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (565, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (566, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (567, 96, NULL, '2024-07-02 01:12:56');
INSERT INTO `record` VALUES (568, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (569, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (570, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (571, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (572, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (573, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (574, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (575, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (576, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (577, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (578, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (579, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (580, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (581, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (582, 96, NULL, '2024-07-02 01:12:57');
INSERT INTO `record` VALUES (583, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (584, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (585, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (586, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (587, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (588, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (589, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (590, 95, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (591, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (592, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (593, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (594, 94, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (595, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (596, 96, NULL, '2024-07-02 01:12:58');
INSERT INTO `record` VALUES (597, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (598, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (599, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (600, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (601, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (602, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (603, 96, NULL, '2024-07-02 01:12:59');
INSERT INTO `record` VALUES (604, 96, NULL, '2024-07-02 01:13:00');
INSERT INTO `record` VALUES (605, 96, NULL, '2024-07-02 01:13:00');
INSERT INTO `record` VALUES (606, 96, NULL, '2024-07-02 01:13:00');
INSERT INTO `record` VALUES (607, 96, NULL, '2024-07-02 01:13:00');
INSERT INTO `record` VALUES (608, 96, NULL, '2024-07-02 01:13:01');
INSERT INTO `record` VALUES (609, 96, NULL, '2024-07-02 01:13:01');
INSERT INTO `record` VALUES (610, 96, NULL, '2024-07-02 01:13:01');
INSERT INTO `record` VALUES (611, 96, NULL, '2024-07-02 01:13:01');
INSERT INTO `record` VALUES (612, 96, NULL, '2024-07-02 01:13:02');
INSERT INTO `record` VALUES (613, 96, NULL, '2024-07-02 01:13:02');
INSERT INTO `record` VALUES (614, 96, NULL, '2024-07-02 01:13:02');
INSERT INTO `record` VALUES (615, 96, NULL, '2024-07-02 01:13:02');
INSERT INTO `record` VALUES (616, 96, NULL, '2024-07-02 01:13:03');
INSERT INTO `record` VALUES (617, 96, NULL, '2024-07-02 01:13:03');
INSERT INTO `record` VALUES (618, 96, NULL, '2024-07-02 01:13:04');
INSERT INTO `record` VALUES (619, 96, NULL, '2024-07-02 01:13:04');
INSERT INTO `record` VALUES (620, 96, NULL, '2024-07-02 01:13:04');
INSERT INTO `record` VALUES (621, 96, NULL, '2024-07-02 01:13:04');
INSERT INTO `record` VALUES (622, 95, NULL, '2024-07-02 01:13:05');
INSERT INTO `record` VALUES (623, 94, NULL, '2024-07-02 01:13:05');
INSERT INTO `record` VALUES (624, 96, NULL, '2024-07-02 01:13:10');
INSERT INTO `record` VALUES (625, 95, NULL, '2024-07-02 01:13:11');
INSERT INTO `record` VALUES (626, 94, NULL, '2024-07-02 01:13:11');
INSERT INTO `record` VALUES (627, 97, NULL, '2024-07-02 01:13:14');
INSERT INTO `record` VALUES (628, 97, NULL, '2024-07-02 01:13:14');
INSERT INTO `record` VALUES (629, 97, NULL, '2024-07-02 01:13:15');
INSERT INTO `record` VALUES (630, 97, NULL, '2024-07-02 01:13:15');
INSERT INTO `record` VALUES (631, 97, NULL, '2024-07-02 01:13:15');
INSERT INTO `record` VALUES (632, 97, NULL, '2024-07-02 01:13:15');
INSERT INTO `record` VALUES (633, 97, NULL, '2024-07-02 01:13:15');
INSERT INTO `record` VALUES (634, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (635, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (636, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (637, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (638, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (639, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (640, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (641, 97, NULL, '2024-07-02 01:13:16');
INSERT INTO `record` VALUES (642, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (643, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (644, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (645, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (646, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (647, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (648, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (649, 97, NULL, '2024-07-02 01:13:17');
INSERT INTO `record` VALUES (650, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (651, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (652, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (653, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (654, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (655, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (656, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (657, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (658, 97, NULL, '2024-07-02 01:13:18');
INSERT INTO `record` VALUES (659, 96, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (660, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (661, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (662, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (663, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (664, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (665, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (666, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (667, 97, NULL, '2024-07-02 01:13:19');
INSERT INTO `record` VALUES (668, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (669, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (670, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (671, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (672, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (673, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (674, 95, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (675, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (676, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (677, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (678, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (679, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (680, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (681, 94, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (682, 97, NULL, '2024-07-02 01:13:20');
INSERT INTO `record` VALUES (683, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (684, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (685, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (686, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (687, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (688, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (689, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (690, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (691, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (692, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (693, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (694, 97, NULL, '2024-07-02 01:13:21');
INSERT INTO `record` VALUES (695, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (696, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (697, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (698, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (699, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (700, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (701, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (702, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (703, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (704, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (705, 97, NULL, '2024-07-02 01:13:22');
INSERT INTO `record` VALUES (706, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (707, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (708, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (709, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (710, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (711, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (712, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (713, 97, NULL, '2024-07-02 01:13:23');
INSERT INTO `record` VALUES (714, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (715, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (716, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (717, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (718, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (719, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (720, 97, NULL, '2024-07-02 01:13:24');
INSERT INTO `record` VALUES (721, 97, NULL, '2024-07-02 01:13:25');
INSERT INTO `record` VALUES (722, 97, NULL, '2024-07-02 01:13:25');
INSERT INTO `record` VALUES (723, 97, NULL, '2024-07-02 01:13:25');
INSERT INTO `record` VALUES (724, 96, NULL, '2024-07-02 01:13:25');
INSERT INTO `record` VALUES (725, 97, NULL, '2024-07-02 01:13:25');
INSERT INTO `record` VALUES (726, 95, NULL, '2024-07-02 01:13:26');
INSERT INTO `record` VALUES (727, 97, NULL, '2024-07-02 01:13:27');
INSERT INTO `record` VALUES (728, 94, NULL, '2024-07-02 01:13:27');
INSERT INTO `record` VALUES (729, 97, NULL, '2024-07-02 01:13:27');
INSERT INTO `record` VALUES (730, 97, NULL, '2024-07-02 01:13:28');
INSERT INTO `record` VALUES (731, 97, NULL, '2024-07-02 01:13:28');
INSERT INTO `record` VALUES (732, 97, NULL, '2024-07-02 01:13:28');
INSERT INTO `record` VALUES (733, 97, NULL, '2024-07-02 01:13:28');
INSERT INTO `record` VALUES (734, 97, NULL, '2024-07-02 01:13:30');
INSERT INTO `record` VALUES (735, 97, NULL, '2024-07-02 01:13:30');
INSERT INTO `record` VALUES (736, 96, NULL, '2024-07-02 01:13:31');
INSERT INTO `record` VALUES (737, 95, NULL, '2024-07-02 01:13:32');
INSERT INTO `record` VALUES (738, 94, NULL, '2024-07-02 01:13:32');
INSERT INTO `record` VALUES (739, 94, NULL, '2024-07-02 01:13:33');
INSERT INTO `record` VALUES (740, 94, NULL, '2024-07-02 01:13:33');
INSERT INTO `record` VALUES (741, 94, NULL, '2024-07-02 01:13:33');
INSERT INTO `record` VALUES (742, 97, NULL, '2024-07-02 01:13:37');
INSERT INTO `record` VALUES (743, 96, NULL, '2024-07-02 01:13:38');
INSERT INTO `record` VALUES (744, 95, NULL, '2024-07-02 01:13:39');
INSERT INTO `record` VALUES (745, 94, NULL, '2024-07-02 01:13:40');
INSERT INTO `record` VALUES (746, 97, NULL, '2024-07-02 01:13:46');
INSERT INTO `record` VALUES (747, 96, NULL, '2024-07-02 01:13:47');
INSERT INTO `record` VALUES (748, 95, NULL, '2024-07-02 01:13:48');
INSERT INTO `record` VALUES (749, 94, NULL, '2024-07-02 01:13:48');
INSERT INTO `record` VALUES (750, 94, NULL, '2024-07-02 01:13:49');
INSERT INTO `record` VALUES (751, 94, NULL, '2024-07-02 01:13:49');
INSERT INTO `record` VALUES (752, 94, NULL, '2024-07-02 01:13:49');
INSERT INTO `record` VALUES (753, 94, NULL, '2024-07-02 01:13:50');
INSERT INTO `record` VALUES (754, 94, NULL, '2024-07-02 01:13:50');
INSERT INTO `record` VALUES (755, 97, NULL, '2024-07-02 01:13:53');
INSERT INTO `record` VALUES (756, 96, NULL, '2024-07-02 01:13:54');
INSERT INTO `record` VALUES (757, 95, NULL, '2024-07-02 01:13:55');
INSERT INTO `record` VALUES (758, 95, NULL, '2024-07-02 01:13:56');
INSERT INTO `record` VALUES (759, 95, NULL, '2024-07-02 01:13:56');
INSERT INTO `record` VALUES (760, 95, NULL, '2024-07-02 01:13:56');
INSERT INTO `record` VALUES (761, 94, NULL, '2024-07-02 01:13:58');
INSERT INTO `record` VALUES (762, 97, NULL, '2024-07-02 01:14:00');
INSERT INTO `record` VALUES (763, 96, NULL, '2024-07-02 01:14:01');
INSERT INTO `record` VALUES (764, 95, NULL, '2024-07-02 01:14:02');
INSERT INTO `record` VALUES (765, 94, NULL, '2024-07-02 01:14:07');
INSERT INTO `record` VALUES (766, 97, NULL, '2024-07-02 01:14:10');
INSERT INTO `record` VALUES (767, 96, NULL, '2024-07-02 01:14:11');
INSERT INTO `record` VALUES (768, 95, NULL, '2024-07-02 01:14:13');
INSERT INTO `record` VALUES (769, 95, NULL, '2024-07-02 01:14:13');
INSERT INTO `record` VALUES (770, 95, NULL, '2024-07-02 01:14:13');
INSERT INTO `record` VALUES (771, 95, NULL, '2024-07-02 01:14:14');
INSERT INTO `record` VALUES (772, 95, NULL, '2024-07-02 01:14:14');
INSERT INTO `record` VALUES (773, 95, NULL, '2024-07-02 01:14:14');
INSERT INTO `record` VALUES (774, 94, NULL, '2024-07-02 01:14:17');
INSERT INTO `record` VALUES (775, 97, NULL, '2024-07-02 01:14:19');
INSERT INTO `record` VALUES (776, 96, NULL, '2024-07-02 01:14:20');
INSERT INTO `record` VALUES (777, 96, NULL, '2024-07-02 01:14:20');
INSERT INTO `record` VALUES (778, 96, NULL, '2024-07-02 01:14:20');
INSERT INTO `record` VALUES (779, 96, NULL, '2024-07-02 01:14:20');
INSERT INTO `record` VALUES (780, 95, NULL, '2024-07-02 01:14:22');
INSERT INTO `record` VALUES (781, 94, NULL, '2024-07-02 01:14:25');
INSERT INTO `record` VALUES (782, 97, NULL, '2024-07-02 01:14:27');
INSERT INTO `record` VALUES (783, 96, NULL, '2024-07-02 01:14:28');
INSERT INTO `record` VALUES (784, 95, NULL, '2024-07-02 01:14:30');
INSERT INTO `record` VALUES (785, 94, NULL, '2024-07-02 01:14:33');
INSERT INTO `record` VALUES (786, 97, NULL, '2024-07-02 01:14:35');
INSERT INTO `record` VALUES (787, 96, NULL, '2024-07-02 01:14:37');
INSERT INTO `record` VALUES (788, 96, NULL, '2024-07-02 01:14:37');
INSERT INTO `record` VALUES (789, 96, NULL, '2024-07-02 01:14:38');
INSERT INTO `record` VALUES (790, 96, NULL, '2024-07-02 01:14:38');
INSERT INTO `record` VALUES (791, 96, NULL, '2024-07-02 01:14:38');
INSERT INTO `record` VALUES (792, 96, NULL, '2024-07-02 01:14:38');
INSERT INTO `record` VALUES (793, 95, NULL, '2024-07-02 01:14:39');
INSERT INTO `record` VALUES (794, 94, NULL, '2024-07-02 01:14:41');
INSERT INTO `record` VALUES (795, 97, NULL, '2024-07-02 01:14:42');
INSERT INTO `record` VALUES (796, 96, NULL, '2024-07-02 01:14:44');
INSERT INTO `record` VALUES (797, 95, NULL, '2024-07-02 01:14:46');
INSERT INTO `record` VALUES (798, 94, NULL, '2024-07-02 01:14:48');
INSERT INTO `record` VALUES (799, 97, NULL, '2024-07-02 01:14:51');
INSERT INTO `record` VALUES (800, 97, NULL, '2024-07-02 01:14:51');
INSERT INTO `record` VALUES (801, 97, NULL, '2024-07-02 01:14:51');
INSERT INTO `record` VALUES (802, 97, NULL, '2024-07-02 01:14:51');
INSERT INTO `record` VALUES (803, 96, NULL, '2024-07-02 01:14:54');
INSERT INTO `record` VALUES (804, 95, NULL, '2024-07-02 01:14:55');
INSERT INTO `record` VALUES (805, 94, NULL, '2024-07-02 01:14:56');
INSERT INTO `record` VALUES (806, 97, NULL, '2024-07-02 01:15:00');
INSERT INTO `record` VALUES (807, 96, NULL, '2024-07-02 01:15:01');
INSERT INTO `record` VALUES (808, 95, NULL, '2024-07-02 01:15:04');
INSERT INTO `record` VALUES (809, 94, NULL, '2024-07-02 01:15:05');
INSERT INTO `record` VALUES (810, 97, NULL, '2024-07-02 01:15:08');
INSERT INTO `record` VALUES (811, 97, NULL, '2024-07-02 01:15:08');
INSERT INTO `record` VALUES (812, 97, NULL, '2024-07-02 01:15:09');
INSERT INTO `record` VALUES (813, 97, NULL, '2024-07-02 01:15:09');
INSERT INTO `record` VALUES (814, 97, NULL, '2024-07-02 01:15:09');
INSERT INTO `record` VALUES (815, 97, NULL, '2024-07-02 01:15:09');
INSERT INTO `record` VALUES (816, 96, NULL, '2024-07-02 01:15:10');
INSERT INTO `record` VALUES (817, 95, NULL, '2024-07-02 01:15:11');
INSERT INTO `record` VALUES (818, 94, NULL, '2024-07-02 01:15:12');
INSERT INTO `record` VALUES (819, 94, NULL, '2024-07-02 01:15:13');
INSERT INTO `record` VALUES (820, 94, NULL, '2024-07-02 01:15:13');
INSERT INTO `record` VALUES (821, 94, NULL, '2024-07-02 01:15:13');
INSERT INTO `record` VALUES (822, 97, NULL, '2024-07-02 01:15:17');
INSERT INTO `record` VALUES (823, 96, NULL, '2024-07-02 01:15:18');
INSERT INTO `record` VALUES (824, 95, NULL, '2024-07-02 01:15:22');
INSERT INTO `record` VALUES (825, 94, NULL, '2024-07-02 01:15:23');
INSERT INTO `record` VALUES (826, 97, NULL, '2024-07-02 01:15:27');
INSERT INTO `record` VALUES (827, 96, NULL, '2024-07-02 01:15:27');
INSERT INTO `record` VALUES (828, 95, NULL, '2024-07-02 01:15:32');
INSERT INTO `record` VALUES (829, 94, NULL, '2024-07-02 01:15:33');
INSERT INTO `record` VALUES (830, 94, NULL, '2024-07-02 01:15:33');
INSERT INTO `record` VALUES (831, 94, NULL, '2024-07-02 01:15:33');
INSERT INTO `record` VALUES (832, 94, NULL, '2024-07-02 01:15:34');
INSERT INTO `record` VALUES (833, 94, NULL, '2024-07-02 01:15:34');
INSERT INTO `record` VALUES (834, 94, NULL, '2024-07-02 01:15:34');
INSERT INTO `record` VALUES (835, 97, NULL, '2024-07-02 01:15:37');
INSERT INTO `record` VALUES (836, 96, NULL, '2024-07-02 01:15:38');
INSERT INTO `record` VALUES (837, 95, NULL, '2024-07-02 01:15:42');
INSERT INTO `record` VALUES (838, 95, NULL, '2024-07-02 01:15:42');
INSERT INTO `record` VALUES (839, 95, NULL, '2024-07-02 01:15:42');
INSERT INTO `record` VALUES (840, 95, NULL, '2024-07-02 01:15:42');
INSERT INTO `record` VALUES (841, 94, NULL, '2024-07-02 01:15:43');
INSERT INTO `record` VALUES (842, 97, NULL, '2024-07-02 01:15:45');
INSERT INTO `record` VALUES (843, 96, NULL, '2024-07-02 01:15:46');
INSERT INTO `record` VALUES (844, 95, NULL, '2024-07-02 01:15:49');
INSERT INTO `record` VALUES (845, 94, NULL, '2024-07-02 01:15:50');
INSERT INTO `record` VALUES (846, 97, NULL, '2024-07-02 01:15:52');
INSERT INTO `record` VALUES (847, 96, NULL, '2024-07-02 01:15:53');
INSERT INTO `record` VALUES (848, 95, NULL, '2024-07-02 01:15:56');
INSERT INTO `record` VALUES (849, 95, NULL, '2024-07-02 01:15:56');
INSERT INTO `record` VALUES (850, 94, NULL, '2024-07-02 01:15:56');
INSERT INTO `record` VALUES (851, 95, NULL, '2024-07-02 01:15:56');
INSERT INTO `record` VALUES (852, 95, NULL, '2024-07-02 01:15:57');
INSERT INTO `record` VALUES (853, 95, NULL, '2024-07-02 01:15:57');
INSERT INTO `record` VALUES (854, 95, NULL, '2024-07-02 01:15:57');
INSERT INTO `record` VALUES (855, 97, NULL, '2024-07-02 01:15:58');
INSERT INTO `record` VALUES (856, 96, NULL, '2024-07-02 01:15:59');
INSERT INTO `record` VALUES (857, 96, NULL, '2024-07-02 01:15:59');
INSERT INTO `record` VALUES (858, 96, NULL, '2024-07-02 01:15:59');
INSERT INTO `record` VALUES (859, 96, NULL, '2024-07-02 01:16:00');
INSERT INTO `record` VALUES (860, 94, NULL, '2024-07-02 01:16:02');
INSERT INTO `record` VALUES (861, 95, NULL, '2024-07-02 01:16:03');
INSERT INTO `record` VALUES (862, 97, NULL, '2024-07-02 01:16:04');
INSERT INTO `record` VALUES (863, 96, NULL, '2024-07-02 01:16:04');
INSERT INTO `record` VALUES (864, 94, NULL, '2024-07-02 01:16:07');
INSERT INTO `record` VALUES (865, 95, NULL, '2024-07-02 01:16:08');
INSERT INTO `record` VALUES (866, 97, NULL, '2024-07-02 01:16:09');
INSERT INTO `record` VALUES (867, 96, NULL, '2024-07-02 01:16:09');
INSERT INTO `record` VALUES (868, 96, NULL, '2024-07-02 01:16:09');
INSERT INTO `record` VALUES (869, 96, NULL, '2024-07-02 01:16:10');
INSERT INTO `record` VALUES (870, 96, NULL, '2024-07-02 01:16:10');
INSERT INTO `record` VALUES (871, 96, NULL, '2024-07-02 01:16:10');
INSERT INTO `record` VALUES (872, 96, NULL, '2024-07-02 01:16:10');
INSERT INTO `record` VALUES (873, 94, NULL, '2024-07-02 01:16:12');
INSERT INTO `record` VALUES (874, 95, NULL, '2024-07-02 01:16:13');
INSERT INTO `record` VALUES (875, 97, NULL, '2024-07-02 01:16:15');
INSERT INTO `record` VALUES (876, 96, NULL, '2024-07-02 01:16:16');
INSERT INTO `record` VALUES (877, 94, NULL, '2024-07-02 01:16:19');
INSERT INTO `record` VALUES (878, 95, NULL, '2024-07-02 01:16:20');
INSERT INTO `record` VALUES (879, 97, NULL, '2024-07-02 01:16:21');
INSERT INTO `record` VALUES (880, 97, NULL, '2024-07-02 01:16:21');
INSERT INTO `record` VALUES (881, 97, NULL, '2024-07-02 01:16:21');
INSERT INTO `record` VALUES (882, 97, NULL, '2024-07-02 01:16:21');
INSERT INTO `record` VALUES (883, 96, NULL, '2024-07-02 01:16:22');
INSERT INTO `record` VALUES (884, 94, NULL, '2024-07-02 01:16:26');
INSERT INTO `record` VALUES (885, 95, NULL, '2024-07-02 01:16:27');
INSERT INTO `record` VALUES (886, 97, NULL, '2024-07-02 01:16:28');
INSERT INTO `record` VALUES (887, 96, NULL, '2024-07-02 01:16:30');
INSERT INTO `record` VALUES (888, 94, NULL, '2024-07-02 01:16:31');
INSERT INTO `record` VALUES (889, 95, NULL, '2024-07-02 01:16:32');
INSERT INTO `record` VALUES (890, 97, NULL, '2024-07-02 01:16:34');
INSERT INTO `record` VALUES (891, 97, NULL, '2024-07-02 01:16:34');
INSERT INTO `record` VALUES (892, 97, NULL, '2024-07-02 01:16:34');
INSERT INTO `record` VALUES (893, 97, NULL, '2024-07-02 01:16:35');
INSERT INTO `record` VALUES (894, 96, NULL, '2024-07-02 01:16:35');
INSERT INTO `record` VALUES (895, 97, NULL, '2024-07-02 01:16:35');
INSERT INTO `record` VALUES (896, 97, NULL, '2024-07-02 01:16:36');
INSERT INTO `record` VALUES (897, 94, NULL, '2024-07-02 01:16:36');
INSERT INTO `record` VALUES (898, 94, NULL, '2024-07-02 01:16:36');
INSERT INTO `record` VALUES (899, 94, NULL, '2024-07-02 01:16:36');
INSERT INTO `record` VALUES (900, 95, NULL, '2024-07-02 01:16:37');
INSERT INTO `record` VALUES (901, 94, NULL, '2024-07-02 01:16:37');
INSERT INTO `record` VALUES (902, 96, NULL, '2024-07-02 01:16:39');
INSERT INTO `record` VALUES (903, 97, NULL, '2024-07-02 01:16:41');
INSERT INTO `record` VALUES (904, 95, NULL, '2024-07-02 01:16:41');
INSERT INTO `record` VALUES (905, 96, NULL, '2024-07-02 01:16:43');
INSERT INTO `record` VALUES (906, 97, NULL, '2024-07-02 01:16:44');
INSERT INTO `record` VALUES (907, 95, NULL, '2024-07-02 01:16:45');
INSERT INTO `record` VALUES (908, 96, NULL, '2024-07-02 01:16:47');
INSERT INTO `record` VALUES (909, 97, NULL, '2024-07-02 01:16:49');
INSERT INTO `record` VALUES (910, 95, NULL, '2024-07-02 01:16:50');
INSERT INTO `record` VALUES (911, 95, NULL, '2024-07-02 01:16:50');
INSERT INTO `record` VALUES (912, 95, NULL, '2024-07-02 01:16:50');
INSERT INTO `record` VALUES (913, 95, NULL, '2024-07-02 01:16:50');
INSERT INTO `record` VALUES (914, 96, NULL, '2024-07-02 01:16:51');
INSERT INTO `record` VALUES (915, 97, NULL, '2024-07-02 01:16:53');
INSERT INTO `record` VALUES (916, 96, NULL, '2024-07-02 01:16:54');
INSERT INTO `record` VALUES (917, 97, NULL, '2024-07-02 01:16:55');
INSERT INTO `record` VALUES (918, 96, NULL, '2024-07-02 01:16:58');
INSERT INTO `record` VALUES (919, 96, NULL, '2024-07-02 01:16:58');
INSERT INTO `record` VALUES (920, 96, NULL, '2024-07-02 01:16:58');
INSERT INTO `record` VALUES (921, 96, NULL, '2024-07-02 01:16:58');
INSERT INTO `record` VALUES (922, 97, NULL, '2024-07-02 01:17:00');
INSERT INTO `record` VALUES (923, 97, NULL, '2024-07-02 01:17:03');
INSERT INTO `record` VALUES (924, 97, NULL, '2024-07-02 01:17:06');
INSERT INTO `record` VALUES (925, 97, NULL, '2024-07-02 01:17:08');
INSERT INTO `record` VALUES (926, 97, NULL, '2024-07-02 01:17:12');
INSERT INTO `record` VALUES (927, 97, NULL, '2024-07-02 01:17:12');
INSERT INTO `record` VALUES (928, 97, NULL, '2024-07-02 01:17:12');
INSERT INTO `record` VALUES (929, 97, NULL, '2024-07-02 01:17:13');
INSERT INTO `record` VALUES (930, 93, NULL, '2024-07-02 01:26:50');
INSERT INTO `record` VALUES (931, 93, NULL, '2024-07-02 01:26:54');
INSERT INTO `record` VALUES (932, 93, NULL, '2024-07-02 01:27:13');
INSERT INTO `record` VALUES (933, 92, NULL, '2024-07-02 01:27:32');
INSERT INTO `record` VALUES (934, 92, NULL, '2024-07-02 01:27:48');
INSERT INTO `record` VALUES (935, 92, NULL, '2024-07-02 01:27:48');
INSERT INTO `record` VALUES (936, 92, NULL, '2024-07-02 01:28:42');
INSERT INTO `record` VALUES (937, 92, NULL, '2024-07-02 01:28:46');
INSERT INTO `record` VALUES (938, 92, NULL, '2024-07-02 01:28:48');
INSERT INTO `record` VALUES (939, 93, NULL, '2024-07-02 01:29:26');
INSERT INTO `record` VALUES (940, 93, NULL, '2024-07-02 01:29:31');
INSERT INTO `record` VALUES (941, 92, NULL, '2024-07-02 14:02:33');
INSERT INTO `record` VALUES (942, 92, NULL, '2024-07-02 14:02:33');
INSERT INTO `record` VALUES (943, 98, NULL, '2024-07-02 22:13:59');
INSERT INTO `record` VALUES (944, 93, NULL, '2024-07-02 22:14:15');
INSERT INTO `record` VALUES (945, 98, NULL, '2024-07-03 00:17:27');
INSERT INTO `record` VALUES (946, 98, NULL, '2024-07-03 00:17:58');
INSERT INTO `record` VALUES (947, 98, NULL, '2024-07-03 00:19:42');
INSERT INTO `record` VALUES (948, 98, NULL, '2024-07-03 00:19:57');
INSERT INTO `record` VALUES (949, 98, NULL, '2024-07-03 00:20:18');
INSERT INTO `record` VALUES (950, 98, NULL, '2024-07-03 00:20:37');
INSERT INTO `record` VALUES (951, 98, NULL, '2024-07-03 00:21:50');
INSERT INTO `record` VALUES (952, 97, NULL, '2024-07-03 00:21:59');
INSERT INTO `record` VALUES (953, 98, NULL, '2024-07-03 00:22:04');
INSERT INTO `record` VALUES (954, 98, NULL, '2024-07-03 00:51:52');
INSERT INTO `record` VALUES (955, 98, NULL, '2024-07-03 01:24:20');
INSERT INTO `record` VALUES (956, 98, NULL, '2024-07-03 01:33:36');
INSERT INTO `record` VALUES (957, 98, NULL, '2024-07-03 01:40:37');
INSERT INTO `record` VALUES (958, 98, NULL, '2024-07-03 01:42:29');
INSERT INTO `record` VALUES (959, 96, NULL, '2024-07-03 03:18:14');
INSERT INTO `record` VALUES (960, 98, NULL, '2024-07-05 16:10:45');
INSERT INTO `record` VALUES (961, 98, NULL, '2024-07-05 16:12:11');
INSERT INTO `record` VALUES (962, 98, NULL, '2024-07-05 16:12:32');
INSERT INTO `record` VALUES (963, 98, NULL, '2024-07-05 16:13:37');
INSERT INTO `record` VALUES (964, 98, NULL, '2024-07-05 16:16:55');
INSERT INTO `record` VALUES (965, 98, NULL, '2024-07-05 16:17:03');
INSERT INTO `record` VALUES (966, 98, NULL, '2024-07-05 16:18:11');
INSERT INTO `record` VALUES (967, 98, NULL, '2024-07-05 16:18:14');
INSERT INTO `record` VALUES (968, 98, NULL, '2024-07-05 16:18:44');
INSERT INTO `record` VALUES (969, 98, NULL, '2024-07-05 16:18:45');
INSERT INTO `record` VALUES (970, 98, NULL, '2024-07-05 16:18:48');
INSERT INTO `record` VALUES (971, 98, NULL, '2024-07-06 16:44:03');
INSERT INTO `record` VALUES (972, 98, NULL, '2024-07-06 18:21:26');
INSERT INTO `record` VALUES (973, 98, NULL, '2024-07-06 18:22:34');
INSERT INTO `record` VALUES (974, -1, NULL, '2024-07-07 22:10:43');
INSERT INTO `record` VALUES (975, 92, NULL, '2024-07-07 23:40:50');
INSERT INTO `record` VALUES (976, 98, NULL, '2024-07-08 21:33:12');
INSERT INTO `record` VALUES (977, 97, NULL, '2024-07-09 09:10:31');
INSERT INTO `record` VALUES (978, 97, NULL, '2024-07-09 09:10:54');
INSERT INTO `record` VALUES (979, 93, NULL, '2024-07-10 04:36:21');
INSERT INTO `record` VALUES (980, 96, NULL, '2024-07-10 06:36:11');
INSERT INTO `record` VALUES (981, 98, NULL, '2024-07-10 08:22:32');
INSERT INTO `record` VALUES (982, 94, NULL, '2024-07-10 14:10:27');
INSERT INTO `record` VALUES (983, 97, NULL, '2024-07-11 08:41:21');
INSERT INTO `record` VALUES (984, 92, NULL, '2024-07-12 10:06:05');
INSERT INTO `record` VALUES (985, -1, NULL, '2024-07-13 15:41:27');
INSERT INTO `record` VALUES (986, 98, NULL, '2024-07-13 18:45:19');
INSERT INTO `record` VALUES (987, 94, NULL, '2024-07-13 19:30:15');
INSERT INTO `record` VALUES (988, 96, NULL, '2024-07-13 21:34:17');
INSERT INTO `record` VALUES (989, -1, NULL, '2024-07-14 08:49:55');
INSERT INTO `record` VALUES (990, -1, NULL, '2024-07-14 08:49:56');
INSERT INTO `record` VALUES (991, 92, NULL, '2024-07-15 14:11:06');
INSERT INTO `record` VALUES (992, 92, NULL, '2024-07-15 14:11:07');
INSERT INTO `record` VALUES (993, 97, NULL, '2024-07-15 14:11:08');
INSERT INTO `record` VALUES (994, 97, NULL, '2024-07-15 14:11:08');
INSERT INTO `record` VALUES (995, 98, NULL, '2024-07-17 09:16:15');
INSERT INTO `record` VALUES (996, 97, NULL, '2024-07-17 09:16:36');
INSERT INTO `record` VALUES (997, 92, NULL, '2024-07-17 09:16:49');
INSERT INTO `record` VALUES (998, -1, NULL, '2024-07-17 09:18:05');
INSERT INTO `record` VALUES (999, 92, NULL, '2024-07-17 09:53:37');
INSERT INTO `record` VALUES (1000, 97, NULL, '2024-07-17 10:20:46');
INSERT INTO `record` VALUES (1001, 94, NULL, '2024-07-18 13:10:14');
INSERT INTO `record` VALUES (1002, 98, NULL, '2024-07-19 07:23:13');
INSERT INTO `record` VALUES (1003, 96, NULL, '2024-07-19 22:34:13');
INSERT INTO `record` VALUES (1004, 94, NULL, '2024-07-20 01:04:08');
INSERT INTO `record` VALUES (1005, 93, NULL, '2024-07-21 04:17:16');
INSERT INTO `record` VALUES (1006, -1, NULL, '2024-07-21 05:47:06');
INSERT INTO `record` VALUES (1007, 97, NULL, '2024-07-22 00:21:44');
INSERT INTO `record` VALUES (1008, 97, NULL, '2024-07-22 03:37:41');
INSERT INTO `record` VALUES (1009, 98, NULL, '2024-07-23 15:09:19');
INSERT INTO `record` VALUES (1010, 92, NULL, '2024-07-25 14:02:28');
INSERT INTO `record` VALUES (1011, -1, NULL, '2024-07-25 20:02:09');
INSERT INTO `record` VALUES (1012, 96, NULL, '2024-07-29 23:44:42');
INSERT INTO `record` VALUES (1013, -1, NULL, '2024-07-30 01:14:15');
INSERT INTO `record` VALUES (1014, 98, NULL, '2024-07-30 07:56:06');
INSERT INTO `record` VALUES (1015, 94, NULL, '2024-07-30 09:41:18');
INSERT INTO `record` VALUES (1016, 97, NULL, '2024-07-30 19:01:58');
INSERT INTO `record` VALUES (1017, 93, NULL, '2024-07-31 07:11:12');
INSERT INTO `record` VALUES (1018, 92, NULL, '2024-08-01 23:52:12');
INSERT INTO `record` VALUES (1019, -1, NULL, '2024-08-02 07:47:40');
INSERT INTO `record` VALUES (1020, 93, NULL, '2024-08-03 14:26:34');
INSERT INTO `record` VALUES (1021, 96, NULL, '2024-08-03 14:55:08');
INSERT INTO `record` VALUES (1022, 98, NULL, '2024-08-06 02:47:19');
INSERT INTO `record` VALUES (1023, 96, NULL, '2024-08-06 04:41:35');
INSERT INTO `record` VALUES (1024, 94, NULL, '2024-08-06 05:45:43');
INSERT INTO `record` VALUES (1025, 97, NULL, '2024-08-06 07:14:31');
INSERT INTO `record` VALUES (1026, 92, NULL, '2024-08-06 09:01:26');
INSERT INTO `record` VALUES (1027, -1, NULL, '2024-08-06 11:07:06');
INSERT INTO `record` VALUES (1028, 93, NULL, '2024-08-06 11:39:36');
INSERT INTO `record` VALUES (1029, 92, NULL, '2024-08-06 12:35:26');
INSERT INTO `record` VALUES (1030, 98, NULL, '2024-08-06 16:44:46');
INSERT INTO `record` VALUES (1031, -1, NULL, '2024-08-13 05:56:38');
INSERT INTO `record` VALUES (1032, 92, NULL, '2024-08-13 08:47:36');
INSERT INTO `record` VALUES (1033, 94, NULL, '2024-08-16 11:25:19');
INSERT INTO `record` VALUES (1034, 96, NULL, '2024-08-16 15:25:48');
INSERT INTO `record` VALUES (1035, 93, NULL, '2024-08-16 15:42:49');
INSERT INTO `record` VALUES (1036, 97, NULL, '2024-08-16 16:18:00');
INSERT INTO `record` VALUES (1037, 98, NULL, '2024-08-16 17:29:04');
INSERT INTO `record` VALUES (1038, 92, NULL, '2024-08-19 10:44:45');
INSERT INTO `record` VALUES (1039, 93, NULL, '2024-08-19 11:03:35');
INSERT INTO `record` VALUES (1040, 96, NULL, '2024-08-19 11:03:42');
INSERT INTO `record` VALUES (1041, 98, NULL, '2024-08-19 11:19:26');
INSERT INTO `record` VALUES (1042, -1, NULL, '2024-08-21 00:30:32');
INSERT INTO `record` VALUES (1043, 92, NULL, '2024-08-21 04:29:36');
INSERT INTO `record` VALUES (1044, 96, NULL, '2024-08-21 08:03:46');
INSERT INTO `record` VALUES (1045, -1, NULL, '2024-08-21 08:03:49');
INSERT INTO `record` VALUES (1046, 94, NULL, '2024-08-25 00:54:29');
INSERT INTO `record` VALUES (1047, 95, NULL, '2024-08-27 09:51:56');
INSERT INTO `record` VALUES (1048, -1, NULL, '2024-08-27 13:13:17');
INSERT INTO `record` VALUES (1049, 97, NULL, '2024-08-27 13:52:07');
INSERT INTO `record` VALUES (1050, -1, NULL, '2024-08-27 13:52:20');
INSERT INTO `record` VALUES (1051, -1, NULL, '2024-08-27 13:52:25');
INSERT INTO `record` VALUES (1052, 92, NULL, '2024-08-27 14:01:53');
INSERT INTO `record` VALUES (1053, 93, NULL, '2024-08-27 14:04:02');
INSERT INTO `record` VALUES (1054, 97, NULL, '2024-08-27 14:06:00');
INSERT INTO `record` VALUES (1055, -1, NULL, '2024-08-27 14:06:20');
INSERT INTO `record` VALUES (1056, -1, NULL, '2024-08-27 19:17:41');
INSERT INTO `record` VALUES (1057, 94, NULL, '2024-08-27 20:33:30');
INSERT INTO `record` VALUES (1058, 95, NULL, '2024-08-27 21:05:44');
INSERT INTO `record` VALUES (1059, 94, NULL, '2024-09-03 07:01:00');
INSERT INTO `record` VALUES (1060, 96, NULL, '2024-09-03 07:18:40');
INSERT INTO `record` VALUES (1061, 93, NULL, '2024-09-03 07:37:18');
INSERT INTO `record` VALUES (1062, 97, NULL, '2024-09-03 09:05:23');
INSERT INTO `record` VALUES (1063, 98, NULL, '2024-09-03 09:23:22');
INSERT INTO `record` VALUES (1064, -1, NULL, '2024-09-03 09:25:35');
INSERT INTO `record` VALUES (1065, -1, NULL, '2024-09-03 09:50:50');
INSERT INTO `record` VALUES (1066, 98, NULL, '2024-09-03 21:25:13');
INSERT INTO `record` VALUES (1067, 94, NULL, '2024-09-03 21:25:44');
INSERT INTO `record` VALUES (1068, 98, NULL, '2024-09-03 22:41:59');
INSERT INTO `record` VALUES (1069, 98, NULL, '2024-09-03 22:43:43');
INSERT INTO `record` VALUES (1070, 98, NULL, '2024-09-03 23:05:54');
INSERT INTO `record` VALUES (1071, 98, NULL, '2024-09-03 23:06:06');
INSERT INTO `record` VALUES (1072, 98, NULL, '2024-09-03 23:08:10');
INSERT INTO `record` VALUES (1073, 98, NULL, '2024-09-03 23:09:04');
INSERT INTO `record` VALUES (1074, 98, NULL, '2024-09-03 23:19:36');
INSERT INTO `record` VALUES (1075, 98, NULL, '2024-09-03 23:20:57');
INSERT INTO `record` VALUES (1076, 98, NULL, '2024-09-03 23:22:04');
INSERT INTO `record` VALUES (1077, 98, NULL, '2024-09-03 23:23:37');
INSERT INTO `record` VALUES (1078, 98, NULL, '2024-09-03 23:26:20');
INSERT INTO `record` VALUES (1079, 98, NULL, '2024-09-03 23:28:57');
INSERT INTO `record` VALUES (1080, 98, NULL, '2024-09-03 23:29:31');
INSERT INTO `record` VALUES (1081, 98, NULL, '2024-09-03 23:31:54');
INSERT INTO `record` VALUES (1082, 98, NULL, '2024-09-03 23:32:47');
INSERT INTO `record` VALUES (1083, 98, NULL, '2024-09-03 23:35:26');
INSERT INTO `record` VALUES (1084, 98, NULL, '2024-09-03 23:35:35');
INSERT INTO `record` VALUES (1085, 98, NULL, '2024-09-03 23:37:28');
INSERT INTO `record` VALUES (1086, 98, NULL, '2024-09-03 23:37:33');
INSERT INTO `record` VALUES (1087, 97, NULL, '2024-09-03 23:58:10');
INSERT INTO `record` VALUES (1088, 97, NULL, '2024-09-03 23:58:12');
INSERT INTO `record` VALUES (1089, 98, NULL, '2024-09-04 00:20:48');
INSERT INTO `record` VALUES (1090, 96, NULL, '2024-09-04 00:21:26');
INSERT INTO `record` VALUES (1091, 98, NULL, '2024-09-04 08:15:24');
INSERT INTO `record` VALUES (1092, 98, NULL, '2024-09-04 08:16:06');
INSERT INTO `record` VALUES (1093, 97, NULL, '2024-09-04 08:16:33');
INSERT INTO `record` VALUES (1094, 98, NULL, '2024-09-05 09:19:33');
INSERT INTO `record` VALUES (1095, 98, NULL, '2024-09-05 09:19:48');
INSERT INTO `record` VALUES (1096, 98, NULL, '2024-09-05 09:24:41');
INSERT INTO `record` VALUES (1097, 98, NULL, '2024-09-05 10:02:28');
INSERT INTO `record` VALUES (1098, 98, NULL, '2024-09-05 10:03:49');
INSERT INTO `record` VALUES (1099, 98, NULL, '2024-09-05 10:04:50');
INSERT INTO `record` VALUES (1100, 98, NULL, '2024-09-05 11:12:12');
INSERT INTO `record` VALUES (1101, 98, NULL, '2024-09-05 11:13:02');
INSERT INTO `record` VALUES (1102, -1, NULL, '2024-09-05 11:25:28');
INSERT INTO `record` VALUES (1103, -1, NULL, '2024-09-05 15:17:27');
INSERT INTO `record` VALUES (1104, -1, NULL, '2024-09-05 15:17:33');
INSERT INTO `record` VALUES (1105, -1, NULL, '2024-09-05 15:17:37');
INSERT INTO `record` VALUES (1106, 96, NULL, '2024-09-05 15:28:15');
INSERT INTO `record` VALUES (1107, -1, NULL, '2024-09-05 15:28:30');
INSERT INTO `record` VALUES (1108, 97, NULL, '2024-09-05 15:30:50');
INSERT INTO `record` VALUES (1109, 97, NULL, '2024-09-05 15:52:46');
INSERT INTO `record` VALUES (1110, 98, NULL, '2024-09-05 16:07:12');
INSERT INTO `record` VALUES (1111, 98, NULL, '2024-09-05 16:23:30');
INSERT INTO `record` VALUES (1112, -1, NULL, '2024-09-05 16:40:30');
INSERT INTO `record` VALUES (1113, 98, NULL, '2024-09-05 16:49:56');
INSERT INTO `record` VALUES (1114, 98, NULL, '2024-09-05 16:49:58');
INSERT INTO `record` VALUES (1115, 98, NULL, '2024-09-05 16:50:00');
INSERT INTO `record` VALUES (1116, 98, NULL, '2024-09-05 16:50:22');
INSERT INTO `record` VALUES (1117, 97, NULL, '2024-09-05 16:50:25');
INSERT INTO `record` VALUES (1118, 96, NULL, '2024-09-05 16:50:31');
INSERT INTO `record` VALUES (1119, 93, NULL, '2024-09-05 16:50:38');
INSERT INTO `record` VALUES (1120, 98, NULL, '2024-09-05 16:56:18');
INSERT INTO `record` VALUES (1121, 92, NULL, '2024-09-05 16:56:54');
INSERT INTO `record` VALUES (1122, 98, NULL, '2024-09-05 16:59:21');
INSERT INTO `record` VALUES (1123, -1, NULL, '2024-09-05 17:51:08');
INSERT INTO `record` VALUES (1124, 98, NULL, '2024-09-05 20:29:20');
INSERT INTO `record` VALUES (1125, 97, NULL, '2024-09-05 20:30:29');
INSERT INTO `record` VALUES (1126, 98, NULL, '2024-09-05 20:40:56');
INSERT INTO `record` VALUES (1127, 98, NULL, '2024-09-05 21:29:00');
INSERT INTO `record` VALUES (1128, 95, NULL, '2024-09-10 13:03:00');
INSERT INTO `record` VALUES (1129, 97, NULL, '2024-09-12 03:39:58');
INSERT INTO `record` VALUES (1130, 94, NULL, '2024-09-12 05:38:56');
INSERT INTO `record` VALUES (1131, 92, NULL, '2024-09-12 05:39:07');
INSERT INTO `record` VALUES (1132, 98, NULL, '2024-09-12 13:47:42');
INSERT INTO `record` VALUES (1133, 98, NULL, '2024-09-12 14:12:14');
INSERT INTO `record` VALUES (1134, 100, NULL, '2024-09-12 14:39:51');
INSERT INTO `record` VALUES (1135, 101, NULL, '2024-09-12 14:41:26');
INSERT INTO `record` VALUES (1136, -1, NULL, '2024-09-14 02:56:04');
INSERT INTO `record` VALUES (1137, 92, NULL, '2024-09-14 03:47:55');
INSERT INTO `record` VALUES (1138, 95, NULL, '2024-09-14 17:03:41');
INSERT INTO `record` VALUES (1139, 98, NULL, '2024-09-19 11:18:08');
INSERT INTO `record` VALUES (1140, 98, NULL, '2024-09-19 11:18:13');
INSERT INTO `record` VALUES (1141, 97, NULL, '2024-09-19 11:18:27');
INSERT INTO `record` VALUES (1142, -1, NULL, '2024-09-19 11:18:33');
INSERT INTO `record` VALUES (1143, 101, NULL, '2024-09-19 11:27:59');
INSERT INTO `record` VALUES (1144, -1, NULL, '2024-09-19 11:28:25');
INSERT INTO `record` VALUES (1145, -1, NULL, '2024-09-19 11:28:41');
INSERT INTO `record` VALUES (1146, 96, NULL, '2024-09-19 11:28:50');
INSERT INTO `record` VALUES (1147, 101, NULL, '2024-09-19 14:03:52');
INSERT INTO `record` VALUES (1148, 93, NULL, '2024-09-19 14:05:29');
INSERT INTO `record` VALUES (1149, 98, NULL, '2024-09-19 20:54:23');
INSERT INTO `record` VALUES (1150, 97, NULL, '2024-09-20 08:38:17');
INSERT INTO `record` VALUES (1151, 97, NULL, '2024-09-23 09:27:38');
INSERT INTO `record` VALUES (1152, 101, NULL, '2024-09-23 10:53:56');
INSERT INTO `record` VALUES (1153, 101, NULL, '2024-09-23 11:42:52');
INSERT INTO `record` VALUES (1154, 92, NULL, '2024-10-03 22:39:10');
INSERT INTO `record` VALUES (1155, 94, NULL, '2024-10-07 23:06:57');
INSERT INTO `record` VALUES (1156, 93, NULL, '2024-10-12 07:49:25');
INSERT INTO `record` VALUES (1157, 94, NULL, '2024-10-12 15:19:23');
INSERT INTO `record` VALUES (1158, 92, NULL, '2024-10-13 02:55:21');
INSERT INTO `record` VALUES (1159, 96, NULL, '2024-10-15 20:58:28');
INSERT INTO `record` VALUES (1160, 96, NULL, '2024-10-20 03:18:21');
INSERT INTO `record` VALUES (1161, 92, NULL, '2024-10-21 09:49:26');
INSERT INTO `record` VALUES (1162, 97, NULL, '2024-10-22 10:41:52');
INSERT INTO `record` VALUES (1163, -1, NULL, '2024-10-23 09:50:46');
INSERT INTO `record` VALUES (1164, 92, NULL, '2024-10-23 15:25:57');
INSERT INTO `record` VALUES (1165, 93, NULL, '2024-10-25 05:28:08');
INSERT INTO `record` VALUES (1166, 92, NULL, '2024-10-25 07:17:50');
INSERT INTO `record` VALUES (1167, 102, NULL, '2024-10-25 13:53:18');
INSERT INTO `record` VALUES (1168, 103, NULL, '2024-10-25 13:57:14');
INSERT INTO `record` VALUES (1169, 103, NULL, '2024-10-25 13:57:18');
INSERT INTO `record` VALUES (1170, 103, NULL, '2024-10-25 13:57:22');
INSERT INTO `record` VALUES (1171, 103, NULL, '2024-10-25 13:57:26');
INSERT INTO `record` VALUES (1172, 104, NULL, '2024-10-25 14:07:40');
INSERT INTO `record` VALUES (1173, 104, NULL, '2024-10-25 14:07:59');
INSERT INTO `record` VALUES (1174, 104, NULL, '2024-10-25 14:08:05');
INSERT INTO `record` VALUES (1175, 102, NULL, '2024-10-25 14:08:12');
INSERT INTO `record` VALUES (1176, 102, NULL, '2024-10-25 14:12:29');
INSERT INTO `record` VALUES (1177, 102, NULL, '2024-10-25 14:24:38');
INSERT INTO `record` VALUES (1178, 102, NULL, '2024-10-25 14:26:02');
INSERT INTO `record` VALUES (1179, 103, NULL, '2024-10-25 14:27:01');
INSERT INTO `record` VALUES (1180, 102, NULL, '2024-10-25 14:27:33');
INSERT INTO `record` VALUES (1181, 96, NULL, '2024-10-26 07:20:04');
INSERT INTO `record` VALUES (1182, 102, NULL, '2024-10-26 11:00:37');
INSERT INTO `record` VALUES (1183, 102, NULL, '2024-10-26 11:00:46');
INSERT INTO `record` VALUES (1184, 102, NULL, '2024-10-26 11:01:40');
INSERT INTO `record` VALUES (1185, 103, NULL, '2024-10-27 09:30:26');
INSERT INTO `record` VALUES (1186, 102, NULL, '2024-10-27 10:30:26');
INSERT INTO `record` VALUES (1187, 104, NULL, '2024-10-27 11:00:26');
INSERT INTO `record` VALUES (1188, 97, NULL, '2024-10-27 11:50:12');
INSERT INTO `record` VALUES (1189, 104, NULL, '2024-10-29 13:54:33');
INSERT INTO `record` VALUES (1190, 101, NULL, '2024-10-29 13:54:57');
INSERT INTO `record` VALUES (1191, 103, NULL, '2024-10-29 17:12:54');
INSERT INTO `record` VALUES (1192, 103, NULL, '2024-10-29 17:38:29');
INSERT INTO `record` VALUES (1193, 103, NULL, '2024-10-29 17:53:29');
INSERT INTO `record` VALUES (1194, 104, NULL, '2024-10-29 17:57:15');
INSERT INTO `record` VALUES (1195, 94, NULL, '2024-10-29 18:20:03');
INSERT INTO `record` VALUES (1196, 102, NULL, '2024-10-29 20:19:27');
INSERT INTO `record` VALUES (1197, 102, NULL, '2024-10-29 20:19:54');
INSERT INTO `record` VALUES (1198, 102, NULL, '2024-10-29 20:20:01');
INSERT INTO `record` VALUES (1199, 104, NULL, '2024-10-29 20:20:48');
INSERT INTO `record` VALUES (1200, 103, NULL, '2024-10-30 08:35:34');
INSERT INTO `record` VALUES (1201, 103, NULL, '2024-10-30 08:42:39');
INSERT INTO `record` VALUES (1202, 103, NULL, '2024-10-30 08:52:24');
INSERT INTO `record` VALUES (1203, 103, NULL, '2024-10-30 09:03:23');
INSERT INTO `record` VALUES (1204, 103, NULL, '2024-10-30 09:22:16');
INSERT INTO `record` VALUES (1205, 103, NULL, '2024-10-30 09:34:37');
INSERT INTO `record` VALUES (1206, 103, NULL, '2024-10-30 09:44:50');
INSERT INTO `record` VALUES (1207, 102, NULL, '2024-10-30 09:45:02');
INSERT INTO `record` VALUES (1208, 102, NULL, '2024-10-30 09:55:56');
INSERT INTO `record` VALUES (1209, 102, NULL, '2024-10-30 10:02:57');
INSERT INTO `record` VALUES (1210, 104, NULL, '2024-10-30 10:03:15');
INSERT INTO `record` VALUES (1211, 104, NULL, '2024-10-30 11:50:16');
INSERT INTO `record` VALUES (1212, 104, NULL, '2024-10-31 09:25:00');
INSERT INTO `record` VALUES (1213, 92, NULL, '2024-10-31 09:27:46');
INSERT INTO `record` VALUES (1214, 104, NULL, '2024-10-31 09:27:47');
INSERT INTO `record` VALUES (1215, 104, NULL, '2024-10-31 13:54:29');
INSERT INTO `record` VALUES (1216, 104, NULL, '2024-11-01 18:25:24');
INSERT INTO `record` VALUES (1217, 104, NULL, '2024-11-01 18:31:44');
INSERT INTO `record` VALUES (1218, 104, NULL, '2024-11-01 18:31:57');
INSERT INTO `record` VALUES (1219, 104, NULL, '2024-11-03 16:41:52');
INSERT INTO `record` VALUES (1220, 104, NULL, '2024-11-04 14:25:05');
INSERT INTO `record` VALUES (1221, 104, NULL, '2024-11-05 10:20:54');
INSERT INTO `record` VALUES (1222, 103, NULL, '2024-11-05 16:15:24');
INSERT INTO `record` VALUES (1223, 105, NULL, '2024-11-06 11:20:41');
INSERT INTO `record` VALUES (1224, 105, NULL, '2024-11-06 15:24:36');
INSERT INTO `record` VALUES (1225, 106, NULL, '2024-11-07 10:44:16');
INSERT INTO `record` VALUES (1226, 106, NULL, '2024-11-07 10:46:07');
INSERT INTO `record` VALUES (1227, 106, NULL, '2024-11-07 10:54:05');
INSERT INTO `record` VALUES (1228, 97, NULL, '2024-11-07 22:07:55');
INSERT INTO `record` VALUES (1229, 106, NULL, '2024-11-08 10:25:50');
INSERT INTO `record` VALUES (1230, 106, NULL, '2024-11-08 10:38:09');
INSERT INTO `record` VALUES (1231, 94, NULL, '2024-11-09 08:15:30');
INSERT INTO `record` VALUES (1232, 96, NULL, '2024-11-10 09:27:45');
INSERT INTO `record` VALUES (1233, 93, NULL, '2024-11-10 13:40:03');
INSERT INTO `record` VALUES (1234, 97, NULL, '2024-11-10 16:40:47');
INSERT INTO `record` VALUES (1235, 92, NULL, '2024-11-11 08:31:57');
INSERT INTO `record` VALUES (1236, 106, NULL, '2024-11-11 08:39:02');
INSERT INTO `record` VALUES (1237, 106, NULL, '2024-11-11 08:39:07');
INSERT INTO `record` VALUES (1238, -1, NULL, '2024-11-11 10:11:54');
INSERT INTO `record` VALUES (1239, 97, NULL, '2024-11-11 11:35:56');
INSERT INTO `record` VALUES (1240, 96, NULL, '2024-11-11 20:26:03');
INSERT INTO `record` VALUES (1241, 97, NULL, '2024-11-11 21:11:37');
INSERT INTO `record` VALUES (1242, 105, NULL, '2024-11-12 05:35:08');
INSERT INTO `record` VALUES (1243, 101, NULL, '2024-11-12 08:35:06');
INSERT INTO `record` VALUES (1244, 106, NULL, '2024-11-12 11:42:01');
INSERT INTO `record` VALUES (1245, 92, NULL, '2024-11-12 23:38:54');
INSERT INTO `record` VALUES (1246, 106, NULL, '2024-11-14 16:44:15');
INSERT INTO `record` VALUES (1247, 97, NULL, '2024-11-15 01:58:47');
INSERT INTO `record` VALUES (1248, 106, NULL, '2024-11-15 09:09:31');
INSERT INTO `record` VALUES (1249, 93, NULL, '2024-11-15 09:50:30');
INSERT INTO `record` VALUES (1250, 95, NULL, '2024-11-15 10:09:41');
INSERT INTO `record` VALUES (1251, 96, NULL, '2024-11-17 08:05:12');
INSERT INTO `record` VALUES (1252, 92, NULL, '2024-11-17 10:23:08');
INSERT INTO `record` VALUES (1253, 106, NULL, '2024-11-18 17:10:47');
INSERT INTO `record` VALUES (1254, 96, NULL, '2024-11-20 12:14:49');
INSERT INTO `record` VALUES (1255, 92, NULL, '2024-11-24 11:29:49');
INSERT INTO `record` VALUES (1256, -1, NULL, '2024-11-26 12:53:34');
INSERT INTO `record` VALUES (1257, 106, NULL, '2024-12-03 15:38:57');
INSERT INTO `record` VALUES (1258, 103, NULL, '2024-12-03 15:39:13');
INSERT INTO `record` VALUES (1259, 94, NULL, '2024-12-04 17:00:59');
INSERT INTO `record` VALUES (1260, 95, NULL, '2024-12-04 17:01:16');
INSERT INTO `record` VALUES (1261, 96, NULL, '2024-12-04 17:01:17');
INSERT INTO `record` VALUES (1262, 106, NULL, '2024-12-04 17:25:19');
INSERT INTO `record` VALUES (1263, -1, NULL, '2024-12-04 17:25:49');
INSERT INTO `record` VALUES (1264, 105, NULL, '2024-12-04 17:27:15');
INSERT INTO `record` VALUES (1265, 96, NULL, '2024-12-12 07:26:04');
INSERT INTO `record` VALUES (1266, 92, NULL, '2024-12-13 03:32:41');
INSERT INTO `record` VALUES (1267, 92, NULL, '2024-12-18 10:45:59');
INSERT INTO `record` VALUES (1268, 92, NULL, '2024-12-22 22:11:17');
INSERT INTO `record` VALUES (1269, 97, NULL, '2024-12-23 02:20:29');
INSERT INTO `record` VALUES (1270, -1, NULL, '2024-12-24 05:29:58');
INSERT INTO `record` VALUES (1271, 92, NULL, '2024-12-26 03:28:23');
INSERT INTO `record` VALUES (1272, 96, NULL, '2024-12-28 05:17:34');
INSERT INTO `record` VALUES (1273, 92, NULL, '2025-01-02 10:08:33');
INSERT INTO `record` VALUES (1274, 96, NULL, '2025-01-05 02:19:34');
INSERT INTO `record` VALUES (1275, 97, NULL, '2025-01-06 02:45:04');
INSERT INTO `record` VALUES (1276, 96, NULL, '2025-01-07 15:26:45');
INSERT INTO `record` VALUES (1277, 95, NULL, '2025-01-07 15:44:38');
INSERT INTO `record` VALUES (1278, 103, NULL, '2025-01-07 15:50:05');
INSERT INTO `record` VALUES (1279, 96, NULL, '2025-01-07 17:45:58');
INSERT INTO `record` VALUES (1280, 96, NULL, '2025-01-07 18:07:28');
INSERT INTO `record` VALUES (1281, 95, NULL, '2025-01-07 23:45:42');
INSERT INTO `record` VALUES (1282, 92, NULL, '2025-01-08 16:11:25');
INSERT INTO `record` VALUES (1283, 92, NULL, '2025-01-14 03:14:23');
INSERT INTO `record` VALUES (1284, 97, NULL, '2025-01-21 03:34:49');
INSERT INTO `record` VALUES (1285, 96, NULL, '2025-01-23 09:41:51');
INSERT INTO `record` VALUES (1286, -1, NULL, '2025-01-24 02:27:37');
INSERT INTO `record` VALUES (1287, 94, NULL, '2025-01-24 02:29:22');
INSERT INTO `record` VALUES (1288, 96, NULL, '2025-01-24 02:29:23');
INSERT INTO `record` VALUES (1289, 105, NULL, '2025-01-24 02:35:09');
INSERT INTO `record` VALUES (1290, 97, NULL, '2025-01-24 02:37:41');
INSERT INTO `record` VALUES (1291, 105, NULL, '2025-01-24 13:47:39');
INSERT INTO `record` VALUES (1292, 102, NULL, '2025-01-24 13:49:57');
INSERT INTO `record` VALUES (1293, 96, NULL, '2025-01-24 14:06:51');
INSERT INTO `record` VALUES (1294, 105, NULL, '2025-01-24 14:12:37');
INSERT INTO `record` VALUES (1295, 96, NULL, '2025-01-24 14:12:49');
INSERT INTO `record` VALUES (1296, 94, NULL, '2025-01-24 14:13:31');
INSERT INTO `record` VALUES (1297, 105, NULL, '2025-01-24 14:14:17');
INSERT INTO `record` VALUES (1298, 105, NULL, '2025-01-24 14:19:47');
INSERT INTO `record` VALUES (1299, 94, NULL, '2025-01-24 14:20:50');
INSERT INTO `record` VALUES (1300, 96, NULL, '2025-01-24 14:20:51');
INSERT INTO `record` VALUES (1301, 105, NULL, '2025-01-24 14:29:12');
INSERT INTO `record` VALUES (1302, 105, NULL, '2025-01-24 14:29:35');
INSERT INTO `record` VALUES (1303, 97, NULL, '2025-01-24 14:33:39');
INSERT INTO `record` VALUES (1304, 105, NULL, '2025-01-24 14:37:58');
INSERT INTO `record` VALUES (1305, 105, NULL, '2025-01-24 14:38:35');
INSERT INTO `record` VALUES (1306, 103, NULL, '2025-01-24 14:44:48');
INSERT INTO `record` VALUES (1307, 92, NULL, '2025-01-25 00:28:23');
INSERT INTO `record` VALUES (1308, 102, NULL, '2025-01-25 08:40:28');
INSERT INTO `record` VALUES (1309, 102, NULL, '2025-01-25 09:03:32');
INSERT INTO `record` VALUES (1310, 102, NULL, '2025-01-25 09:03:32');
INSERT INTO `record` VALUES (1311, 103, NULL, '2025-01-25 09:53:15');
INSERT INTO `record` VALUES (1312, 92, NULL, '2025-02-02 08:33:01');
INSERT INTO `record` VALUES (1313, 94, NULL, '2025-02-02 14:44:14');
INSERT INTO `record` VALUES (1314, 96, NULL, '2025-02-02 15:13:16');
INSERT INTO `record` VALUES (1315, 94, NULL, '2025-02-02 15:37:10');
INSERT INTO `record` VALUES (1316, 92, NULL, '2025-02-02 16:07:35');
INSERT INTO `record` VALUES (1317, 97, NULL, '2025-02-02 16:23:31');
INSERT INTO `record` VALUES (1318, 97, NULL, '2025-02-02 16:24:36');
INSERT INTO `record` VALUES (1319, 98, NULL, '2025-02-02 16:29:27');
INSERT INTO `record` VALUES (1320, -1, NULL, '2025-02-02 18:08:21');
INSERT INTO `record` VALUES (1321, 98, NULL, '2025-02-02 18:14:43');
INSERT INTO `record` VALUES (1322, 95, NULL, '2025-02-03 02:05:02');
INSERT INTO `record` VALUES (1323, -1, NULL, '2025-02-04 11:58:33');
INSERT INTO `record` VALUES (1324, 106, NULL, '2025-02-05 09:08:36');
INSERT INTO `record` VALUES (1325, 105, NULL, '2025-02-05 09:08:38');
INSERT INTO `record` VALUES (1326, 97, NULL, '2025-02-05 11:16:40');
INSERT INTO `record` VALUES (1327, 105, NULL, '2025-02-06 22:00:28');
INSERT INTO `record` VALUES (1328, 96, NULL, '2025-02-06 22:48:06');
INSERT INTO `record` VALUES (1329, 93, NULL, '2025-02-07 11:44:16');
INSERT INTO `record` VALUES (1330, 92, NULL, '2025-02-08 13:56:51');
INSERT INTO `record` VALUES (1331, 96, NULL, '2025-02-09 02:23:08');

-- ----------------------------
-- Table structure for reply
-- ----------------------------
DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `updatedAt` datetime NULL DEFAULT NULL,
  `articleId` int NULL DEFAULT NULL,
  `commentId` int NULL DEFAULT NULL,
  `userId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  INDEX `userId`(`userId` ASC) USING BTREE,
  CONSTRAINT `reply_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `reply_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reply
-- ----------------------------

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `articleId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `articleId`(`articleId` ASC) USING BTREE,
  CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`articleId`) REFERENCES `article` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 240 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tag
-- ----------------------------
INSERT INTO `tag` VALUES (203, 'geth ', 92);
INSERT INTO `tag` VALUES (204, '区块链', 92);
INSERT INTO `tag` VALUES (205, '区块链部署', 92);
INSERT INTO `tag` VALUES (208, 'Go', 94);
INSERT INTO `tag` VALUES (209, 'Go lang', 94);
INSERT INTO `tag` VALUES (210, 'Go', 93);
INSERT INTO `tag` VALUES (211, 'Go lang', 93);
INSERT INTO `tag` VALUES (212, 'Go', 95);
INSERT INTO `tag` VALUES (213, 'Go lang', 95);
INSERT INTO `tag` VALUES (214, 'Go', 96);
INSERT INTO `tag` VALUES (215, 'Go lang', 96);
INSERT INTO `tag` VALUES (216, 'Go', 97);
INSERT INTO `tag` VALUES (217, 'Go lang', 97);
INSERT INTO `tag` VALUES (218, '性能优化', 98);
INSERT INTO `tag` VALUES (219, '前端', 98);
INSERT INTO `tag` VALUES (220, '性能分析', 98);
INSERT INTO `tag` VALUES (224, 'Electron', 102);
INSERT INTO `tag` VALUES (225, 'JavaScript', 102);
INSERT INTO `tag` VALUES (226, 'Electron', 103);
INSERT INTO `tag` VALUES (227, 'JavaScript', 103);
INSERT INTO `tag` VALUES (228, 'Electron', 104);
INSERT INTO `tag` VALUES (229, 'JavaScript', 104);
INSERT INTO `tag` VALUES (234, 'spring', 105);
INSERT INTO `tag` VALUES (235, 'java', 105);
INSERT INTO `tag` VALUES (236, 'java', 106);
INSERT INTO `tag` VALUES (237, 'shiro', 106);
INSERT INTO `tag` VALUES (238, 'springboot', 106);
INSERT INTO `tag` VALUES (239, '鉴权', 106);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '通过 bcrypt 加密后的密码',
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `notice` tinyint(1) NULL DEFAULT 1,
  `disabledDiscuss` tinyint(1) NULL DEFAULT 0,
  `role` tinyint NULL DEFAULT 2 COMMENT '用户权限：1 - admin, 2 - 普通用户',
  `github` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `createdAt` datetime NULL DEFAULT NULL,
  `updatedAt` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 47529557 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (47529555, 'bayunche@gmail.com', '$2a$10$Gj9UqD6UPnUu3nBvzDLyqOPSdXddiQDC4GjAMFRIAafPOtNpiRJS.', 'bayunche@gmail.com', 1, 0, 1, NULL, '2024-05-04 12:47:30', '2024-05-04 12:47:30');
INSERT INTO `user` VALUES (47529556, '测试', '$2a$10$ENsI9xjkGL0UlAdSiS4af.O2sg/7qeGL82BnpCVo0eF9GELqFdMze', '15899863819@qq.com', 1, 0, 2, NULL, '2024-05-06 15:39:39', '2024-05-06 15:39:39');

-- ----------------------------
-- Triggers structure for table article
-- ----------------------------
DROP TRIGGER IF EXISTS `before_insert_article`;
delimiter ;;
CREATE TRIGGER `before_insert_article` BEFORE INSERT ON `article` FOR EACH ROW BEGIN
    SET NEW.uuid = REPLACE(UUID(),'-','');
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;

