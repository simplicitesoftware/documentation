---
sidebar_position: 210
title: Modeler code hooks legacy
---

CANVAS Modeler hooks (legacy)
=============================

This document describes the Modeler hooks that can be implemented to put some **additional** business logic in a specific Modeler template.

None of these hooks **needs** to be implemented. You need to implement one or several of these hooks if you want to apply out some
dynamic business logic that goes beyond what can be configured.

Abstract
--------

Hooks are executed on the client-side in javascript and the override the rendering.
Edit the script and create a JavaScript object to declare the hooks :

```javascript
// Modeler extension (canvas)
Simplicite.ModelHooks.<MyModelName> = {

// Template global properties
canUseContainer: true,
canUseGrid: true,
canUseTree: true,
canUseNote: true,
canUseTitle: true,
canUseBackground: true,

// Gadget initial width : percentage of innerWindow if <1 or fixed size in px
gadgdetWidth: 0.4,

//-----------------
// Model data hooks
//-----------------
// Called when the template is loaded
onLoadTemplate: function(template) {},
// Called when the model is loaded
onLoadModel: function() {},
// Called before save
preSaveModel: function() {},
// Called if the model has been saved
onSaveModel: function() {},
// Called before closing
onCloseModel: function() {},

//-----------------
// Layout hooks
//-----------------
// Override default background (color, image, grid)
onDrawBackground: null, //function() {},
// Override default box with vertical contents
onDrawNode: null, //function(node) {},
// Override default item drawing
onDrawItem: null, //function(node, item, content, indexContent, indexItem, heightInNode) {},
// Override default broken line
onDrawLink: null, //function(link) {},

//-----------------
// Desktop hooks
//-----------------
// Called when node is loaded
onLoadNode: function(node) {},
// Called when link is loaded
onLoadLink: function(link) {},

// Override default model form in work zone
onOpenDesktop: null, //function() {},
// Override default target form in work zone
onOpenElement: null, //function(target) {},
// Override default creation form in work zone
onNewNode: null, //function(nodeTemplate) {},
// Override default object selector
onInsertNode: null, //function(nodeTemplate) {},
// Override default content selector
onInsertContent: null, // function(node,contentTemplate) {},
// Override default content creation
onAddContent: null, // function(node,contentTemplate) {},
// Override default link creation
onCreateLink: null, // function(fromNode,toNode,linkTemplate) {},

// Called when node is added to desktop
onAddNode: function(node) {},
// Called after removing node
onRemoveNode: function(node) {},
// Called after moving node
onMoveNode: function(node) {},

// Called when link is added to desktop
onAddLink: function(link) {},
// Called after removing link
onRemoveLink: function(link) {},
// Called after deleting link
onDeleteLink: function(link) {},

//-----------------
// Custom menu
//-----------------
customDesktopMenu: null, //function() {},
customNodeMenu: null, //function(node) {},
customLinkMenu: null, //function(link) {}

// Menu actions
canCreateNode: null, //function(tplNode) { return true; },
canInsertNode: null, //function(tplNode) { return true; },
canFetchNode: null, //function(tplNode) { return true; },
canRemoveNode: null, //function(tplNode) { return true; },
canDeleteNode: null, //function(tplNode) { return false; }, // default is false
canCreateContent: null, //function(tplContent) { return true; },
canInsertContent: null, //function(tplContent) { return true; },
canAddLink: null, //function(tplLink) { return true; },
canDeleteLink: null //function(tplLink) { return false; }, // default is false

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
// Called when node is loaded
onLoadNode: function(node) {
	// Content Field
	var c = node.contents[2];
	var item;
	for (var i=0; c.items && i<c.items.length; i++) {
		item = c.items[i];
		if (!item.data) continue;
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

		// Prefix
		var img = "blank16.gif";
		if (parseInt(item.data.fld_visible)>0) {
			var updatable = item.data.fld_updatable;
			var required  = item.data.fld_required;
			if (updatable && !required)
				img = "pencil.png";
			else if (updatable && required)
				img = "pencil_red.png";
			else if (!updatable && !required)
				img = "pencil_not.png";
			else if (!updatable && required)
				img = "pencil_red_not.png";
		}
		item.pre = "[ICON:"+img+"]";

		// Postfix
		item.post = "";
		if (item.data.fld_fonctid)
			item.post = "[ICON:funct_key.gif] ";
		else if (parseInt(item.data.fld_research)>0)
			item.post = "[ICON:search_mini.gif] ";

		var size = item.data.fld_size || "0";
		var prec = item.data.fld_precision || "0";

		switch(parseInt(item.data.fld_type))
		{
		case Simplicite.TYPE_BOOLEAN:
			item.post += "boolean";	break;
		case Simplicite.TYPE_DATE:
			item.post += "date"; break;
		case Simplicite.TYPE_TIME:
			item.post += "time"; break;
		case Simplicite.TYPE_DATETIME:
			item.post += "datetime"; break;
		case Simplicite.TYPE_DOC:
			item.post += "document"; break;
		case Simplicite.TYPE_IMAGE:
			item.post += "image"; break;
		case Simplicite.TYPE_EMAIL:
			item.post += "email("+size+")"; break;
		case Simplicite.TYPE_ENUM:
			item.post += "enum("+size+")"; break;
		case Simplicite.TYPE_ENUM_MULTI:
			item.post += "multi("+size+")"; break;
		case Simplicite.TYPE_FLOAT:
			item.post += "float("+size+","+prec+")"; break;
		case Simplicite.TYPE_HTML:
			item.post += "html("+size+")"; break;
		case Simplicite.TYPE_ID:
			item.post += "id("+size+")"; break;
		case Simplicite.TYPE_INT:
			item.post += "int("+size+")"; break;
		case Simplicite.TYPE_STRING:
			item.post += "string("+size+")"; break;
		case Simplicite.TYPE_LONG_STRING:
			item.post += "longstr("+size+")"; break;
		case Simplicite.TYPE_PASSWORD:
			item.post += "pwd("+size+")"; break;
		case Simplicite.TYPE_REGEXP:
			item.post += "regexp("+size+")"; break;
		case Simplicite.TYPE_URL:
			item.post += "url("+size+")"; break;
		case Simplicite.TYPE_PHONENUM:
			item.post += "phone("+size+")"; break;
		case Simplicite.TYPE_COLOR:
			item.post += "color("+size+")"; break;
		case Simplicite.TYPE_EXTFILE:
			item.post += "extfile("+size+")"; break;
		case Simplicite.TYPE_NOTEPAD:
			item.post += "notepad("+size+")"; break;
		case Simplicite.TYPE_OBJECT:
			item.post += "object("+size+")"; break;
		case Simplicite.TYPE_NONE:
			item.post += "none("+size+")"; break;
		default:
			item.post += "unknown"; break;
		}
	}
	// Content BusinessFunction
	c = node.contents[3];
	for (i=0; c.items && i<c.items.length; i++) {
		item = c.items[i];
		if (!item.data) continue;
		// Label
		item.text = item.data.fct_name;

		// Prefix
		item.pre = "";
		var act_name = item.data.fct_action_id__act_name;
		var viw_name = item.data.fct_view_id__viw_name;
		if (act_name)
			item.pre = "[ICON:fct_action.png]";
		else if (viw_name)
			item.pre = "[ICON:fct_view.png]";
		else
			item.pre = "[ICON:fct_crud.png]";

		// Postfix
		item.post = act_name;
		if (!item.post)	item.post = viw_name;
		if (!item.post)	item.post = item.data.fct_function;
	}
},
// Called when link is loaded
onLoadLink: function(link) {
	link.fromType = Simplicite.Modeler.LINK.BLANK;
	if (link.template.name=="Inherit") {
		link.toType = Simplicite.Modeler.LINK.INHERIT;
	}
	else if (link.template.name=="Link" && link.data) {
		var cascad = link.data.obf_cascad;
		if (cascad=="R")
			link.toType = Simplicite.Modeler.LINK.REFERENCE;
		else if (cascad=="N")
			link.toType = Simplicite.Modeler.LINK.AGREGAT;
		else if (cascad=="C")
			link.toType = Simplicite.Modeler.LINK.COMPOSIT;
		else
			link.toType = Simplicite.Modeler.LINK.VIRTUAL;
	}
},

// Launch screenflow
onNewNode: function(template) {
	// Create object screen flow
	if (template && template.name=="BusinessObject")
		openInFrame(getTop().frame_work, "PCS_start.jsp?pcs=CreateObject&modeldiv="+this.div, "QUIT_SAVE");
},
onAddContent: function(node,template) {
	// Add a field screen flow
	if (node.object=="ObjectInternal" && template.name=="Field") {
		openInFrame(getTop().frame_work, "ext/SystemAddField?row_id="+node.id+"&modeldiv="+this.div, "QUIT_SAVE");
	}
	// Add a function
	else if (node.object=="ObjectInternal" && template.name=="BusinessFunction") {
		var p = "&modelnode="+node.object+";"+node.id+";"+template.name+"&modeldiv="+this.div;
		p += "&"+template.refField+"="+node.id; // reference
		p += "&fct_name="+node.data.obo_name+"-"+"R"; // name
		openInFrame(getTop().frame_work, "ALL_form.jsp?action=new&nav=new&row_id=0&object="+template.object + p, "QUIT_SAVE");
	}
},
onCreateLink: function(from,to,template) {
	// Add a link screen flow
	if (from && to && template.name=="Link")
		openInFrame(getTop().frame_work, "ext/SystemAddField?row_id="+from.id+"&link=1&refid="+to.id+"&modeldiv="+this.div, "QUIT_SAVE");
	// Inherit not reflexive
	else if (template.name=="Inherit" && from!=to) {
		this._createLink(from,to,template);
	}
},

// Open object script
customNodeMenu: function(node) {
	var m = this.menu;
	if (node.object=="ObjectInternal") {
		if (node.data.obo_script_id) {
			m.addItem("EDIT_SCRIPT", function() {
				var url = "ALL_doc_edit.jsp?field=obo_script_id&object=ObjectInternal&row_id="+node.id;
				openInFrame(getTop().frame_work, url, "QUIT_SAVE");
			}, null, "edit.gif");
		}
		else m.itemOff("EDIT_SCRIPT");
		m.spacer();
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
// Modeler extension
Simplicite.ModelHooks.ModelState = {

// Called when the model is loaded
onLoadModel: function() {
	// Model of a states ?
	var self = this;
	var s = new Simplicite.Ajax();
	var p = s.getBusinessObject("FieldList");
	p.search(function() {
		if (p.list && p.list.length>0) {
			self.template.listId = p.list[0].row_id;
		}
	}, { lov_model_id: self.id });
},

// Called when node is loaded
onLoadNode: function(node) {
	if (node.template.name=="State" && node.data) {
		node.setLabel(node.data.sta_state+" / "+node.data.sta_label);
		node.contents[0].align = "center"; // center the title
		node.getTitleStyle = function(c) { return node.color; };
	}
},
// Called when link is loaded
onLoadLink: function(link) {
	var self = this;
	if (link.template.name=="Transition" && link.data) {
		link.label = "";
		// Transition details
		var alt = link.data.stm_notif_id__alt_name;
		var cnd = link.data.stm_condition;
		var cbk = link.data.stm_callback;
		if (alt) link.label += "Alert:"+alt+"\n";
		if (cnd) link.label += "Cond:"+(cnd.length>15 ? cnd.substring(0,15)+"..." : cnd)+"\n";
		if (cbk) link.label += "Call:"+cbk+"\n";

		// Granted Groups
		var groups = link.data.stm_groups.split(/;/);
		for (var i=0; i<groups.length; i++)
			link.label += groups[i]+"\n";

		// Remove last \n
		if (link.label.length>0) link.label = link.label.substring(0,link.label.length-1);
	}
},

// Override new node
onNewNode: function(template) {
	var url = "ALL_form.jsp?action=new&nav=new&row_id=0&object="+template.object+"&modeldiv="+this.div;
	openInFrame(getTop().frame_work, url, "QUIT_SAVE");
},
onInsertNode: function(template) {
	var url = "ALL_select.jsp?object="+template.object+"&modeldiv="+this.div;
	// Filter current list
	if (this.template.listId) url += "&hst=1;myfilter;sta_state_id.lov_list_id&myfilter="+this.template.listId;
	openSelect("modeler", url, null, null);
},
onOpenDesktop: function() {
	// Open states definition
	if (this.template.listId)
		openInFrame(getTop().frame_work, "ALL_list.jsp?action=search&nav=new&object=BPMState&sta_state_id.lov_list_id="+this.template.listId, "QUIT_SAVE");
	else // Open model
		openInFrame(getTop().frame_work, "ALL_form.jsp?action=update&nav=new&object=Model&row_id="+this.id, "QUIT_SAVE");
}
};
```

