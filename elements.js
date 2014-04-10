// APP is global state from index.html.

// Item Model.
function Item(data) {
  Item.prototype.new.call(this, data)
  this.template = 'item'
}
Item.prototype = new Model()

Item.prototype.templateData = function() {
  return {item: this}
}

Item.prototype.complete = function(event) {
  this.data.completed = !this.data.completed
  this.update()
  APP.textbox.focus()
  APP.todolist.saveLocal()
}

Item.prototype.delete = function(event) {
  APP.todolist.remove(this)
  APP.textbox.focus()
}

// Todo Collection.
function TodoList() {
  this.template = 'todolist'
  this.loadLocal()
}
TodoList.prototype = new Collection()

TodoList.prototype.templateData = function() {
  return {todolist: this}
}

TodoList.prototype.sort = function() {
  this.items.sort(function (a,b) {
    if (a.data.completed === b.data.completed) return 0
    else return a.data.completed ? -1 : 1
  })
  this.update()
  APP.textbox.focus()
  this.saveLocal()
}

TodoList.prototype.clean = function() {
  this.items = this.items.filter(function(item) {
    return !item.data.completed
  })
  this.update()
  APP.textbox.focus()
  this.saveLocal()
}

TodoList.prototype.add = function(item) {
  Collection.prototype.add.call(this, item)
  this.saveLocal()
}

TodoList.prototype.remove = function(item) {
  Collection.prototype.remove.call(this, item)
  this.saveLocal()
}

TodoList.prototype.saveLocal = function(item) {
  var data = Array.prototype.map.call(this.items, function(item) {
    return [item.data.title, item.data.completed]
  })
  localStorage.setItem('bee_todo_items', JSON.stringify(data))
}

TodoList.prototype.loadLocal = function(item) {
  var items = JSON.parse(localStorage.getItem('bee_todo_items'))
  if (items === null) return
  for(var i=0, j=items.length; i<j; i++) {
    var item = items[i]
    TodoList.prototype.items.push(new Item({
      title: item[0],
      completed: item[1],
    }))
  }
}


// TextBox Model.
function TextBox(data) {
  TextBox.prototype.new.call(this, data)
  this.template = 'textbox'
}
TextBox.prototype = new Model()

TextBox.prototype.init = function() {
  this.focus()
}

TextBox.prototype.focus = function() {
  var x = window.scrollX, 
      y = window.scrollY
  this.element().focus()
  window.scrollTo(x, y);
}

TextBox.prototype.add = function(event) {
  if(event.keyCode !== 13) return
  var title = this.element().value
  if (title.trim() === "") {
    return
  }
  APP.todolist.add(new Item({
    title: title,
    completed: false,
  }))
  this.update()
}

TextBox.prototype.templateData = function() {
  return {textbox: this}
}