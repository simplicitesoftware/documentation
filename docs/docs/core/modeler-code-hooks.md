---
sidebar_position: 150
title: Modeler code hooks
---

SVG Modeler hooks
=================

This document describes the **SVG Modeler** hooks that can be implemented to put some **additional** business logic in a specific Modeler template.

None of these hooks needs to be implemented. You need to implement one or several of these hooks if you want to apply
out some dynamic business logic that goes beyond what can be configured.

To get documentation about previous version of hooks using **Canvas** on legacy UI: [Canvas code examples](/docs/core/modeler-code-hooks-legacy)

Abstract
--------

Hooks are executed on the client-side in javascript and the override the rendering.
Edit the script and create an JavaScript object to declare the hooks :

```javascript
// Modeler extension (SVG)
Simplicite.Diagram.ModelHooks.<MyModelName> = {

// Template global properties
canUseGrid: true,
canUseNote: true,
canUseShape: true,
canUseContainer: true,
canUseTitle: true,
canUseSprings: true,

//-----------------
// Model hooks
//-----------------
// Called when the template is loaded
onLoadTemplate: function(template, cbk) { cbk(); },
// Called when the model is loaded (before rendering)
onLoadModel: function(data, cbk) { cbk(); },
// Called before save
preSaveModel: function(item, cbk) { cbk(); },
// Called if the model has been saved
postSaveModel: function(item, cbk) { cbk(); },
// Called before closing
preCloseModel: function(cbk) { cbk(); },

//-----------------
// Element hooks
//-----------------

// Called when node is loaded from DB
onLoadNode: function(node, cbk) { cbk(); },
// Override node drawing (synchronous)
onDrawNode: function(node, display) { display(); },
// Override node item drawing (synchronous)
onDrawItem: function(node, data, display) { display(); },

// Called when link is loaded
onLoadLink: function(link, cbk) { cbk(); },
// Override link drawing (synchronous)
onDrawLink: function(link, display) { display(); },

//-----------------
// Desktop hooks
//-----------------

// When desktop is displayed with diagram
ready: function(desktop, cbk) { cbk(); },

// Override default background (color, image, grid)
//onDrawBackground: null, // function(cbk) {},

// Override default diagram form (object Model on rowId)
onOpenModel: function(modelId, form) { form(); },
// Override default target form { object, id }
onOpenElement: function(target, form) { form(); },

// Prepare or Override default creation form (node or container)
onNewNode: function(nodeTemplate, container, position, form) { form(); },
// Prepare or Override default object selector (node or container) or call select(optional filters)
onInsertNode: function(nodeTemplate, position, container, select) { select(); },

// Called when node is added to desktop
onAddNode: function(node, cbk) { cbk(); },
// Called after node move
onMoveNode: function(node) {},
// Called after node remove from UI
onRemoveNode: function(node) {},
// Called after node deletion from DB
onDeleteNode: function(node) {},

// Override default content selector
onInsertContent: function(node, contentTemplate, select) { select(); },
// Override default content creation
onAddContent: function(node, contentTemplate, form) { form(); },

// Override default link creation
onCreateLink: function(fromNode, toNode, linkTemplate, create) { create(); },
// Called when link is added to desktop
onAddLink: function(link) {},
// Called after link remove from UI
onRemoveLink: function(link) {},
// Called after link deletion from DB
onDeleteLink: function(link) {},

// Called when container is loaded from DB
onLoadContainer: function(cont, cbk) { cbk(); },
// Called when container is added to desktop
onAddContainer: function(node, cbk) { cbk(); },
// Override container drawing (synchronous)
onDrawContainer: function(cont, display) { display(); },
// Called after container move
onMoveContainer: function(cont) {},
// Called after container remove from UI
onRemoveContainer: function(cont) {},

//-----------------
// Custom menu
//-----------------
customNodeMenu: function(node, item) {},
customLinkMenuAdd: function(from,to,pal) { return false; },

// Menu actions
canCreateNode: function(tplNode) { return true; },
canInsertNode: function(tplNode) { return true; },
canFetchNode:  function(tplNode) { return true; },
canRemoveNode: function(tplNode) { return true; },
canDeleteNode: function(tplNode) { return false; },
canCreateContent: function(tplContent) { return true; },
canInsertContent: function(tplContent) { return true; },
canAddLink: function(tplLink) { return true; },
canDeleteLink: function(tplLink) { return false; },
canRemoveContainer: function(tpl) { return true; }

};
```

Case 1: Business object hooks
-----------------------------

ModelBusinessObject is a template to edit the internal objects in a diagram (as a class diagram), and has been scripted to:

