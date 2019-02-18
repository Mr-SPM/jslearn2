# BFS 广度优先遍历(非递归实现)
```js
function wideTraversal(node) {  
    var nodes = [];  
    if (node != null) {  
        var queue = [];  
        queue.unshift(node);  
        while (queue.length != 0) {  
            var item = queue.shift();  
            nodes.push(item);  
            var children = item.children;  
            for (var i = 0; i < children.length; i++)  
                queue.push(children[i]);  
        }  
    }  
    return nodes;  
}
```

# DFS 深度优先遍历
```js
function deepTraversal(node,nodeList) {  
    if (node) {    
            nodeList.push(node);    
            var children = node.children;    
            for (var i = 0; i < children.length; i++) 
      //每次递归的时候将  需要遍历的节点  和 节点所存储的数组传下去
                deepTraversal(children[i],nodeList);    
        }    
    return nodeList;  
}  
```