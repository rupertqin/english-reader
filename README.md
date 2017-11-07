# english-reader

## Resources

### online: 
http://fanyi.youdao.com/openapi.do?keyfrom=node-translator&key=2058911035&type=data&doctype=json&version=1.1&q=python
https://github.com/louisun/iSearch

### local:
https://github.com/ChestnutHeng/Wudao-dict

### search algthem
https://github.com/nowgoo/dict

## Todos
1. 词库(你已经有了)
2. 词库是怎么存储的？想使用嵌入式数据库sqlite还是直接存到txt文件里？
3. 如果是使用sqlite存储，直接使用JDBC查询数据库(已经支持模糊匹配)
4. 存储在txt里，这个很有技术含量，要对词典文件做索引，一级，二级索引，甚至多级索引。
     4.1. 索引的算法需要一定的功力。查询单词时，一级一级的查询索引，最后查到单词对应在文件中的位置，然后使用随机读取文件。
     4.2. 搜索算法，支持模糊匹配或者按输入的字符串开头查询，还是只查询整个匹配的单词。如果按单词顺序查询，二分查找非常快，如果要使用模糊匹配去查询，那这个每查一次都要搜索整个词库，速度很慢。

5. 缓存：用户最近查询的单词最好使用缓存存起来，查询时先到缓存里查询，如果没有找到，再多索引或者数据库里查询。

具体要做得更好，还有很多需要了解的。例如支持多种语言查询，用户添加删除词典等。