- Add icons and datatypes on attributes
- Change link aspect: reference arrow, aggregation, inheritance...
- Launch the wizards to create objects and fields
- Add a contextual menu to edit the object script directly

```javascript
Simplicite.Diagram.ModelHooks.ModelBusinessObject = {

// Disable Shape menu
canUseShape: false,

// data = { content, item, indexContent, indexItem, height, group }
onDrawItem: function(node, data, display) {
	var self = this, app = this.app, img,
		item = data ? data.item : null,
		elt = Simplicite.Diagram.createElement;
	// Content fields
	if (item && data.content.object=="Field") {
		// Label
		// foreign.field
		if (item.rel.obf_ref_object_id && item.rel.obf_ref_field_id)
			item.text = item.rel.obf_ref_field_id__fld_name + "." + item.rel.obf_field_id__fld_name;
		// foreign @object
		else if (item.rel.obf_ref_object_id && !item.rel.obf_ref_field_id)
			item.text = item.rel.obf_field_id__fld_name + " @" + item.rel.obf_ref_object_id__obo_name;
		// main field
		else item.text = item.rel.obf_field_id__fld_name;
		// add specific input name
		if (item.rel.obf_input)	item.text += " ("+item.rel.obf_input+")";

		// Prefix icon
		img = "blank16";
		if (parseInt(item.data.fld_visible)>0) {
			var updatable = item.data.fld_updatable;
			var required  = item.data.fld_required;
			if (updatable && !required)
				img = "pencil";
			else if (updatable && required)
				img = "pencil_red";
			else if (!updatable && !required)
				img = "pencil_not";
			else if (!updatable && required)
				img = "pencil_red_not";
		}
		item.pre = [self.desktop.getDefIcon(img,12,12)];

		// Postfix icon
		item.post = [];
		img = null;
		if (item.data.fld_fonctid)
			img = "funct_key";
		else if (parseInt(item.data.fld_research)>0)
			img = "search_mini";
		if (img)
			item.post.push(self.desktop.getDefIcon(img,12,12));

		// Type
		var type,
			size = item.data.fld_size || "0",
			prec = item.data.fld_precision || "0";
		switch(parseInt(item.data.fld_type))
		{
		case app.TYPE_BOOLEAN:
			type = "boolean";	break;
		case app.TYPE_DATE:
			type = "date"; break;
		case app.TYPE_TIME:
			type = "time"; break;
		case app.TYPE_DATETIME:
			type = "datetime"; break;
		case app.TYPE_DOC:
			type = "document"; break;
		case app.TYPE_IMAGE:
			type = "image"; break;
		case app.TYPE_EMAIL:
			type = "email("+size+")"; break;
		case app.TYPE_ENUM:
			type = "enum("+size+")"; break;
		case app.TYPE_ENUM_MULTI:
			type = "multi("+size+")"; break;
		case app.TYPE_FLOAT:
			type = "float("+size+","+prec+")"; break;
		case app.TYPE_BiGDECIMAL:
			type = "numeric("+size+","+prec+")"; break;
		case app.TYPE_HTML:
			type = "html("+size+")"; break;
		case app.TYPE_ID:
			type = "id("+size+")"; break;
		case app.TYPE_INT:
			type = "int("+size+")"; break;
		case app.TYPE_STRING:
			type = "string("+size+")"; break;
		case app.TYPE_LONG_STRING:
			type = "longstr("+size+")"; break;
		case app.TYPE_PASSWORD:
			type = "pwd("+size+")"; break;
		case app.TYPE_REGEXP:
			type = "regexp("+size+")"; break;
		case app.TYPE_URL:
			type = "url("+size+")"; break;
		case app.TYPE_PHONENUM:
			type = "phone("+size+")"; break;
		case app.TYPE_COLOR:
			type = "color("+size+")"; break;
		case app.TYPE_EXTFILE:
			type = "extfile("+size+")"; break;
		case app.TYPE_NOTEPAD:
			type = "notepad("+size+")"; break;
		case app.TYPE_OBJECT:
			type = "object("+size+")"; break;
		case app.TYPE_NONE:
			type = "none("+size+")"; break;
		default:
			type = "unknown"; break;
		}
		item.post.push(elt("text").text(type));
	}
	// Content functions
	else if (item && data.content.object=="Function") {
		// Label
		item.text = item.data.fct_name;

		// Prefix
		var act_name = item.data.fct_action_id__act_name,
			viw_name = item.data.fct_view_id__viw_name;
		if (act_name)
			img = "fct_action";
		else if (viw_name)
			img = "fct_view";
		else
			img = "fct_crud";
		item.pre = [self.desktop.getDefIcon(img,12,12)];

		// Postfix
		item.post = [elt("text").text(act_name || viw_name || item.data.fct_function)];
	}
	// Use default display
	return display();
},
// Called when link is loaded
onLoadLink: function(link, cbk) {
	if (link.template.name=="Inherit") {
		link.fromType = link.LINK.BLANK;
		link.toType = link.LINK.INHERIT;
	}
	else if (link.template.name=="Link" && link.data) {
		link.fromType = link.LINK.CROWSFEET;
		var cascad = link.data.obf_cascad;
		if (cascad=="R")
			link.toType = link.LINK.REFERENCE;
		else if (cascad=="N")
			link.toType = link.LINK.AGREGAT;
		else if (cascad=="C")
			link.toType = link.LINK.COMPOSIT;
		else
			link.toType = link.LINK.VIRTUAL;
	}
	cbk();
},
// Launch screenflow
onNewNode: function(template, container, position, form) {
	var self = this;
	// Create object screen flow
	if (template && template.name=="BusinessObject")
		self.openWorkflow("CreateObject");
},
onAddContent: function(node, template, form) {
	var self = this;
	// Add field screen flow thru external object wrapper
	if (node.object=="ObjectInternal" && template.name=="Field") {
		self.topui.loadURL(null, self.root + "/ui/ext/SystemAddField?row_id="+node.id);
	}
	// Add a function
	else if (node.object=="ObjectInternal" && template.name=="BusinessFunction") {
		var o = this.app.getBusinessObject(template.object);
		o.getForCreate(function() {
			o.item[template.refField] = node.id; // Referenced object
			o.item.fct_name = node.data.obo_name+"-R"; // Default name
			o.populate(function() {
				self.topui.displayForm(null, o, "0", { nav: "new", showNav: true, values: o.item });
			});
		},{
			metadata: true
		});
	}
},
onCreateLink: function(from, to, template, create) {
	var self = this;
	// Add a link screen flow
	if (from && to && template.name=="Link")
		self.topui.loadURL(null, self.root + "/ui/ext/SystemAddField?row_id="+from.id+"&link=1&refid="+to.id);
	// Inherit not reflexive
	else if (template.name=="Inherit" && from!=to)
		create();
},
// Custom menu
customNodeMenu: function(node, item) {
	var self = this, obj, ul,
		app = self.app;
	function copy(text, x, lov) {
		ul.append($('<li/>')
			.append($('<span/>').text((lov ? x : text)+": "))
			.append($('<span class="value"/>').text(lov ? text : x))
			.click(function() {
				$ui.copyToClipboard(x);
			}));
	}
	function def(cbk) {
		obj = app.getBusinessObject(node.data.obo_name);
		obj.getMetaData(cbk);
	}
	function copyMenu() {
		var menu = $('.pal-menu').empty();
		ul = $('<ul/>').appendTo(menu);
		copy(app.T("OBJECT"), node.data.obo_name);
		copy("Table", node.data.obo_dbtable);
		if (item && item.data && item.object=="Field") {
			ul.append('<li class="separator"/>');
			var name = item.data.fld_name;
			copy("Logical name", name);
			copy("DB column...", item.data.fld_dbname);
			var f = obj.metadata.fields[item.index + (obj.getRowIdFieldName()=="row_id" ? 1 : 0)];
			if (f && f.name!=name) {
				copy("Full name...", f.name.replace(/__/g,'.'));
				copy("API name....", f.name);
			}
			// LOV
			if (f && f.listOfValues) {
				ul.append('<li class="separator"/>');
				for (i=0; i<f.listOfValues.length; i++) {
					var x = f.listOfValues[i];
					copy(x.value, x.code, true);
				}
			}
		}
		self.desktop.ensureVisible(menu);
		$("span", menu).css("font-family","monospace");
		$("span.value", menu).css({ "font-weight":"bold", "text-align":"right", "margin-left":"5px" });
	}
	if (node.object=="ObjectInternal") {
		var m = [];
		// Open object script
		m.push({ icon:"edit", text:app.T("EDIT_SCRIPT"), cbk:function() {
			//self.topui.loadURL(null, self.root + "/ui//editor?field=obo_script_id&object=ObjectInternal&row_id="+node.id);
			// Use confirm action to choose the language
			var o = app.getBusinessObject("ObjectInternal");
			o.get(function(item) {
				o.setValues(item);
				var a = o.getAction("internalObjectScriptEdit");
				a && self.topui.doAction(a, o, node.id);
			}, node.id, {
				context:app.CONTEXT_UPDATE,
				metadata: true
			});
		}});
		// Edit template
		m.push({ icon:"edit", text:app.T("EDIT_TEMPLATE"), cbk:function() {
			self.topui.displayTemplate(null, node.object, node.id);
		}});
		// Copy sub-menu
		m.push({ text:app.T("COPY"), cbk:function() {
			def(copyMenu);
		}});
		return m;
	}
},
// Custom menu to create N,N
customLinkMenuAdd: function(from, to, pal) {
	var m = this;
	function pick() {
		// Create object
		m.createLinkMany2Many(from, to);
		pal.remove();
	}
	if (from.template.object=="ObjectInternal" && to.template.object=="ObjectInternal") {
		var g = $('<div/>').appendTo(pal);
		g.append($('<div class="tplk"/>')
			.append($('<img class="icon"/>').attr("src", app.getIconURL("icon_link")))
			.append("&nbsp;<b>Link N,N</b>"));
		var tb = $('<table/>').appendTo(g);
		$('<tr class="tpl"/>')
			.appendTo(tb)
			.append($('<td/>').text(from.label))
			.append($('<td/>').append("many to many"))
			.append($('<td/>').text(to.label))
			.click(pick);
		return true;
	}
}
};
```

