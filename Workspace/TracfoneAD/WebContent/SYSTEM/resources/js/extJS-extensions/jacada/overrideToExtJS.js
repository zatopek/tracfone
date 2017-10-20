/**
* Replaces the 'Refresh' button icon with a text
**/
try{
	Ext.override(Ext.PagingToolbar, {
	    addButton : function(config){
			if (config.iconCls && config.iconCls == "x-tbar-loading"){
				config2 = {text: this.refreshText, tooltip: this.refreshText, handler: this.onClick.createDelegate(this, ["refresh"])};
				return Ext.PagingToolbar.superclass.addButton.call(this, config2);
			}
			return Ext.PagingToolbar.superclass.addButton.call(this, config);
		} 
	});
}catch(e){
	//do nothing
}


/**
* Fix a bug in v3.4 for controllers click validation.
* At the first click target is null.
*/
Ext.override(Ext.dd.DragDrop, {
    clickValidator: function(e) {
        var target = e.getTarget();
        if(target != null){
	        return ( this.isValidHandleChild(target) &&
	                    (this.id == this.handleElId ||
	                        this.DDM.handleWasClicked(target, this.id)) );
        }else{
        	return true;
        }
    }
});
