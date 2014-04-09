// Item Model.
function Item(data) {
  Item.prototype.new.call(this, data)
  this.template = 'item'
}
Item.prototype = new Model()

Item.prototype.templateData = function() {
  return this.data
}

Item.prototype.complete = function(event) {
  this.data.completed = !this.data.completed
  this.update()
  APP.textbox.focus()
}

Item.prototype.delete = function(event) {
  APP.todolist.remove(this)
  APP.textbox.focus()
}

// Todo Collection.
function TodoList() {
  this.template = 'todolist'
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
  this.element().focus()
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

// SortButton Model.
function SortButton(data) {
  SortButton.prototype.new.call(this, data)
  this.template = 'sortbutton'
}
SortButton.prototype = new Model()

SortButton.prototype.templateData = function() {
  return {sortbutton: this}
}

SortButton.prototype.sort = function(event) {
  APP.todolist.sort()
  APP.textbox.focus()
}