Case 2: States model
--------------------

In this example:

- Use Ajax to get the related list Id
- Change the node rendering to display the state code and label
- Add information on states transition (alert, granted groups...)
- Redirect some actions to specific URLs

```javascript
Simplicite.Diagram.ModelHooks.ModelState = {

onLoadModel: function(data, loaded) {
	// Search th list of values of state-model
	var self = this,
		o = self.app.getBusinessObject("FieldList","tmp_ajax_FieldList");
	o.search(function() {
		if (o.list && o.list.length) self.template.listId = o.list[0].row_id;
		loaded();
	}, { lov_model_id: self.modelId });
},
onDrawNode: function(node, cbk) {
	if (node.template.name=="State" && node.data)
		node.setLabel(node.data.sta_state+" / "+node.data.sta_label);
	cbk();
},
onDrawLink: function(link, display) {
	var self = this;
	if (link.template.name=="Transition" && link.data) {
		link.label = "";
		// Transition details
		var alt = link.data.stm_notif_id__alt_name,
			cnd = link.data.stm_condition,
			cal = link.data.stm_callback;
		if (alt) link.label += "Alert:"+alt+"\n";
		if (cnd) link.label += "Cond:"+(cnd.length>15 ? cnd.substring(0,15)+"..." : cnd)+"\n";
		if (cal) link.label += "Call:"+cal+"\n";

		// Granted Groups
		var groups = link.data.stm_groups.split(/;/);
		for (var i=0; i<groups.length; i++)
			link.label += groups[i]+"\n";

		// Remove last \n
		if (link.label.length>0) link.label = link.label.substring(0,link.label.length-1);
	}
	display();
},
onNewNode: function(template, container, position, form) {
	this.openForm({ object:template.object, rowId:"0" });
},
onInsertNode: function(template, pos, cont, select) {
	// Select with filter on current lov
	select({
		sta_state_id__lov_list_id: this.template.listId || "%"
	});
},
onOpenModel: function(modelId, form) {
	var m = this;
	// List of states
	if (m.template.listId)
		m.topui.displayList(null, "BPMState", { filters:{ sta_state_id__lov_list_id: m.template.listId }});
	else
		form(); // default = open model
}
};
```