Case 3: User diagram
--------------------

- Change the node rendering with the user infos: login, phone, photo...
- Resize the node to as specific size

```javascript
// Modeler extension
Simplicite.ModelHooks.ModelUser = {

// Called when the template is loaded
onLoadTemplate: function(template) {
	// Pictures cache
	template.pictures = {};
},

// Called when node is loaded
onLoadNode: function(node) {
	if (node.object=="User") {
		node.contents[0].align = "center"; // center the title
		node.getTitleStyle = function(c) { return node.color; }; // plain color
		node.isItemVisible = function(i,j,ct,item) {
			if (i==1) {
				return (item.field=="usr_login" || item.field=="usr_email" || item.field=="usr_cell_num" || item.field=="usr_work_num" || item.field=="usr_city");
			}
			return true;
		};
		node.bound = function() {
			if (!this.w || !this.h) {
				var items = this.contents && this.contents.length>1 ? this.contents[1].items : null;
				var c = node.desktop.ctx;
				c.font = "11px sans-serif";
				this.w = 0;
				for (var i=0; items && i<items.length; i++) {
					var item = items[i];
					if (item.field=="usr_login" || item.field=="usr_email" || item.field=="usr_cell_num" || item.field=="usr_work_num" || item.field=="usr_city") {
						var w = c.measureText(item.text).width + 65; // text + picture 50 + margin 5 * 3
						if (this.w<w) this.w = w;
					}
				}
				this.h = !this.showField ? 40 : 100; // title + 5 fields + margin = 6*15 + 10 = 100
			}
			return { x:node.x, y:node.y, w:node.w, h:node.h };
		};
		delete this.template.pictures[node.id]; // remove cached image
	}
	else if (node.object=="Group") {
		if (node.data) node.setIcon(node.data.grp_parent_id ? "group" : "building");
	}
},

onDrawItem: function(node,item,ct,i,j,h) {
	if (i==1 && node.object=="User" && node.data) {
		var c = this.desktop.ctx;
		var dh = node.getItemHeight(i,j,item);
		var y = node.y + h + dh/2;

		c.textAlign = "left";
		var sel = node.selectedItem;
		c.fillStyle = (sel && sel.object==ct.object && sel.id==item.id && !item.field ? '#f00' : '#000');
		node.drawText(c, item.text, node.x+60, y);

		this.template.drawUserImage(c,node);
		return dh;
	}
	// default
	return node.drawItem(item,ct,i,j,h);
},

drawUserImage: function(c,node) {
	if (!node.data.usr_image_id) return;
	var self = this; // model template
	var img = self.pictures[node.id];
	if (!img) {
		img = new Image();
		img.src = "ALL_docblob.jsp?object=User&field=usr_image_id&row_id="+node.id+"&doc_id="+node.data.usr_image_id+"&cdisp=inline";
		img.onload = function() { self._drawUserImage(c,img,node.x,node.y); };
		self.pictures[node.id] = img;
	}
	else self._drawUserImage(c,img,node.x,node.y);
},
_drawUserImage: function(c,img,x,y) {
	var w = img.width;
	var h = img.height;
	if (w<10 || h<10) return;
	if (w>50) { h = h*50/w; w = 50; }
	if (h>75) { w = w*75/h; h = 75; }
	c.drawImage(img, x+4, y+20, w, h);
}
};
```

