Ext.define('Jacada.system.ui.email.EmailHtmlEditor', {
    extend: 'Ext.form.field.HtmlEditor',
    
    inlineAttachments: new Object(),
    fixKeys : function(e){
    	if(e.keyCode == 8){//backspace
    		if(this.readOnly){
    			e.stopEvent();
    			return;
    		}
    	}
    	this.callParent(arguments);
    },
    setValue : function(v){
    	if(v){
    		//WS-5810
    		v = v.replace('direction:rtl;', 'direction:ltr;');
    	}
        Jacada.system.ui.email.EmailHtmlEditor.superclass.setValue.call(this, v);
        return this;
    },
	listeners: {
		afterrender: function(_this, eOpts){
			if(!_this.toolbarVisible){
				_this.getToolbar().hide();
			}
		},
		push: function(_this){
			var bd = _this.getEditorBody();
			if(bd){
				Jacada.Utils.processEmailBody(bd);
				
				_this.totalInlineAttachments = 0;
				var tagsImg = bd.getElementsByTagName("img");
				if(tagsImg.length > 0){
					var email = _this.email;
					var attachments = email.attachments;
					for (var k = 0; k < tagsImg.length; k++) { 
						//search for the image name in attachments
						for (var i = 0; i < attachments.length; i++) { 
							//TODO not the best matching, check if we can get a unique identifier for an attachment
    						if(tagsImg[k].src.indexOf(attachments[i].name) >= 0){
    							tagsImg[k].src = $W().mediaAPI.getAttachmentUrl(email.interactionId, attachments[i].id, attachments[i].name);
    							//mark this attachment as inline
    							//save inline attachments
    							_this.inlineAttachments[attachments[i].name] = attachments[i];
    							_this.totalInlineAttachments++;
    						}else if(tagsImg[k].alt && tagsImg[k].alt.indexOf("http") == 0){
    							tagsImg[k].src = tagsImg[k].alt;
    							_this.inlineAttachments[attachments[i].name] = attachments[i];
    							_this.totalInlineAttachments++;
    						}
    					}
					}
				}
				
				//display colored text in html (for some reason the extjs html editor does not show the colored text, see bug WS-5529)
				var pArray = bd.getElementsByTagName("p");
				for( var i = 0; i < pArray.length; i++){
					var currentP = pArray[i];
					if(currentP.getAttribute("dir") == 'RTL'){
						var spanArray = currentP.getElementsByTagName('span');
						for(var j = 0; j < spanArray.length; j++){
							var currentSpan = spanArray[j];
							var spanDir = currentSpan.getAttribute("dir");
							var spanStyle = currentSpan.getAttribute("style");
							if(spanDir && spanDir == 'LTR' && spanStyle && spanStyle.indexOf('background') != -1 ){
								//setting the span with the colored text to the same direction as the paragraph holding it displays the colored text.
								currentSpan.setAttribute("dir", "RTL");
							}
						}
					}
				}
				
				/* Synchronize the value */
				_this.syncValue();
			}
			if(_this.callback){
				_this.callback(_this);
			}
		}

	}
    
});