Case 3: User diagram
--------------------

- Change the node rendering with the user infos: login, phone, photo...
- Resize the node to as specific size

```javascript
Simplicite.Diagram.ModelHooks.ModelUser = {

canUseShape: false,

// Asynchronous loading of user picture
onLoadNode: function(node, cbk) {
	var self = this;
	if (node.object=="Group" && node.data) {
		node.icon = node.data.grp_parent_id ? "group" : "building";
	}
	else if (node.object=="User") {
		// Remove previous cached image in SVG definitions
		var imgId = node.data.usr_image_id,
			imgName = "pict_user_"+node.id;
		self.desktop.removeDefImage(imgName, 50, 0);
		// Load picture before rendering
		if (imgId) {
			self.desktop.addDefImage(imgName,
				self.root + "/ui/document?object=User&field=usr_image_id&row_id="+node.id+"&doc_id="+imgId+"&cdisp=inline",
				50, 0, "def-image", cbk);
			return;
		}
	}
	cbk();
},
// Synchronous rendering
onDrawNode: function(n, display) {
	var self = this, pad=10;
		elt = Simplicite.Diagram.createElement;

	if (n.object=="User") {
		// Border
		var b = n.border = elt("rect", { x:0, y:0, width:0, height:0 });
		b.addClass("border").appendTo(n.elt);
		n.radius && b.attr({ rx: n.radius, ry: n.radius });
		if (n.shadow) b.attr("filter","url(#shadow)");
		else b.removeAttr("filter");
		n.bind(b);

		// Picture
		var x = pad,
			imgId = n.data.usr_image_id,
			imgName = "pict_user_"+n.id;
		if (imgId) {
			self.desktop.getDefImage(imgName, 50, 0)
				.appendTo(n.elt)
				.attr({ x:x, y:pad });
			x += 50+pad;
		}

		// User infos
		elt("text", { x:x, y:pad, dy:"1em"}).text(n.label).appendTo(n.elt).css("font-weight", "bold");
		elt("text", { x:x, y:pad, dy:"4em"}).text("Login: "+n.data.usr_login).appendTo(n.elt);
		var email = elt("text", { x:x, y:pad, dy:"2.5em"}).text("Email: "+n.data.usr_email).appendTo(n.elt);
		elt("text", { x:x, y:pad, dy:"5.5em"}).text(n.data.usr_city || n.data.usr_lang).appendTo(n.elt);

		// Clickable email
		email.addClass("hit")
			.mouseover(function()  { email.css({ fill:"#F00", cursor:"pointer" }); })
			.mouseleave(function() { email.css({ fill:"#000", cursor:"initial" }); })
			.click(function() {
				self.topui.openURL("mailto:"+n.data.usr_email);
			});

		// Set final size of border
		var box = n.elt[0].getBBox();
		n.size(box.width + pad*2, box.height + pad*2);
	}
	// Default drawing for Group
	else display();
}
};
```

