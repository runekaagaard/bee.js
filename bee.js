// Element.
function Element() {}

var IDS = 0
Element.prototype.new = function() {
  this.id = IDS++
  this.template = null
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

// Model.
function Model(data) {
    this.new(data)
}
Model.prototype = new Element()

Model.prototype.new = function(data) {
  Element.prototype.new.call(this)
  this.data = data
}

// Collection.
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

// Helper functions.
function render(name, data) {
  var source = document.getElementById(name + "-template").textContent
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

function start_app(data) {
  document.getElementById(data.elementId).innerHTML = render(data.template, 
                                                             data.templateData)
  processQue() 
}

// Handlebars helpers.
Handlebars.registerHelper('for', function(items, options) {
  var ret = ""
  for(var i=0, j=items.length; i<j; i++) {
    data = {}
    data[options.hash.as] = items[i]
    ret = ret + options.fn(data)
  }
  return ret
})

Handlebars.registerHelper('render', function(item) {
  return item.render()
})

Handlebars.registerHelper('event', function(obj, event, callback, extra) {
  id = obj.id
  if ('for' in extra.hash) {
    id += extra.hash.for
  }
  QUE.push([
    [obj, event, callback, id], 
    function(obj, event, callback, id) {
      document.getElementById(id).addEventListener(event, function(event) {
        obj[callback](event)
      }, false)
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