Case 4: Use case diagram
------------------------

- Draw directly on canvas to render the Actors nodes (system or human), but keep the default rendering of Activities
- Resize and rename the labels

```javascript
// Modeler extension
Simplicite.ModelHooks.ModelUseCase = {

// Called when the model is loaded
onLoadModel: function() {
	// Model of a use case ?
	var self = this;
	var s = new Simplicite.Ajax();
	var uc = s.getBusinessObject("ALMUseCase");
	uc.search(function() {
		if (uc.list && uc.list.length>0) {
			self.template.useCaseId = uc.list[0].row_id;
		}
	}, { ALMUseCaseModelId: self.id });
},

// Override default box with vertical contents
onDrawNode: function(node) {
	// Actor
	if (node.template.name=="Actor") {
		if (node.data && node.data.ALMActorType=="SYS")
			this.template.drawSystem(node);
		else
			this.template.drawHuman(node);
	}
	// Activity
	else if (node.template.name=="Activity") {
		// Default drawing
		node.draw();
	}
},

// Draw human node
drawHuman: function(node) {
	var c = node.desktop.ctx;
	var name = node.data ? node.data.ALMActorName : "";
	var x=node.x, y=node.y, w=node.w, h=node.h;
	var mx = x+w/2, r=8;

	c.lineWidth = 1;
	c.fillStyle = node.selected ? '#f00' : '#000';
	c.font = "11px sans-serif";
	c.textBaseline = "top";
	c.textAlign = "left";
	c.fillText(name,x+5,y);

	c.strokeStyle = node.selected ? '#f00' : '#000';
	c.fillStyle = node.color || '#fff';
	c.beginPath();
	c.arc(mx, y+17+r, r, 0, 2*Math.PI, false); // head
	c.closePath();
	c.fill(); c.stroke();
	c.beginPath();
	c.moveTo(mx, y+17+r*2); c.lineTo(mx, y+3*h/4); // body
	c.moveTo(mx-14, y+h/2+5); c.lineTo(mx+14, y+h/2+5);   // arms
	c.moveTo(mx-14, y+h-3); c.lineTo(x+w/2, y+3*h/4); // 2 legs
	c.lineTo(mx+14, y+h-3);
	c.stroke();
},
// Draw System node
drawSystem: function(node) {
	var c = node.desktop.ctx;
	var name = node.data ? node.data.ALMActorName : "";
	var x=node.x, y=node.y, w=node.w, h=node.h;
	var mx = x+w/2, my=y+h/2+8, dx1=10, dx2=20, dy1=h/4, dy2=h/2.6;

	c.lineWidth = 1;
	c.fillStyle = node.selected ? '#f00' : '#000';
	c.font = "11px sans-serif";
	c.textBaseline = "top";
	c.textAlign = "left";
	c.fillText(name,x+5,y);

	c.strokeStyle = node.selected ? '#f00' : '#000';
	c.fillStyle = node.color || '#fff';
	c.beginPath();
	c.moveTo(mx-dx1, my-dy2); c.lineTo(mx+dx2, my-dy2);
	c.lineTo(mx+dx2, my+dy1); c.lineTo(mx+dx1, my+dy2);
	c.lineTo(mx-dx2, my+dy2); c.lineTo(mx-dx2, my-dy1);
	c.closePath();
	c.fill(); c.stroke();
	c.beginPath();
	c.moveTo(mx+dx1, my-dy1); c.lineTo(mx-dx2, my-dy1);
	c.moveTo(mx+dx1, my-dy1); c.lineTo(mx+dx1, my+dy2);
	c.moveTo(mx+dx1, my-dy1); c.lineTo(mx+dx2, my-dy2);
	c.moveTo(mx-dx2+5, my-3); c.lineTo(mx+dx1-5, my-3);
	c.moveTo(mx-dx2+5, my-8); c.lineTo(mx+dx1-5, my-8);
	c.moveTo(mx-dx2+5, my-13); c.lineTo(mx+dx1-5, my-13);
	c.stroke();
},

// Called when node is loaded
onLoadNode: function(node) {
	if (node.template.name=="Actor") {
		// Override size calculation
		node.bound = function(withInner) {
			if (!this.w || !this.h) {
				var name = node.data ? node.data.ALMActorName : "";
				var c = node.desktop.ctx;
				c.font = "11px sans-serif";
				node.w = c.measureText(name).width + 10;
				node.h = 70;
			}
			return { x:node.x, y:node.y, w:node.w, h:node.h };
		};
		// Returns title item
		node.getItemAt = function(y) {
			return node.contents[0].items[0];
		};
	}
	else if (node.template.name=="Activity") {
		node.setLabel(node.data.ALMActivityName);
		node.contents[0].align = "center";
		node.getTitleStyle = function(c) {
			return node.color;
		};
	}
},
// Called when link is loaded
onLoadLink: function(link) {
	if (link.template.name=="ActivityLink" && link.data) {
		var o = new Simplicite.BusinessObject(link.object);
		o.getMetaData();
		var list = o.getField("ALMActLinkType").listOfValues;
		link.label = o.getListValue(list, link.data.ALMActLinkType);
	}
	else if (link.template.name=="Participate") {
		link.label = "";
	}
},
// Override new node
onNewNode: function(template) {
	var url = "ALL_form.jsp?action=new&nav=new&row_id=0&object="+template.object+"&modeldiv="+this.div;
	// Default use case if known
	if (template.name=="Activity" && this.template.useCaseId)
		url += "&ALMActivityUseCaseId="+this.template.useCaseId;
	openInFrame(getTop().frame_work, url, "QUIT_SAVE");
},
onOpenDesktop: function() {
	// Open use case definition
	if (this.template.useCaseId)
		openInFrame(getTop().frame_work, "ALL_form.jsp?action=update&nav=new&object=ALMUseCase&row_id="+this.template.useCaseId, "QUIT_SAVE");
	else // Open model
		openInFrame(getTop().frame_work, "ALL_form.jsp?action=update&nav=new&object=Model&row_id="+this.id, "QUIT_SAVE");
}
};
```