Case 4: Demo products and orders
------------------------

- Specific node drawing with product image and infos

```javascript
Simplicite.Diagram.ModelHooks.DemoModel = {

canUseShape: false,

imgFields: { "DemoSupplier": "demoSupLogo", "DemoProduct": "demoPrdPicture" },

// Asynchronous loading of picture
onLoadNode: function(node, cbk) {
	var self = this;
	var imgField = self.template.imgFields[node.object];
	if (imgField && node.data) {
		// Remove previous cached image in SVG definitions
		var imgId = node.data[imgField],
			imgName = "pict_"+node.object+"_"+node.id;
		self.desktop.removeDefImage(imgName, 50, 0);
		// Load picture before rendering
		if (imgId) {
			self.desktop.addDefImage(imgName,
				self.root + "/ui/document?object="+node.object+"&field="+imgField+"&row_id="+node.id+"&doc_id="+imgId+"&cdisp=inline",
				50, 0, "def-image", cbk);
			return;
		}
	}
	cbk();
},

// Synchronous rendering
onDrawNode: function(n, display) {
	var self = this, pad=10,
		elt = Simplicite.Diagram.createElement;

	var imgField = self.template.imgFields[n.object];
	if (imgField && n.data) {
		// Border
		var b = n.border = elt("rect", { x:0, y:0, width:0, height:0 });
		b.addClass("border").appendTo(n.elt);
		n.radius && b.attr({ rx: n.radius, ry: n.radius });
		if (n.shadow) b.attr("filter","url(#shadow)");
		else b.removeAttr("filter");
		n.bind(b);

		// Picture
		var x = pad,
			imgId = n.data[imgField],
			imgName = "pict_"+n.object+"_"+n.id;
		if (imgId) {
			self.desktop.getDefImage(imgName, 50, 0)
				.appendTo(n.elt)
				.attr({ x:x, y:pad });
			x += 50+pad;
		}

		// Product infos
		elt("text", { x:x, y:pad, dy:"1em"}).text(n.label).appendTo(n.elt).css("font-weight", "bold");
		if (n.object=="DemoSupplier") {
			elt("text", { x:x, y:pad, dy:"2em"}).text(n.data.demoSupName).appendTo(n.elt);
		} else if (n.object=="DemoProduct") {
			elt("text", { x:x, y:pad, dy:"2em"}).text(n.data.demoPrdName).appendTo(n.elt);
			elt("text", { x:x, y:pad, dy:"3em"}).text("Unit price: "+n.data.demoPrdUnitPrice).appendTo(n.elt);
		}

		// Set final size of border
		var box = n.elt[0].getBBox();
		n.size(box.width + pad*2, box.height + pad*2);
	} else { // Default drawing for other objects
		display();
	}
}
};
```
