Ext.define('Jacada.core.IFrameComponent', {
    extend: 'Ext.Component',

    listeners: {
    	afterrender: function( me, eOpts ){
    		me.el.dom.style.height = me.el.dom.parentNode.style.height;
    	}
    },
    
    initComponent: function(){
        this.updateHTML();
        this.callParent(arguments);
    },
    updateHTML: function() {
    	var h = this.height;
    	var w = this.width;
    	if(!h){
    		h = "100%";
    	}
    	if(!w){
    		w = "100%";
    	}
    	if(this.id){
    		this.html='<iframe SECURITY="unrestricted" width='+w+' height='+h+' id='+this.id+'Id name='+this.id+ ' frameborder=0 scrolling="auto" src='+this.url+'></iframe>';
    	}else{
    		this.html='<iframe SECURITY="unrestricted" width='+w+' height='+h+' frameborder=0 scrolling="auto" src='+this.url+'></iframe>';
    	}
    }
      
});
