function Element() {}

var IDS = 0
Element.prototype.new = function() {
  this.id = IDS++
}

Element.prototype.element = function() {
  return document.getElementById(this.id)
}

Element.prototype.render = function() {
  return render(this.template, this.templateData())
}

Element.prototype.update = function() {
  this.element().outerHTML = this.render()
  processQue()
}

function Model(data) {
    this.new(data)
    this.template = null
}
Model.prototype = new Element()

Model.prototype.new = function(data) {
  Element.prototype.new.call(this)
  this.data = data
}

function Collection() {
    Element.prototype.new.call(this)
    this.items = []
}
Collection.prototype = new Element()

Collection.prototype.add = function(item) {
  this.items.push(item)
  this.update()
}

Collection.prototype.remove = function(item) {
  this.items.splice(this.items.indexOf(item), 1)
  this.update()
}

function render(name, data) {
  var source   = $("#" + name + "-template").html()
  var template = Handlebars.compile(source)
  var html = template(data)
  return html
}

var QUE = []
function processQue() {
  var i = QUE.length
  while (i--) {
   callback = QUE.pop()
   callback[1].apply(false, callback[0])
  }
}

Handlebars.registerHelper('for', function(items, options) {
  var ret = ""
  for(var i=0, j=items.length; i<j; i++) {
    data = items[i].data
    data[options.hash.as] = items[i]
    ret = ret + options.fn(data)
  }
  return ret
})

Handlebars.registerHelper('render', function(item) {
  return render(item.template, item.templateData())
})

Handlebars.registerHelper('event', function(obj, eventName, callbackName, extra) {
  id = obj.id
  if ('for' in extra.hash) {
    id += extra.hash.for
  }
  QUE.push([
    [obj, eventName, callbackName, id], 
    function(obj, eventName, callbackName, id) {
      $('#'+id).on(eventName, function(event) {
        obj[callbackName](event)
      })
    }
  ])
})

Handlebars.registerHelper('id', function(obj, extra) {
  var id = obj.id
  if ('name' in extra.hash) {
    id += extra.hash.name
  }
  if ('init' in obj) {
    QUE.push([
      [obj, id], 
      function(obj, id) {
        obj.init()
      }
    ])
  }
  return 'id="' + id + '"'
})